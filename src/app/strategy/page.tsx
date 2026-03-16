"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
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
  Tooltip,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const allocationData = [
  { name: "Core", value: 70, color: "#3B82F6", amount: "$8.68M", description: "WETH, cbBTC, USDC yields on Aave/Compound" },
  { name: "Mid-Risk", value: 20, color: "#60A5FA", amount: "$2.48M", description: "Established Base tokens (AERO, DEGEN), Aerodrome pools" },
  { name: "Degen", value: 10, color: "#93C5FD", amount: "$1.24M", description: "New Base launches, momentum plays" },
];

const strategies = [
  {
    name: "Aave USDC Yield",
    tier: "Core",
    icon: Landmark,
    allocation: 25,
    apy: 8.2,
    return30d: 2.1,
    risk: "Low" as const,
  },
  {
    name: "Compound ETH",
    tier: "Core",
    icon: Layers,
    allocation: 20,
    apy: 5.4,
    return30d: 1.8,
    risk: "Low" as const,
  },
  {
    name: "cbBTC/WETH LP",
    tier: "Core",
    icon: Droplets,
    allocation: 25,
    apy: 12.1,
    return30d: 3.4,
    risk: "Low" as const,
  },
  {
    name: "Aerodrome AERO/USDC",
    tier: "Mid-Risk",
    icon: BarChart3,
    allocation: 12,
    apy: 24.8,
    return30d: 5.8,
    risk: "Medium" as const,
  },
  {
    name: "DEGEN/WETH Pool",
    tier: "Mid-Risk",
    icon: Droplets,
    allocation: 8,
    apy: 31.2,
    return30d: -1.4,
    risk: "Medium" as const,
  },
  {
    name: "New Base Launch #47",
    tier: "Degen",
    icon: Zap,
    allocation: 6,
    apy: 0,
    return30d: 12.3,
    risk: "High" as const,
  },
  {
    name: "Momentum Token XYZ",
    tier: "Degen",
    icon: Banknote,
    allocation: 4,
    apy: 0,
    return30d: -3.1,
    risk: "High" as const,
  },
];

const decisionLog = [
  {
    action: "Increased Aave USDC lending position by 3%",
    time: "2h ago",
    icon: ArrowUpRight,
  },
  {
    action: "Reduced Degen tier exposure after volatility spike",
    time: "6h ago",
    icon: ArrowDownRight,
  },
  {
    action: "Rebalanced Aerodrome LP positions",
    time: "12h ago",
    icon: RefreshCw,
  },
  {
    action: "Moved 2% from Mid-Risk to Core as hedge",
    time: "1d ago",
    icon: ShieldCheck,
  },
  {
    action: "Entered new cbBTC/WETH LP on Compound",
    time: "2d ago",
    icon: Zap,
  },
];

const riskMetrics = [
  { label: "Sharpe Ratio", value: "2.4", icon: Award },
  { label: "Max Drawdown", value: "-8.3%", icon: TrendingDown },
  { label: "Volatility", value: "12.1%", icon: Activity },
  { label: "Win Rate", value: "73%", icon: Target },
];

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

function PieTooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { amount: string; description: string };
  }>;
}) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  return (
    <div className="bg-card-solid border border-border rounded-lg px-3 py-2 max-w-xs">
      <p className="text-sm font-medium text-foreground">{d.name}</p>
      <p className="text-xs text-muted">
        {d.value}% &middot; {d.payload.amount}
      </p>
      <p className="text-xs text-muted mt-1">{d.payload.description}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function StrategyPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <Navbar />

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
            <p className="text-lg font-semibold text-foreground">2h ago</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted mb-2">
              <RefreshCw className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">
                Next Rebalance
              </span>
            </div>
            <p className="text-lg font-semibold text-foreground">~4h</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted mb-2">
              <Brain className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">
                Confidence
              </span>
            </div>
            <p className="text-lg font-semibold text-foreground">87%</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">
                Risk Level
              </span>
            </div>
            <p className="text-lg font-semibold text-foreground">Moderate</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">
                Active Strategies
              </span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              7<span className="text-muted">/7</span>
            </p>
          </div>
        </section>

        {/* ---- ALLOCATION ---- */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
          {/* Pie Chart */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
              Portfolio Allocation
            </h2>
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
                    <Tooltip content={<PieTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="font-heading text-2xl font-bold text-foreground">
                  $12.4M
                </span>
                <span className="text-xs text-muted mt-1">Total Value</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading text-lg font-semibold text-foreground mb-6">
              Breakdown
            </h2>
            <div>
              {allocationData.map((item, idx) => (
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
          {strategies.map((s) => {
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
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-xs text-muted">Active</span>
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
              {decisionLog.map((entry, idx) => {
                const Icon = entry.icon;
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
                      <p className="text-sm text-foreground">{entry.action}</p>
                      <p className="text-xs text-muted mt-0.5">{entry.time}</p>
                    </div>
                  </div>
                );
              })}
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
                <p className="text-xl font-bold text-foreground">{m.value}</p>
              </div>
            );
          })}
        </section>
      </main>
    </>
  );
}
