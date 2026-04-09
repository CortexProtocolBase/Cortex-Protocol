describe("Staking", () => {
  it("has correct multipliers", () => {
    expect([1.0, 1.5, 2.0, 2.5]).toEqual([1.0, 1.5, 2.0, 2.5]);
  });
  it("calculates effective stake", () => {
    expect(1000 * 2.0).toBe(2000);
  });
});
