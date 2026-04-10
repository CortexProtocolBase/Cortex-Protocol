// Public types for Cortex Protocol SDK consumers.
// Mirrors the on-chain / off-chain enums used throughout the protocol.

export type TradeType = "Swap" | "Add LP" | "Remove LP" | "Stake" | "Unstake";
export type Tier = "Core" | "Mid-Risk" | "Degen";
export type RiskLevel = "Low" | "Medium" | "High";
export type ProposalStatus = "Active" | "Passed" | "Rejected" | "Queued";
export type RewardStatus = "Claimed" | "Pending" | "Distributed";
export type AiDecision = "HOLD" | "TRADE" | "REBALANCE";
export type MarketRegime = "Bullish" | "Bearish" | "Neutral" | "Volatile";

export interface VaultStats {
  totalAssets: bigint;
  totalSupply: bigint;
  /** Share price scaled to 1e18 (i.e. 1.0 share price = 10n ** 18n). */
  sharePrice: bigint;
}

export interface UserVaultPosition {
  shares: bigint;
  /** shares * sharePrice / 1e18 */
  assetValue: bigint;
}
