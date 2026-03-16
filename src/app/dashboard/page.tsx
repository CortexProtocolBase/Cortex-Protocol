"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Copy } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const performanceData = [
  { month: "Apr", value: 15200 },
  { month: "May", value: 16800 },
  { month: "Jun", value: 16100 },
  { month: "Jul", value: 17400 },
  { month: "Aug", value: 18900 },
  { month: "Sep", value: 18200 },
  { month: "Oct", value: 19800 },
  { month: "Nov", value: 21300 },
  { month: "Dec", value: 20700 },
  { month: "Jan", value: 22100 },
  { month: "Feb", value: 23400 },
  { month: "Mar", value: 24531 },
];

const timeFilters = ["1W", "1M", "3M", "6M", "1Y", "ALL"] as const;

const recentActivity = [
  {
    type: "Deposit",
    amount: "+2,500.00 USDC",
    date: "Mar 15, 2026",
    status: "Completed" as const,
  },
  {
    type: "Yield",
    amount: "+127.43 USDC",
    date: "Mar 14, 2026",
    status: "Completed" as const,
  },
  {
    type: "Withdraw",
    amount: "-1,000.00 USDC",
    date: "Mar 12, 2026",
    status: "Completed" as const,
  },
  {
    type: "Deposit",
    amount: "+5,000.00 USDC",
    date: "Mar 10, 2026",
    status: "Completed" as const,
  },
  {
    type: "Yield",
    amount: "+98.12 USDC",
    date: "Mar 9, 2026",
    status: "Pending" as const,
  },
];

const allocations = [
  { label: "DeFi Lending", pct: 35, opacity: 1 },
  { label: "DEX LP", pct: 25, opacity: 0.8 },
  { label: "Options", pct: 20, opacity: 0.6 },
  { label: "Staking", pct: 15, opacity: 0.4 },
  { label: "Cash", pct: 5, opacity: 0.2 },
];

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

  const handleCopy = () => {
    navigator.clipboard.writeText("0x1234...5678");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <Navbar />

      <main className="pt-28 pb-20 max-w-5xl mx-auto px-6">
        {/* ----- Header ----- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <button
            onClick={handleCopy}
            className="cursor-pointer flex items-center gap-2 bg-card-solid border border-border rounded-lg px-3 py-1.5 text-sm text-muted hover:text-foreground transition-colors duration-200"
          >
            <span className="font-mono">0x1234...5678</span>
            <Copy size={14} className={copied ? "text-primary" : ""} />
          </button>
        </div>

        {/* ----- Portfolio Overview Cards ----- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {/* Total Balance */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:border-border-hover hover:bg-card-hover transition-all duration-300">
            <p className="text-muted text-sm mb-1">Total Balance</p>
            <p className="font-heading text-2xl font-bold">$24,531.82</p>
            <span className="text-primary text-sm mt-1 inline-block">
              +12.4%
            </span>
          </div>

          {/* Vault Share */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:border-border-hover hover:bg-card-hover transition-all duration-300">
            <p className="text-muted text-sm mb-1">Vault Share</p>
            <p className="font-heading text-2xl font-bold">0.34%</p>
          </div>

          {/* Total Profit */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:border-border-hover hover:bg-card-hover transition-all duration-300">
            <p className="text-muted text-sm mb-1">Total Profit</p>
            <p className="font-heading text-2xl font-bold">+$2,847.23</p>
            <span className="text-primary text-sm mt-1 inline-block">
              +18.7%
            </span>
          </div>

          {/* Current APY */}
          <div className="bg-card border border-border rounded-2xl p-6 hover:border-border-hover hover:bg-card-hover transition-all duration-300">
            <p className="text-muted text-sm mb-1">Current APY</p>
            <p className="font-heading text-2xl font-bold">18.7%</p>
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
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient
                    id="blueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#3B82F6"
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="100%"
                      stopColor="#3B82F6"
                      stopOpacity={0}
                    />
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
              {recentActivity.map((tx, i) => (
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
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 ${
                        tx.status === "Completed"
                          ? "text-primary bg-primary/10"
                          : "text-muted bg-card-solid"
                      }`}
                    >
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
    </>
  );
}
