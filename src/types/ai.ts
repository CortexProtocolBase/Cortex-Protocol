export type AIDecision = "hold" | "trade" | "rebalance";
export interface AIReasoning { cycleId: number; decision: AIDecision; confidence: number; marketSummary: string; sentiments: Record<string, number>; riskAssessment: { level: string; score: number }; tradesProposed: number; tradesExecuted: number; timestamp: number; }
