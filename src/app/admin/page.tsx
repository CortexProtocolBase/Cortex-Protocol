"use client";
import { useEffect, useState } from "react";
import { Activity, Server, Database, Brain, TrendingUp, TrendingDown, Users, Zap } from "lucide-react";
interface Stats { totalDeposits24h: number; totalWithdrawals24h: number; netFlow24h: number; totalUsers: number; tvl: number; tradesExecuted24h: number; aiCycles24h: number; }
interface Health { status: string; supabaseLatency: number; rpcLatency: number; errorCount24h: number; }
export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  useEffect(() => {
    const key = localStorage.getItem("admin_key") || "";
    const headers = { Authorization: `Bearer ${key}` };
    Promise.all([
      fetch("/api/admin/stats", { headers }).then(r => r.json()),
      fetch("/api/admin/health", { headers }).then(r => r.json()),
    ]).then(([s, h]) => { setStats(s.data); setHealth(h.data); });
  }, []);
  if (!stats || !health) return <div className="text-muted">Loading...</div>;
  const cards = [
    { label: "TVL", value: "$" + (stats.tvl / 1e6).toFixed(2) + "M", icon: TrendingUp },
    { label: "Net Flow 24h", value: "$" + stats.netFlow24h.toLocaleString(), icon: stats.netFlow24h >= 0 ? TrendingUp : TrendingDown },
    { label: "Total Users", value: stats.totalUsers.toLocaleString(), icon: Users },
    { label: "AI Cycles 24h", value: stats.aiCycles24h.toString(), icon: Brain },
    { label: "Trades 24h", value: stats.tradesExecuted24h.toString(), icon: Zap },
    { label: "System", value: health.status, icon: Server },
    { label: "DB Latency", value: health.supabaseLatency + "ms", icon: Database },
    { label: "RPC Latency", value: health.rpcLatency + "ms", icon: Activity },
  ];
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">System Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => { const Icon = c.icon; return (
          <div key={c.label} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted mb-2"><Icon className="w-4 h-4" /><span className="text-xs">{c.label}</span></div>
            <p className="text-lg font-bold text-foreground">{c.value}</p>
          </div>
        ); })}
      </div>
    </div>
  );
}
