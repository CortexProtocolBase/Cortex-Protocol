import { scoreSentiment, scoreWithVolume } from "@/lib/sentiment/scorer";
describe("Sentiment Scorer", () => {
  test("positive text scores positive", () => { expect(scoreSentiment("ETH is bullish, moon soon")).toBeGreaterThan(0); });
  test("negative text scores negative", () => { expect(scoreSentiment("dump incoming, bearish crash")).toBeLessThan(0); });
  test("neutral text scores zero", () => { expect(scoreSentiment("the weather is nice today")).toBe(0); });
  test("scoreWithVolume aggregates correctly", () => { const result = scoreWithVolume(["bullish moon", "bearish dump", "neutral day"]); expect(result.volume).toBe(3); expect(typeof result.score).toBe("number"); expect(typeof result.momentum).toBe("number"); });
});
