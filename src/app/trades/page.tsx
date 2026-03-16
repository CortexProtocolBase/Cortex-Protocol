"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Download, ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

type TradeType = "Swap" | "Add LP" | "Remove LP" | "Stake" | "Unstake";
type Tier = "Core" | "Mid-Risk" | "Degen";

interface Trade {
  id: number;
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

const trades: Trade[] = [
  {
    id: 1,
    time: "2h ago",
    type: "Swap",
    asset: "USDC \u2192 WETH",
    amount: "$12,400",
    protocol: "Aave",
    tier: "Core",
    pnl: "+$124",
    pnlPositive: true,
    reasoning:
      "Increasing ETH exposure ahead of expected momentum shift",
  },
  {
    id: 2,
    time: "4h ago",
    type: "Add LP",
    asset: "AERO/USDC",
    amount: "$8,200",
    protocol: "Aerodrome",
    tier: "Mid-Risk",
    pnl: "+$312",
    pnlPositive: true,
    reasoning:
      "High yield opportunity in Aerodrome AERO pool, sentiment positive",
  },
  {
    id: 3,
    time: "6h ago",
    type: "Swap",
    asset: "WETH \u2192 USDC",
    amount: "$5,100",
    protocol: "Uniswap",
    tier: "Core",
    pnl: "-$43",
    pnlPositive: false,
    reasoning:
      "De-risking: reducing ETH exposure due to rising volatility",
  },
  {
    id: 4,
    time: "8h ago",
    type: "Stake",
    asset: "cbBTC",
    amount: "$15,000",
    protocol: "Compound",
    tier: "Core",
    pnl: "+$89",
    pnlPositive: true,
    reasoning: "Compounding cbBTC yield at 5.4% APY",
  },
  {
    id: 5,
    time: "12h ago",
    type: "Remove LP",
    asset: "DEGEN/WETH",
    amount: "$3,200",
    protocol: "Aerodrome",
    tier: "Mid-Risk",
    pnl: "+$445",
    pnlPositive: true,
    reasoning:
      "Taking profits on DEGEN position after 40% run",
  },
  {
    id: 6,
    time: "1d ago",
    type: "Swap",
    asset: "USDC \u2192 AERO",
    amount: "$6,800",
    protocol: "Aerodrome",
    tier: "Mid-Risk",
    pnl: "-$127",
    pnlPositive: false,
    reasoning:
      "Entering AERO position, strong on-chain metrics",
  },
  {
    id: 7,
    time: "1d ago",
    type: "Add LP",
    asset: "WETH/USDC",
    amount: "$22,000",
    protocol: "Aave",
    tier: "Core",
    pnl: "+$234",
    pnlPositive: true,
    reasoning: "Core yield position, stable returns",
  },
  {
    id: 8,
    time: "2d ago",
    type: "Swap",
    asset: "Momentum Token \u2192 USDC",
    amount: "$1,400",
    protocol: "Uniswap",
    tier: "Degen",
    pnl: "+$890",
    pnlPositive: true,
    reasoning:
      "Exiting momentum play after 3x, sentiment cooling",
  },
  {
    id: 9,
    time: "2d ago",
    type: "Swap",
    asset: "USDC \u2192 New Base Token",
    amount: "$2,100",
    protocol: "Uniswap",
    tier: "Degen",
    pnl: "-$210",
    pnlPositive: false,
    reasoning:
      "Entering new Base launch with strong early metrics",
  },
  {
    id: 10,
    time: "3d ago",
    type: "Unstake",
    asset: "WETH",
    amount: "$18,500",
    protocol: "Compound",
    tier: "Core",
    pnl: "+$156",
    pnlPositive: true,
    reasoning:
      "Rebalancing: moving from staking to LP for better yield",
  },
];

const typeFilters = ["All", "Swaps", "LP", "Staking"] as const;
const tierFilters = ["All Tiers", "Core", "Mid-Risk", "Degen"] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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

function matchesTypeFilter(
  trade: Trade,
  filter: (typeof typeFilters)[number]
) {
  if (filter === "All") return true;
  if (filter === "Swaps") return trade.type === "Swap";
  if (filter === "LP")
    return trade.type === "Add LP" || trade.type === "Remove LP";
  if (filter === "Staking")
    return trade.type === "Stake" || trade.type === "Unstake";
  return true;
}

function matchesTierFilter(
  trade: Trade,
  filter: (typeof tierFilters)[number]
) {
  if (filter === "All Tiers") return true;
  return trade.tier === filter;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TradesPage() {
  const [activeType, setActiveType] =
    useState<(typeof typeFilters)[number]>("All");
  const [activeTier, setActiveTier] =
    useState<(typeof tierFilters)[number]>("All Tiers");
  const [expandedRows, setExpandedRows] = useState<Set<number>>(
    new Set()
  );

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = trades.filter(
    (t) => matchesTypeFilter(t, activeType) && matchesTierFilter(t, activeTier)
  );

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
          </div>
        </section>

        {/* ---- PAGINATION ---- */}
        <section className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted text-sm">
            Showing 1&ndash;10 of 247 trades
          </p>
          <div className="flex items-center gap-2">
            <button className="border border-border rounded-lg px-4 py-2 text-sm text-muted hover:text-foreground hover:border-border-hover transition-colors cursor-pointer">
              Previous
            </button>
            <button className="border border-border rounded-lg px-4 py-2 text-sm text-foreground hover:border-border-hover transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
