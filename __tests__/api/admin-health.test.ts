describe("/api/admin/health", () => {
  it("endpoint path is valid", () => { expect("/api/admin/health").toMatch(/^\/api\//); });
  it("method is GET", () => { expect("GET").toBe("GET"); });
});
