import { getSlippageBps, maxPriceImpact, validateTradeParams } from "@/lib/dex/slippage";
describe("Slippage Management", () => {
  test("stable pair gets lowest slippage", () => { expect(getSlippageBps("0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA")).toBe(10); });
  test("maxPriceImpact varies by tier", () => { expect(maxPriceImpact("core")).toBe(0.5); expect(maxPriceImpact("mid")).toBe(1.5); expect(maxPriceImpact("degen")).toBe(3.0); });
  test("validates trade params correctly", () => { expect(validateTradeParams({ priceImpact: 0.3, slippageBps: 50, tier: "core", amountUsd: 1000, maxTradeSize: 50000 }).valid).toBe(true);
    expect(validateTradeParams({ priceImpact: 2.0, slippageBps: 50, tier: "core", amountUsd: 1000, maxTradeSize: 50000 }).valid).toBe(false); });
});
