export interface VaultState { totalAssets: bigint; totalShares: bigint; sharePrice: number; depositorCount: number; isPaused: boolean; }
export interface UserVaultPosition { shares: bigint; depositedValue: number; currentValue: number; pnl: number; pnlPercent: number; }
