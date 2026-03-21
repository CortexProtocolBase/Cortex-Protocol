import { createWalletClient, createPublicClient, http, formatUnits } from "viem";
import { base } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { CONTRACTS } from "@/lib/constants";
import { vaultAbi } from "@/lib/abis/vault";
import type { TradeProposal } from "./types";

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

// ─── Execute trades via vault's executeStrategy ─────────────────────

export async function executeTrades(
  trades: TradeProposal[]
): Promise<{ executed: TradeProposal[]; gasUsed: number }> {
  if (trades.length === 0) {
    return { executed: [], gasUsed: 0 };
  }

  const { account, wallet } = getAgentWallet();
  const executed: TradeProposal[] = [];
  let totalGas = 0;

  for (const trade of trades) {
    try {
      // In production, encode the actual DEX swap/LP calldata.
      // For now, log the intent. The executeStrategy function on the vault
      // would forward calls to DEX routers.
      console.log(
        `[executor] Would execute: ${trade.action} ${trade.from} → ${trade.to} ($${trade.amount}) via ${trade.protocol}`
      );

      // TODO: Encode actual calldata for each protocol:
      // - Uniswap: exactInputSingle on SwapRouter
      // - Aerodrome: addLiquidity / removeLiquidity
      // - Aave: supply / withdraw on Pool
      // - Compound: supply / withdraw on Comet
      //
      // Example (uncomment when DEX integration is ready):
      // const txHash = await wallet.writeContract({
      //   address: CONTRACTS.CVAULT,
      //   abi: vaultAbi,
      //   functionName: "executeStrategy",
      //   args: [targetDexRouter, encodedCalldata],
      // });
      // const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      // totalGas += Number(receipt.gasUsed);

      executed.push(trade);
    } catch (err) {
      console.error(`[executor] Trade failed:`, err);
    }
  }

  return { executed, gasUsed: totalGas };
}
