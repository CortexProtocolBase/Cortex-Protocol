"use client";
import Navbar from "@/components/Navbar";
import { Book, Code, Key, Zap } from "lucide-react";
const endpoints = [
  { method: "GET", path: "/api/v1/vault/stats", description: "Current vault TVL, share price, depositor count, and APY", auth: "None" },
  { method: "GET", path: "/api/v1/vault/user/:address", description: "User position including shares, P&L, and recent transactions", auth: "None" },
  { method: "GET", path: "/api/v1/portfolio", description: "Current portfolio allocation across tiers and strategies", auth: "None" },
  { method: "GET", path: "/api/v1/trades", description: "Paginated trade history with tier and type filtering", auth: "None" },
  { method: "GET", path: "/api/v1/trades/:id", description: "Single trade details by ID", auth: "None" },
  { method: "GET", path: "/api/v1/performance", description: "Historical performance data (daily, weekly, monthly)", auth: "None" },
  { method: "GET", path: "/api/v1/ai/insights", description: "AI confidence, sentiment, and market regime", auth: "Token-gated" },
  { method: "GET", path: "/api/v1/ai/reasoning-feed", description: "Latest 10 AI reasoning cycles", auth: "Token-gated" },
  { method: "GET", path: "/api/v1/governance/proposals", description: "Active and past governance proposals", auth: "None" },
  { method: "GET", path: "/api/v1/staking/info/:address", description: "Staking position, rewards, and lock tiers", auth: "None" },
  { method: "GET", path: "/api/v1/risk/metrics", description: "Portfolio risk metrics (Sharpe, drawdown, VaR)", auth: "None" },
];
export default function DocsPage() {
  return (
    <><Navbar />
    <main className="pt-28 pb-20 max-w-5xl mx-auto px-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight mb-2">API Documentation</h1>
      <p className="text-muted mb-8">CORTEX Protocol REST API reference</p>
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <h2 className="font-heading font-semibold mb-4 flex items-center gap-2"><Key className="w-4 h-4 text-muted" />Authentication</h2>
        <p className="text-sm text-muted mb-2">Most endpoints are public. Token-gated endpoints require the <code className="bg-card-solid px-1.5 py-0.5 rounded text-xs">x-wallet-address</code> header with a wallet holding 10K+ $CORTEX tokens.</p>
        <p className="text-sm text-muted">Tier access: 10K CORTEX (Basic) · 100K (Pro) · 1M (Full)</p>
      </div>
      <div className="space-y-3">
        {endpoints.map((ep, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 hover:border-border-hover transition-all">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary/10 text-primary text-xs font-mono font-bold rounded px-2 py-0.5">{ep.method}</span>
              <code className="text-sm text-foreground font-mono">{ep.path}</code>
              {ep.auth !== "None" && <span className="text-xs bg-card-solid text-muted rounded-full px-2 py-0.5">{ep.auth}</span>}
            </div>
            <p className="text-sm text-muted">{ep.description}</p>
          </div>
        ))}
      </div>
    </main></>
  );
}
