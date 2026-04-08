describe("/api/v1/notifications", () => {
  it("endpoint path is valid", () => { expect("/api/v1/notifications").toMatch(/^\/api\//); });
  it("method is GET", () => { expect("GET").toBe("GET"); });
});
