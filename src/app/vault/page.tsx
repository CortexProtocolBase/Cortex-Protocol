"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const performanceData = [
  { month: "Mar", tvl: 3.2 },
  { month: "Apr", tvl: 4.1 },
  { month: "May", tvl: 5.8 },
  { month: "Jun", tvl: 5.3 },
  { month: "Jul", tvl: 7.1 },
  { month: "Aug", tvl: 8.4 },
  { month: "Sep", tvl: 7.9 },
  { month: "Oct", tvl: 9.2 },
  { month: "Nov", tvl: 10.1 },
  { month: "Dec", tvl: 9.8 },
  { month: "Jan", tvl: 11.3 },
  { month: "Feb", tvl: 12.4 },
];

const recentTransactions = [
  { type: "Deposit", amount: "1.5 ETH", share: "0.012%", date: "2026-03-15" },
  { type: "Deposit", amount: "3,200 USDC", share: "0.026%", date: "2026-03-14" },
  { type: "Withdraw", amount: "0.8 ETH", share: "0.006%", date: "2026-03-13" },
  { type: "Deposit", amount: "5,000 USDC", share: "0.040%", date: "2026-03-12" },
  { type: "Withdraw", amount: "2.1 ETH", share: "0.017%", date: "2026-03-11" },
  { type: "Deposit", amount: "1,750 USDC", share: "0.014%", date: "2026-03-10" },
];

const vaultStats = [
  { label: "Total Value Locked", value: "$12.4M" },
  { label: "Current APY", value: "18.7%" },
  { label: "Total Depositors", value: "2,847" },
  { label: "24h Volume", value: "$1.2M" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card-solid p-3">
        <p className="font-body text-sm text-muted">{label}</p>
        <p className="font-heading text-sm text-primary">
          ${payload[0].value}M TVL
        </p>
      </div>
    );
  }
  return null;
}

export default function VaultPage() {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [selectedToken, setSelectedToken] = useState<"ETH" | "USDC">("ETH");
  const [amount, setAmount] = useState("");

  const balance = selectedToken === "ETH" ? "4.23" : "8,412.50";
  const exchangeRate =
    selectedToken === "ETH"
      ? "1 ETH = 0.0135% vault share"
      : "1 USDC = 0.0000081% vault share";

  const estimatedShare =
    amount && !isNaN(parseFloat(amount.replace(/,/g, "")))
      ? selectedToken === "ETH"
        ? (parseFloat(amount) * 0.0135).toFixed(3)
        : (parseFloat(amount.replace(/,/g, "")) * 0.0000081).toFixed(6)
      : "0";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        {/* Header */}
        <section>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
            CORTEX Vault
          </h1>
          <p className="mt-2 font-body text-lg text-muted">
            Deposit ETH or USDC and let AI optimize your returns
          </p>
        </section>

        {/* Vault Stats */}
        <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {vaultStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-border-hover"
            >
              <p className="font-body text-sm text-muted">{stat.label}</p>
              <p className="mt-1 font-heading text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* Main Area */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Deposit / Withdraw */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              {/* Tab Row */}
              <div className="mb-6 flex gap-6 border-b border-border">
                <button
                  onClick={() => setActiveTab("deposit")}
                  className={`pb-3 font-heading text-sm font-medium transition-all duration-300 ${
                    activeTab === "deposit"
                      ? "border-b-2 border-primary text-foreground"
                      : "text-muted"
                  }`}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setActiveTab("withdraw")}
                  className={`pb-3 font-heading text-sm font-medium transition-all duration-300 ${
                    activeTab === "withdraw"
                      ? "border-b-2 border-primary text-foreground"
                      : "text-muted"
                  }`}
                >
                  Withdraw
                </button>
              </div>

              {/* Token Buttons */}
              <div className="mb-6 flex gap-3">
                <button
                  onClick={() => setSelectedToken("ETH")}
                  className={`rounded-xl border px-5 py-2.5 font-heading text-sm transition-all duration-300 ${
                    selectedToken === "ETH"
                      ? "border-border bg-card-solid text-foreground"
                      : "border-transparent text-muted"
                  }`}
                >
                  ETH
                </button>
                <button
                  onClick={() => setSelectedToken("USDC")}
                  className={`rounded-xl border px-5 py-2.5 font-heading text-sm transition-all duration-300 ${
                    selectedToken === "USDC"
                      ? "border-border bg-card-solid text-foreground"
                      : "border-transparent text-muted"
                  }`}
                >
                  USDC
                </button>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-4 font-body text-lg text-foreground placeholder-muted/50 outline-none transition-all duration-300 focus:border-border-hover"
                  />
                  <button
                    onClick={() => setAmount(balance)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer font-body text-sm text-primary"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Balance */}
              <p className="mb-6 font-body text-sm text-muted">
                Balance: {balance} {selectedToken}
              </p>

              {/* Info Box */}
              <div className="mb-6 space-y-3 rounded-xl border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted">
                    Estimated vault share
                  </span>
                  <span className="font-heading text-sm text-foreground">
                    {estimatedShare}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted">
                    Exchange rate
                  </span>
                  <span className="font-body text-sm text-muted">
                    {exchangeRate}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full cursor-pointer rounded-xl bg-foreground py-4 font-heading font-bold text-background transition-all duration-300 hover:opacity-90">
                {activeTab === "deposit" ? "Deposit" : "Withdraw"}
              </button>
            </div>
          </div>

          {/* Your Position */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 font-heading font-semibold text-foreground">
                Your Position
              </h2>
              <div>
                <div className="flex items-center justify-between border-b border-border py-3">
                  <span className="font-body text-sm text-muted">Deposited</span>
                  <div className="text-right">
                    <p className="font-heading text-sm text-foreground">2.5 ETH</p>
                    <p className="font-body text-xs text-muted">$4,875.00</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-border py-3">
                  <span className="font-body text-sm text-muted">Current Value</span>
                  <p className="font-heading text-sm text-foreground">$5,247.82</p>
                </div>
                <div className="flex items-center justify-between border-b border-border py-3">
                  <span className="font-body text-sm text-muted">Profit / Loss</span>
                  <div className="text-right">
                    <p className="font-heading text-sm text-primary">+$372.82</p>
                    <p className="font-body text-xs text-primary">+7.6%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-border py-3">
                  <span className="font-body text-sm text-muted">Vault Share</span>
                  <p className="font-heading text-sm text-foreground">0.034%</p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="font-body text-sm text-muted">Time in Vault</span>
                  <p className="font-heading text-sm text-foreground">47 days</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vault Performance Chart */}
        <section className="mt-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-6 font-heading font-semibold text-foreground">
              Vault Performance
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
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
                    stroke="#a1a1aa"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#a1a1aa"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `$${val}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="tvl"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#tvlGradient)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: "#3B82F6",
                      stroke: "#09090b",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="mt-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-6 font-heading font-semibold text-foreground">
              Recent Transactions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-heading text-xs font-medium text-muted">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left font-heading text-xs font-medium text-muted">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left font-heading text-xs font-medium text-muted">
                      Share
                    </th>
                    <th className="px-4 py-3 text-right font-heading text-xs font-medium text-muted">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((tx, i) => (
                    <tr
                      key={i}
                      className="border-b border-border transition-all duration-300 last:border-0 hover:bg-card-hover"
                    >
                      <td className="px-4 py-4 font-body text-sm text-foreground">
                        {tx.type}
                      </td>
                      <td className="px-4 py-4 font-body text-sm text-foreground">
                        {tx.amount}
                      </td>
                      <td className="px-4 py-4 font-body text-sm text-muted">
                        {tx.share}
                      </td>
                      <td className="px-4 py-4 text-right font-body text-sm text-muted">
                        {tx.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
