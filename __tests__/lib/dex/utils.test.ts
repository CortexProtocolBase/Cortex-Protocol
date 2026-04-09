import { applySlippage, calculatePriceImpact, getDeadline, isSameToken, sortTokens } from "@/lib/dex/utils";
describe("DEX Utils", () => {
  test("applySlippage reduces amount correctly", () => { expect(applySlippage(10000n, 50)).toBe(9950n); expect(applySlippage(10000n, 100)).toBe(9900n); expect(applySlippage(10000n, 0)).toBe(10000n); });
  test("calculatePriceImpact returns correct percentage", () => { expect(calculatePriceImpact(100n, 99n)).toBe(1); expect(calculatePriceImpact(100n, 100n)).toBe(0); expect(calculatePriceImpact(0n, 0n)).toBe(0); });
  test("getDeadline returns future timestamp", () => { const deadline = getDeadline(600); expect(deadline).toBeGreaterThan(Math.floor(Date.now() / 1000)); });
  test("isSameToken is case insensitive", () => { expect(isSameToken("0xABC", "0xabc")).toBe(true); expect(isSameToken("0xABC", "0xDEF")).toBe(false); });
  test("sortTokens returns consistent order", () => { const [a, b] = sortTokens("0xBBB", "0xAAA"); expect(a).toBe("0xAAA"); expect(b).toBe("0xBBB"); });
});
