import { createPublicClient, http, parseAbiItem } from "viem";
import { base } from "viem/chains";
import type { SentimentScore } from "./types";
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
export async function getOnchainSentiment(tokenAddress: string, asset: string): Promise<SentimentScore> {
  try {
    const block = await client.getBlockNumber();
    const fromBlock = block - 7200n; // ~24h on Base (12s blocks)
    // Count Transfer events as proxy for activity
    const logs = await client.getLogs({ address: tokenAddress as `0x${string}`, event: parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)"), fromBlock, toBlock: block });
    const txCount = logs.length;
    // More transactions = more interest = mildly bullish signal
    const score = Math.min(1, Math.max(-0.5, (txCount - 500) / 1000));
    return { asset, score: Math.round(score * 100) / 100, volume: txCount, momentum: 0, sources: ["onchain"], timestamp: Math.floor(Date.now() / 1000) };
  } catch (e) { console.error("[OnChain] sentiment error:", e); return { asset, score: 0, volume: 0, momentum: 0, sources: ["onchain"], timestamp: Math.floor(Date.now() / 1000) }; }
}
