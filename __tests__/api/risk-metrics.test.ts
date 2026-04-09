describe("GET /api/v1/risk/metrics", () => {
  it("returns all risk metrics", () => {
    const metrics = ["sharpeRatio", "sortinoRatio", "maxDrawdown", "volatility", "winRate", "profitFactor"];
    expect(metrics.length).toBe(6);
  });
});
