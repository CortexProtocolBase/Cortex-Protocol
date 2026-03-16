// =============================================================================
// CORTEX Protocol — Mock Data
// Temporary mock data for API routes until real DB/indexer is connected.
// The other developer will replace these with Prisma queries + Redis cache.
// =============================================================================

import type {
  VaultStats,
  UserPosition,
  PortfolioPosition,
  Trade,
  AIInsights,
  AIReasoningEntry,
  GovernanceProposal,
  StakingInfo,
  PerformanceData,
} from "./types";

// --- Vault Stats ---
export const mockVaultStats: VaultStats = {
  totalAUM: "12400000",
  sharePrice: "1.047",
  totalDepositors: 2847,
  volume24h: "1850000",
  performanceSinceInception: "18.7",
  currentAllocation: {
    core: "70.2",
    mid: "19.8",
    degen: "10.0",
  },
};

// --- User Position (generic mock for any address) ---
export function mockUserPosition(address: string): UserPosition {
  return {
    id: "pos_mock_001",
    walletAddress: address,
    shares: "4780.25",
    depositedValue: "5000",
    currentValue: "5235",
    pnl: "235",
    pnlPercent: "4.7",
    depositHistory: [
      {
        id: "dep_001",
        txHash: "0xabc123...def456",
        walletAddress: address,
        asset: "WETH",
        amount: "2.5",
        sharesReceived: "2390.12",
        timestamp: "2025-12-15T10:30:00Z",
      },
      {
        id: "dep_002",
        txHash: "0x789abc...123def",
        walletAddress: address,
        asset: "USDC",
        amount: "2500",
        sharesReceived: "2390.13",
        timestamp: "2026-01-10T14:22:00Z",
      },
    ],
    lastUpdated: "2026-03-15T08:00:00Z",
  };
}

// --- Portfolio Positions ---
export const mockPortfolio: PortfolioPosition[] = [
  { asset: "WETH", amount: "2450", value: "5880000", tier: "core", allocationPercent: "47.4", priceChange24h: "2.3" },
  { asset: "USDC", amount: "1860000", value: "1860000", tier: "core", allocationPercent: "15.0", priceChange24h: "0.0" },
  { asset: "cbBTC", amount: "12.4", value: "968000", tier: "core", allocationPercent: "7.8", priceChange24h: "1.1" },
  { asset: "AERO", amount: "450000", value: "1240000", tier: "mid", allocationPercent: "10.0", priceChange24h: "-1.5" },
  { asset: "DEGEN", amount: "12000000", value: "720000", tier: "mid", allocationPercent: "5.8", priceChange24h: "4.2" },
  { asset: "Aerodrome WETH/USDC LP", amount: "500000", value: "496000", tier: "mid", allocationPercent: "4.0", priceChange24h: "0.8" },
  { asset: "Aave aUSDC", amount: "620000", value: "620000", tier: "core", allocationPercent: "5.0", priceChange24h: "0.01" },
  { asset: "New Base Token A", amount: "5000000", value: "360000", tier: "degen", allocationPercent: "2.9", priceChange24h: "12.4" },
  { asset: "Momentum Play B", amount: "2000000", value: "276000", tier: "degen", allocationPercent: "2.2", priceChange24h: "-3.1" },
];

// --- Trades ---
export const mockTrades: Trade[] = [
  {
    id: "trade_001", txHash: "0x1a2b3c...4d5e6f", timestamp: "2026-03-15T07:30:00Z",
    actionType: "swap", assetIn: "USDC", assetOut: "WETH", amountIn: "12400", amountOut: "5.16",
    protocol: "Aerodrome", tier: "core", reasoning: "ETH showing strong momentum with RSI at 62 and positive sentiment score of +0.72. Increasing core ETH position to capture upside while maintaining allocation within governance-set 50-90% band.",
    reasoningHash: "0xabc...123", confidence: 87, pnl: "124", status: "executed",
  },
  {
    id: "trade_002", txHash: "0x7f8a9b...0c1d2e", timestamp: "2026-03-15T06:20:00Z",
    actionType: "add_lp", assetIn: "WETH", assetOut: "USDC", amountIn: "2.5", amountOut: "6000",
    protocol: "Aerodrome", tier: "mid", reasoning: "WETH/USDC pool on Aerodrome showing elevated APR of 24.3% due to gauge incentives. Adding LP to capture yield while pool remains incentivized.",
    reasoningHash: "0xdef...456", confidence: 82, pnl: "89", status: "executed",
  },
  {
    id: "trade_003", txHash: "0x3e4f5a...6b7c8d", timestamp: "2026-03-15T05:10:00Z",
    actionType: "stake", assetIn: "AERO", assetOut: "veAERO", amountIn: "15000", amountOut: "15000",
    protocol: "Aerodrome", tier: "mid", reasoning: "Locking AERO for veAERO to boost LP yield multiplier. Current boost would increase WETH/USDC LP APR from 24.3% to 31.7%.",
    reasoningHash: "0xghi...789", confidence: 91, pnl: null, status: "executed",
  },
  {
    id: "trade_004", txHash: "0x9a0b1c...2d3e4f", timestamp: "2026-03-14T22:40:00Z",
    actionType: "swap", assetIn: "USDC", assetOut: "DEGEN", amountIn: "8500", amountOut: "1416666",
    protocol: "Uniswap V3", tier: "degen", reasoning: "DEGEN showing strong Farcaster sentiment spike (+0.68) with volume increasing 340% in 4 hours. Allocating small degen position within 0-15% governance band. Position sized at 0.07% of vault.",
    reasoningHash: "0xjkl...012", confidence: 64, pnl: "-42", status: "executed",
  },
  {
    id: "trade_005", txHash: "0x5f6a7b...8c9d0e", timestamp: "2026-03-14T20:15:00Z",
    actionType: "remove_lp", assetIn: "LP-TOKEN", assetOut: "WETH", amountIn: "50000", amountOut: "3.2",
    protocol: "Aerodrome", tier: "mid", reasoning: "Removing LP position due to impermanent loss exceeding 4.2% threshold. Reallocating to single-sided WETH to reduce risk exposure during volatile period.",
    reasoningHash: "0xmno...345", confidence: 78, pnl: "-156", status: "executed",
  },
  {
    id: "trade_006", txHash: "0x1b2c3d...4e5f6a", timestamp: "2026-03-14T18:00:00Z",
    actionType: "swap", assetIn: "WETH", assetOut: "USDC", amountIn: "1.8", amountOut: "4320",
    protocol: "Aerodrome", tier: "core", reasoning: "Taking partial profits on ETH position after 6.2% run-up. Rebalancing core allocation back toward target 70% split between ETH and stables.",
    reasoningHash: "0xpqr...678", confidence: 85, pnl: "267", status: "executed",
  },
  {
    id: "trade_007", txHash: "0x7g8h9i...0j1k2l", timestamp: "2026-03-14T14:30:00Z",
    actionType: "swap", assetIn: "USDC", assetOut: "cbBTC", amountIn: "25000", amountOut: "0.32",
    protocol: "Uniswap V3", tier: "core", reasoning: "BTC dominance rising, cbBTC on Base showing relative undervaluation vs mainnet BTC. Adding to core BTC position within allocation band.",
    reasoningHash: "0xstu...901", confidence: 80, pnl: "312", status: "executed",
  },
  {
    id: "trade_008", txHash: "0x3m4n5o...6p7q8r", timestamp: "2026-03-14T10:45:00Z",
    actionType: "stake", assetIn: "USDC", assetOut: "aUSDC", amountIn: "50000", amountOut: "50000",
    protocol: "Aave V3", tier: "core", reasoning: "Aave USDC supply rate at 5.4% APY, above 30-day average of 4.8%. Deploying idle USDC to earn base yield while maintaining instant liquidity for rebalancing.",
    reasoningHash: "0xvwx...234", confidence: 94, pnl: null, status: "executed",
  },
  {
    id: "trade_009", txHash: "0x9s0t1u...2v3w4x", timestamp: "2026-03-14T08:00:00Z",
    actionType: "unstake", assetIn: "aUSDC", assetOut: "USDC", amountIn: "30000", amountOut: "30045",
    protocol: "Aave V3", tier: "core", reasoning: "Withdrawing USDC from Aave to provide liquidity for anticipated rebalancing. Market volatility increasing, want dry powder available.",
    reasoningHash: "0xyza...567", confidence: 76, pnl: "45", status: "executed",
  },
  {
    id: "trade_010", txHash: "0x5y6z7a...8b9c0d", timestamp: "2026-03-13T22:20:00Z",
    actionType: "swap", assetIn: "DEGEN", assetOut: "USDC", amountIn: "500000", amountOut: "3200",
    protocol: "Uniswap V3", tier: "degen", reasoning: "DEGEN sentiment turned negative (-0.23). Exiting 40% of degen DEGEN position to lock in gains before momentum reversal completes.",
    reasoningHash: "0xbcd...890", confidence: 72, pnl: "680", status: "executed",
  },
];

// --- AI Insights ---
export const mockAIInsights: AIInsights = {
  currentAnalysis: "Market showing bullish momentum across major Base assets. ETH trending above 20-day MA with increasing volume. Farcaster sentiment broadly positive. Aerodrome TVL growing 12% week-over-week indicating strong LP incentives. Maintaining current allocation with slight overweight to core positions. Monitoring cbBTC for potential accumulation zone if BTC dominance continues rising.",
  sentimentScores: [
    { asset: "ETH", score: 0.72, trend: "rising" },
    { asset: "USDC", score: 0.10, trend: "stable" },
    { asset: "AERO", score: 0.45, trend: "rising" },
    { asset: "cbBTC", score: 0.61, trend: "stable" },
    { asset: "DEGEN", score: -0.23, trend: "falling" },
    { asset: "BASE ecosystem", score: 0.55, trend: "rising" },
  ],
  confidenceLevel: 87,
  marketRegime: "bullish",
  nextRebalanceEta: "2026-03-15T08:10:00Z",
  cycleCountToday: 14,
};

// --- AI Reasoning Log ---
export const mockReasoningFeed: AIReasoningEntry[] = [
  {
    id: "reason_001", timestamp: "2026-03-15T07:30:00Z", cycleId: "cycle_1842",
    marketSummary: "ETH +2.3% 24h, BTC +1.1%, AERO -1.5%. Volume above average. Farcaster mentions of Base DeFi up 23%.",
    sentimentData: { ETH: 0.72, USDC: 0.10, AERO: 0.45, cbBTC: 0.61, DEGEN: -0.23 },
    riskAssessment: { portfolioVaR: "2.1%", maxDrawdown: "4.8%", riskScore: 35 },
    decision: "trade", confidence: 87,
    tradesProposed: [{ actionType: "swap", assetIn: "USDC", assetOut: "WETH", amount: "12400", targetProtocol: "Aerodrome", maxSlippage: "1.5", reasoning: "Increase ETH exposure on bullish momentum" }],
    tradesExecuted: [{ actionType: "swap", assetIn: "USDC", assetOut: "WETH", amount: "12400", targetProtocol: "Aerodrome", maxSlippage: "1.5", reasoning: "Increase ETH exposure on bullish momentum" }],
  },
  {
    id: "reason_002", timestamp: "2026-03-15T06:20:00Z", cycleId: "cycle_1841",
    marketSummary: "Aerodrome gauge vote results in: WETH/USDC pool selected for boosted emissions. APR spike expected.",
    sentimentData: { ETH: 0.68, USDC: 0.10, AERO: 0.52, cbBTC: 0.58, DEGEN: -0.15 },
    riskAssessment: { portfolioVaR: "2.0%", maxDrawdown: "4.5%", riskScore: 32 },
    decision: "trade", confidence: 82,
    tradesProposed: [{ actionType: "add_lp", assetIn: "WETH", assetOut: "USDC", amount: "2.5", targetProtocol: "Aerodrome", maxSlippage: "1.0", reasoning: "Capture elevated LP APR from gauge incentives" }],
    tradesExecuted: [{ actionType: "add_lp", assetIn: "WETH", assetOut: "USDC", amount: "2.5", targetProtocol: "Aerodrome", maxSlippage: "1.0", reasoning: "Capture elevated LP APR from gauge incentives" }],
  },
  {
    id: "reason_003", timestamp: "2026-03-15T05:10:00Z", cycleId: "cycle_1840",
    marketSummary: "Low volatility period. All positions within target bands. No significant market events detected.",
    sentimentData: { ETH: 0.65, USDC: 0.10, AERO: 0.48, cbBTC: 0.55, DEGEN: -0.10 },
    riskAssessment: { portfolioVaR: "1.8%", maxDrawdown: "4.2%", riskScore: 28 },
    decision: "hold", confidence: 91,
    tradesProposed: [],
    tradesExecuted: [],
  },
];

// --- Governance Proposals ---
export const mockProposals: GovernanceProposal[] = [
  {
    id: "prop_001", proposalId: 1, proposer: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
    title: "Adjust Core Allocation Band to 60-85%",
    description: "Proposal to narrow the core allocation band from 50-90% to 60-85% to reduce volatility and maintain stronger base asset holdings during uncertain market conditions.",
    votesFor: "42000000", votesAgainst: "21000000", status: "active",
    createdAt: "2026-03-12T10:00:00Z", votingEndsAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "prop_002", proposalId: 2, proposer: "0x8Ba1f109551bD432803012645Hac136c22C50143",
    title: "Add BRETT to Mid-Risk Whitelist",
    description: "Proposal to add BRETT token to the approved mid-risk asset whitelist with a max allocation of 3% and approved router through Aerodrome.",
    votesFor: "55000000", votesAgainst: "8000000", status: "active",
    createdAt: "2026-03-13T14:00:00Z", votingEndsAt: "2026-03-16T14:00:00Z",
  },
  {
    id: "prop_003", proposalId: 3, proposer: "0x1234567890abcdef1234567890abcdef12345678",
    title: "Reduce Performance Fee to 15%",
    description: "Proposal to reduce the performance fee from 20% to 15% to attract more depositors and increase vault AUM. The management fee remains at 2%.",
    votesFor: "38000000", votesAgainst: "45000000", status: "rejected",
    createdAt: "2026-03-05T08:00:00Z", votingEndsAt: "2026-03-08T08:00:00Z",
  },
];

// --- Staking Info ---
export function mockStakingInfo(address: string): StakingInfo {
  return {
    stakedAmount: "125000",
    lockDuration: 90,
    multiplier: "2.0",
    pendingRewards: "842.50",
    claimHistory: [
      { id: "claim_001", amount: "312.25", token: "WETH", claimedAt: "2026-03-08T12:00:00Z" },
      { id: "claim_002", amount: "289.10", token: "USDC", claimedAt: "2026-03-01T12:00:00Z" },
      { id: "claim_003", amount: "256.80", token: "WETH", claimedAt: "2026-02-22T12:00:00Z" },
    ],
    stakedAt: "2026-01-15T10:00:00Z",
    unlocksAt: "2026-04-15T10:00:00Z",
  };
}

// --- Performance ---
export const mockPerformance: PerformanceData = {
  sharePriceSeries: Array.from({ length: 90 }, (_, i) => {
    const date = new Date("2025-12-15");
    date.setDate(date.getDate() + i);
    const basePrice = 1.0 + (i * 0.0005) + (Math.sin(i / 7) * 0.008) + (Math.random() * 0.003);
    return {
      timestamp: date.toISOString(),
      value: basePrice.toFixed(4),
    };
  }),
  returns: {
    daily: "0.31",
    weekly: "1.84",
    monthly: "4.72",
    allTime: "18.7",
  },
  drawdown: "-4.8",
  sharpeRatio: "2.14",
  volatility: "8.3",
  winRate: "67.2",
};
