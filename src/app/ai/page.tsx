"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Navbar from "@/components/Navbar";
import { showToast } from "@/components/Toast";
import { Brain, TrendingUp, Clock, Activity, Info } from "lucide-react";
import type { AiInsightsResponse, ReasoningFeedEntry } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Decision badge styles                                              */
/* ------------------------------------------------------------------ */

const decisionStyles: Record<"HOLD" | "TRADE" | "REBALANCE", string> = {
  HOLD: "text-muted bg-card-solid",
  TRADE: "text-primary bg-primary/10",
  REBALANCE: "text-foreground bg-card-solid",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AIPage() {
  const { address } = useAccount();
  const [insights, setInsights] = useState<AiInsightsResponse | null>(null);
  const [feed, setFeed] = useState<ReasoningFeedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    const headers = { "x-wallet-address": address };

    setLoading(true);

    Promise.all([
      fetch("/api/v1/ai/insights", { headers }).then((r) => r.json()),
      fetch("/api/v1/ai/reasoning-feed", { headers }).then((r) => r.json()),
    ])
      .then(([insightsRes, feedRes]) => {
        setInsights(insightsRes.data);
        setFeed(feedRes.data);
      })
      .catch(() => {
        showToast("Failed to load AI data", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [address]);

  const statusCards = insights
    ? [
        { label: "Confidence Level", value: `${insights.confidence}%`, pct: insights.confidence, icon: Brain },
        { label: "Market Regime", value: insights.marketRegime, icon: TrendingUp, accent: true },
        { label: "Next Rebalance", value: `~${insights.nextRebalanceMinutes} min`, icon: Clock },
        { label: "Cycle Count Today", value: `${insights.cyclesToday} cycles`, icon: Activity },
      ]
    : [];

  const sentimentData = insights?.sentiments ?? [];
  const reasoningLog = feed;

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

        {!address ? (
          <div className="mt-12 text-center text-muted text-sm">
            Connect your wallet to view AI insights.
          </div>
        ) : loading ? (
          <div className="mt-12 text-center text-muted text-sm">
            Loading AI data...
          </div>
        ) : (
          <>
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
                    <p className="text-sm text-foreground flex-1">{entry.reasoning}</p>
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
                {insights?.marketSummary ?? "No market summary available."}
              </p>
            </div>
          </>
        )}
      </main>
    </>
  );
}
