export interface AuditConfig { enabled: boolean; interval: number; }
export interface AuditResult { success: boolean; timestamp: number; data: unknown; }
