import { applySlippage, calculatePriceImpact, getDeadline, isSameToken, sortTokens } from "@/lib/dex/utils";

describe("applySlippage", () => {
  it("applies 0.5% slippage", () => { expect(applySlippage(10000n, 50)).toBe(9950n); });
  it("applies 1% slippage", () => { expect(applySlippage(10000n, 100)).toBe(9900n); });
  it("applies 0% slippage", () => { expect(applySlippage(10000n, 0)).toBe(10000n); });
  it("handles large amounts", () => { expect(applySlippage(1000000000000000000n, 50)).toBe(999500000000000000n); });
});

describe("calculatePriceImpact", () => {
  it("calculates 1% impact", () => { expect(calculatePriceImpact(100n, 99n)).toBe(1); });
  it("calculates 0% impact", () => { expect(calculatePriceImpact(100n, 100n)).toBe(0); });
  it("handles zero input", () => { expect(calculatePriceImpact(0n, 0n)).toBe(0); });
});

describe("getDeadline", () => {
  it("returns future timestamp", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(getDeadline(600)).toBeGreaterThan(now);
    expect(getDeadline(600)).toBeLessThanOrEqual(now + 601);
  });
});

describe("isSameToken", () => {
  it("matches case insensitive", () => { expect(isSameToken("0xABC", "0xabc")).toBe(true); });
  it("rejects different tokens", () => { expect(isSameToken("0xABC", "0xDEF")).toBe(false); });
});

describe("sortTokens", () => {
  it("sorts lower address first", () => {
    const [a, b] = sortTokens("0xBBB", "0xAAA");
    expect(a.toLowerCase() < b.toLowerCase()).toBe(true);
  });
});
