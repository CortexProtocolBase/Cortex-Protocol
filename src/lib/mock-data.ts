import type {
  VaultStatsResponse,
  UserPositionResponse,
  PortfolioResponse,
  TradeResponse,
  AiInsightsResponse,
  ReasoningFeedEntry,
  GovernanceResponse,
  StakingInfoResponse,
  PerformanceResponse,
} from "./types";

// ─── Vault Stats ─────────────────────────────────────────────────────

export const mockVaultStats: VaultStatsResponse = {
  tvl: 12_400_000,
  sharePriceUsd: 1.087,
  apy24h: 18.7,
  apy7d: 17.2,
  apy30d: 16.8,
  depositors: 2847,
  totalProfit: 1_840_000,
  fees: {
    management: 0.02,
    performance: 0.2,
    withdrawal: 0.005,
    deposit: 0,
  },
};

// ─── User Position ───────────────────────────────────────────────────

export const mockUserPosition: UserPositionResponse = {
  walletAddress: "0xAb3...7f2",
  depositedAmount: 21_684.59,
  currentValue: 24_531.82,
  profitLoss: 2_847.23,
  profitLossPct: 13.13,
  cvaultShares: 22_567.4,
  vaultSharePct: 0.34,
  entryDate: "2025-10-15T00:00:00Z",
  recentTransactions: [
    { type: "Deposit", amount: 5000, share: 4600, date: "2026-03-10T14:22:00Z" },
    { type: "Deposit", amount: 10000, share: 9250, date: "2025-12-01T09:15:00Z" },
    { type: "Withdraw", amount: 2000, share: 1840, date: "2026-01-20T16:45:00Z" },
    { type: "Deposit", amount: 8684.59, share: 8757.4, date: "2025-10-15T11:30:00Z" },
  ],
};

// ─── Portfolio / Strategy ────────────────────────────────────────────

export const mockPortfolio: PortfolioResponse = {
  allocations: [
    { strategyName: "Aave USDC Yield", protocol: "Aave", tier: "Core", allocationPct: 25, apy: 8.2, return30d: 2.1, riskLevel: "Low", isActive: true },
    { strategyName: "Compound ETH", protocol: "Compound", tier: "Core", allocationPct: 20, apy: 5.4, return30d: 1.4, riskLevel: "Low", isActive: true },
    { strategyName: "cbBTC/WETH LP", protocol: "Aerodrome", tier: "Core", allocationPct: 25, apy: 12.1, return30d: 3.2, riskLevel: "Medium", isActive: true },
    { strategyName: "Aerodrome AERO/USDC", protocol: "Aerodrome", tier: "Mid-Risk", allocationPct: 12, apy: 24.8, return30d: 6.1, riskLevel: "Medium", isActive: true },
    { strategyName: "DEGEN/WETH Pool", protocol: "Uniswap", tier: "Mid-Risk", allocationPct: 8, apy: 31.2, return30d: 7.8, riskLevel: "High", isActive: true },
    { strategyName: "New Base Launch #47", protocol: "Various", tier: "Degen", allocationPct: 6, apy: 0, return30d: 12.3, riskLevel: "High", isActive: true },
    { strategyName: "Momentum Token XYZ", protocol: "Various", tier: "Degen", allocationPct: 4, apy: 0, return30d: -3.1, riskLevel: "High", isActive: true },
  ],
  tiers: [
    { name: "Core", allocationPct: 70, valueUsd: 8_680_000 },
    { name: "Mid-Risk", allocationPct: 20, valueUsd: 2_480_000 },
    { name: "Degen", allocationPct: 10, valueUsd: 1_240_000 },
  ],
  riskMetrics: {
    sharpeRatio: 2.4,
    maxDrawdown: -8.3,
    volatility: 12.1,
    winRate: 73,
  },
  lastRebalance: "2026-03-16T08:14:00Z",
  nextRebalance: "2026-03-16T09:22:00Z",
  confidence: 87,
};

// ─── Trades ──────────────────────────────────────────────────────────

export const mockTrades: TradeResponse[] = [
  { id: "t-001", time: "2h ago", type: "Swap", assetPair: "USDC → WETH", amountUsd: 12400, protocol: "Uniswap", tier: "Core", pnlUsd: 124, pnlPositive: true, reasoning: "ETH showing strong momentum on Base. Rotating 5% of idle USDC into WETH to capture upside. Confidence: 84%.", txHash: "0xabc1" },
  { id: "t-002", time: "3h ago", type: "Add LP", assetPair: "AERO/USDC", amountUsd: 8200, protocol: "Aerodrome", tier: "Mid-Risk", pnlUsd: 287, pnlPositive: true, reasoning: "Aerodrome AERO/USDC pool APY spiked to 32%. Adding LP to capture elevated yield before normalization.", txHash: "0xabc2" },
  { id: "t-003", time: "5h ago", type: "Remove LP", assetPair: "DEGEN/WETH", amountUsd: 3100, protocol: "Uniswap", tier: "Degen", pnlUsd: -89, pnlPositive: false, reasoning: "DEGEN sentiment turning negative. Reducing LP exposure by 40% to lock in remaining gains.", txHash: "0xabc3" },
  { id: "t-004", time: "8h ago", type: "Stake", assetPair: "WETH → aWETH", amountUsd: 15600, protocol: "Aave", tier: "Core", pnlUsd: 42, pnlPositive: true, reasoning: "Aave lending rate increased to 5.8%. Staking idle WETH for yield generation.", txHash: "0xabc4" },
  { id: "t-005", time: "12h ago", type: "Swap", assetPair: "WETH → USDC", amountUsd: 6800, protocol: "Uniswap", tier: "Core", pnlUsd: 312, pnlPositive: true, reasoning: "Taking partial profit on WETH position after 8% run-up. Rebalancing Core tier toward target allocation.", txHash: "0xabc5" },
  { id: "t-006", time: "1d ago", type: "Add LP", assetPair: "cbBTC/WETH", amountUsd: 22400, protocol: "Aerodrome", tier: "Core", pnlUsd: 156, pnlPositive: true, reasoning: "BTC-ETH correlation stable. Adding to LP for 12.1% APY yield farming.", txHash: "0xabc6" },
  { id: "t-007", time: "1d ago", type: "Swap", assetPair: "USDC → DEGEN", amountUsd: 1800, protocol: "Uniswap", tier: "Degen", pnlUsd: -45, pnlPositive: false, reasoning: "DEGEN community event detected. Small speculative position within Degen allocation budget.", txHash: "0xabc7" },
  { id: "t-008", time: "2d ago", type: "Unstake", assetPair: "aUSDC → USDC", amountUsd: 10200, protocol: "Aave", tier: "Core", pnlUsd: 89, pnlPositive: true, reasoning: "Unstaking USDC from Aave to redeploy into higher-yield Aerodrome LP opportunity.", txHash: "0xabc8" },
  { id: "t-009", time: "2d ago", type: "Swap", assetPair: "AERO → USDC", amountUsd: 4500, protocol: "Aerodrome", tier: "Mid-Risk", pnlUsd: 234, pnlPositive: true, reasoning: "AERO reward harvesting. Converting earned AERO rewards to USDC to compound.", txHash: "0xabc9" },
  { id: "t-010", time: "3d ago", type: "Add LP", assetPair: "XYZ/WETH", amountUsd: 2200, protocol: "Uniswap", tier: "Degen", pnlUsd: -120, pnlPositive: false, reasoning: "Momentum signal detected on token XYZ. Small position within Degen risk budget.", txHash: "0xabca" },
];

// Total trades for pagination mock
export const MOCK_TOTAL_TRADES = 247;

// ─── AI Insights ─────────────────────────────────────────────────────

export const mockAiInsights: AiInsightsResponse = {
  confidence: 87,
  marketRegime: "Bullish",
  nextRebalanceMinutes: 8,
  cyclesToday: 14,
  sentiments: [
    { asset: "ETH", score: 0.72 },
    { asset: "USDC", score: 0.1 },
    { asset: "AERO", score: 0.45 },
    { asset: "cbBTC", score: 0.61 },
    { asset: "DEGEN", score: -0.23 },
    { asset: "Overall", score: 0.52 },
  ],
  marketSummary:
    "Base DeFi ecosystem showing strength with TVL up 3.2% over 24h. ETH holding above key support with bullish structure. Aerodrome volumes elevated post-incentive refresh. Degen sector mixed — DEGEN token under distribution pressure while newer launches showing momentum. Overall sentiment leans constructive; maintaining current allocation with slight risk-on bias.",
};

// ─── Reasoning Feed ──────────────────────────────────────────────────

export const mockReasoningFeed: ReasoningFeedEntry[] = [
  { cycle: 1042, decision: "HOLD", reasoning: "All positions within target bands. ETH stable above $3,400. No rebalance needed — monitoring Aerodrome reward rate changes.", time: "8 min ago", confidence: 87 },
  { cycle: 1041, decision: "TRADE", reasoning: "Executed USDC → WETH swap ($12.4k). ETH momentum score crossed 0.7 threshold. Adding exposure within Core allocation budget.", time: "34 min ago", confidence: 84 },
  { cycle: 1040, decision: "HOLD", reasoning: "Market regime still Bullish. Aave/Compound rates stable. DEGEN sentiment declining but position small enough to hold through volatility.", time: "1h ago", confidence: 86 },
  { cycle: 1039, decision: "REBALANCE", reasoning: "Core tier drifted to 67.2% (target 70%). Rebalancing: moved $8.2k from USDC reserves into Aerodrome AERO/USDC LP to restore tier balance.", time: "2h ago", confidence: 82 },
  { cycle: 1038, decision: "TRADE", reasoning: "Removed 40% of DEGEN/WETH LP ($3.1k). Sentiment score dropped below -0.2 threshold. Securing remaining gains before further decline.", time: "5h ago", confidence: 79 },
];

// ─── Governance ──────────────────────────────────────────────────────

export const mockGovernance: GovernanceResponse = {
  tokenPrice: 0.42,
  marketCap: 420_000_000,
  totalSupply: 1_000_000_000,
  proposals: [
    { id: "p-001", title: "Adjust Core Allocation Band to 60-85%", status: "Active", proposer: "0xAb3...7f2", forPct: 67, againstPct: 33, quorumPct: 45, timeRemaining: "2 days left" },
    { id: "p-002", title: "Increase AI Trade Rate to 30/hour", status: "Active", proposer: "0x1f4...8a1", forPct: 54, againstPct: 46, quorumPct: 38, timeRemaining: "5 days left" },
    { id: "p-003", title: "Reduce Performance Fee to 15%", status: "Passed", proposer: "0xc92...3d4", forPct: 78, againstPct: 22, quorumPct: 62, timeRemaining: null },
  ],
  parameters: [
    { name: "Core Allocation", value: "70%", range: "50-90%" },
    { name: "Mid-Risk Allocation", value: "20%", range: "5-35%" },
    { name: "Degen Allocation", value: "10%", range: "0-15%" },
    { name: "Max Slippage", value: "1.5%", range: "0.5-5%" },
    { name: "Management Fee", value: "2%", range: "0-5%" },
    { name: "Performance Fee", value: "20%", range: "0-30%" },
    { name: "Withdrawal Fee", value: "0.5%", range: "0-2%" },
    { name: "AI Trade Rate", value: "20/hour", range: "1-50" },
    { name: "Quorum", value: "4%", range: "1-10%" },
    { name: "Voting Period", value: "3 days", range: "1-14 days" },
    { name: "Timelock", value: "24h", range: "6-72h" },
  ],
  stats: {
    totalProposals: 23,
    passed: 18,
    rejected: 3,
    active: 2,
    totalVotesCast: 14_200_000,
  },
};

// ─── Staking ─────────────────────────────────────────────────────────

export const mockStakingInfo: StakingInfoResponse = {
  totalStaked: 142_000_000,
  totalStakedUsd: 59_640_000,
  currentApr: 12.4,
  userPosition: {
    stakedAmount: 25_000,
    lockDurationDays: 90,
    multiplier: 2,
    effectiveStake: 50_000,
    pendingRewards: 0.142,
    pendingRewardsUsd: 483.4,
    unlockDate: "2026-05-15T00:00:00Z",
  },
  rewardHistory: [
    { date: "2026-03-10", amount: 0.038, token: "WETH", status: "Claimed" },
    { date: "2026-03-03", amount: 0.041, token: "WETH", status: "Claimed" },
    { date: "2026-02-24", amount: 0.036, token: "WETH", status: "Claimed" },
    { date: "2026-02-17", amount: 0.029, token: "WETH", status: "Claimed" },
  ],
  lockTiers: [
    { label: "No Lock", days: 0, multiplier: 1 },
    { label: "1 Month", days: 30, multiplier: 1.5 },
    { label: "3 Months", days: 90, multiplier: 2 },
    { label: "6 Months", days: 180, multiplier: 2.5 },
  ],
};

// ─── Performance ─────────────────────────────────────────────────────

export const mockPerformance: PerformanceResponse = {
  daily: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2026, 2, i + 1).toISOString().split("T")[0],
    value: 10000 + Math.sin(i * 0.3) * 500 + i * 80,
  })),
  weekly: Array.from({ length: 52 }, (_, i) => ({
    date: new Date(2025, 2, 16 + i * 7).toISOString().split("T")[0],
    value: 10000 + i * 200 + Math.sin(i * 0.5) * 800,
  })),
  monthly: Array.from({ length: 12 }, (_, i) => ({
    date: new Date(2025, 3 + i, 1).toISOString().split("T")[0],
    value: 10000 + i * 1200 + Math.sin(i * 0.8) * 600,
  })),
  benchmarks: [
    { name: "CORTEX Vault", returnPct: 18.7 },
    { name: "ETH Hold", returnPct: 12.3 },
    { name: "BTC Hold", returnPct: 8.9 },
    { name: "S&P 500", returnPct: 6.2 },
    { name: "USDC Aave", returnPct: 4.1 },
  ],
  totalReturn: 2_847.23,
  totalReturnPct: 18.7,
};
