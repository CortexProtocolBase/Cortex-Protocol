import { createWalletClient, createPublicClient, http, formatUnits, parseUnits, type Hash } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { CONTRACTS } from "@/lib/constants";
import { vaultAbi } from "@/lib/abis/vault";
import { UniswapV3Adapter } from "@/lib/dex/uniswap";
import { AerodromeAdapter } from "@/lib/dex/aerodrome";
import { AaveV3Adapter } from "@/lib/dex/aave";
import { CompoundV3Adapter } from "@/lib/dex/compound";
import { COMPOUND_V3, BASE_TOKENS } from "@/lib/dex/constants";
import { getDeadline } from "@/lib/dex/utils";
import type { TradeProposal } from "./types";

// ─── Adapters ──────────────────────────────────────────────────────────

const uniswap = new UniswapV3Adapter();
const aerodrome = new AerodromeAdapter();
const aave = new AaveV3Adapter();
const compoundUsdc = new CompoundV3Adapter(COMPOUND_V3.COMET_USDC);
const compoundWeth = new CompoundV3Adapter(COMPOUND_V3.COMET_WETH);

// ─── Token decimals lookup ─────────────────────────────────────────────

const TOKEN_DECIMALS: Record<string, number> = {
  USDC: 6,
  USDbC: 6,
  WETH: 18,
  cbBTC: 8,
  AERO: 18,
  DEGEN: 18,
};

// ─── Token symbol to address mapping ───────────────────────────────────

const TOKEN_ADDRESSES: Record<string, `0x${string}`> = {
  WETH: BASE_TOKENS.WETH,
  USDC: BASE_TOKENS.USDC,
  USDbC: BASE_TOKENS.USDbC,
  cbBTC: BASE_TOKENS.cbBTC,
  AERO: BASE_TOKENS.AERO,
  DEGEN: BASE_TOKENS.DEGEN,
};

function resolveToken(symbolOrAddress: string): `0x${string}` {
  if (symbolOrAddress.startsWith("0x")) return symbolOrAddress as `0x${string}`;
  const addr = TOKEN_ADDRESSES[symbolOrAddress];
  if (!addr) throw new Error(`Unknown token symbol: ${symbolOrAddress}`);
  return addr;
}

function getDecimals(symbolOrAddress: string): number {
  if (symbolOrAddress.startsWith("0x")) {
    // Reverse lookup by address
    for (const [sym, addr] of Object.entries(TOKEN_ADDRESSES)) {
      if (addr.toLowerCase() === symbolOrAddress.toLowerCase()) {
        return TOKEN_DECIMALS[sym] ?? 18;
      }
    }
    return 18; // Default to 18 decimals for unknown tokens
  }
  return TOKEN_DECIMALS[symbolOrAddress] ?? 18;
}

// ─── Create agent wallet client ─────────────────────────────────────

function getAgentWallet() {
  const key = process.env.AI_AGENT_PRIVATE_KEY;
  if (!key) throw new Error("AI_AGENT_PRIVATE_KEY not set");

  const account = privateKeyToAccount(key as `0x${string}`);
  const wallet = createWalletClient({
    account,
    chain: base,
    transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org"),
  });

  return { account, wallet };
}

const publicClient = createPublicClient({
  chain: base,
  transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org"),
});

// ─── Execute a single strategy call through the vault ──────────────

async function executeVaultStrategy(
  target: `0x${string}`,
  calldata: `0x${string}`,
): Promise<{ txHash: Hash; gasUsed: bigint }> {
  const { account, wallet } = getAgentWallet();

  // Simulate the transaction first to catch reverts before spending gas
  const { request } = await publicClient.simulateContract({
    account,
    address: CONTRACTS.CVAULT,
    abi: vaultAbi,
    functionName: "executeStrategy",
    args: [target, calldata],
  });

  const txHash = await wallet.writeContract(request);

  const receipt = await publicClient.waitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
    timeout: 60_000,
  });

  if (receipt.status === "reverted") {
    throw new Error(`Transaction reverted: ${txHash}`);
  }

  return { txHash, gasUsed: receipt.gasUsed };
}

// ─── Build calldata for a trade proposal ───────────────────────────

interface CalldataResult {
  target: `0x${string}`;
  data: `0x${string}`;
}

async function buildTradeCalldata(trade: TradeProposal): Promise<CalldataResult> {
  const fromAddr = resolveToken(trade.from);
  const toAddr = resolveToken(trade.to);
  const decimals = getDecimals(trade.from);
  const amountIn = parseUnits(trade.amount.toString(), decimals);
  const protocol = trade.protocol.toLowerCase();

  switch (trade.action) {
    case "swap": {
      if (protocol.includes("uniswap") || protocol === "uniswap-v3") {
        const result = await uniswap.buildSwapCalldataWithQuote({
          tokenIn: fromAddr,
          tokenOut: toAddr,
          amountIn,
          minAmountOut: amountIn, // Will be adjusted by slippage in buildSwapCalldata
          recipient: CONTRACTS.CVAULT,
          deadline: getDeadline(),
          slippageBps: 50, // 0.5% default slippage
        });
        return { target: result.target, data: result.data };
      }

      if (protocol.includes("aerodrome") || protocol === "aerodrome") {
        const result = await aerodrome.buildSwapCalldata({
          tokenIn: fromAddr,
          tokenOut: toAddr,
          amountIn,
          minAmountOut: amountIn,
          recipient: CONTRACTS.CVAULT,
          deadline: getDeadline(),
          slippageBps: 50,
        });
        return { target: result.target, data: result.data };
      }

      throw new Error(`Unsupported swap protocol: ${protocol}`);
    }

    case "stake": {
      // "stake" maps to supply on lending protocols
      if (protocol.includes("aave") || protocol === "aave") {
        const calldata = aave.buildSupplyCalldata({
          asset: fromAddr,
          amount: amountIn,
          onBehalfOf: CONTRACTS.CVAULT,
        });
        return calldata;
      }

      if (protocol.includes("compound") || protocol === "compound") {
        const adapter = isWethRelated(fromAddr) ? compoundWeth : compoundUsdc;
        const calldata = adapter.buildSupplyCalldata({
          asset: fromAddr,
          amount: amountIn,
          onBehalfOf: CONTRACTS.CVAULT,
        });
        return calldata;
      }

      throw new Error(`Unsupported stake protocol: ${protocol}`);
    }

    case "unstake": {
      // "unstake" maps to withdraw on lending protocols
      if (protocol.includes("aave") || protocol === "aave") {
        const calldata = aave.buildWithdrawCalldata({
          asset: fromAddr,
          amount: amountIn,
          onBehalfOf: CONTRACTS.CVAULT,
        });
        return calldata;
      }

      if (protocol.includes("compound") || protocol === "compound") {
        const adapter = isWethRelated(fromAddr) ? compoundWeth : compoundUsdc;
        const calldata = adapter.buildWithdrawCalldata({
          asset: fromAddr,
          amount: amountIn,
          onBehalfOf: CONTRACTS.CVAULT,
        });
        return calldata;
      }

      throw new Error(`Unsupported unstake protocol: ${protocol}`);
    }

    case "add_lp":
    case "remove_lp": {
      // LP operations route through Aerodrome or Uniswap depending on protocol
      throw new Error(`LP operations not yet supported for protocol: ${protocol}`);
    }

    default:
      throw new Error(`Unknown trade action: ${trade.action}`);
  }
}

function isWethRelated(tokenAddr: string): boolean {
  return tokenAddr.toLowerCase() === BASE_TOKENS.WETH.toLowerCase();
}

// ─── Execute trades via vault's executeStrategy ─────────────────────

export async function executeTrades(
  trades: TradeProposal[]
): Promise<{ executed: TradeProposal[]; gasUsed: number }> {
  if (trades.length === 0) {
    return { executed: [], gasUsed: 0 };
  }

  const { account } = getAgentWallet();
  const executed: TradeProposal[] = [];
  let totalGas = 0;

  for (const trade of trades) {
    try {
      console.log(
        `[executor] Executing: ${trade.action} ${trade.from} -> ${trade.to} ($${trade.amount}) via ${trade.protocol}`
      );

      // Step 1: Build protocol-specific calldata
      const { target, data } = await buildTradeCalldata(trade);

      console.log(
        `[executor] Calldata built for ${trade.protocol}: target=${target}, data=${data.slice(0, 10)}...`
      );

      // Step 2: Execute through vault's executeStrategy
      const { txHash, gasUsed } = await executeVaultStrategy(target, data);

      console.log(
        `[executor] Trade confirmed: tx=${txHash}, gas=${gasUsed.toString()}`
      );

      totalGas += Number(gasUsed);
      executed.push(trade);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[executor] Trade failed (${trade.action} ${trade.from}->${trade.to} via ${trade.protocol}):`, message);

      // If a simulation revert happens, log details but continue with next trade
      if (message.includes("reverted") || message.includes("simulation")) {
        console.error(`[executor] Simulation/execution revert - skipping trade`);
        continue;
      }

      // For non-revert errors (e.g., network issues), re-throw to halt execution
      // to prevent cascading failures from stale state
      throw new Error(`[executor] Fatal error executing trade: ${message}`);
    }
  }

  return { executed, gasUsed: totalGas };
}
