import { formatUsd, formatCompact, formatPercent, formatAddress, formatTimeAgo } from "@/lib/utils/format";

describe("formatUsd", () => {
  it("formats whole numbers", () => { expect(formatUsd(1000)).toBe("$1,000"); });
  it("formats decimals", () => { expect(formatUsd(1234.56)).toContain("1,234"); });
  it("formats zero", () => { expect(formatUsd(0)).toBe("$0"); });
  it("formats negative", () => { expect(formatUsd(-500)).toContain("500"); });
});

describe("formatCompact", () => {
  it("formats millions", () => { expect(formatCompact(12400000)).toBe("$12.40M"); });
  it("formats billions", () => { expect(formatCompact(1500000000)).toBe("$1.50B"); });
  it("formats thousands", () => { expect(formatCompact(5000)).toBe("$5.0K"); });
  it("formats small numbers", () => { expect(formatCompact(42)).toBe("$42.00"); });
});

describe("formatPercent", () => {
  it("adds percent sign", () => { expect(formatPercent(18.7)).toBe("18.7%"); });
  it("respects decimals param", () => { expect(formatPercent(18.7, 0)).toBe("19%"); });
  it("handles zero", () => { expect(formatPercent(0)).toBe("0.0%"); });
});

describe("formatAddress", () => {
  it("truncates correctly", () => {
    expect(formatAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe("0x1234...5678");
  });
  it("preserves 0x prefix", () => {
    expect(formatAddress("0xABCDEF1234567890ABCDEF1234567890ABCDEF12")).toMatch(/^0x/);
  });
});

describe("formatTimeAgo", () => {
  it("formats seconds", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatTimeAgo(now - 30)).toBe("30s ago");
  });
  it("formats minutes", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatTimeAgo(now - 300)).toBe("5m ago");
  });
  it("formats hours", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatTimeAgo(now - 7200)).toBe("2h ago");
  });
  it("formats days", () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatTimeAgo(now - 172800)).toBe("2d ago");
  });
});
