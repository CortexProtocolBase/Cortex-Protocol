import type { RiskMetrics, DrawdownEntry } from "./types";
export function calculateSharpeRatio(returns: number[], riskFreeRate: number = 0.05): number {
  if (returns.length < 2) return 0;
  const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
  const annualizedReturn = avg * 252;
  const stdDev = Math.sqrt(returns.reduce((sum, r) => sum + (r - avg) ** 2, 0) / (returns.length - 1)) * Math.sqrt(252);
  return stdDev === 0 ? 0 : (annualizedReturn - riskFreeRate) / stdDev;
}
export function calculateSortinoRatio(returns: number[], riskFreeRate: number = 0.05): number {
  if (returns.length < 2) return 0;
  const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
  const annualizedReturn = avg * 252;
  const negativeReturns = returns.filter(r => r < 0);
  if (negativeReturns.length === 0) return annualizedReturn > riskFreeRate ? 99 : 0;
  const downDev = Math.sqrt(negativeReturns.reduce((sum, r) => sum + r ** 2, 0) / negativeReturns.length) * Math.sqrt(252);
  return downDev === 0 ? 0 : (annualizedReturn - riskFreeRate) / downDev;
}
export function calculateMaxDrawdown(equityCurve: number[]): { maxDrawdown: number; drawdowns: DrawdownEntry[] } {
  let peak = equityCurve[0]; let maxDD = 0; const drawdowns: DrawdownEntry[] = [];
  let currentDD: DrawdownEntry | null = null;
  for (let i = 1; i < equityCurve.length; i++) {
    if (equityCurve[i] > peak) { peak = equityCurve[i]; if (currentDD) { currentDD.recovered = true; currentDD.endDate = i.toString(); drawdowns.push(currentDD); currentDD = null; } }
    else { const dd = (peak - equityCurve[i]) / peak; if (dd > maxDD) maxDD = dd; if (!currentDD) currentDD = { startDate: i.toString(), endDate: null, depth: dd, recovered: false, duration: 0 };
      currentDD.depth = Math.max(currentDD.depth, dd); currentDD.duration++; }
  }
  if (currentDD) drawdowns.push(currentDD);
  return { maxDrawdown: Math.round(maxDD * 10000) / 100, drawdowns };
}
export function calculateVolatility(returns: number[]): number {
  if (returns.length < 2) return 0;
  const avg = returns.reduce((a, b) => a + b, 0) / returns.length;
  return Math.round(Math.sqrt(returns.reduce((sum, r) => sum + (r - avg) ** 2, 0) / (returns.length - 1)) * Math.sqrt(252) * 10000) / 100;
}
export function calculateWinRate(trades: { pnl: number }[]): number {
  if (trades.length === 0) return 0;
  return Math.round(trades.filter(t => t.pnl > 0).length / trades.length * 10000) / 100;
}
export function calculateProfitFactor(trades: { pnl: number }[]): number {
  const gains = trades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
  const losses = Math.abs(trades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0));
  return losses === 0 ? gains > 0 ? 99 : 0 : Math.round(gains / losses * 100) / 100;
}
export function calculateVaR(returns: number[], confidence: number = 0.95, portfolioValue: number = 1): number {
  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.floor((1 - confidence) * sorted.length);
  return Math.round(Math.abs(sorted[index] || 0) * portfolioValue * 100) / 100;
}
