import { bigintMin, bigintMax, bigintAbs, bigintToNumber, numberToBigint } from "@/lib/utils/bigint";

describe("bigintMin", () => {
  it("returns smaller value", () => { expect(bigintMin(10n, 20n)).toBe(10n); });
  it("handles equal values", () => { expect(bigintMin(5n, 5n)).toBe(5n); });
  it("handles negative", () => { expect(bigintMin(-10n, 5n)).toBe(-10n); });
});

describe("bigintMax", () => {
  it("returns larger value", () => { expect(bigintMax(10n, 20n)).toBe(20n); });
  it("handles equal values", () => { expect(bigintMax(5n, 5n)).toBe(5n); });
});

describe("bigintAbs", () => {
  it("handles positive", () => { expect(bigintAbs(10n)).toBe(10n); });
  it("handles negative", () => { expect(bigintAbs(-10n)).toBe(10n); });
  it("handles zero", () => { expect(bigintAbs(0n)).toBe(0n); });
});

describe("bigintToNumber", () => {
  it("converts with 18 decimals", () => { expect(bigintToNumber(1000000000000000000n, 18)).toBe(1); });
  it("converts with 6 decimals", () => { expect(bigintToNumber(1000000n, 6)).toBe(1); });
});

describe("numberToBigint", () => {
  it("converts with 18 decimals", () => { expect(numberToBigint(1, 18)).toBe(1000000000000000000n); });
  it("converts with 6 decimals", () => { expect(numberToBigint(1, 6)).toBe(1000000n); });
});
