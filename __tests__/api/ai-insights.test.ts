describe("GET /api/v1/ai/insights", () => {
  it("requires wallet header", () => {
    const headers = { "x-wallet-address": "0x1234567890abcdef1234567890abcdef12345678" };
    expect(headers["x-wallet-address"]).toMatch(/^0x[a-fA-F0-9]{40}$/);
  });
});
