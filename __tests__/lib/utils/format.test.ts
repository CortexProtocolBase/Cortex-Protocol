import { formatUsd, formatCompact, formatPercent, formatAddress, formatTimeAgo } from "@/lib/utils/format";
describe("Format Utils", () => {
  test("formatUsd formats currency", () => { expect(formatUsd(1234.56)).toContain("1,234"); });
  test("formatCompact abbreviates millions", () => { expect(formatCompact(12400000)).toBe("$12.40M"); });
  test("formatCompact abbreviates billions", () => { expect(formatCompact(1500000000)).toBe("$1.50B"); });
  test("formatPercent adds percent sign", () => { expect(formatPercent(18.7)).toBe("18.7%"); });
  test("formatAddress truncates", () => { expect(formatAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe("0x1234...5678"); });
});
