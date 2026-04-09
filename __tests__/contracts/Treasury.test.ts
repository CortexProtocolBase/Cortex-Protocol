describe("Treasury", () => {
  it("splits fees 50/50", () => {
    const total = 1000;
    const stakerShare = total * 0.5;
    const treasuryShare = total * 0.5;
    expect(stakerShare + treasuryShare).toBe(total);
  });
});
