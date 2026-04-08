import { isValidAddress, isValidAmount, isValidTxHash, sanitizeInput } from "@/lib/utils/validation";

describe("isValidAddress", () => {
  it("accepts valid address", () => { expect(isValidAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(true); });
  it("rejects short address", () => { expect(isValidAddress("0x1234")).toBe(false); });
  it("rejects no prefix", () => { expect(isValidAddress("1234567890abcdef1234567890abcdef12345678")).toBe(false); });
  it("rejects invalid chars", () => { expect(isValidAddress("0xGGGG567890abcdef1234567890abcdef12345678")).toBe(false); });
});

describe("isValidAmount", () => {
  it("accepts positive integer", () => { expect(isValidAmount("100")).toBe(true); });
  it("accepts decimal", () => { expect(isValidAmount("1.5")).toBe(true); });
  it("rejects zero", () => { expect(isValidAmount("0")).toBe(false); });
  it("rejects negative", () => { expect(isValidAmount("-5")).toBe(false); });
  it("rejects text", () => { expect(isValidAmount("abc")).toBe(false); });
});

describe("isValidTxHash", () => {
  it("accepts valid hash", () => { expect(isValidTxHash("0x" + "a".repeat(64))).toBe(true); });
  it("rejects short hash", () => { expect(isValidTxHash("0x1234")).toBe(false); });
});

describe("sanitizeInput", () => {
  it("removes angle brackets", () => { expect(sanitizeInput("<script>alert(1)</script>")).not.toContain("<"); });
  it("removes quotes", () => { expect(sanitizeInput('test"value')).not.toContain('"'); });
  it("passes clean input", () => { expect(sanitizeInput("hello world")).toBe("hello world"); });
});
