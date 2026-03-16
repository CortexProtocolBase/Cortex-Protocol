"use client";

import Navbar from "@/components/Navbar";
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

/* ───────── Data ───────── */

const tokenStats = [
  { label: "CORTEX Price", value: "$3.47", icon: CircleDollarSign },
  { label: "Market Cap", value: "$34.7M", icon: TrendingUp },
  { label: "Supply", value: "1B (Fixed)", icon: Coins },
  { label: "Your Balance", value: "1,247 CORTEX", icon: Wallet },
  { label: "Voting Power", value: "0.012%", icon: Vote },
];

interface Proposal {
  id: number;
  title: string;
  status: "Active" | "Passed";
  proposer: string;
  forPct: number;
  againstPct: number;
  quorum: number;
  timeRemaining: string | null;
}

const proposals: Proposal[] = [
  {
    id: 1,
    title: "Adjust Core Allocation Band to 60-85%",
    status: "Active",
    proposer: "0xAb3...7f2",
    forPct: 67,
    againstPct: 33,
    quorum: 45,
    timeRemaining: "2 days left",
  },
  {
    id: 2,
    title: "Whitelist DEGEN Token for Mid-Risk Tier",
    status: "Active",
    proposer: "0x7eF...1a9",
    forPct: 82,
    againstPct: 18,
    quorum: 71,
    timeRemaining: "5 days left",
  },
  {
    id: 3,
    title: "Reduce Management Fee from 2% to 1.5%",
    status: "Passed",
    proposer: "0xCd1...4b8",
    forPct: 91,
    againstPct: 9,
    quorum: 100,
    timeRemaining: null,
  },
];

const parameters = [
  { label: "Core Allocation", value: "70%", range: "50-90%", icon: PieChart },
  { label: "Mid-Risk Allocation", value: "20%", range: "5-35%", icon: PieChart },
  { label: "Degen Allocation", value: "10%", range: "0-15%", icon: PieChart },
  { label: "Max Slippage", value: "1.5%", range: "0.5-5%", icon: Gauge },
  { label: "Management Fee", value: "2%", range: "0-4%", icon: Percent },
  { label: "Performance Fee", value: "20%", range: "0-30%", icon: Percent },
  { label: "Withdrawal Fee", value: "0.5%", range: "0-2%", icon: Percent },
  { label: "AI Trade Rate Limit", value: "20/hour", range: "5-50", icon: RefreshCcw },
  { label: "Proposal Quorum", value: "4%", range: "2-10%", icon: BarChart3 },
  { label: "Voting Period", value: "3 days", range: "1-7 days", icon: Clock },
  { label: "Timelock Delay", value: "24 hours", range: "6-72 hours", icon: ShieldCheck },
];

const feeSlices = [
  { label: "CORTEX Stakers", pct: 50, color: "bg-primary" },
  { label: "Treasury", pct: 50, color: "bg-primary/60" },
];

const govStats = [
  { label: "Total Proposals", value: "23", icon: FileText },
  { label: "Passed", value: "18", icon: CheckCircle2 },
  { label: "Rejected", value: "3", icon: XCircle },
  { label: "Active", value: "2", icon: Clock },
  { label: "Votes Cast", value: "14.2M", icon: Users },
];

/* ───────── Page ───────── */

export default function GovernancePage() {
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
            {tokenStats.map((s) => (
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
            {proposals.map((p) => (
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
                    <span>Quorum: {p.quorum}%</span>
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
            {parameters.map((param) => (
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
                <p className="text-muted text-xs mb-3">
                  Range: {param.range}
                </p>
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
            {govStats.map((s) => (
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
