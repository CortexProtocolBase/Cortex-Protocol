import Anthropic from "@anthropic-ai/sdk";
import type { MarketSnapshot, AgentDecision, TradeProposal } from "./types";
import { TIER_DEFAULTS, GOVERNANCE } from "@/lib/constants";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are the CORTEX AI Agent — an autonomous portfolio manager for a DeFi vault on Base L2.

Your vault manages USDC across three tiers:
- Core (target 70%, range 50-90%): Aave, Compound lending yields
- Mid-Risk (target 20%, range 5-35%): Aerodrome LP positions
- Degen (target 10%, range 0-15%): New token launches, momentum trades

Rules:
- Never exceed tier allocation bounds
- Max slippage per trade: 1.5%
- Max 20 trades per hour
- Confidence must be >0.5 to execute trades
- When in doubt, HOLD

You must respond with ONLY valid JSON matching this schema:
{
  "decision": "hold" | "trade" | "rebalance",
  "confidence": 0.0-1.0,
  "marketSummary": "2-3 sentence market analysis",
  "riskAssessment": {
    "volatility": 0.0-1.0,
    "maxDrawdown": -1.0-0.0,
    "sharpeRatio": 0.0-5.0,
    "regime": "Bullish" | "Bearish" | "Neutral" | "Volatile"
  },
  "tradesProposed": [
    {
      "action": "swap" | "add_lp" | "remove_lp" | "stake" | "unstake",
      "from": "TOKEN",
      "to": "TOKEN",
      "amount": 0,
      "protocol": "Uniswap" | "Aerodrome" | "Aave" | "Compound",
      "tier": "core" | "mid" | "degen",
      "reasoning": "Why this trade"
    }
  ]
}`;

export async function analyzeMarket(snapshot: MarketSnapshot): Promise<AgentDecision> {
  const userMessage = `Current market state:

Vault TVL: $${snapshot.vaultTvl.toLocaleString()}
Share Price: $${snapshot.sharePrice.toFixed(4)}
Allocations: Core ${(snapshot.allocations.core * 100).toFixed(1)}%, Mid-Risk ${(snapshot.allocations.mid * 100).toFixed(1)}%, Degen ${(snapshot.allocations.degen * 100).toFixed(1)}%

Token Prices:
${Object.entries(snapshot.prices).map(([k, v]) => `  ${k}: $${v.toLocaleString()}`).join("\n")}

Sentiment Scores (-1 bearish to +1 bullish):
${Object.entries(snapshot.sentiments).map(([k, v]) => `  ${k}: ${v}`).join("\n")}

Tier Bounds:
  Core: ${TIER_DEFAULTS.Core.min}-${TIER_DEFAULTS.Core.max}% (target ${TIER_DEFAULTS.Core.target}%)
  Mid-Risk: ${TIER_DEFAULTS["Mid-Risk"].min}-${TIER_DEFAULTS["Mid-Risk"].max}% (target ${TIER_DEFAULTS["Mid-Risk"].target}%)
  Degen: ${TIER_DEFAULTS.Degen.min}-${TIER_DEFAULTS.Degen.max}% (target ${TIER_DEFAULTS.Degen.target}%)

Analyze the market and decide: HOLD, TRADE, or REBALANCE. Return JSON only.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      decision: parsed.decision || "hold",
      confidence: parsed.confidence || 0.5,
      marketSummary: parsed.marketSummary || "Analysis unavailable.",
      sentimentData: snapshot.sentiments,
      riskAssessment: parsed.riskAssessment || {
        volatility: 0.1,
        maxDrawdown: -0.05,
        sharpeRatio: 2.0,
        regime: "Neutral",
      },
      tradesProposed: parsed.tradesProposed || [],
      tradesExecuted: [],
    };
  } catch (err) {
    console.error("[analyzer] Claude API error:", err);
    // Fallback: conservative HOLD
    return {
      decision: "hold",
      confidence: 0.5,
      marketSummary: "Analysis engine temporarily unavailable. Defaulting to HOLD.",
      sentimentData: snapshot.sentiments,
      riskAssessment: {
        volatility: 0.1,
        maxDrawdown: -0.05,
        sharpeRatio: 2.0,
        regime: "Neutral",
      },
      tradesProposed: [],
      tradesExecuted: [],
    };
  }
}
