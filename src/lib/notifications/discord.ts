export async function sendDiscordNotification(webhookUrl: string, title: string, message: string, color: number = 0x3B82F6): Promise<boolean> {
  try {
    const res = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ embeds: [{ title, description: message, color, timestamp: new Date().toISOString(), footer: { text: "CORTEX Protocol" } }] }) });
    return res.ok;
  } catch (e) { console.error("[Discord] send error:", e); return false; }
}
