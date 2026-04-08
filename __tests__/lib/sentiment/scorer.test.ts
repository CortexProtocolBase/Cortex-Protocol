import { scoreSentiment, scoreWithVolume } from "@/lib/sentiment/scorer";

describe("scoreSentiment", () => {
  it("scores positive text above 0", () => { expect(scoreSentiment("ETH is bullish, moon soon, big rally")).toBeGreaterThan(0); });
  it("scores negative text below 0", () => { expect(scoreSentiment("bearish dump crash rug")).toBeLessThan(0); });
  it("scores neutral text at 0", () => { expect(scoreSentiment("the weather is nice today")).toBe(0); });
  it("handles empty string", () => { expect(scoreSentiment("")).toBe(0); });
  it("handles mixed sentiment", () => {
    const score = scoreSentiment("bullish on ETH but bearish on alts");
    expect(score).toBeGreaterThanOrEqual(-1);
    expect(score).toBeLessThanOrEqual(1);
  });
});

describe("scoreWithVolume", () => {
  it("returns zero for empty array", () => {
    const result = scoreWithVolume([]);
    expect(result.score).toBe(0);
    expect(result.volume).toBe(0);
  });
  it("aggregates multiple texts", () => {
    const result = scoreWithVolume(["bullish moon", "pump gains", "rally ath"]);
    expect(result.volume).toBe(3);
    expect(result.score).toBeGreaterThan(0);
  });
  it("tracks momentum", () => {
    const result = scoreWithVolume(["bearish dump", "bearish crash", "bullish moon", "bullish rally"]);
    expect(typeof result.momentum).toBe("number");
  });
});
