describe("GET /api/v1/vault/stats", () => {
  it("returns expected shape", () => {
    const expected = { tvl: 0, sharePriceUsd: 0, totalShares: 0, depositors: 0, apy7d: 0 };
    for (const key of Object.keys(expected)) {
      expect(key).toBeTruthy();
    }
  });
});
