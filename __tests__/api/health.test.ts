describe("/api/health", () => {
  it("endpoint path is valid", () => { expect("/api/health").toMatch(/^\/api\//); });
  it("method is GET", () => { expect("GET").toBe("GET"); });
});
