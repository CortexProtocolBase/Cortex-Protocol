// =============================================================================
// CORTEX Protocol — Constants & Configuration
// Based on CORTEX Blueprint v1.0
// =============================================================================

// --- Chain ---
export const BASE_CHAIN_ID = 8453;
export const BASE_RPC_URL = process.env.NEXT_PUBLIC_BASE_RPC_URL || "https://mainnet.base.org";

// --- Contract Addresses (to be updated after deployment) ---
export const CONTRACTS = {
  CORTEX_VAULT: process.env.NEXT_PUBLIC_VAULT_ADDRESS || "0x0000000000000000000000000000000000000000",
  CORTEX_TOKEN: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "0x0000000000000000000000000000000000000000",
  TRADE_EXECUTOR: process.env.NEXT_PUBLIC_EXECUTOR_ADDRESS || "0x0000000000000000000000000000000000000000",
  GOVERNOR: process.env.NEXT_PUBLIC_GOVERNOR_ADDRESS || "0x0000000000000000000000000000000000000000",
  FEE_DISTRIBUTOR: process.env.NEXT_PUBLIC_FEE_DISTRIBUTOR_ADDRESS || "0x0000000000000000000000000000000000000000",
  ASSET_REGISTRY: process.env.NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000",
} as const;

// --- Known Tokens on Base ---
export const TOKENS = {
  WETH: "0x4200000000000000000000000000000000000006",
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  cbBTC: "0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf",
  AERO: "0x940181a94A35A4569E4529A3CDfB74e38FD98631",
  DEGEN: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
} as const;

// --- Default Allocation Bands (Section 7.4) ---
export const DEFAULT_ALLOCATIONS = {
  core:  { default: 70, min: 50, max: 90 },
  mid:   { default: 20, min: 5,  max: 35 },
  degen: { default: 10, min: 0,  max: 15 },
} as const;

// --- Fee Structure (Section 7.2) ---
export const FEES = {
  management: 2,         // 2% annualized
  performance: 20,       // 20% of profits above HWM
  withdrawal: 0.5,       // 0.5%
  deposit: 0,            // Free
} as const;

// --- Governance Defaults (Section 8.2) ---
export const GOVERNANCE = {
  proposalQuorum: 4,     // 4% of total supply
  votingPeriodDays: 3,
  timelockDelayHours: 24,
  emergencyBrakeThreshold: 66, // 66% supermajority
  minProposalTokens: 100_000,  // 100K CORTEX to create proposal
} as const;

// --- Token Info (Section 5.2) ---
export const TOKEN_INFO = {
  name: "Cortex Protocol",
  symbol: "CORTEX",
  decimals: 18,
  totalSupply: "1000000000", // 1B fixed, non-mintable
} as const;

// --- Staking Multipliers (Section 5.5) ---
export const STAKING_MULTIPLIERS = [
  { lockDays: 0,   multiplier: 1.0, label: "No Lock" },
  { lockDays: 30,  multiplier: 1.5, label: "1 Month" },
  { lockDays: 90,  multiplier: 2.0, label: "3 Months" },
  { lockDays: 180, multiplier: 2.5, label: "6 Months" },
] as const;

// --- Dashboard Tiers (Section 8.1) ---
export const DASHBOARD_TIERS = {
  tier1: 10_000,       // 10K CORTEX
  tier2: 100_000,      // 100K CORTEX
  tier3: 1_000_000,    // 1M CORTEX
} as const;

// --- AI Config ---
export const AI_CONFIG = {
  tradeCycleMinutes: 10,
  maxTradesPerHour: 20,
  maxSlippageDefault: 1.5, // percent
} as const;

// --- API ---
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
