export async function sendEmailNotification(apiKey: string, from: string, to: string[], subject: string, body: string): Promise<boolean> {
  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ personalizations: [{ to: to.map(email => ({ email })) }], from: { email: from, name: "CORTEX Protocol" }, subject, content: [{ type: "text/plain", value: body }] }) });
    return res.status === 202;
  } catch (e) { console.error("[Email] send error:", e); return false; }
}
