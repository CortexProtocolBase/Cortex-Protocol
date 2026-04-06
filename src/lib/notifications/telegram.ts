export async function sendTelegramNotification(botToken: string, chatId: string, title: string, message: string): Promise<boolean> {
  try {
    const text = `*${title}*\n\n${message}`;
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown", disable_web_page_preview: true }) });
    return res.ok;
  } catch (e) { console.error("[Telegram] send error:", e); return false; }
}
