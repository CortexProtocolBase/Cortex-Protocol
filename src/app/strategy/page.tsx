"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { showToast } from "@/components/Toast";
import type { PortfolioResponse, ReasoningFeedEntry } from "@/lib/types";
import type { LucideIcon } from "lucide-react";
import {
  Brain,
  RefreshCw,
  Clock,
  ShieldCheck,
  Zap,
  TrendingDown,
  Landmark,
  Droplets,
  BarChart3,
  Layers,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  AlertTriangle,
  Award,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import WalletGate from "@/components/WalletGate";

/* ------------------------------------------------------------------ */
/*  Static maps                                                        */
/* ------------------------------------------------------------------ */

const tierColors: Record<string, string> = {
  Core: "#3B82F6",
  "Mid-Risk": "#60A5FA",
  Degen: "#93C5FD",
};

const tierDescriptions: Record<string, string> = {
  Core: "WETH, cbBTC, USDC yields on Aave/Compound",
  "Mid-Risk": "Established Base tokens (AERO, DEGEN), Aerodrome pools",
  Degen: "New Base launches, momentum plays",
};

const strategyIcons: Record<string, LucideIcon> = {
  Aave: Landmark,
  Compound: Layers,
  Aerodrome: BarChart3,
};

const decisionIconMap: Record<string, LucideIcon> = {
  TRADE: ArrowUpRight,
  REBALANCE: RefreshCw,
  HOLD: ShieldCheck,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const riskBadge = (risk: string) => {
  switch (risk) {
    case "Low":
      return "bg-primary/10 text-primary";
    case "Medium":
      return "bg-card-solid text-muted";
    case "High":
      return "bg-card-solid text-foreground";
    default:
      return "bg-card-solid text-muted";
  }
};

/* ------------------------------------------------------------------ */
/*  Custom Pie Tooltip                                                 */
/* ------------------------------------------------------------------ */

// Tooltip is rendered below the chart instead of overlapping it

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function StrategyPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [decisionLog, setDecisionLog] = useState<ReasoningFeedEntry[]>([]);
  const [decisionLogLoading, setDecisionLogLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const res = await fetch("/api/v1/portfolio");
        if (!res.ok) throw new Error("Failed to fetch portfolio");
        const json = await res.json();
        setPortfolio(json.data as PortfolioResponse);
      } catch (err) {
        console.error(err);
        showToast("Failed to load portfolio data", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchPortfolio();
  }, []);

  useEffect(() => {
    async function fetchDecisionLog() {
      try {
        const res = await fetch("/api/v1/ai/reasoning-feed", {
          headers: { "x-wallet-address": "public" },
        });
        if (!res.ok) throw new Error("Failed to fetch reasoning feed");
        const json = await res.json();
        setDecisionLog(json.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setDecisionLogLoading(false);
      }
    }
    fetchDecisionLog();
  }, []);

  /* Derived data --------------------------------------------------- */

  const formatValue = (v: number) => {
    if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
    if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
    if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
    if (v > 0) return `$${v.toFixed(0)}`;
    return "$0";
  };

  const formatTimeAgo = (iso: string) => {
    if (!iso) return "--";
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (diff < 0) {
      const absDiff = Math.abs(diff);
      if (absDiff < 60) return `~${absDiff}s`;
      if (absDiff < 3600) return `~${Math.floor(absDiff / 60)} min`;
      return `~${Math.floor(absDiff / 3600)}h`;
    }
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const allocationData = (portfolio?.tiers ?? []).map((t) => ({
    name: t.name,
    value: t.allocationPct,
    color: tierColors[t.name] ?? "#3B82F6",
    amount: formatValue(t.valueUsd),
    description: tierDescriptions[t.name] ?? "",
  }));

  const rawTotal = portfolio
    ? portfolio.tiers.reduce((a, t) => a + t.valueUsd, 0)
    : 0;
  const totalValue = rawTotal > 0 ? formatValue(rawTotal) : "$0";

  const strategies = (portfolio?.allocations ?? []).map((a) => ({
    name: a.strategyName,
    tier: a.tier,
    icon: strategyIcons[a.protocol] ?? Zap,
    allocation: a.allocationPct,
    apy: a.apy,
    return30d: a.return30d,
    risk: a.riskLevel,
    isActive: a.isActive,
  }));

  const riskMetrics = portfolio
    ? [
        { label: "Sharpe Ratio", value: String(portfolio.riskMetrics.sharpeRatio), icon: Award },
        { label: "Max Drawdown", value: `${portfolio.riskMetrics.maxDrawdown}%`, icon: TrendingDown },
        { label: "Volatility", value: `${portfolio.riskMetrics.volatility}%`, icon: Activity },
        { label: "Win Rate", value: `${portfolio.riskMetrics.winRate}%`, icon: Target },
      ]
    : [
        { label: "Sharpe Ratio", value: "--", icon: Award },
        { label: "Max Drawdown", value: "--", icon: TrendingDown },
        { label: "Volatility", value: "--", icon: Activity },
        { label: "Win Rate", value: "--", icon: Target },
      ];

  const activeCount = strategies.filter((s) => s.isActive).length;

  /* Skeleton pulse component --------------------------------------- */

  const Skeleton = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-border/40 rounded ${className}`} />
  );

  return (
    <>
      <Navbar />

      <WalletGate>
      <main className="pt-28 pb-20 max-w-5xl mx-auto px-6">
        {/* ---- HEADER ---- */}
        <section>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            AI Portfolio
          </h1>
          <p className="text-muted mt-2">
            Autonomous portfolio allocation across the Base DeFi ecosystem
          </p>
          <div className="flex items-center gap-2 mt-4">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-sm text-muted">Running on Base</span>
          </div>
        </section>

        {/* ---- AI STATUS ---- */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">
                Last Rebalance
              </span>
            </div>
            {loading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <p className="text-lg font-semibold text-foreground">
                {portfolio?.lastRebalance ? formatTimeAgo(portfolio.lastRebalance) : "--"}
              </p>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted mb-2">
              <RefreshCw className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">
                Next Rebalance
              </span>
            </div>
            {loading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <p className="text-lg font-semibold text-foreground">
                {portfolio?.nextRebalance ? formatTimeAgo(portfolio.nextRebalance) : "--"}
              </p>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted mb-2">
              <Brain className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">
                Confidence
              </span>
            </div>
            {loading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <p className="text-lg font-semibold text-foreground">
                {portfolio ? `${portfolio.confidence}%` : "--"}
              </p>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">
                Risk Level
              </span>
            </div>
            {loading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <p className="text-lg font-semibold text-foreground">Moderate</p>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">
                Active Strategies
              </span>
            </div>
            {loading ? (
              <Skeleton className="h-6 w-12" />
            ) : (
              <p className="text-lg font-semibold text-foreground">
                {activeCount}
                <span className="text-muted">/{strategies.length}</span>
              </p>
            )}
          </div>
        </section>

        {/* ---- ALLOCATION ---- */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
          {/* Pie Chart */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
              Portfolio Allocation
            </h2>
            {loading ? (
              <div className="flex justify-center">
                <Skeleton className="w-64 h-64 sm:w-72 sm:h-72 rounded-full" />
              </div>
            ) : (
              <>
                <div className="relative w-full flex justify-center">
                  <div className="w-64 h-64 sm:w-72 sm:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={allocationData}
                          cx="50%"
                          cy="50%"
                          innerRadius="58%"
                          outerRadius="85%"
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                          onMouseEnter={(_, index) => setActiveIndex(index)}
                          onMouseLeave={() => setActiveIndex(null)}
                        >
                          {allocationData.map((entry, index) => (
                            <Cell
                              key={entry.name}
                              fill={entry.color}
                              opacity={
                                activeIndex === null || activeIndex === index
                                  ? 1
                                  : 0.4
                              }
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-heading text-2xl font-bold text-foreground">
                      {activeIndex !== null ? allocationData[activeIndex]?.name : totalValue}
                    </span>
                    <span className="text-xs text-muted mt-1">
                      {activeIndex !== null
                        ? `${allocationData[activeIndex]?.value}% · ${allocationData[activeIndex]?.amount}`
                        : "Total Value"}
                    </span>
                  </div>
                </div>
                {/* Hover info below chart */}
                {activeIndex !== null && allocationData[activeIndex] && (
                  <div className="mt-4 text-center">
                    <p className="text-xs text-muted">{allocationData[activeIndex].description}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Legend */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
              Breakdown
            </h2>
            <div>
              {loading
                ? Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className={`py-3 ${idx < 2 ? "border-b border-border" : ""}`}>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))
                : allocationData.map((item, idx) => (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between py-3 ${
                        idx < allocationData.length - 1
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <span className="text-sm text-foreground">{item.name}</span>
                          <p className="text-xs text-muted">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-foreground">
                          {item.value}%
                        </span>
                        <span className="text-sm text-muted w-16 text-right">
                          {item.amount}
                        </span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ---- STRATEGY CARDS ---- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <Skeleton className="h-5 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))
            : strategies.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.name}
                    className="bg-card border border-border rounded-2xl p-6 hover:border-border-hover transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted" />
                        <h3 className="text-sm font-semibold text-foreground">
                          {s.name}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted">Allocation</span>
                        <span className="text-sm font-medium text-foreground">
                          {s.allocation}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted">APY</span>
                        <span className="text-sm font-medium text-primary">
                          {s.apy > 0 ? `${s.apy}%` : "--"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted">30d Return</span>
                        <span className="text-sm font-medium text-foreground">
                          {s.return30d > 0 ? "+" : ""}
                          {s.return30d}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs rounded-full px-2 py-0.5 ${riskBadge(
                          s.risk
                        )}`}
                      >
                        {s.risk}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            s.isActive ? "bg-primary" : "bg-muted"
                          }`}
                        />
                        <span className="text-xs text-muted">
                          {s.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
        </section>

        {/* ---- AI DECISION LOG ---- */}
        <section className="mt-8">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-4">
              AI Decision Log
            </h2>
            <div>
              {decisionLogLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <div key={idx} className={`py-3 ${idx < 4 ? "border-b border-border" : ""}`}>
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))
              ) : decisionLog.length === 0 ? (
                <p className="text-sm text-muted py-4">No recent AI decisions.</p>
              ) : (
                decisionLog.map((entry, idx) => {
                  const Icon = decisionIconMap[entry.decision] ?? Activity;
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-3 py-3 ${
                        idx < decisionLog.length - 1
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <Icon className="w-4 h-4 text-muted mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-primary bg-primary/10 rounded-full px-2 py-0.5">
                            {entry.decision}
                          </span>
                          <span className="text-xs text-muted">
                            Cycle #{entry.cycle} &middot; {entry.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-1">{entry.reasoning}</p>
                        <p className="text-xs text-muted mt-0.5">{entry.time}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* ---- RISK METRICS ---- */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {riskMetrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.label}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center gap-2 text-muted mb-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">
                    {m.label}
                  </span>
                </div>
                {loading ? (
                  <Skeleton className="h-7 w-16" />
                ) : (
                  <p className="text-xl font-bold text-foreground">{m.value}</p>
                )}
              </div>
            );
          })}
        </section>
      </main>
      </WalletGate>
    </>
  );
}
