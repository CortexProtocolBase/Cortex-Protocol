import type { NotificationCategory, NotificationPriority, NotificationChannel } from "./types";
interface Template { title: string; body: string; priority: NotificationPriority; channels: NotificationChannel[]; }
export const TEMPLATES: Record<NotificationCategory, Template> = {
  trade_executed: { title: "Trade Executed", body: "{{type}} {{asset}} — ${{amount}} on {{protocol}}", priority: "medium", channels: ["discord", "telegram"] },
  rebalance: { title: "Portfolio Rebalanced", body: "AI rebalanced portfolio. Confidence: {{confidence}}%", priority: "medium", channels: ["discord"] },
  large_deposit: { title: "Large Deposit", body: "${{amount}} deposited by {{address}}", priority: "high", channels: ["discord", "telegram"] },
  large_withdrawal: { title: "Large Withdrawal", body: "${{amount}} withdrawn by {{address}}", priority: "high", channels: ["discord", "telegram"] },
  governance_proposal: { title: "New Proposal", body: "Proposal #{{id}}: {{title}}", priority: "medium", channels: ["discord", "telegram"] },
  risk_alert: { title: "Risk Alert", body: "{{message}}", priority: "critical", channels: ["discord", "telegram", "email"] },
  system_health: { title: "System Alert", body: "{{message}}", priority: "high", channels: ["discord"] },
  price_alert: { title: "Price Alert", body: "{{asset}} price: ${{price}} ({{change}}%)", priority: "medium", channels: ["discord"] },
};
export function renderTemplate(category: NotificationCategory, data: Record<string, string>): { title: string; body: string } {
  const t = TEMPLATES[category]; let title = t.title; let body = t.body;
  for (const [key, val] of Object.entries(data)) { title = title.replace(`{{${key}}}`, val); body = body.replace(`{{${key}}}`, val); }
  return { title, body };
}
