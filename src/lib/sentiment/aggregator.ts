import { getFarcasterSentiment } from "./farcaster";
import { getTwitterSentiment } from "./twitter";
import { getOnchainSentiment } from "./onchain";
import { BASE_TOKENS } from "../dex/constants";
import type { AggregatedSentiment, SentimentScore } from "./types";
const TOKEN_ADDRESSES: Record<string, string> = { ETH: BASE_TOKENS.WETH, AERO: BASE_TOKENS.AERO, DEGEN: BASE_TOKENS.DEGEN, cbBTC: BASE_TOKENS.cbBTC };
const WEIGHTS = { farcaster: 0.35, twitter: 0.35, onchain: 0.3 };
export async function getAggregatedSentiment(assets: string[]): Promise<AggregatedSentiment> {
  const byAsset: Record<string, SentimentScore> = {};
  for (const asset of assets) {
    const [fc, tw, oc] = await Promise.allSettled([
      getFarcasterSentiment(asset),
      getTwitterSentiment(asset),
      TOKEN_ADDRESSES[asset] ? getOnchainSentiment(TOKEN_ADDRESSES[asset], asset) : Promise.resolve(null),
    ]);
    const scores: SentimentScore[] = [];
    if (fc.status === "fulfilled" && fc.value) scores.push(fc.value);
    if (tw.status === "fulfilled" && tw.value) scores.push(tw.value);
    if (oc.status === "fulfilled" && oc.value) scores.push(oc.value);
    if (scores.length > 0) {
      const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
      const totalVolume = scores.reduce((sum, s) => sum + s.volume, 0);
      const avgMomentum = scores.reduce((sum, s) => sum + s.momentum, 0) / scores.length;
      byAsset[asset] = { asset, score: Math.round(avgScore * 100) / 100, volume: totalVolume, momentum: Math.round(avgMomentum * 100) / 100, sources: scores.flatMap(s => s.sources), timestamp: Math.floor(Date.now() / 1000) };
    }
  }
  const allScores = Object.values(byAsset).map(s => s.score);
  const overall = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
  let regime: AggregatedSentiment["marketRegime"] = "neutral";
  if (overall > 0.3) regime = "bullish"; else if (overall < -0.3) regime = "bearish";
  const volatility = allScores.length > 1 ? Math.sqrt(allScores.reduce((sum, s) => sum + (s - overall) ** 2, 0) / allScores.length) : 0;
  if (volatility > 0.4) regime = "volatile";
  return { overall: Math.round(overall * 100) / 100, byAsset, marketRegime: regime, confidence: Math.min(1, allScores.length / assets.length), analyzedAt: Math.floor(Date.now() / 1000) };
}
