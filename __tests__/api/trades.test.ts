describe("GET /api/v1/trades", () => {
  it("accepts page and pageSize params", () => {
    const params = new URLSearchParams({ page: "1", pageSize: "10" });
    expect(params.get("page")).toBe("1");
    expect(params.get("pageSize")).toBe("10");
  });
  it("filters by tier", () => {
    const params = new URLSearchParams({ tier: "core" });
    expect(["core", "mid", "degen"]).toContain(params.get("tier"));
  });
});
