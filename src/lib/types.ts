// ─── Database Row Types ──────────────────────────────────────────────

export interface DbVaultSnapshot {
  id: string;
  tvl: number;
  share_price: number;
  apy_24h: number;
  apy_7d: number;
  apy_30d: number;
  depositors: number;
  created_at: string;
}

export interface DbUserPosition {
  id: string;
  wallet_address: string;
  deposited_amount: number;
  current_value: number;
  cvault_shares: number;
  vault_share_pct: number;
  entry_date: string;
  updated_at: string;
}

export interface DbTrade {
  id: string;
  type: TradeType;
  asset_pair: string;
  amount_usd: number;
  protocol: string;
  tier: Tier;
  pnl_usd: number;
  reasoning: string;
  tx_hash: string;
  executed_at: string;
}

export interface DbAllocation {
  id: string;
  strategy_name: string;
  protocol: string;
  tier: Tier;
  allocation_pct: number;
  apy: number;
  return_30d: number;
  risk_level: RiskLevel;
  is_active: boolean;
  updated_at: string;
}

export interface DbProposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: ProposalStatus;
  for_votes: number;
  against_votes: number;
  quorum_pct: number;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface DbStakingPosition {
  id: string;
  wallet_address: string;
  staked_amount: number;
  lock_duration_days: number;
  multiplier: number;
  effective_stake: number;
  pending_rewards: number;
  unlock_date: string;
  created_at: string;
}

export interface DbRewardHistory {
  id: string;
  wallet_address: string;
  amount: number;
  token: string;
  status: RewardStatus;
  distributed_at: string;
}

export interface DbAiCycle {
  id: string;
  cycle_number: number;
  decision: AiDecision;
  reasoning: string;
  confidence: number;
  market_regime: MarketRegime;
  executed_at: string;
}

// ─── Enums ───────────────────────────────────────────────────────────

export type TradeType = "Swap" | "Add LP" | "Remove LP" | "Stake" | "Unstake";
export type Tier = "Core" | "Mid-Risk" | "Degen";
export type RiskLevel = "Low" | "Medium" | "High";
export type ProposalStatus = "Active" | "Passed" | "Rejected" | "Queued";
export type RewardStatus = "Claimed" | "Pending" | "Distributed";
export type AiDecision = "HOLD" | "TRADE" | "REBALANCE";
export type MarketRegime = "Bullish" | "Bearish" | "Neutral" | "Volatile";

// ─── API Response Types ──────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  cached?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  timestamp: string;
}

export interface VaultStatsResponse {
  tvl: number;
  sharePriceUsd: number;
  apy24h: number;
  apy7d: number;
  apy30d: number;
  depositors: number;
  totalProfit: number;
  fees: {
    management: number;
    performance: number;
    withdrawal: number;
    deposit: number;
  };
}

export interface UserPositionResponse {
  walletAddress: string;
  depositedAmount: number;
  currentValue: number;
  profitLoss: number;
  profitLossPct: number;
  cvaultShares: number;
  vaultSharePct: number;
  entryDate: string;
  recentTransactions: {
    type: string;
    amount: number;
    share: number;
    date: string;
  }[];
}

export interface PortfolioResponse {
  allocations: {
    strategyName: string;
    protocol: string;
    tier: Tier;
    allocationPct: number;
    apy: number;
    return30d: number;
    riskLevel: RiskLevel;
    isActive: boolean;
  }[];
  tiers: {
    name: Tier;
    allocationPct: number;
    valueUsd: number;
  }[];
  riskMetrics: {
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
    winRate: number;
  };
  lastRebalance: string;
  nextRebalance: string;
  confidence: number;
}

export interface TradeResponse {
  id: string;
  time: string;
  type: TradeType;
  assetPair: string;
  amountUsd: number;
  protocol: string;
  tier: Tier;
  pnlUsd: number;
  pnlPositive: boolean;
  reasoning: string;
  txHash: string;
}

export interface AiInsightsResponse {
  confidence: number;
  marketRegime: MarketRegime;
  nextRebalanceMinutes: number;
  cyclesToday: number;
  sentiments: {
    asset: string;
    score: number;
  }[];
  marketSummary: string;
}

export interface ReasoningFeedEntry {
  cycle: number;
  decision: AiDecision;
  reasoning: string;
  time: string;
  confidence: number;
}

export interface GovernanceResponse {
  tokenPrice: number;
  marketCap: number;
  totalSupply: number;
  proposals: {
    id: string;
    title: string;
    status: ProposalStatus;
    proposer: string;
    forPct: number;
    againstPct: number;
    quorumPct: number;
    timeRemaining: string | null;
  }[];
  parameters: {
    name: string;
    value: string;
    range?: string;
  }[];
  stats: {
    totalProposals: number;
    passed: number;
    rejected: number;
    active: number;
    totalVotesCast: number;
  };
}

export interface StakingInfoResponse {
  totalStaked: number;
  totalStakedUsd: number;
  currentApr: number;
  userPosition: {
    stakedAmount: number;
    lockDurationDays: number;
    multiplier: number;
    effectiveStake: number;
    pendingRewards: number;
    pendingRewardsUsd: number;
    unlockDate: string;
  } | null;
  rewardHistory: {
    date: string;
    amount: number;
    token: string;
    status: RewardStatus;
  }[];
  lockTiers: {
    label: string;
    days: number;
    multiplier: number;
  }[];
}

export interface PerformanceResponse {
  daily: { date: string; value: number }[];
  weekly: { date: string; value: number }[];
  monthly: { date: string; value: number }[];
  benchmarks: {
    name: string;
    returnPct: number;
  }[];
  totalReturn: number;
  totalReturnPct: number;
}
