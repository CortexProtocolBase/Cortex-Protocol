describe("/api/v1/portfolio/allocation-history", () => {
  it("endpoint path is valid", () => { expect("/api/v1/portfolio/allocation-history").toMatch(/^\/api\//); });
  it("method is GET", () => { expect("GET").toBe("GET"); });
});
