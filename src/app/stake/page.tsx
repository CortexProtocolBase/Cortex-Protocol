"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useWallet } from "@/contexts/WalletContext";
import { formatUnits } from "viem";
import Navbar from "@/components/Navbar";
import { showToast } from "@/components/Toast";
import { Coins, Lock, Gift, TrendingUp, Info } from "lucide-react";
import type { StakingInfoResponse } from "@/lib/types";
import { useApproveForStaking, useStake, useUnstake, useClaimRewards, useCortexBalance } from "@/hooks/useStaking";
import { LOCK_TIERS } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function StakePage() {
  const { address } = useAccount();
  const { connected } = useWallet();
  const [selectedLock, setSelectedLock] = useState(2); // default 3 Months
  const [amount, setAmount] = useState("");
  const [stakingInfo, setStakingInfo] = useState<StakingInfoResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // Contract hooks
  const { approve, isPending: isApproving, isSuccess: approveSuccess } = useApproveForStaking();
  const { stake, isPending: isStaking, isSuccess: stakeSuccess } = useStake();
  const { unstake, isPending: isUnstaking, isSuccess: unstakeSuccess } = useUnstake();
  const { claimRewards, isPending: isClaiming, isSuccess: claimSuccess } = useClaimRewards();
  const { data: cortexBalance } = useCortexBalance(address);

  const lockDaysMap = [0, 30, 90, 180];

  useEffect(() => {
    if (approveSuccess && amount && selectedLock !== undefined) {
      stake(amount, lockDaysMap[selectedLock]);
      showToast("Staking...", "info");
    }
  }, [approveSuccess]);

  useEffect(() => {
    if (stakeSuccess) { showToast("Staked successfully!", "success"); setAmount(""); }
  }, [stakeSuccess]);

  useEffect(() => {
    if (unstakeSuccess) showToast("Unstaked successfully!", "success");
  }, [unstakeSuccess]);

  useEffect(() => {
    if (claimSuccess) showToast("Rewards claimed!", "success");
  }, [claimSuccess]);

  const handleStake = () => {
    if (!address) { showToast("Connect wallet first", "error"); return; }
    if (!amount || parseFloat(amount) <= 0) { showToast("Enter a valid amount", "error"); return; }
    approve(amount);
    showToast("Approving CORTEX...", "info");
  };

  const isTxPending = isApproving || isStaking || isUnstaking || isClaiming;

  useEffect(() => {
    if (!address) {
      setStakingInfo(null);
      return;
    }

    const fetchStakingInfo = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/staking/info/${address}`);
        if (!res.ok) throw new Error("Failed to fetch staking info");
        const json = await res.json();
        setStakingInfo(json.data);
      } catch (err) {
        console.error(err);
        showToast("Failed to load staking data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStakingInfo();
  }, [address]);

  /* ---------- Derived data ---------- */

  const formatStaked = (val: number) => {
    if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
    if (val >= 1e3) return val.toLocaleString();
    return val.toString();
  };

  const overviewCards = stakingInfo
    ? [
        { label: "Total Staked", value: `${formatStaked(stakingInfo.totalStaked)} CORTEX`, icon: Coins },
        {
          label: "Your Staked",
          value: stakingInfo.userPosition
            ? `${stakingInfo.userPosition.stakedAmount.toLocaleString()} CORTEX`
            : "0 CORTEX",
          icon: Lock,
        },
        {
          label: "Pending Rewards",
          value: stakingInfo.userPosition
            ? `${stakingInfo.userPosition.pendingRewards} WETH`
            : "0 WETH",
          icon: Gift,
        },
        { label: "Current APR", value: `${stakingInfo.currentApr}%`, icon: TrendingUp },
      ]
    : [
        { label: "Total Staked", value: "--", icon: Coins },
        { label: "Your Staked", value: "--", icon: Lock },
        { label: "Pending Rewards", value: "--", icon: Gift },
        { label: "Current APR", value: "--", icon: TrendingUp },
      ];

  const lockOptions = stakingInfo
    ? stakingInfo.lockTiers.map((tier) => ({
        label: tier.label,
        multiplier: tier.multiplier,
      }))
    : [
        { label: "No Lock", multiplier: 1 },
        { label: "1 Month", multiplier: 1.5 },
        { label: "3 Months", multiplier: 2 },
        { label: "6 Months", multiplier: 2.5 },
      ];

  const positionRows = stakingInfo?.userPosition
    ? [
        { label: "Staked", value: `${stakingInfo.userPosition.stakedAmount.toLocaleString()} CORTEX` },
        {
          label: "Lock Duration",
          value:
            stakingInfo.userPosition.lockDurationDays === 0
              ? "No Lock"
              : stakingInfo.userPosition.lockDurationDays === 30
                ? "1 month"
                : stakingInfo.userPosition.lockDurationDays === 90
                  ? "3 months"
                  : stakingInfo.userPosition.lockDurationDays === 180
                    ? "6 months"
                    : `${stakingInfo.userPosition.lockDurationDays} days`,
        },
        { label: "Multiplier", value: `${stakingInfo.userPosition.multiplier}x` },
        { label: "Effective Stake", value: `${stakingInfo.userPosition.effectiveStake.toLocaleString()} CORTEX` },
        {
          label: "Pending Rewards",
          value: `${stakingInfo.userPosition.pendingRewards} WETH (~$${stakingInfo.userPosition.pendingRewardsUsd.toFixed(2)})`,
        },
        { label: "Unlock Date", value: stakingInfo.userPosition.unlockDate },
      ]
    : [];

  const rewardHistory = stakingInfo?.rewardHistory ?? [];

  const multiplier = lockOptions[selectedLock]?.multiplier ?? 1;
  const numericAmount = parseFloat(amount) || 0;
  const apr = stakingInfo?.currentApr ?? 12.4;
  const weeklyEstimate = ((numericAmount * multiplier * (apr / 100)) / 52).toFixed(4);

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

        {/* ----- Connect Wallet Prompt ----- */}
        {!address && (
          <div className="mt-8 bg-card border border-border rounded-2xl p-10 text-center">
            <p className="text-muted text-lg">
              Connect your wallet to view staking info and stake CORTEX.
            </p>
          </div>
        )}

        {/* ----- Loading ----- */}
        {address && loading && (
          <div className="mt-8 bg-card border border-border rounded-2xl p-10 text-center">
            <p className="text-muted text-lg">Loading staking data...</p>
          </div>
        )}

        {/* ----- Main Content ----- */}
        {address && !loading && (
          <>
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
                    Available: {cortexBalance ? parseFloat(formatUnits(cortexBalance as bigint, 18)).toLocaleString() : "0"} CORTEX
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
                <button
                  onClick={handleStake}
                  disabled={isTxPending}
                  className="cursor-pointer mt-6 bg-foreground text-background rounded-xl py-4 w-full font-heading font-bold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTxPending ? "Processing..." : "Stake CORTEX"}
                </button>
              </div>

              {/* Right — Your Position (2/5) */}
              <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
                <h2 className="font-heading font-semibold mb-4">
                  Your Staking Position
                </h2>

                {positionRows.length > 0 ? (
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
                ) : (
                  <p className="text-sm text-muted py-4">
                    No active staking position.
                  </p>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => claimRewards()}
                    disabled={isTxPending}
                    className="cursor-pointer flex-1 bg-foreground text-background rounded-lg px-4 py-3 font-heading font-bold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isClaiming ? "Claiming..." : "Claim Rewards"}
                  </button>
                  <button
                    onClick={() => unstake()}
                    disabled={isTxPending}
                    className="cursor-pointer flex-1 border border-border text-foreground rounded-lg px-4 py-3 font-heading font-bold hover:bg-card-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUnstaking ? "Unstaking..." : "Unstake"}
                  </button>
                </div>
              </div>
            </div>

            {/* ----- Reward History ----- */}
            <div className="bg-card border border-border rounded-2xl p-6 mt-8">
              <h2 className="font-heading font-semibold mb-4">Reward History</h2>

              {rewardHistory.length > 0 ? (
                <>
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
                </>
              ) : (
                <p className="text-sm text-muted py-4">No reward history yet.</p>
              )}
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
          </>
        )}
      </main>
    </>
  );
}
