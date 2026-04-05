import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { CHAINLINK_AGGREGATOR_ABI } from "./abis/chainlink-aggregator";
import { CHAINLINK_FEEDS, STALE_PRICE_THRESHOLD } from "./feeds";
import type { PriceData } from "./types";
const client = createPublicClient({ chain: base, transport: http(process.env.BASE_RPC_URL || "https://mainnet.base.org") });
export async function getChainlinkPrice(asset: string): Promise<PriceData | null> {
  const cfg = CHAINLINK_FEEDS[asset.toUpperCase()]; if (!cfg) return null;
  try { const rd = await client.readContract({ address: cfg.feed as `0x${string}`, abi: CHAINLINK_AGGREGATOR_ABI, functionName: "latestRoundData" });
    const [, answer, , updatedAt] = rd as [bigint, bigint, bigint, bigint, bigint];
    const price = Number(answer) / Math.pow(10, cfg.decimals); const ts = Number(updatedAt); const age = Math.floor(Date.now()/1000) - ts;
    return { price, decimals: cfg.decimals, timestamp: ts, source: "chainlink", confidence: age > STALE_PRICE_THRESHOLD ? 0.5 : 1.0 };
  } catch (e) { console.error("[Chainlink]", asset, e); return null; }
}
export async function getChainlinkPrices(assets: string[]): Promise<Record<string, PriceData>> {
  const results: Record<string, PriceData> = {};
  const prices = await Promise.allSettled(assets.map(a => getChainlinkPrice(a)));
  for (let i = 0; i < assets.length; i++) { const r = prices[i]; if (r.status === "fulfilled" && r.value) results[assets[i]] = r.value; }
  return results;
}
export async function isPriceFeedHealthy(asset: string): Promise<boolean> { const p = await getChainlinkPrice(asset); if (!p) return false; return (Math.floor(Date.now()/1000) - p.timestamp) < STALE_PRICE_THRESHOLD && p.price > 0; }
