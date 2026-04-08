import { clamp, lerp, roundTo, percentChange } from "@/lib/utils/math";

describe("clamp", () => {
  it("clamps below min", () => { expect(clamp(-5, 0, 100)).toBe(0); });
  it("clamps above max", () => { expect(clamp(150, 0, 100)).toBe(100); });
  it("passes through in range", () => { expect(clamp(50, 0, 100)).toBe(50); });
  it("handles equal min/max", () => { expect(clamp(50, 10, 10)).toBe(10); });
});

describe("lerp", () => {
  it("returns start at t=0", () => { expect(lerp(0, 100, 0)).toBe(0); });
  it("returns end at t=1", () => { expect(lerp(0, 100, 1)).toBe(100); });
  it("returns midpoint at t=0.5", () => { expect(lerp(0, 100, 0.5)).toBe(50); });
  it("clamps t above 1", () => { expect(lerp(0, 100, 2)).toBe(100); });
});

describe("roundTo", () => {
  it("rounds to 2 decimals", () => { expect(roundTo(3.14159, 2)).toBe(3.14); });
  it("rounds to 0 decimals", () => { expect(roundTo(3.7, 0)).toBe(4); });
  it("handles negative", () => { expect(roundTo(-3.14159, 2)).toBe(-3.14); });
});

describe("percentChange", () => {
  it("calculates positive change", () => { expect(percentChange(100, 120)).toBe(20); });
  it("calculates negative change", () => { expect(percentChange(100, 80)).toBe(-20); });
  it("handles zero base", () => { expect(percentChange(0, 100)).toBe(0); });
  it("handles no change", () => { expect(percentChange(50, 50)).toBe(0); });
});
