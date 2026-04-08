import { isPriceReliable } from "@/lib/oracle/aggregator";
import type { OracleResult } from "@/lib/oracle/types";

const makePriceResult = (overrides: Partial<OracleResult> = {}): OracleResult => ({
  price: 100,
  sources: [{ price: 100, decimals: 8, timestamp: Math.floor(Date.now() / 1000), source: "chainlink", confidence: 1 }],
  aggregatedAt: Math.floor(Date.now() / 1000),
  isStale: false,
  deviation: 0,
  ...overrides,
});

describe("isPriceReliable", () => {
  it("accepts fresh, consistent price", () => {
    expect(isPriceReliable(makePriceResult())).toBe(true);
  });
  it("rejects stale price", () => {
    expect(isPriceReliable(makePriceResult({ isStale: true }))).toBe(false);
  });
  it("rejects high deviation", () => {
    expect(isPriceReliable(makePriceResult({ deviation: 5 }))).toBe(false);
  });
  it("rejects no sources", () => {
    expect(isPriceReliable(makePriceResult({ sources: [] }))).toBe(false);
  });
  it("accepts borderline deviation", () => {
    expect(isPriceReliable(makePriceResult({ deviation: 1.9 }))).toBe(true);
  });
});
