import { getSlippageBps, maxPriceImpact, validateTradeParams } from "@/lib/dex/slippage";
import { SLIPPAGE_DEFAULTS } from "@/lib/dex/constants";

describe("getSlippageBps", () => {
  const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  const USDbC = "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA";
  const WETH = "0x4200000000000000000000000000000000000006";

  it("returns lowest for stable-stable", () => { expect(getSlippageBps(USDC, USDbC)).toBe(SLIPPAGE_DEFAULTS.STABLE); });
  it("returns normal for stable-volatile", () => { expect(getSlippageBps(USDC, WETH)).toBe(SLIPPAGE_DEFAULTS.NORMAL); });
  it("respects volatility param", () => { expect(getSlippageBps(WETH, WETH, 60)).toBe(SLIPPAGE_DEFAULTS.DEGEN); });
});

describe("maxPriceImpact", () => {
  it("core is strictest", () => { expect(maxPriceImpact("core")).toBe(0.5); });
  it("mid is moderate", () => { expect(maxPriceImpact("mid")).toBe(1.5); });
  it("degen is most permissive", () => { expect(maxPriceImpact("degen")).toBe(3.0); });
});

describe("validateTradeParams", () => {
  it("accepts valid trade", () => {
    expect(validateTradeParams({ priceImpact: 0.3, slippageBps: 50, tier: "core", amountUsd: 1000, maxTradeSize: 50000 }).valid).toBe(true);
  });
  it("rejects high price impact", () => {
    expect(validateTradeParams({ priceImpact: 2.0, slippageBps: 50, tier: "core", amountUsd: 1000, maxTradeSize: 50000 }).valid).toBe(false);
  });
  it("rejects oversized trade", () => {
    expect(validateTradeParams({ priceImpact: 0.1, slippageBps: 50, tier: "core", amountUsd: 100000, maxTradeSize: 50000 }).valid).toBe(false);
  });
});
