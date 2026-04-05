export interface StakingPosition { id: string; amount: bigint; lockDuration: number; multiplier: number; effectiveStake: bigint; pendingRewards: bigint; stakedAt: number; unlocksAt: number; }
export interface LockTier { duration: number; multiplier: number; label: string; }
