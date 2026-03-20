"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Download, ChevronDown } from "lucide-react";
import type { TradeResponse } from "@/lib/types";
import { showToast } from "@/components/Toast";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type TradeType = "Swap" | "Add LP" | "Remove LP" | "Stake" | "Unstake";
type Tier = "Core" | "Mid-Risk" | "Degen";

interface Trade {
  id: string;
  time: string;
  type: TradeType;
  asset: string;
  amount: string;
  protocol: string;
  tier: Tier;
  pnl: string;
  pnlPositive: boolean;
  reasoning: string;
}

const PAGE_SIZE = 10;

const typeFilters = ["All", "Swaps", "LP", "Staking"] as const;
const tierFilters = ["All Tiers", "Core", "Mid-Risk", "Degen"] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function mapTypeFilter(filter: (typeof typeFilters)[number]): string | undefined {
  switch (filter) {
    case "Swaps":
      return "swap";
    case "LP":
      return "add_lp,remove_lp";
    case "Staking":
      return "stake,unstake";
    default:
      return undefined;
  }
}

function mapTierFilter(filter: (typeof tierFilters)[number]): string | undefined {
  switch (filter) {
    case "All Tiers":
      return undefined;
    default:
      return filter.toLowerCase();
  }
}

function formatPnl(amountUsd: number, positive: boolean): string {
  const abs = Math.abs(amountUsd);
  const formatted = abs.toLocaleString();
  return positive ? `+$${formatted}` : `-$${formatted}`;
}

function mapTradeResponse(r: TradeResponse): Trade {
  return {
    id: r.id,
    time: r.time,
    type: r.type,
    asset: r.assetPair,
    amount: `$${r.amountUsd.toLocaleString()}`,
    protocol: r.protocol,
    tier: r.tier,
    pnl: formatPnl(r.pnlUsd, r.pnlPositive),
    pnlPositive: r.pnlPositive,
    reasoning: r.reasoning,
  };
}

const typeBadge = (type: TradeType) => {
  switch (type) {
    case "Swap":
      return "text-primary bg-primary/10";
    case "Add LP":
      return "text-foreground bg-card-solid";
    case "Stake":
      return "text-muted bg-card-solid";
    case "Remove LP":
      return "text-foreground bg-card-solid";
    case "Unstake":
      return "text-muted bg-card-solid";
  }
};

const tierBadge = (tier: Tier) => {
  switch (tier) {
    case "Core":
      return "text-primary bg-primary/10";
    case "Mid-Risk":
      return "text-foreground bg-card-solid";
    case "Degen":
      return "text-muted bg-card-solid";
  }
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TradesPage() {
  const [activeType, setActiveType] =
    useState<(typeof typeFilters)[number]>("All");
  const [activeTier, setActiveTier] =
    useState<(typeof tierFilters)[number]>("All Tiers");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(
    new Set()
  );

  const [trades, setTrades] = useState<Trade[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchTrades() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("pageSize", String(PAGE_SIZE));

        const typeParam = mapTypeFilter(activeType);
        if (typeParam) params.set("type", typeParam);

        const tierParam = mapTierFilter(activeTier);
        if (tierParam) params.set("tier", tierParam);

        const res = await fetch(`/api/v1/trades?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch trades");

        const json = await res.json();
        if (cancelled) return;

        setTrades(json.data.map(mapTradeResponse));
        setTotal(json.total);
      } catch (err) {
        if (!cancelled) {
          showToast("Failed to load trades", "error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTrades();
    return () => {
      cancelled = true;
    };
  }, [currentPage, activeType, activeTier]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeType, activeTier]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = trades;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <>
      <Navbar />

      <main className="pt-28 pb-20 max-w-5xl mx-auto px-6">
        {/* ---- HEADER ---- */}
        <section className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              Trade History
            </h1>
            <p className="text-muted mt-2">
              Every AI trade, logged on-chain with full reasoning.
            </p>
          </div>
          <button className="flex items-center gap-1.5 text-primary text-sm cursor-pointer hover:underline shrink-0 mt-1">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </section>

        {/* ---- FILTERS BAR ---- */}
        <section className="mt-8 flex flex-wrap items-center gap-2">
          {/* Type filters */}
          {typeFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveType(f)}
              className={
                activeType === f
                  ? "bg-card-solid text-foreground border border-border rounded-lg px-3 py-1.5 text-xs cursor-pointer"
                  : "text-muted hover:text-foreground text-xs cursor-pointer px-3 py-1.5"
              }
            >
              {f}
            </button>
          ))}

          {/* Divider */}
          <span className="w-px h-5 bg-border mx-1" />

          {/* Tier filters */}
          {tierFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveTier(f)}
              className={
                activeTier === f
                  ? "bg-card-solid text-foreground border border-border rounded-lg px-3 py-1.5 text-xs cursor-pointer"
                  : "text-muted hover:text-foreground text-xs cursor-pointer px-3 py-1.5"
              }
            >
              {f}
            </button>
          ))}
        </section>

        {/* ---- TRADE TABLE ---- */}
        <section className="mt-6">
          <div className="bg-card border border-border rounded-2xl p-6 overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-muted text-sm">
                Loading trades&hellip;
              </div>
            ) : (
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="text-left text-xs text-muted uppercase tracking-wider">
                    <th className="pb-4 pr-4 font-medium">Time</th>
                    <th className="pb-4 pr-4 font-medium">Type</th>
                    <th className="pb-4 pr-4 font-medium">Asset</th>
                    <th className="pb-4 pr-4 font-medium">Amount</th>
                    <th className="pb-4 pr-4 font-medium">Protocol</th>
                    <th className="pb-4 pr-4 font-medium">Tier</th>
                    <th className="pb-4 pr-4 font-medium text-right">P&L</th>
                    <th className="pb-4 font-medium w-8" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((trade, idx) => {
                    const isExpanded = expandedRows.has(trade.id);
                    return (
                      <tr key={trade.id} className="group">
                        <td
                          colSpan={8}
                          className={`p-0 ${
                            idx < filtered.length - 1
                              ? "border-b border-border"
                              : ""
                          }`}
                        >
                          {/* Main row */}
                          <button
                            onClick={() => toggleRow(trade.id)}
                            className="w-full flex items-center text-left py-3 cursor-pointer hover:bg-card-solid/50 transition-colors rounded-lg -mx-1 px-1"
                          >
                            <span className="text-sm text-muted pr-4 w-[72px] shrink-0">
                              {trade.time}
                            </span>
                            <span className="pr-4 w-[90px] shrink-0">
                              <span
                                className={`text-xs rounded-full px-2 py-0.5 ${typeBadge(
                                  trade.type
                                )}`}
                              >
                                {trade.type}
                              </span>
                            </span>
                            <span className="text-sm text-foreground pr-4 flex-1 min-w-[120px]">
                              {trade.asset}
                            </span>
                            <span className="text-sm text-foreground pr-4 w-[80px] shrink-0">
                              {trade.amount}
                            </span>
                            <span className="text-sm text-muted pr-4 w-[90px] shrink-0">
                              {trade.protocol}
                            </span>
                            <span className="pr-4 w-[80px] shrink-0">
                              <span
                                className={`text-xs rounded-full px-2 py-0.5 ${tierBadge(
                                  trade.tier
                                )}`}
                              >
                                {trade.tier}
                              </span>
                            </span>
                            <span
                              className={`text-sm font-medium pr-4 w-[70px] shrink-0 text-right ${
                                trade.pnlPositive
                                  ? "text-primary"
                                  : "text-muted"
                              }`}
                            >
                              {trade.pnl}
                            </span>
                            <span className="w-8 shrink-0 flex items-center justify-center">
                              <ChevronDown
                                className={`w-4 h-4 text-muted transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </span>
                          </button>

                          {/* Expanded reasoning */}
                          {isExpanded && (
                            <div className="border-l-2 border-primary pl-4 ml-4 py-2 mb-3">
                              <p className="text-muted text-sm">
                                {trade.reasoning}
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-muted text-sm">
                        No trades match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* ---- PAGINATION ---- */}
        <section className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">
            {total > 0
              ? `Showing ${rangeStart}\u2013${rangeEnd} of ${total} trades`
              : "No trades found"}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="border border-border rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground hover:border-border-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="border border-border rounded-lg px-4 py-2 text-sm text-foreground hover:border-border-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
