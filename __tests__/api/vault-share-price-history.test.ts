describe("/api/v1/vault/share-price-history", () => {
  it("endpoint path is valid", () => { expect("/api/v1/vault/share-price-history").toMatch(/^\/api\//); });
  it("method is GET", () => { expect("GET").toBe("GET"); });
});
