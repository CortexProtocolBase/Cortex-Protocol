"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { useAccount, useBalance } from "wagmi";
import { useWallet } from "@/contexts/WalletContext";
import { formatUnits } from "viem";
import { showToast } from "@/components/Toast";
import type {
  VaultStatsResponse,
  UserPositionResponse,
  PerformanceResponse,
} from "@/lib/types";
import {
  useApproveUSDC,
  useUSDCAllowance,
  useUSDCBalance,
  useDeposit,
  useRedeem,
  useVaultShares,
} from "@/hooks/useVault";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import WalletGate from "@/components/WalletGate";

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
  const [selectedToken, setSelectedToken] = useState<"ETH" | "USDC">("USDC");
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const { connected } = useWallet();

  const [vaultStats, setVaultStats] = useState<VaultStatsResponse | null>(null);
  const [userPosition, setUserPosition] = useState<UserPositionResponse | null>(null);
  const [performance, setPerformance] = useState<PerformanceResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Contract hooks
  const { approve, isPending: isApproving, isConfirming: approveConfirming, isSuccess: approveSuccess } = useApproveUSDC();
  const { data: allowance, refetch: refetchAllowance } = useUSDCAllowance(address);
  const { data: usdcBalance } = useUSDCBalance(address);
  const { data: ethBalance } = useBalance({ address });
  const { deposit, isPending: isDepositing, isSuccess: depositSuccess, isConfirming: depositConfirming } = useDeposit();
  const { redeem, isPending: isRedeeming, isSuccess: redeemSuccess, isConfirming: redeemConfirming } = useRedeem();
  const { data: vaultSharesBigInt } = useVaultShares(address);

  // Refetch allowance when approval confirms so button label updates
  useEffect(() => {
    if (approveSuccess) {
      refetchAllowance();
      showToast("Approved! Now click Deposit to Vault.", "success");
    }
  }, [approveSuccess]);

  // Refresh everything after a tx
  const refreshAll = useCallback(() => {
    if (!address) return;
    fetch("/api/v1/vault/stats")
      .then((r) => r.json())
      .then((json) => setVaultStats(json.data))
      .catch(() => {});
    fetch(`/api/v1/vault/user/${address}`)
      .then((r) => r.json())
      .then((json) => setUserPosition(json.data))
      .catch(() => {});
  }, [address]);

  useEffect(() => {
    if (depositSuccess) {
      showToast("Deposit confirmed!", "success");
      setTimeout(() => showToast("It may take a couple minutes for your balance to update.", "info"), 1500);
      setAmount("");
      refreshAll();
      setTimeout(refreshAll, 5000);
      setTimeout(refreshAll, 15000);
    }
  }, [depositSuccess, refreshAll]);

  useEffect(() => {
    if (redeemSuccess) {
      showToast("Withdrawal confirmed!", "success");
      setTimeout(() => showToast("It may take a couple minutes for your balance to update.", "info"), 1500);
      setAmount("");
      refreshAll();
      setTimeout(refreshAll, 5000);
      setTimeout(refreshAll, 15000);
    }
  }, [redeemSuccess, refreshAll]);

  const handleAction = () => {
    if (!address) {
      showToast("Connect your wallet first", "error");
      return;
    }
    if (!amount || parseFloat(amount.replace(/,/g, "")) <= 0) {
      showToast("Enter a valid amount", "error");
      return;
    }

    if (activeTab === "deposit") {
      if (selectedToken === "USDC") {
        const cleanAmount = amount.replace(/,/g, "");
        const parsedAmount = parseFloat(cleanAmount);
        const allowanceNum = allowance ? parseFloat(formatUnits(allowance as bigint, 6)) : 0;
        if (allowanceNum < parsedAmount) {
          // Step 1: Just approve — user clicks button again to deposit
          approve(cleanAmount);
          showToast("Approve USDC spend in your wallet...", "info");
        } else {
          // Approved — deposit now
          deposit(cleanAmount, address);
          showToast("Confirm deposit in your wallet...", "info");
        }
      } else {
        showToast("ETH deposits coming soon — use USDC", "info");
      }
    } else {
      redeem(amount.replace(/,/g, ""), address);
      showToast("Redeeming cVault shares...", "info");
    }
  };

  const isTxPending = isApproving || isDepositing || isRedeeming || approveConfirming || depositConfirming || redeemConfirming;

  const needsApproval = (() => {
    if (activeTab !== "deposit" || selectedToken !== "USDC" || !amount) return false;
    const parsedAmount = parseFloat(amount.replace(/,/g, ""));
    const allowanceNum = allowance ? parseFloat(formatUnits(allowance as bigint, 6)) : 0;
    return allowanceNum < parsedAmount;
  })();

  const buttonLabel = (() => {
    if (isApproving || approveConfirming) return "Approving USDC...";
    if (isDepositing || depositConfirming) return "Depositing...";
    if (isRedeeming || redeemConfirming) return "Withdrawing...";
    if (activeTab === "withdraw") return "Redeem cVault Shares";
    if (needsApproval) return "Approve USDC";
    return "Deposit to Vault";
  })();

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, perfRes] = await Promise.all([
          fetch("/api/v1/vault/stats"),
          fetch("/api/v1/performance"),
        ]);
        const [statsJson, perfJson] = await Promise.all([
          statsRes.json(),
          perfRes.json(),
        ]);
        setVaultStats(statsJson.data);
        setPerformance(perfJson.data);
      } catch {
        showToast("Failed to load vault data", "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!address) {
      setUserPosition(null);
      return;
    }
    fetch(`/api/v1/vault/user/${address}`)
      .then((r) => r.json())
      .then((json) => setUserPosition(json.data))
      .catch(() => showToast("Failed to load position", "error"));
  }, [address]);

  const usdcBal = usdcBalance ? parseFloat(formatUnits(usdcBalance as bigint, 6)) : 0;
  const shareBal = vaultSharesBigInt ? parseFloat(formatUnits(vaultSharesBigInt as bigint, 6)) : 0;
  const sharePrice = vaultStats?.sharePriceUsd ?? 0;
  const tvl = vaultStats?.tvl ?? 0;
  const exchangeRate =
    sharePrice > 0
      ? `1 ${selectedToken} = ${(1 / sharePrice).toFixed(4)} cVLT shares`
      : `1 ${selectedToken} = -- cVLT shares`;

  const estimatedShare =
    amount && !isNaN(parseFloat(amount.replace(/,/g, ""))) && tvl > 0
      ? ((parseFloat(amount.replace(/,/g, "")) / tvl) * 100).toFixed(6)
      : "0";

  const computedVaultStats = [
    {
      label: "Total Value Locked",
      value: loading ? "\u2014" : `$${(vaultStats?.tvl ?? 0).toLocaleString()}`,
    },
    {
      label: "Current APY",
      value: loading ? "\u2014" : `${(vaultStats?.apy7d ?? 0).toFixed(1)}%`,
    },
    {
      label: "Total Depositors",
      value: loading ? "\u2014" : (vaultStats?.depositors ?? 0).toLocaleString(),
    },
    {
      label: "cVault Share Price",
      value: loading ? "\u2014" : `$${(vaultStats?.sharePriceUsd ?? 0).toFixed(3)}`,
    },
  ];

  const performanceData = [
    ...(performance?.daily ?? []),
    ...(performance?.weekly ?? []),
    ...(performance?.monthly ?? []),
  ]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((d, i, arr) => i === 0 || d.date !== arr[i - 1].date)
    .filter((d) => d.value > 0) // Only show non-zero data points
    .map((d) => ({
      month: new Date(d.date).toLocaleDateString("default", { month: "short", day: "numeric" }),
      tvl: d.value,
    }));

  const recentTransactions = (userPosition?.recentTransactions ?? []).map((tx) => ({
    type: tx.type,
    amount: `${tx.amount.toLocaleString()} USDC`,
    share: `${tx.share.toFixed(3)}%`,
    date: new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  }));

  const depositedAmount = userPosition?.depositedAmount ?? 0;
  const currentValue = userPosition?.currentValue ?? 0;
  const profitLoss = userPosition?.profitLoss ?? 0;
  const profitLossPct = userPosition?.profitLossPct ?? 0;
  const cvaultShares = userPosition?.cvaultShares ?? 0;
  const vaultSharePct = userPosition?.vaultSharePct ?? 0;
  const entryDate = userPosition?.entryDate ?? null;

  const daysInVault = entryDate
    ? Math.floor((Date.now() - new Date(entryDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const hasPosition = !!userPosition;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <WalletGate>
      <main className="mx-auto max-w-5xl px-6 pt-28 pb-20">
        {/* Header */}
        <section>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
              CORTEX Vault
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-card-solid border border-border px-3 py-1 text-xs text-muted"><span className="w-1.5 h-1.5 rounded-full bg-primary" />Base</span>
          </div>
          <p className="mt-2 font-body text-lg text-muted">
            Deposit USDC on Base. Receive cVault shares. Let the AI manage the rest.
          </p>
        </section>

        {/* Vault Stats */}
        <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {computedVaultStats.map((stat) => (
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
                  onClick={() => setSelectedToken("USDC")}
                  className={`rounded-xl border px-5 py-2.5 font-heading text-sm transition-all duration-300 ${
                    selectedToken === "USDC"
                      ? "border-border bg-card-solid text-foreground"
                      : "border-transparent text-muted"
                  }`}
                >
                  USDC
                </button>
                <span className="rounded-xl border border-transparent px-5 py-2.5 font-heading text-sm text-muted/30 cursor-default select-none">
                  ETH (Base)
                  <span className="ml-1.5 text-[10px]">Soon</span>
                </span>
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
                    onClick={() => setAmount(activeTab === "deposit" ? String(usdcBal) : String(shareBal))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer font-body text-sm text-primary"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Balance */}
              <p className="mb-6 font-body text-sm text-muted">
                {activeTab === "deposit"
                  ? `Balance: ${usdcBal.toLocaleString()} USDC`
                  : `cVault Shares: ${shareBal.toLocaleString()} cVLT`}
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
                <div className="my-3 border-t border-border" />
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted">Deposit Fee</span>
                  <span className="font-body text-sm text-foreground">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted">Withdrawal Fee</span>
                  <span className="font-body text-sm text-foreground">0.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted">Management Fee</span>
                  <span className="font-body text-sm text-foreground">2% annualized</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-body text-sm text-muted">Performance Fee</span>
                  <span className="font-body text-sm text-foreground">20% of profits</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleAction}
                disabled={isTxPending}
                className="w-full cursor-pointer rounded-xl bg-foreground py-4 font-heading font-bold text-background transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {buttonLabel}
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
                    <p className="font-heading text-sm text-foreground">
                      {hasPosition ? `${depositedAmount.toLocaleString()} USDC` : "\u2014"}
                    </p>
                    <p className="font-body text-xs text-muted">
                      {hasPosition ? `$${depositedAmount.toLocaleString()}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-border py-3">
                  <span className="font-body text-sm text-muted">Current Value</span>
                  <p className="font-heading text-sm text-foreground">
                    {hasPosition ? `$${currentValue.toLocaleString()}` : "\u2014"}
                  </p>
                </div>
                <div className="flex items-center justify-between border-b border-border py-3">
                  <span className="font-body text-sm text-muted">Profit / Loss</span>
                  <div className="text-right">
                    <p className={`font-heading text-sm ${profitLoss >= 0 ? "text-primary" : "text-red-400"}`}>
                      {hasPosition ? `${profitLoss >= 0 ? "+" : ""}$${profitLoss.toLocaleString()}` : "\u2014"}
                    </p>
                    <p className={`font-body text-xs ${profitLossPct >= 0 ? "text-primary" : "text-red-400"}`}>
                      {hasPosition ? `${profitLossPct >= 0 ? "+" : ""}${profitLossPct.toFixed(1)}%` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-b border-border py-3">
                  <span className="font-body text-sm text-muted">Vault Share</span>
                  <p className="font-heading text-sm text-foreground">
                    {hasPosition ? `${vaultSharePct.toFixed(3)}%` : "\u2014"}
                  </p>
                </div>
                <div className="flex items-center justify-between border-b border-border py-3">
                  <span className="font-body text-sm text-muted">cVault Shares</span>
                  <p className="font-heading text-sm text-foreground">
                    {hasPosition ? `${cvaultShares.toLocaleString()} cVLT` : "\u2014"}
                  </p>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="font-body text-sm text-muted">Time in Vault</span>
                  <p className="font-heading text-sm text-foreground">
                    {hasPosition ? `${daysInVault} days` : "\u2014"}
                  </p>
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
              {performanceData.length > 1 ? (
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
                      tickFormatter={(val: number) =>
                        val >= 1e6 ? `$${(val / 1e6).toFixed(1)}M` : val >= 1e3 ? `$${(val / 1e3).toFixed(0)}k` : `$${val}`
                      }
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
              ) : (
                <div className="flex items-center justify-center h-full text-muted text-sm">
                  {loading ? "Loading chart\u2026" : "No performance data yet"}
                </div>
              )}
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
                  {recentTransactions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 font-body text-sm text-muted text-center">
                        {address ? "No recent transactions" : "Connect wallet to view transactions"}
                      </td>
                    </tr>
                  )}
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
      </WalletGate>
    </div>
  );
}
