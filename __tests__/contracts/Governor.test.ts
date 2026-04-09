describe("Governor", () => {
  it("requires 4% quorum", () => { expect(0.04 * 1e9).toBe(40000000); });
  it("has 3-day voting period", () => { expect(3 * 24 * 60 * 60).toBe(259200); });
  it("has 24-hour timelock", () => { expect(24 * 60 * 60).toBe(86400); });
});
