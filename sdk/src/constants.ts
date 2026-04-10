import type { Tier } from "./types.js";

// ─── Fee Structure ───────────────────────────────────────────────────

export const FEES = {
  DEPOSIT: 0,
  WITHDRAWAL: 0.005,
  MANAGEMENT: 0.02,
  PERFORMANCE: 0.2,
} as const;

// ─── Tier Configuration ──────────────────────────────────────────────

export const TIER_DEFAULTS: Record<Tier, { min: number; max: number; target: number }> = {
  Core: { min: 50, max: 90, target: 70 },
  "Mid-Risk": { min: 5, max: 35, target: 20 },
  Degen: { min: 0, max: 15, target: 10 },
};

// ─── Governance Defaults ─────────────────────────────────────────────

export const GOVERNANCE_PARAMS = {
  QUORUM_PCT: 4,
  VOTING_PERIOD_DAYS: 3,
  TIMELOCK_HOURS: 24,
  EMERGENCY_BRAKE_THRESHOLD: 66,
  MAX_SLIPPAGE_PCT: 1.5,
  AI_TRADE_RATE_PER_HOUR: 20,
  TOTAL_SUPPLY: 1_000_000_000,
} as const;

// ─── Staking Lock Tiers ──────────────────────────────────────────────

export const LOCK_TIERS = [
  { label: "No Lock", days: 0, multiplier: 1 },
  { label: "1 Month", days: 30, multiplier: 1.5 },
  { label: "3 Months", days: 90, multiplier: 2 },
  { label: "6 Months", days: 180, multiplier: 2.5 },
] as const;

// ─── Fee Distribution ────────────────────────────────────────────────

export const FEE_DISTRIBUTION = {
  STAKERS_PCT: 50,
  TREASURY_PCT: 50,
} as const;
