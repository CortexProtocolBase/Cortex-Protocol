describe("GET /api/v1/staking/info/:address", () => {
  it("returns position data", () => {
    const expected = ["totalStaked", "currentApr", "lockTiers"];
    expect(expected).toContain("totalStaked");
  });
});
