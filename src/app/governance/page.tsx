"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { showToast } from "@/components/Toast";
import type { GovernanceResponse } from "@/lib/types";
import {
  Vote,
  Coins,
  TrendingUp,
  CircleDollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Gauge,
  RefreshCcw,
  PieChart,
  AlertTriangle,
  Percent,
  BarChart3,
  Users,
  FileText,
  Wallet,
} from "lucide-react";

/* ───────── Icon mapping for parameters ───────── */

const parameterIconMap: Record<string, typeof PieChart> = {
  "Core Allocation": PieChart,
  "Mid-Risk Allocation": PieChart,
  "Degen Allocation": PieChart,
  "Max Slippage": Gauge,
  "Management Fee": Percent,
  "Performance Fee": Percent,
  "Withdrawal Fee": Percent,
  "AI Trade Rate Limit": RefreshCcw,
  "Proposal Quorum": BarChart3,
  "Voting Period": Clock,
  "Timelock Delay": ShieldCheck,
};

/* ───────── Static data ───────── */

const feeSlices = [
  { label: "CORTEX Stakers", pct: 50, color: "bg-primary" },
  { label: "Treasury", pct: 50, color: "bg-primary/60" },
];

/* ───────── Helpers ───────── */

function formatMarketCap(value: number): string {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value}`;
}

/* ───────── Page ───────── */

export default function GovernancePage() {
  const [data, setData] = useState<GovernanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGovernance() {
      try {
        const res = await fetch("/api/v1/governance/proposals");
        if (!res.ok) throw new Error("Failed to fetch governance data");
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        showToast(
          err instanceof Error ? err.message : "Failed to load governance data",
          "error",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchGovernance();
  }, []);

  const tokenStats = data
    ? [
        { label: "CORTEX Price", value: `$${data.tokenPrice}`, icon: CircleDollarSign },
        { label: "Market Cap", value: formatMarketCap(data.marketCap), icon: TrendingUp },
        { label: "Supply", value: `${(data.totalSupply / 1e9).toFixed(0)}B (Fixed)`, icon: Coins },
        { label: "Your Balance", value: "1,247 CORTEX", icon: Wallet },
        { label: "Voting Power", value: "0.012%", icon: Vote },
      ]
    : [];

  const proposals = data?.proposals ?? [];

  const parameters = (data?.parameters ?? []).map((p) => ({
    label: p.name,
    value: p.value,
    range: p.range,
    icon: parameterIconMap[p.name] ?? PieChart,
  }));

  const govStats = data
    ? [
        { label: "Total Proposals", value: String(data.stats.totalProposals), icon: FileText },
        { label: "Passed", value: String(data.stats.passed), icon: CheckCircle2 },
        { label: "Rejected", value: String(data.stats.rejected), icon: XCircle },
        { label: "Active", value: String(data.stats.active), icon: Clock },
        { label: "Votes Cast", value: data.stats.totalVotesCast.toLocaleString(), icon: Users },
      ]
    : [];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* ── Header ── */}
          <section>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Governance
            </h1>
            <p className="text-muted text-lg mt-2">
              Shape CORTEX protocol parameters with your tokens.
            </p>
          </section>

          {/* ── Token Overview ── */}
          <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-2xl p-5 animate-pulse"
                  >
                    <div className="h-4 bg-card-solid rounded w-20 mb-3" />
                    <div className="h-6 bg-card-solid rounded w-16" />
                  </div>
                ))
              : tokenStats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-card border border-border rounded-2xl p-5 transition-all duration-300 hover:border-border-hover"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <s.icon size={16} className="text-muted" />
                      <span className="text-muted text-xs font-medium">
                        {s.label}
                      </span>
                    </div>
                    <p className="text-foreground font-heading text-lg font-bold">
                      {s.value}
                    </p>
                  </div>
                ))}
          </section>

          {/* ── Proposals ── */}
          <section className="mt-8 space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-2xl p-6 animate-pulse"
                  >
                    <div className="h-5 bg-card-solid rounded w-3/4 mb-4" />
                    <div className="h-3 bg-card-solid rounded w-1/3 mb-4" />
                    <div className="h-2 bg-card-solid rounded w-full mb-3" />
                    <div className="h-3 bg-card-solid rounded w-1/2" />
                  </div>
                ))
              : proposals.map((p) => (
                  <div
                    key={p.id}
                    className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-border-hover"
                  >
                    {/* Title + Badge */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-foreground font-heading text-base font-semibold">
                        {p.title}
                      </h3>
                      <span className="bg-primary/10 text-primary text-xs rounded-full px-2 py-0.5 whitespace-nowrap">
                        {p.status}
                      </span>
                    </div>

                    {/* Proposer */}
                    <p className="text-muted text-sm mb-4">
                      Proposed by <span className="font-mono">{p.proposer}</span>
                    </p>

                    {/* Vote bar */}
                    <div className="w-full h-2 rounded-full bg-card-solid overflow-hidden mb-2">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${p.forPct}%` }}
                      />
                    </div>

                    {/* Vote percentages */}
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground">
                        For: {p.forPct}%
                      </span>
                      <span className="text-muted">
                        Against: {p.againstPct}%
                      </span>
                    </div>

                    {/* Quorum + Time + Buttons */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-muted text-sm">
                        <span>Quorum: {p.quorumPct}%</span>
                        {p.timeRemaining ? (
                          <span>{p.timeRemaining}</span>
                        ) : (
                          <span className="text-primary">Executed</span>
                        )}
                      </div>

                      {p.status === "Active" && (
                        <div className="flex items-center gap-2">
                          <button className="cursor-pointer bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:opacity-90">
                            For
                          </button>
                          <button className="cursor-pointer border border-border text-muted rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-border-hover hover:text-foreground">
                            Against
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
          </section>

          {/* ── Emergency Brake ── */}
          <section className="mt-8">
            <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-border-hover">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-muted" />
                <h3 className="text-foreground font-heading text-base font-semibold">
                  Emergency Brake
                </h3>
              </div>
              <p className="text-muted text-sm mb-4">
                Supermajority vote (66% of voting power) can pause the AI agent
                and trigger full withdrawal to base assets (ETH/USDC). Bypasses
                timelock.
              </p>
              <button
                disabled
                className="text-foreground bg-card-solid border border-border opacity-60 rounded-lg px-5 py-2 text-sm font-medium cursor-not-allowed"
              >
                Initiate Emergency Brake
              </button>
            </div>
          </section>

          {/* ── Protocol Parameters ── */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-2xl p-5 animate-pulse"
                  >
                    <div className="h-4 bg-card-solid rounded w-24 mb-3" />
                    <div className="h-6 bg-card-solid rounded w-12 mb-2" />
                    <div className="h-3 bg-card-solid rounded w-16" />
                  </div>
                ))
              : parameters.map((param) => (
                  <div
                    key={param.label}
                    className="bg-card border border-border rounded-2xl p-5 transition-all duration-300 hover:border-border-hover"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <param.icon size={16} className="text-muted" />
                      <span className="text-muted text-sm">{param.label}</span>
                    </div>
                    <p className="text-foreground font-heading text-xl font-bold mb-1">
                      {param.value}
                    </p>
                    {param.range && (
                      <p className="text-muted text-xs mb-3">
                        Range: {param.range}
                      </p>
                    )}
                    <span className="cursor-pointer text-primary text-sm hover:underline">
                      Propose Change
                    </span>
                    <p className="text-muted text-xs mt-1">
                      Min 100K $CORTEX required
                    </p>
                  </div>
                ))}
          </section>

          {/* ── Fee Distribution ── */}
          <section className="mt-8">
            <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-border-hover">
              {/* Stacked bar */}
              <div className="w-full h-3 rounded-full overflow-hidden flex mb-5">
                {feeSlices.map((s) => (
                  <div
                    key={s.label}
                    className={`${s.color} h-full`}
                    style={{ width: `${s.pct}%` }}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                {feeSlices.map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                    <span className="text-muted text-sm">
                      {s.label}:{" "}
                      <span className="text-foreground font-medium">
                        {s.pct}%
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-muted text-sm">
                Total fees collected:{" "}
                <span className="text-foreground font-heading font-bold">
                  $247,832
                </span>
              </p>
            </div>
          </section>

          {/* ── Governance Stats ── */}
          <section className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-8">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-2xl p-5 animate-pulse"
                  >
                    <div className="h-4 bg-card-solid rounded w-20 mb-3" />
                    <div className="h-6 bg-card-solid rounded w-12" />
                  </div>
                ))
              : govStats.map((s) => (
                  <div
                    key={s.label}
                    className="bg-card border border-border rounded-2xl p-5 transition-all duration-300 hover:border-border-hover"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <s.icon size={16} className="text-muted" />
                      <span className="text-muted text-xs font-medium">
                        {s.label}
                      </span>
                    </div>
                    <p className="text-foreground font-heading text-lg font-bold">
                      {s.value}
                    </p>
                  </div>
                ))}
          </section>
        </div>
      </main>
    </>
  );
}
