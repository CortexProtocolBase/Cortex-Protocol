import type { Tier } from "./types";

// ─── Chain Configuration ─────────────────────────────────────────────

export const BASE_CHAIN_ID = 8453;
export const BASE_RPC_URL = "https://mainnet.base.org";

// ─── Contract Addresses (Base Mainnet) ───────────────────────────────

export const CONTRACTS = {
  CORTEX_TOKEN: "0x7A67AFf42d26bDb1A1569C6DE758A4f28e15e4FD" as `0x${string}`,
  CVAULT: "0x3A0799D13c737b341c41004BF9861eBdba28Dcf1" as `0x${string}`,
  STAKING: "0x494D4ba8BBe8E9041207A206Cd635af343c9007E" as `0x${string}`,
  GOVERNANCE: "0x11cd3AfcBd99c22B47435DA29E93C26844b8d1Dc" as `0x${string}`,
  TREASURY: "0xd637A73E056Da2f8761474621B4889c96257d3f3" as `0x${string}`,
} as const;

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

export const GOVERNANCE = {
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

// ─── API ─────────────────────────────────────────────────────────────

export const API_VERSION = "v1";
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ─── Cache TTLs (seconds) ────────────────────────────────────────────

export const CACHE_TTL = {
  VAULT_STATS: 30,
  PORTFOLIO: 60,
  TRADES: 15,
  AI_INSIGHTS: 10,
  GOVERNANCE: 300,
  STAKING: 60,
  PERFORMANCE: 120,
} as const;

// ─── Token Gate ──────────────────────────────────────────────────────

export const TOKEN_GATE_MIN_BALANCE = BigInt(1);
