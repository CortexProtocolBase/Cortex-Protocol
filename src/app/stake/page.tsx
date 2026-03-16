"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Coins, Lock, Gift, TrendingUp, Info } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const overviewCards = [
  { label: "Total Staked", value: "247M CORTEX", icon: Coins },
  { label: "Your Staked", value: "1,247 CORTEX", icon: Lock },
  { label: "Pending Rewards", value: "0.042 WETH", icon: Gift },
  { label: "Current APR", value: "12.4%", icon: TrendingUp },
];

const lockOptions = [
  { label: "No Lock", multiplier: 1 },
  { label: "1 Month", multiplier: 1.5 },
  { label: "3 Months", multiplier: 2 },
  { label: "6 Months", multiplier: 2.5 },
];

const positionRows = [
  { label: "Staked", value: "1,247 CORTEX" },
  { label: "Lock Duration", value: "3 months" },
  { label: "Multiplier", value: "2.0x" },
  { label: "Effective Stake", value: "2,494 CORTEX" },
  { label: "Pending Rewards", value: "0.042 WETH (~$82.14)" },
  { label: "Unlock Date", value: "Jun 15, 2026" },
];

const rewardHistory = [
  { date: "Mar 10, 2026", amount: "0.038", token: "WETH", status: "Claimed" },
  { date: "Mar 3, 2026", amount: "0.041", token: "WETH", status: "Claimed" },
  { date: "Feb 24, 2026", amount: "0.035", token: "WETH", status: "Claimed" },
  { date: "Feb 17, 2026", amount: "0.029", token: "WETH", status: "Claimed" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function StakePage() {
  const [selectedLock, setSelectedLock] = useState(2); // default 3 Months
  const [amount, setAmount] = useState("");

  const multiplier = lockOptions[selectedLock].multiplier;
  const numericAmount = parseFloat(amount) || 0;
  const weeklyEstimate = ((numericAmount * multiplier * 0.124) / 52).toFixed(4);

  return (
    <>
      <Navbar />

      <main className="pt-28 pb-20 max-w-5xl mx-auto px-6">
        {/* ----- Header ----- */}
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Stake CORTEX
          </h1>
          <p className="text-muted mt-2">
            Stake $CORTEX to earn a share of protocol fees. Lock longer for
            higher multipliers.
          </p>
        </div>

        {/* ----- Staking Overview ----- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {overviewCards.map((card) => {
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
                <p className="font-heading text-2xl font-bold">{card.value}</p>
              </div>
            );
          })}
        </div>

        {/* ----- Stake Panel ----- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
          {/* Left — Stake Form (3/5) */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading font-semibold mb-6">Stake</h2>

            {/* Amount Input */}
            <div>
              <label className="text-sm text-muted mb-2 block">Amount</label>
              <div className="flex items-center gap-2 bg-card-solid border border-border rounded-xl px-4 py-3">
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-transparent text-foreground font-mono text-lg outline-none placeholder:text-muted/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-sm text-muted mr-2">CORTEX</span>
                <button
                  onClick={() => setAmount("3200")}
                  className="cursor-pointer text-xs text-primary font-medium bg-primary/10 rounded-md px-2.5 py-1 hover:bg-primary/20 transition-colors duration-200"
                >
                  MAX
                </button>
              </div>
              <p className="text-xs text-muted mt-2">
                Available: 3,200 CORTEX
              </p>
            </div>

            {/* Lock Duration Selector */}
            <div className="mt-6">
              <label className="text-sm text-muted mb-3 block">
                Lock Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {lockOptions.map((opt, i) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedLock(i)}
                    className={`cursor-pointer rounded-xl px-3 py-3 text-center transition-all duration-200 border ${
                      selectedLock === i
                        ? "bg-card-solid border-border text-foreground"
                        : "border-transparent text-muted hover:text-foreground hover:border-border"
                    }`}
                  >
                    <span className="block text-sm font-medium">
                      {opt.label}
                    </span>
                    <span className="block text-xs text-muted mt-0.5">
                      {opt.multiplier}x
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Reward */}
            {numericAmount > 0 && (
              <div className="mt-6 flex items-center justify-between bg-card-solid rounded-xl px-4 py-3 border border-border">
                <span className="text-sm text-muted">Est. weekly reward</span>
                <span className="text-sm font-mono text-foreground">
                  ~{weeklyEstimate} WETH
                </span>
              </div>
            )}

            {/* Stake Button */}
            <button className="cursor-pointer mt-6 bg-foreground text-background rounded-xl py-4 w-full font-heading font-bold hover:opacity-90 transition-opacity duration-200">
              Stake CORTEX
            </button>
          </div>

          {/* Right — Your Position (2/5) */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
            <h2 className="font-heading font-semibold mb-4">
              Your Staking Position
            </h2>

            <div>
              {positionRows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between py-3 ${
                    i < positionRows.length - 1
                      ? "border-b border-border"
                      : ""
                  }`}
                >
                  <span className="text-sm text-muted">{row.label}</span>
                  <span className="text-sm text-foreground font-medium">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <button className="cursor-pointer mt-4 bg-foreground text-background rounded-lg px-6 py-3 w-full font-heading font-bold hover:opacity-90 transition-opacity duration-200">
              Claim Rewards
            </button>
          </div>
        </div>

        {/* ----- Reward History ----- */}
        <div className="bg-card border border-border rounded-2xl p-6 mt-8">
          <h2 className="font-heading font-semibold mb-4">Reward History</h2>

          {/* Table header */}
          <div className="hidden sm:grid grid-cols-4 gap-4 text-xs text-muted pb-3 border-b border-border">
            <span>Date</span>
            <span>Amount</span>
            <span>Token</span>
            <span className="text-right">Status</span>
          </div>

          {/* Table rows */}
          {rewardHistory.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 py-3 ${
                i < rewardHistory.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <span className="text-sm text-muted">{row.date}</span>
              <span className="text-sm text-foreground font-mono">
                {row.amount}
              </span>
              <span className="text-sm text-muted">{row.token}</span>
              <span className="text-sm text-right">
                <span className="text-primary bg-primary/10 text-xs rounded-full px-2 py-0.5">
                  {row.status}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* ----- Fee Info ----- */}
        <div className="bg-card border border-border rounded-2xl p-6 mt-8">
          <div className="flex items-start gap-3">
            <Info size={16} className="text-muted mt-0.5 shrink-0" />
            <p className="text-sm text-muted leading-relaxed">
              Staking rewards come from protocol fees: 50% of the 2% management
              fee and 50% of the 20% performance fee collected by the vault are
              distributed weekly to $CORTEX stakers in WETH/USDC.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
