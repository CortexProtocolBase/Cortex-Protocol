import type { SentimentScore } from "./types";
import { ASSET_KEYWORDS } from "./keywords";
import { scoreWithVolume } from "./scorer";
export async function getTwitterSentiment(asset: string): Promise<SentimentScore | null> {
  const keywords = ASSET_KEYWORDS[asset.toUpperCase()];
  if (!keywords) return null;
  // Twitter API v2 requires Bearer token
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) { console.warn("[Twitter] No TWITTER_BEARER_TOKEN configured"); return null; }
  try {
    const query = keywords.map(k => `"${k}"`).join(" OR ") + " -is:retweet lang:en";
    const res = await fetch(`https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&max_results=100&tweet.fields=created_at,public_metrics`, { headers: { Authorization: `Bearer ${bearerToken}` } });
    if (!res.ok) return null;
    const data = await res.json();
    const texts = (data.data || []).map((t: any) => t.text);
    if (texts.length === 0) return null;
    const { score, volume, momentum } = scoreWithVolume(texts);
    return { asset, score, volume, momentum, sources: ["twitter"], timestamp: Math.floor(Date.now() / 1000) };
  } catch (e) { console.error("[Twitter] error:", e); return null; }
}
