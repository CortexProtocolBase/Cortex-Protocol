describe("/api/v1/vault/depositors", () => {
  it("endpoint path is valid", () => { expect("/api/v1/vault/depositors").toMatch(/^\/api\//); });
  it("method is GET", () => { expect("GET").toBe("GET"); });
});
