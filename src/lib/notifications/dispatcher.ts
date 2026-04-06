import { sendDiscordNotification } from "./discord";
import { sendTelegramNotification } from "./telegram";
import { sendEmailNotification } from "./email";
import { renderTemplate } from "./templates";
import type { NotificationCategory, NotificationChannel, NotificationConfig } from "./types";
export async function dispatch(category: NotificationCategory, data: Record<string, string>, config?: NotificationConfig, channels?: NotificationChannel[]): Promise<void> {
  const { title, body } = renderTemplate(category, data);
  const cfg = config || getDefaultConfig();
  const promises: Promise<boolean>[] = [];
  const activeChannels = channels || ["discord"];
  if (activeChannels.includes("discord") && cfg.discord) promises.push(sendDiscordNotification(cfg.discord.webhookUrl, title, body));
  if (activeChannels.includes("telegram") && cfg.telegram) promises.push(sendTelegramNotification(cfg.telegram.botToken, cfg.telegram.chatId, title, body));
  if (activeChannels.includes("email") && cfg.email) promises.push(sendEmailNotification(cfg.email.apiKey, cfg.email.from, cfg.email.to, title, body));
  await Promise.allSettled(promises);
}
function getDefaultConfig(): NotificationConfig {
  return { discord: process.env.DISCORD_WEBHOOK_URL ? { webhookUrl: process.env.DISCORD_WEBHOOK_URL } : undefined, telegram: process.env.TELEGRAM_BOT_TOKEN ? { botToken: process.env.TELEGRAM_BOT_TOKEN, chatId: process.env.TELEGRAM_CHAT_ID || "" } : undefined };
}
