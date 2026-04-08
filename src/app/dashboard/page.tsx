"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Copy } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { showToast } from "@/components/Toast";
import type {
  VaultStatsResponse,
  UserPositionResponse,
  PortfolioResponse,
  PerformanceResponse,
} from "@/lib/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import WalletGate from "@/components/WalletGate";

const timeFilters = ["1W", "1M", "3M", "6M", "1Y", "ALL"] as const;

/* ------------------------------------------------------------------ */
/*  Custom Recharts tooltip                                            */
/* ------------------------------------------------------------------ */

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card-solid border border-border rounded-lg px-4 py-2">
      <p className="text-muted text-xs mb-1">{label}</p>
      <p className="text-foreground font-heading font-semibold text-sm">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<string>("1Y");
  const [copied, setCopied] = useState(false);
  const { fullWalletAddress: address } = useWallet();

  const [vaultStats, setVaultStats] = useState<VaultStatsResponse | null>(null);
  const [userPosition, setUserPosition] = useState<UserPositionResponse | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [performance, setPerformance] = useState<PerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, portfolioRes, perfRes] = await Promise.all([
          fetch("/api/v1/vault/stats"),
          fetch("/api/v1/portfolio"),
          fetch("/api/v1/performance"),
        ]);
        const [statsJson, portfolioJson, perfJson] = await Promise.all([
          statsRes.json(),
          portfolioRes.json(),
          perfRes.json(),
        ]);
        setVaultStats(statsJson.data);
        setPortfolio(portfolioJson.data);
        setPerformance(perfJson.data);
      } catch {
        showToast("Failed to load dashboard data", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!address) {
      setUserPosition(null);
      return;
    }
    fetch(`/api/v1/vault/user/${address}`)
      .then((r) => r.json())
      .then((json) => setUserPosition(json.data))
      .catch(() => showToast("Failed to load position", "error"));
  }, [address]);

  const displayAddress = address
    ? `${address.slice(0, 6)}…${address.slice(-4)}`
    : "Not Connected";

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    showToast("Copied address");
    setTimeout(() => setCopied(false), 1500);
  };

  const currentValue = userPosition?.currentValue ?? 0;
  const profitLoss = userPosition?.profitLoss ?? 0;
  const profitLossPct = userPosition?.profitLossPct ?? 0;
  const vaultSharePct = userPosition?.vaultSharePct ?? 0;
  const apy = vaultStats?.apy7d ?? 0;

  const chartData = (performance?.monthly ?? []).map((d) => ({
    month: new Date(d.date).toLocaleString("default", { month: "short" }),
    value: d.value,
  }));

  const tierOpacities: Record<string, number> = { Core: 1, "Mid-Risk": 0.7, Degen: 0.4 };
  const allocations = (portfolio?.tiers ?? []).map((t) => ({
    label: t.name,
    pct: t.allocationPct,
    opacity: tierOpacities[t.name] ?? 0.5,
  }));

  const recentTxs = (userPosition?.recentTransactions ?? []).map((tx) => ({
    type: tx.type,
    amount: `${tx.type === "Withdraw" ? "-" : "+"}${tx.amount.toLocaleString()} USDC`,
    date: new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "Completed" as const,
  }));

  return (
    <>
      <Navbar />

      <WalletGate>
      <main className="pt-28 pb-20 max-w-5xl mx-auto px-6">
        {/* ----- Header ----- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
        </div>

        {/* ----- No Position Banner ----- */}
        {!loading && currentValue === 0 && address && (
          <div className="mt-8 bg-card border border-border rounded-2xl p-8 text-center">
            <p className="font-heading text-lg font-semibold text-foreground mb-2">No vault position yet</p>
            <p className="text-sm text-muted mb-4">Deposit ETH or USDC into the CORTEX Vault to start earning AI-managed yield.</p>
            <a href="/vault" className="inline-flex items-center bg-foreground text-background rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">Go to Vault</a>
          </div>
        )}

        {/* ----- Portfolio Overview Cards ----- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <div className="bg-card border border-border rounded-2xl p-6 hover:border-border-hover hover:bg-card-hover transition-all duration-300">
            <p className="text-muted text-sm mb-1">Total Balance</p>
            <p className="font-heading text-2xl font-bold">
              {loading ? "—" : currentValue > 0 ? `$${currentValue.toLocaleString()}` : "$0.00"}
            </p>
            {profitLossPct > 0 && (
              <span className="text-primary text-sm mt-1 inline-block">
                +{profitLossPct.toFixed(1)}%
              </span>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:border-border-hover hover:bg-card-hover transition-all duration-300">
            <p className="text-muted text-sm mb-1">Vault Share</p>
            <p className="font-heading text-2xl font-bold">
              {loading ? "—" : `${vaultSharePct.toFixed(2)}%`}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:border-border-hover hover:bg-card-hover transition-all duration-300">
            <p className="text-muted text-sm mb-1">Total Profit</p>
            <p className="font-heading text-2xl font-bold">
              {loading ? "—" : profitLoss !== 0 ? `${profitLoss >= 0 ? "+" : ""}$${profitLoss.toLocaleString()}` : "$0.00"}
            </p>
            {profitLossPct !== 0 && (
              <span className={`text-sm mt-1 inline-block ${profitLossPct >= 0 ? "text-primary" : "text-red-400"}`}>
                {profitLossPct >= 0 ? "+" : ""}{profitLossPct.toFixed(1)}%
              </span>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 hover:border-border-hover hover:bg-card-hover transition-all duration-300">
            <p className="text-muted text-sm mb-1">Current APY</p>
            <p className="font-heading text-2xl font-bold">
              {loading ? "—" : apy > 0 ? `${apy.toFixed(1)}%` : "0.0%"}
            </p>
          </div>
        </div>

        {/* ----- Performance Chart ----- */}
        <div className="bg-card border border-border rounded-2xl p-6 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="font-heading font-semibold">
              Portfolio Performance
            </h2>

            <div className="flex items-center gap-1">
              {timeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`cursor-pointer px-3 py-1 text-xs rounded-md transition-colors duration-200 ${
                    activeFilter === f
                      ? "bg-card-solid text-foreground border border-border"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="blueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#27272a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#a1a1aa", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#blueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted text-sm">
                {loading ? "Loading chart…" : "No performance data"}
              </div>
            )}
          </div>
        </div>

        {/* ----- Two Column: Activity + Allocation ----- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-8">
          {/* Recent Activity (3/5) */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading font-semibold mb-4">
              Recent Activity
            </h2>

            <div>
              {recentTxs.length === 0 && (
                <p className="text-muted text-sm py-3">
                  {address ? "No recent transactions" : "Connect wallet to view activity"}
                </p>
              )}
              {recentTxs.map((tx, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-border last:border-b-0 hover:bg-card-hover transition-colors duration-150"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-sm font-medium text-foreground w-20 shrink-0">
                      {tx.type}
                    </span>
                    <span className="text-sm font-mono text-muted">
                      {tx.amount}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted hidden sm:block">
                      {tx.date}
                    </span>
                    <span className="text-xs rounded-full px-2 py-0.5 text-primary bg-primary/10">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation (2/5) */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading font-semibold mb-4">Allocation</h2>

            <div className="space-y-4">
              {allocations.length === 0 && (
                <p className="text-muted text-sm">{loading ? "Loading…" : "No allocation data"}</p>
              )}
              {allocations.map((a) => (
                <div key={a.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-foreground">{a.label}</span>
                    <span className="text-sm text-muted">{a.pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-card-solid rounded-full overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${a.pct}%`, opacity: a.opacity }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      </WalletGate>
    </>
  );
}
