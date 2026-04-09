import { isPriceReliable } from "@/lib/oracle/aggregator";
describe("Oracle Aggregator", () => {
  test("marks stale prices as unreliable", () => { expect(isPriceReliable({ price: 100, sources: [{ price: 100, decimals: 8, timestamp: 0, source: "chainlink", confidence: 1 }], aggregatedAt: Date.now() / 1000, isStale: true, deviation: 0 })).toBe(false); });
  test("marks high deviation as unreliable", () => { expect(isPriceReliable({ price: 100, sources: [{ price: 100, decimals: 8, timestamp: Date.now() / 1000, source: "chainlink", confidence: 1 }], aggregatedAt: Date.now() / 1000, isStale: false, deviation: 5 })).toBe(false); });
  test("accepts reliable prices", () => { expect(isPriceReliable({ price: 100, sources: [{ price: 100, decimals: 8, timestamp: Date.now() / 1000, source: "chainlink", confidence: 1 }], aggregatedAt: Date.now() / 1000, isStale: false, deviation: 0.5 })).toBe(true); });
});
