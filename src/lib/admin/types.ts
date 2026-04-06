export interface SystemHealth { status: "healthy" | "degraded" | "down"; uptime: number; lastCronRun: Record<string, number>; supabaseLatency: number; rpcLatency: number; aiAgentStatus: "running" | "paused" | "error"; pendingTrades: number; errorCount24h: number; }
export interface AdminStats { totalDeposits24h: number; totalWithdrawals24h: number; netFlow24h: number; uniqueUsers24h: number; totalUsers: number; tvl: number; fees24h: number; feesTotal: number; aiCycles24h: number; tradesExecuted24h: number; }
export interface TreasuryBalance { asset: string; balance: number; valueUsd: number; percentage: number; }
export interface AdminAlert { id: string; severity: "info" | "warning" | "error" | "critical"; title: string; message: string; source: string; timestamp: number; acknowledged: boolean; }
export interface AuditLogEntry { id: string; action: string; actor: string; details: Record<string, unknown>; timestamp: number; }
