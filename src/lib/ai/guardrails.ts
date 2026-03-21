import { TIER_DEFAULTS, GOVERNANCE } from "@/lib/constants";
import type { AgentDecision, TradeProposal, MarketSnapshot } from "./types";

interface GuardrailResult {
  passed: boolean;
  reason?: string;
  filteredTrades: TradeProposal[];
}

// Track trades per hour for rate limiting
let recentTradeTimestamps: number[] = [];

export function validateDecision(
  decision: AgentDecision,
  snapshot: MarketSnapshot
): GuardrailResult {
  const now = Date.now();

  // 1. Confidence threshold
  if (decision.confidence < 0.5 && decision.decision !== "hold") {
    return {
      passed: false,
      reason: `Confidence ${decision.confidence} below 0.5 threshold. Forcing HOLD.`,
      filteredTrades: [],
    };
  }

  // 2. Rate limit: max trades per hour
  recentTradeTimestamps = recentTradeTimestamps.filter(
    (t) => now - t < 60 * 60 * 1000
  );
  const remainingSlots = GOVERNANCE.AI_TRADE_RATE_PER_HOUR - recentTradeTimestamps.length;
  if (remainingSlots <= 0 && decision.tradesProposed.length > 0) {
    return {
      passed: false,
      reason: `Rate limit: ${GOVERNANCE.AI_TRADE_RATE_PER_HOUR} trades/hour exceeded.`,
      filteredTrades: [],
    };
  }

  // 3. Validate each proposed trade
  const validTrades: TradeProposal[] = [];

  for (const trade of decision.tradesProposed.slice(0, remainingSlots)) {
    // Check tier bounds
    const tierKey = trade.tier === "core" ? "Core" : trade.tier === "mid" ? "Mid-Risk" : "Degen";
    const tierConfig = TIER_DEFAULTS[tierKey];
    const currentAlloc =
      trade.tier === "core" ? snapshot.allocations.core :
      trade.tier === "mid" ? snapshot.allocations.mid :
      snapshot.allocations.degen;

    const currentPct = currentAlloc * 100;

    // Rough check: would this trade push allocation out of bounds?
    if (trade.amount > 0 && snapshot.vaultTvl > 0) {
      const tradePct = (trade.amount / snapshot.vaultTvl) * 100;
      const newPct = currentPct + tradePct;
      if (newPct > tierConfig.max) {
        console.warn(
          `[guardrails] Trade rejected: ${tierKey} would exceed ${tierConfig.max}% (current ${currentPct.toFixed(1)}% + ${tradePct.toFixed(1)}%)`
        );
        continue;
      }
    }

    // Check trade amount is reasonable (max 10% of TVL per trade)
    if (snapshot.vaultTvl > 0 && trade.amount > snapshot.vaultTvl * 0.1) {
      console.warn(
        `[guardrails] Trade rejected: $${trade.amount} exceeds 10% of TVL ($${snapshot.vaultTvl})`
      );
      continue;
    }

    validTrades.push(trade);
  }

  // Record trade timestamps
  for (let i = 0; i < validTrades.length; i++) {
    recentTradeTimestamps.push(now);
  }

  return {
    passed: true,
    filteredTrades: validTrades,
  };
}
