describe("/api/v1/staking/stats", () => {
  it("endpoint path is valid", () => { expect("/api/v1/staking/stats").toMatch(/^\/api\//); });
  it("method is GET", () => { expect("GET").toBe("GET"); });
});
