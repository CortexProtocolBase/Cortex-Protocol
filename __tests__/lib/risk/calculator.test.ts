import { calculateSharpeRatio, calculateSortinoRatio, calculateMaxDrawdown, calculateVolatility, calculateWinRate, calculateProfitFactor, calculateVaR } from "@/lib/risk/calculator";

describe("calculateSharpeRatio", () => {
  it("returns positive for good returns", () => {
    const returns = Array.from({ length: 100 }, () => 0.005 + Math.random() * 0.001);
    expect(calculateSharpeRatio(returns)).toBeGreaterThan(0);
  });
  it("returns 0 for insufficient data", () => { expect(calculateSharpeRatio([0.01])).toBe(0); });
  it("returns 0 for empty array", () => { expect(calculateSharpeRatio([])).toBe(0); });
});

describe("calculateMaxDrawdown", () => {
  it("finds correct drawdown", () => {
    const curve = [100, 110, 105, 95, 100, 115];
    const { maxDrawdown } = calculateMaxDrawdown(curve);
    expect(maxDrawdown).toBeGreaterThan(0);
    expect(maxDrawdown).toBeLessThan(100);
  });
  it("handles monotonically increasing", () => {
    const curve = [100, 101, 102, 103];
    const { maxDrawdown } = calculateMaxDrawdown(curve);
    expect(maxDrawdown).toBe(0);
  });
});

describe("calculateVolatility", () => {
  it("returns positive for varying returns", () => {
    const returns = [0.01, -0.005, 0.02, -0.01, 0.015];
    expect(calculateVolatility(returns)).toBeGreaterThan(0);
  });
  it("returns 0 for constant returns", () => {
    expect(calculateVolatility([0.01, 0.01, 0.01])).toBe(0);
  });
});

describe("calculateWinRate", () => {
  it("calculates correctly", () => {
    const trades = [{ pnl: 100 }, { pnl: -50 }, { pnl: 200 }, { pnl: -30 }];
    expect(calculateWinRate(trades)).toBe(50);
  });
  it("handles all winners", () => {
    expect(calculateWinRate([{ pnl: 100 }, { pnl: 50 }])).toBe(100);
  });
  it("handles empty", () => { expect(calculateWinRate([])).toBe(0); });
});

describe("calculateProfitFactor", () => {
  it("calculates ratio", () => {
    const trades = [{ pnl: 300 }, { pnl: -100 }];
    expect(calculateProfitFactor(trades)).toBe(3);
  });
  it("handles no losses", () => {
    expect(calculateProfitFactor([{ pnl: 100 }])).toBe(99);
  });
});

describe("calculateVaR", () => {
  it("returns positive value", () => {
    const returns = Array.from({ length: 100 }, (_, i) => (i % 3 === 0 ? -0.02 : 0.01));
    expect(calculateVaR(returns, 0.95, 100000)).toBeGreaterThan(0);
  });
});
