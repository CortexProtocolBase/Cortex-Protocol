import { createPublicClient, http, parseAbiItem } from "viem";
import { base } from "viem/chains";
import { supabaseAdmin } from "../supabase";
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
export async function processDepositEvents(vaultAddress: string, fromBlock: bigint, toBlock: bigint): Promise<number> {
  try {
    const logs = await client.getLogs({ address: vaultAddress as `0x${string}`, event: parseAbiItem("event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares)"), fromBlock, toBlock });
    for (const log of logs) {
      const block = await client.getBlock({ blockNumber: log.blockNumber });
      await supabaseAdmin.from("deposits").upsert({ tx_hash: log.transactionHash, wallet_address: log.args.owner, amount: Number(log.args.assets) / 1e6, shares_received: Number(log.args.shares) / 1e18, timestamp: new Date(Number(block.timestamp) * 1000).toISOString(), asset: "USDC" }, { onConflict: "tx_hash" });
    }
    return logs.length;
  } catch (e) { console.error("[Indexer] deposit events error:", e); return 0; }
}
export async function processWithdrawEvents(vaultAddress: string, fromBlock: bigint, toBlock: bigint): Promise<number> {
  try {
    const logs = await client.getLogs({ address: vaultAddress as `0x${string}`, event: parseAbiItem("event Withdraw(address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares)"), fromBlock, toBlock });
    for (const log of logs) {
      const block = await client.getBlock({ blockNumber: log.blockNumber });
      await supabaseAdmin.from("withdrawals").upsert({ tx_hash: log.transactionHash, wallet_address: log.args.owner, assets_received: Number(log.args.assets) / 1e6, shares_burned: Number(log.args.shares) / 1e18, timestamp: new Date(Number(block.timestamp) * 1000).toISOString() }, { onConflict: "tx_hash" });
    }
    return logs.length;
  } catch (e) { console.error("[Indexer] withdraw events error:", e); return 0; }
}
