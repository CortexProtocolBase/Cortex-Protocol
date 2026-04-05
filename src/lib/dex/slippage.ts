import { SLIPPAGE_DEFAULTS } from "./constants";
const stablecoins = new Set(["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA"]);
export function getSlippageBps(tokenIn: string, tokenOut: string, volatility?: number): number {
  if (stablecoins.has(tokenIn) && stablecoins.has(tokenOut)) return SLIPPAGE_DEFAULTS.STABLE;
  if (volatility !== undefined) { if (volatility > 50) return SLIPPAGE_DEFAULTS.DEGEN; if (volatility > 20) return SLIPPAGE_DEFAULTS.VOLATILE; if (volatility > 5) return SLIPPAGE_DEFAULTS.NORMAL; return SLIPPAGE_DEFAULTS.STABLE; }
  if (stablecoins.has(tokenIn) || stablecoins.has(tokenOut)) return SLIPPAGE_DEFAULTS.NORMAL;
  return SLIPPAGE_DEFAULTS.VOLATILE;
}
export function maxPriceImpact(tier: "core" | "mid" | "degen"): number { const map = { core: 0.5, mid: 1.5, degen: 3.0 }; return map[tier]; }
export function validateTradeParams(p: { priceImpact: number; slippageBps: number; tier: "core"|"mid"|"degen"; amountUsd: number; maxTradeSize: number }): { valid: boolean; reason?: string } {
  if (p.priceImpact > maxPriceImpact(p.tier)) return { valid: false, reason: "Price impact too high for " + p.tier };
  if (p.amountUsd > p.maxTradeSize) return { valid: false, reason: "Trade size exceeds max" };
  if (p.slippageBps > SLIPPAGE_DEFAULTS.DEGEN) return { valid: false, reason: "Slippage too high" };
  return { valid: true };
}
