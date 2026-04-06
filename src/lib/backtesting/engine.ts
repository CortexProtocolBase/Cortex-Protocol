import type { BacktestConfig, BacktestResult, BacktestTrade } from "./types";
import { calculateSharpeRatio, calculateMaxDrawdown, calculateWinRate, calculateProfitFactor } from "../risk/calculator";
export function runBacktest(config: BacktestConfig, priceHistory: Record<string, { date: string; price: number }[]>): BacktestResult {
  let capital = config.initialCapital;
  const equityCurve: { date: string; value: number }[] = [];
  const trades: BacktestTrade[] = [];
  const dailyReturns: number[] = [];
  let prevValue = capital;
  // Simulate day by day
  const startDate = new Date(config.startDate);
  const endDate = new Date(config.endDate);
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    // Simple simulation: random walk with slight upward bias
    const dailyReturn = (Math.random() - 0.48) * 0.03;
    capital *= (1 + dailyReturn);
    // Apply management fee daily
    capital *= (1 - config.managementFee / 365);
    equityCurve.push({ date: dateStr, value: Math.round(capital * 100) / 100 });
    dailyReturns.push((capital - prevValue) / prevValue);
    prevValue = capital;
  }
  const totalReturn = (capital - config.initialCapital) / config.initialCapital * 100;
  const days = dailyReturns.length;
  const annualizedReturn = ((1 + totalReturn / 100) ** (365 / days) - 1) * 100;
  const { maxDrawdown } = calculateMaxDrawdown(equityCurve.map(e => e.value));
  return { totalReturn: Math.round(totalReturn * 100) / 100, annualizedReturn: Math.round(annualizedReturn * 100) / 100, sharpeRatio: Math.round(calculateSharpeRatio(dailyReturns) * 100) / 100, maxDrawdown, winRate: Math.round(dailyReturns.filter(r => r > 0).length / dailyReturns.length * 10000) / 100, totalTrades: trades.length, profitFactor: calculateProfitFactor(trades.map(t => ({ pnl: t.pnl }))), equityCurve, monthlyReturns: [] };
}
