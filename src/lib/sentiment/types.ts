export interface SentimentScore { asset: string; score: number; volume: number; momentum: number; sources: SentimentSource[]; timestamp: number; }
export type SentimentSource = "farcaster" | "twitter" | "reddit" | "onchain";
export interface FarcasterCast { hash: string; author: string; text: string; timestamp: number; likes: number; recasts: number; }
export interface AggregatedSentiment { overall: number; byAsset: Record<string, SentimentScore>; marketRegime: "bullish" | "bearish" | "neutral" | "volatile"; confidence: number; analyzedAt: number; }
export interface TrendSignal { asset: string; direction: "up" | "down" | "flat"; strength: number; duration: number; catalyst: string; }
