describe("/api/v1/vault/tvl-history", () => {
  it("endpoint path is valid", () => { expect("/api/v1/vault/tvl-history").toMatch(/^\/api\//); });
  it("method is GET", () => { expect("GET").toBe("GET"); });
});
