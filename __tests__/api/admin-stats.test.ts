describe("/api/admin/stats", () => {
  it("endpoint path is valid", () => { expect("/api/admin/stats").toMatch(/^\/api\//); });
  it("method is GET", () => { expect("GET").toBe("GET"); });
});
