// =============================================================================
// CORTEX Protocol — Core Type Definitions
// Based on CORTEX Blueprint v1.0 Database Schema (Section 11)
// =============================================================================

// --- Vault ---

export interface VaultSnapshot {
  id: string;
  timestamp: string;
  totalAssets: string;       // Decimal as string for precision
  sharePrice: string;
  totalShares: string;
  depositorCount: number;
  coreAlloc: string;
  midAlloc: string;
  degenAlloc: string;
  idleCash: string;
}

export interface VaultStats {
  totalAUM: string;
  sharePrice: string;
  totalDepositors: number;
  volume24h: string;
  performanceSinceInception: string;
  currentAllocation: {
    core: string;
    mid: string;
    degen: string;
  };
}

export interface UserPosition {
  id: string;
  walletAddress: string;
  shares: string;
  depositedValue: string;
  currentValue: string;
  pnl: string;
  pnlPercent: string;
  depositHistory: DepositRecord[];
  lastUpdated: string;
}

// --- Deposits & Withdrawals ---

export interface DepositRecord {
  id: string;
  txHash: string;
  walletAddress: string;
  asset: "WETH" | "USDC";
  amount: string;
  sharesReceived: string;
  timestamp: string;
}

export interface WithdrawalRecord {
  id: string;
  txHash: string;
  walletAddress: string;
  sharesBurned: string;
  assetsReceived: string;
  feeCharged: string;
  timestamp: string;
}

// --- Trades ---

export type TradeActionType = "swap" | "add_lp" | "remove_lp" | "stake" | "unstake";
export type TradeTier = "core" | "mid" | "degen";
export type TradeStatus = "pending" | "executed" | "failed";

export interface Trade {
  id: string;
  txHash: string;
  timestamp: string;
  actionType: TradeActionType;
  assetIn: string;
  assetOut: string;
  amountIn: string;
  amountOut: string;
  protocol: string;
  tier: TradeTier;
  reasoning: string;
  reasoningHash: string;
  confidence: number;       // 0-100
  pnl: string | null;
  status: TradeStatus;
}

export interface TradeListParams {
  page?: number;
  limit?: number;
  type?: TradeActionType | "all";
  tier?: TradeTier | "all";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// --- Portfolio ---

export interface PortfolioPosition {
  asset: string;
  amount: string;
  value: string;
  tier: TradeTier;
  allocationPercent: string;
  priceChange24h: string;
}

// --- AI ---

export interface AIInsights {
  currentAnalysis: string;
  sentimentScores: SentimentScore[];
  confidenceLevel: number;
  marketRegime: "bullish" | "bearish" | "neutral" | "volatile";
  nextRebalanceEta: string;
  cycleCountToday: number;
}

export interface SentimentScore {
  asset: string;
  score: number;            // -1.0 to +1.0
  trend: "rising" | "falling" | "stable";
}

export interface AIReasoningEntry {
  id: string;
  timestamp: string;
  cycleId: string;
  marketSummary: string;
  sentimentData: Record<string, number>;
  riskAssessment: Record<string, unknown>;
  decision: "trade" | "hold" | "rebalance";
  confidence: number;
  tradesProposed: TradeProposal[];
  tradesExecuted: TradeProposal[];
}

export interface TradeProposal {
  actionType: TradeActionType;
  assetIn: string;
  assetOut: string;
  amount: string;
  targetProtocol: string;
  maxSlippage: string;
  reasoning: string;
}

// --- Governance ---

export type ProposalStatus = "active" | "passed" | "rejected" | "executed" | "expired";

export interface GovernanceProposal {
  id: string;
  proposalId: number;
  proposer: string;
  title: string;
  description: string;
  votesFor: string;
  votesAgainst: string;
  status: ProposalStatus;
  createdAt: string;
  votingEndsAt: string;
}

// --- Staking ---

export interface StakingInfo {
  stakedAmount: string;
  lockDuration: number;     // days (0 = no lock)
  multiplier: string;       // 1.0 - 2.5
  pendingRewards: string;
  claimHistory: ClaimRecord[];
  stakedAt: string;
  unlocksAt: string | null;
}

export interface ClaimRecord {
  id: string;
  amount: string;
  token: "WETH" | "USDC";
  claimedAt: string;
}

// --- Performance ---

export interface PerformanceData {
  sharePriceSeries: TimeSeriesPoint[];
  returns: {
    daily: string;
    weekly: string;
    monthly: string;
    allTime: string;
  };
  drawdown: string;
  sharpeRatio: string;
  volatility: string;
  winRate: string;
}

export interface TimeSeriesPoint {
  timestamp: string;
  value: string;
}
