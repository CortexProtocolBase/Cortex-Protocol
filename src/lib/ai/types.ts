// ─── AI Agent Types ──────────────────────────────────────────────────

export interface MarketSnapshot {
  timestamp: string;
  vaultTvl: number;
  sharePrice: number;
  allocations: {
    core: number;
    mid: number;
    degen: number;
  };
  prices: Record<string, number>;
  sentiments: Record<string, number>;
}

export interface TradeProposal {
  action: "swap" | "add_lp" | "remove_lp" | "stake" | "unstake";
  from: string;
  to: string;
  amount: number;
  protocol: string;
  tier: "core" | "mid" | "degen";
  reasoning: string;
}

export interface AgentDecision {
  decision: "hold" | "trade" | "rebalance";
  confidence: number;
  marketSummary: string;
  sentimentData: Record<string, number>;
  riskAssessment: {
    volatility: number;
    maxDrawdown: number;
    sharpeRatio: number;
    regime: "Bullish" | "Bearish" | "Neutral" | "Volatile";
  };
  tradesProposed: TradeProposal[];
  tradesExecuted: TradeProposal[];
}

export interface CycleResult {
  cycleId: number;
  decision: AgentDecision;
  gasUsed: number;
  error?: string;
}
