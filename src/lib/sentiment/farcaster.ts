import type { FarcasterCast, SentimentScore } from "./types";
import { ASSET_KEYWORDS } from "./keywords";
import { scoreWithVolume } from "./scorer";
const NEYNAR_API = "https://api.neynar.com/v2/farcaster";
export async function fetchFarcasterCasts(query: string, limit: number = 100): Promise<FarcasterCast[]> {
  const apiKey = process.env.NEYNAR_API_KEY;
  if (!apiKey) { console.warn("[Farcaster] No NEYNAR_API_KEY configured"); return []; }
  try {
    const res = await fetch(`${NEYNAR_API}/cast/search?q=${encodeURIComponent(query)}&limit=${limit}`, { headers: { accept: "application/json", api_key: apiKey } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.result?.casts || []).map((c: any) => ({ hash: c.hash, author: c.author?.username || "", text: c.text, timestamp: new Date(c.timestamp).getTime() / 1000, likes: c.reactions?.likes_count || 0, recasts: c.reactions?.recasts_count || 0 }));
  } catch (e) { console.error("[Farcaster] Fetch error:", e); return []; }
}
export async function getFarcasterSentiment(asset: string): Promise<SentimentScore | null> {
  const keywords = ASSET_KEYWORDS[asset.toUpperCase()];
  if (!keywords) return null;
  const casts = await fetchFarcasterCasts(keywords.join(" OR "));
  if (casts.length === 0) return null;
  const texts = casts.map(c => c.text);
  const { score, volume, momentum } = scoreWithVolume(texts);
  return { asset, score, volume, momentum, sources: ["farcaster"], timestamp: Math.floor(Date.now() / 1000) };
}
