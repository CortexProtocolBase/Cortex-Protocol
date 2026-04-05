import { POSITIVE_TERMS, NEGATIVE_TERMS } from "./keywords";
export function scoreSentiment(text: string): number {
  const lower = text.toLowerCase();
  let score = 0; let matches = 0;
  for (const term of POSITIVE_TERMS) { if (lower.includes(term)) { score += 1; matches++; } }
  for (const term of NEGATIVE_TERMS) { if (lower.includes(term)) { score -= 1; matches++; } }
  if (matches === 0) return 0;
  return Math.max(-1, Math.min(1, score / matches));
}
export function scoreWithVolume(texts: string[]): { score: number; volume: number; momentum: number } {
  if (texts.length === 0) return { score: 0, volume: 0, momentum: 0 };
  const scores = texts.map(scoreSentiment);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const half = Math.floor(scores.length / 2);
  const recentAvg = scores.slice(half).reduce((a, b) => a + b, 0) / Math.max(1, scores.length - half);
  const olderAvg = scores.slice(0, half).reduce((a, b) => a + b, 0) / Math.max(1, half);
  return { score: Math.round(avg * 100) / 100, volume: texts.length, momentum: Math.round((recentAvg - olderAvg) * 100) / 100 };
}
