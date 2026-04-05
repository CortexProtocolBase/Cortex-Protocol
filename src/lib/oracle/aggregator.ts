import { getChainlinkPrice } from "./chainlink";
import { getCoinGeckoPrice } from "./coingecko";
import { DEVIATION_THRESHOLD } from "./feeds";
import type { PriceData, OracleResult } from "./types";
export async function getAggregatedPrice(asset: string): Promise<OracleResult> {
  const sources: PriceData[] = [];
  const [cl, cg] = await Promise.allSettled([getChainlinkPrice(asset), getCoinGeckoPrice(asset)]);
  if (cl.status === "fulfilled" && cl.value) sources.push(cl.value);
  if (cg.status === "fulfilled" && cg.value) sources.push(cg.value);
  if (!sources.length) return { price: 0, sources: [], aggregatedAt: Math.floor(Date.now()/1000), isStale: true, deviation: 0 };
  let tw = 0, ws = 0; for (const s of sources) { ws += s.price * s.confidence; tw += s.confidence; }
  const price = tw > 0 ? ws / tw : sources[0].price;
  let deviation = 0; if (sources.length > 1) { const ps = sources.map(s => s.price); deviation = ((Math.max(...ps) - Math.min(...ps)) / Math.min(...ps)) * 100; }
  const now = Math.floor(Date.now()/1000); const newest = Math.max(...sources.map(s => s.timestamp));
  return { price, sources, aggregatedAt: now, isStale: now - newest > 3600, deviation };
}
export async function getAggregatedPrices(assets: string[]): Promise<Record<string, OracleResult>> {
  const results: Record<string, OracleResult> = {};
  const prices = await Promise.allSettled(assets.map(a => getAggregatedPrice(a)));
  for (let i = 0; i < assets.length; i++) { if (prices[i].status === "fulfilled") results[assets[i]] = (prices[i] as PromiseFulfilledResult<OracleResult>).value; }
  return results;
}
export function isPriceReliable(r: OracleResult): boolean { return !r.isStale && r.sources.length > 0 && r.deviation <= DEVIATION_THRESHOLD; }
