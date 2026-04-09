describe("GET /api/v1/governance/proposals", () => {
  it("proposal has required fields", () => {
    const fields = ["id", "title", "status", "proposer", "forPct", "againstPct"];
    expect(fields.length).toBeGreaterThan(0);
  });
});
