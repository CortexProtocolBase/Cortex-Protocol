"use client";
import { useState } from "react";
import { Settings, Save } from "lucide-react";
export default function SettingsPage() {
  const [settings, setSettings] = useState({
    aiEnabled: true, maxTradesPerHour: 20, maxTradeSize: 50000, emergencyPause: false,
    discordWebhook: "", telegramBotToken: "", telegramChatId: "",
  });
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2"><Settings className="w-6 h-6" />Settings</h1>
      <div className="space-y-6 max-w-xl">
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-heading font-semibold mb-4">AI Agent</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between"><span className="text-sm text-muted">AI Agent Enabled</span>
              <button onClick={() => setSettings(s => ({ ...s, aiEnabled: !s.aiEnabled }))} className={`w-10 h-6 rounded-full transition-colors cursor-pointer ${settings.aiEnabled ? "bg-primary" : "bg-card-solid"}`}><span className={`block w-4 h-4 rounded-full bg-white transition-transform ${settings.aiEnabled ? "translate-x-5" : "translate-x-1"}`} /></button>
            </label>
            <label className="flex items-center justify-between"><span className="text-sm text-muted">Max Trades/Hour</span>
              <input type="number" value={settings.maxTradesPerHour} onChange={e => setSettings(s => ({ ...s, maxTradesPerHour: Number(e.target.value) }))} className="w-20 bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground text-right outline-none" />
            </label>
            <label className="flex items-center justify-between"><span className="text-sm text-muted">Max Trade Size ($)</span>
              <input type="number" value={settings.maxTradeSize} onChange={e => setSettings(s => ({ ...s, maxTradeSize: Number(e.target.value) }))} className="w-24 bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground text-right outline-none" />
            </label>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-heading font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div><label className="text-sm text-muted block mb-1">Discord Webhook URL</label><input type="text" value={settings.discordWebhook} onChange={e => setSettings(s => ({ ...s, discordWebhook: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none" placeholder="https://discord.com/api/webhooks/..." /></div>
            <div><label className="text-sm text-muted block mb-1">Telegram Bot Token</label><input type="text" value={settings.telegramBotToken} onChange={e => setSettings(s => ({ ...s, telegramBotToken: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none" /></div>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-foreground text-background rounded-xl px-6 py-3 font-heading font-bold cursor-pointer hover:opacity-90"><Save className="w-4 h-4" />Save Settings</button>
      </div>
    </div>
  );
}
