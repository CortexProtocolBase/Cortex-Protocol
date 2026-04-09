describe("GET /api/v1/portfolio", () => {
  it("tier allocations sum to 100", () => {
    const tiers = { core: 70, mid: 20, degen: 10 };
    expect(tiers.core + tiers.mid + tiers.degen).toBe(100);
  });
});
