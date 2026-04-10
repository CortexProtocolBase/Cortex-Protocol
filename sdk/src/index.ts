// @cortex-protocol/sdk — public entry point

// Client
export { createCortexClient } from "./client.js";
export type { CortexClient } from "./client.js";

// Addresses & chain config
export {
  BASE_CHAIN_ID,
  BASE_RPC_URL,
  CONTRACTS,
  type CortexContractName,
} from "./addresses.js";

// Constants
export {
  FEES,
  TIER_DEFAULTS,
  GOVERNANCE_PARAMS,
  LOCK_TIERS,
  FEE_DISTRIBUTION,
} from "./constants.js";

// Types
export type {
  TradeType,
  Tier,
  RiskLevel,
  ProposalStatus,
  RewardStatus,
  AiDecision,
  MarketRegime,
  VaultStats,
  UserVaultPosition,
} from "./types.js";

// ABIs
export { vaultAbi } from "./abis/vault.js";
export { tokenAbi } from "./abis/token.js";
export { stakingAbi } from "./abis/staking.js";
export { governorAbi } from "./abis/governor.js";
export { treasuryAbi } from "./abis/treasury.js";
