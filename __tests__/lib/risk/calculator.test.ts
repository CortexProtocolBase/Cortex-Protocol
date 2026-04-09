import { calculateSharpeRatio, calculateMaxDrawdown, calculateVolatility, calculateWinRate, calculateProfitFactor, calculateVaR } from "@/lib/risk/calculator";
describe("Risk Calculator", () => {
  const returns = [0.01, -0.005, 0.02, -0.01, 0.015, 0.008, -0.003, 0.012, 0.005, -0.008];
  test("calculateSharpeRatio returns number", () => { expect(typeof calculateSharpeRatio(returns)).toBe("number"); });
  test("calculateMaxDrawdown finds correct drawdown", () => { const curve = [100, 105, 103, 98, 102, 107]; const result = calculateMaxDrawdown(curve); expect(result.maxDrawdown).toBeGreaterThan(0); });
  test("calculateVolatility returns percentage", () => { expect(calculateVolatility(returns)).toBeGreaterThan(0); });
  test("calculateWinRate returns percentage", () => { const trades = [{ pnl: 100 }, { pnl: -50 }, { pnl: 200 }, { pnl: -30 }]; expect(calculateWinRate(trades)).toBe(50); });
  test("calculateProfitFactor returns ratio", () => { const trades = [{ pnl: 300 }, { pnl: -100 }]; expect(calculateProfitFactor(trades)).toBe(3); });
  test("calculateVaR returns positive number", () => { expect(calculateVaR(returns, 0.95, 100000)).toBeGreaterThan(0); });
});
