"use client";

import Navbar from "@/components/Navbar";
import { Brain, TrendingUp, Clock, Activity, Info } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const statusCards = [
  { label: "Confidence Level", value: "87%", pct: 87, icon: Brain },
  { label: "Market Regime", value: "Bullish", icon: TrendingUp, accent: true },
  { label: "Next Rebalance", value: "~8 min", icon: Clock },
  { label: "Cycle Count Today", value: "14 cycles", icon: Activity },
];

const sentimentData = [
  { asset: "ETH", score: 0.72 },
  { asset: "USDC", score: 0.1 },
  { asset: "AERO", score: 0.45 },
  { asset: "cbBTC", score: 0.61 },
  { asset: "DEGEN", score: -0.23 },
  { asset: "Overall", score: 0.52 },
];

type Decision = "HOLD" | "TRADE" | "REBALANCE";

const reasoningLog: {
  cycle: number;
  decision: Decision;
  text: string;
  time: string;
}[] = [
  {
    cycle: 847,
    decision: "HOLD",
    text: "Market consolidating. No significant alpha signals detected. Maintaining current allocation.",
    time: "8 min ago",
  },
  {
    cycle: 846,
    decision: "TRADE",
    text: "Increased Aave USDC position by 3%. Reason: declining ETH volatility favors stable yield. Confidence: 91%.",
    time: "18 min ago",
  },
  {
    cycle: 845,
    decision: "REBALANCE",
    text: "Moved 2% from Degen to Core tier. Reason: Degen sentiment score dropped below -0.3 threshold.",
    time: "28 min ago",
  },
  {
    cycle: 844,
    decision: "HOLD",
    text: "All positions within target bands. Risk score nominal.",
    time: "38 min ago",
  },
  {
    cycle: 843,
    decision: "TRADE",
    text: "Exited DEGEN/WETH LP. Reason: liquidity depth dropped 40% in 2h, triggering risk threshold.",
    time: "48 min ago",
  },
];

const decisionStyles: Record<Decision, string> = {
  HOLD: "text-muted bg-card-solid",
  TRADE: "text-primary bg-primary/10",
  REBALANCE: "text-foreground bg-card-solid",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AIPage() {
  return (
    <>
      <Navbar />

      <main className="pt-28 pb-20 max-w-5xl mx-auto px-6">
        {/* ----- Header ----- */}
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            AI Insights
          </h1>
          <p className="text-muted mt-2">
            Real-time AI analysis, sentiment data, and reasoning logs.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-card-solid border border-border rounded-lg px-4 py-2 text-xs text-muted">
            <Info size={14} className="shrink-0" />
            <span>
              Tier access: 10K CORTEX (Basic) · 100K (Pro) · 1M (Full)
            </span>
          </div>
        </div>

        {/* ----- AI Status Overview ----- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {statusCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-card border border-border rounded-2xl p-6 hover:border-border-hover hover:bg-card-hover transition-all duration-300"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className="text-muted" />
                  <p className="text-muted text-sm">{card.label}</p>
                </div>
                <p
                  className={`font-heading text-2xl font-bold ${
                    card.accent ? "text-primary" : ""
                  }`}
                >
                  {card.value}
                </p>
                {card.pct !== undefined && (
                  <div className="w-full h-1.5 bg-card-solid rounded-full mt-3 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${card.pct}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ----- Sentiment Gauges ----- */}
        <div className="bg-card border border-border rounded-2xl p-6 mt-8">
          <h2 className="font-heading font-semibold mb-6">Market Sentiment</h2>

          <div className="space-y-4">
            {sentimentData.map((item) => {
              const isPositive = item.score >= 0;
              const width = Math.abs(item.score) * 100;
              return (
                <div key={item.asset} className="flex items-center gap-4">
                  <span className="text-sm text-foreground w-16 shrink-0 font-medium">
                    {item.asset}
                  </span>
                  <div className="flex-1 h-1.5 bg-card-solid rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isPositive ? "bg-primary" : "bg-muted"
                      }`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span
                    className={`text-sm font-mono w-14 text-right shrink-0 ${
                      isPositive ? "text-primary" : "text-muted"
                    }`}
                  >
                    {item.score > 0 ? "+" : ""}
                    {item.score.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ----- Reasoning Stream ----- */}
        <div className="bg-card border border-border rounded-2xl p-6 mt-8">
          <h2 className="font-heading font-semibold mb-4">Reasoning Log</h2>

          <div>
            {reasoningLog.map((entry, i) => (
              <div
                key={entry.cycle}
                className={`flex flex-col sm:flex-row sm:items-start gap-3 py-4 ${
                  i < reasoningLog.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-medium rounded-md px-2.5 py-1 ${
                      decisionStyles[entry.decision]
                    }`}
                  >
                    {entry.decision}
                  </span>
                  <span className="text-xs text-muted font-mono">
                    #{entry.cycle}
                  </span>
                </div>
                <p className="text-sm text-foreground flex-1">{entry.text}</p>
                <span className="text-xs text-muted shrink-0">
                  {entry.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ----- Market Summary ----- */}
        <div className="bg-card border border-border rounded-2xl p-6 mt-8">
          <h2 className="font-heading font-semibold mb-4">AI Market Summary</h2>
          <p className="text-sm text-muted leading-relaxed">
            Base DeFi TVL has increased 4.2% over the past 24 hours, driven
            primarily by inflows into Aerodrome and Aave. ETH is showing bullish
            divergence on the 4h timeframe with RSI at 58. Farcaster sentiment
            is net positive (+0.52) with increased discussion around AERO
            tokenomics. The Degen tier is showing elevated volatility — the
            agent has reduced exposure from 10% to 8% as a precaution. Overall
            market regime: cautiously bullish.
          </p>
        </div>
      </main>
    </>
  );
}
