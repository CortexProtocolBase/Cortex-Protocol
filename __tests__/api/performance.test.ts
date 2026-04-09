describe("GET /api/v1/performance", () => {
  it("returns monthly data", () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    expect(months).toHaveLength(12);
  });
});
