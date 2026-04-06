export type NotificationChannel = "discord" | "telegram" | "email" | "webhook";
export type NotificationPriority = "low" | "medium" | "high" | "critical";
export type NotificationCategory = "trade_executed" | "rebalance" | "large_deposit" | "large_withdrawal" | "governance_proposal" | "risk_alert" | "system_health" | "price_alert";
export interface Notification { id: string; category: NotificationCategory; priority: NotificationPriority; title: string; message: string; data?: Record<string, unknown>; channels: NotificationChannel[]; createdAt: number; }
export interface NotificationConfig { discord?: { webhookUrl: string }; telegram?: { botToken: string; chatId: string }; email?: { apiKey: string; from: string; to: string[] }; webhook?: { url: string; secret: string } }
