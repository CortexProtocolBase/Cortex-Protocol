"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Book,
  Code,
  Key,
  Layers,
  Brain,
  Shield,
  Vote,
  Coins,
  TrendingUp,
  Zap,
  GitBranch,
  Terminal,
  Database,
  Globe,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Section Data                                                       */
/* ------------------------------------------------------------------ */

const sections = [
  {
    id: "overview",
    label: "Overview",
    icon: Book,
  },
  {
    id: "architecture",
    label: "Architecture",
    icon: Layers,
  },
  {
    id: "contracts",
    label: "Smart Contracts",
    icon: Code,
  },
  {
    id: "vault",
    label: "Vault (ERC-4626)",
    icon: Coins,
  },
  {
    id: "ai-agent",
    label: "AI Agent",
    icon: Brain,
  },
  {
    id: "governance",
    label: "Governance",
    icon: Vote,
  },
  {
    id: "staking",
    label: "Staking",
    icon: TrendingUp,
  },
  {
    id: "risk",
    label: "Risk Management",
    icon: Shield,
  },
  {
    id: "api",
    label: "API Reference",
    icon: Terminal,
  },
  {
    id: "contributing",
    label: "Contributing",
    icon: GitBranch,
  },
];

const contracts = [
  {
    name: "CortexToken",
    address: "0x7A67AFf42d26bDb1A1569C6DE758A4f28e15e4FD",
    description: "ERC-20 governance token with ERC20Votes and ERC20Permit. Fixed supply of 1,000,000,000 CORTEX.",
  },
  {
    name: "CortexVault",
    address: "0x3A0799D13c737b341c41004BF9861eBdba28Dcf1",
    description: "ERC-4626 tokenized vault. Accepts ETH and USDC deposits, issues cVault shares. AI-managed strategy execution with fee accrual.",
  },
  {
    name: "CortexStaking",
    address: "0x494D4ba8BBe8E9041207A206Cd635af343c9007E",
    description: "Lock-based staking with time multipliers. Stake CORTEX to earn a share of protocol fees paid in WETH.",
  },
  {
    name: "CortexGovernor",
    address: "0x11cd3AfcBd99c22B47435DA29E93C26844b8d1Dc",
    description: "OpenZeppelin Governor with 4% quorum, 3-day voting period, 1-day voting delay, and 24-hour timelock.",
  },
  {
    name: "Treasury",
    address: "0xd637A73E056Da2f8761474621B4889c96257d3f3",
    description: "Fee collection and distribution. 50% of all fees go to CORTEX stakers, 50% to the protocol treasury.",
  },
];

const endpoints = [
  { method: "GET", path: "/api/v1/vault/stats", description: "Current vault TVL, share price, depositor count, and APY", auth: "Public" },
  { method: "GET", path: "/api/v1/vault/user/:address", description: "User position including shares, current value, P&L, and recent transactions", auth: "Public" },
  { method: "GET", path: "/api/v1/vault/tvl-history", description: "Historical TVL data points for charting", auth: "Public" },
  { method: "GET", path: "/api/v1/vault/share-price-history", description: "Historical share price data points", auth: "Public" },
  { method: "GET", path: "/api/v1/vault/depositors", description: "Current active depositor count", auth: "Public" },
  { method: "GET", path: "/api/v1/portfolio", description: "Current portfolio allocation across tiers and individual strategies", auth: "Public" },
  { method: "GET", path: "/api/v1/portfolio/allocation-history", description: "Historical tier allocation changes over time", auth: "Public" },
  { method: "GET", path: "/api/v1/trades", description: "Paginated trade history with tier and type filtering", auth: "Public" },
  { method: "GET", path: "/api/v1/trades/:id", description: "Single trade details including reasoning and tx hash", auth: "Public" },
  { method: "GET", path: "/api/v1/performance", description: "Historical performance data (daily, weekly, monthly)", auth: "Public" },
  { method: "GET", path: "/api/v1/ai/insights", description: "AI confidence level, market sentiment scores, and current regime", auth: "Token-gated" },
  { method: "GET", path: "/api/v1/ai/reasoning-feed", description: "Latest 10 AI reasoning cycles with decisions and confidence", auth: "Token-gated" },
  { method: "GET", path: "/api/v1/ai/cycles", description: "Total and today's AI cycle count", auth: "Public" },
  { method: "GET", path: "/api/v1/governance/proposals", description: "Active and past governance proposals with vote tallies", auth: "Public" },
  { method: "GET", path: "/api/v1/governance/stats", description: "Governance statistics (total, active, passed, rejected)", auth: "Public" },
  { method: "GET", path: "/api/v1/staking/info/:address", description: "Staking position, pending rewards, lock tier, and multiplier", auth: "Public" },
  { method: "GET", path: "/api/v1/staking/stats", description: "Total staked, effective stake, staker count", auth: "Public" },
  { method: "GET", path: "/api/v1/risk/metrics", description: "Portfolio risk metrics — Sharpe, Sortino, VaR, drawdown, win rate", auth: "Public" },
  { method: "GET", path: "/api/health", description: "System health check", auth: "Public" },
];

const feeStructure = [
  { label: "Management Fee", value: "2% annualized", description: "Charged on total AUM, accrued continuously" },
  { label: "Performance Fee", value: "20% of profits", description: "Charged on net new profits above high-water mark" },
  { label: "Withdrawal Fee", value: "0.5%", description: "Deducted when redeeming cVault shares" },
  { label: "Deposit Fee", value: "Free", description: "No fee to deposit into the vault" },
];

const lockTiers = [
  { duration: "No Lock", multiplier: "1.0x", apr: "Base APR" },
  { duration: "1 Month", multiplier: "1.5x", apr: "1.5x Base APR" },
  { duration: "3 Months", multiplier: "2.0x", apr: "2.0x Base APR" },
  { duration: "6 Months", multiplier: "2.5x", apr: "2.5x Base APR" },
];

const allocationTiers = [
  { name: "Core", range: "50–90%", target: "70%", assets: "WETH, USDC, cbBTC", protocols: "Aave, Compound", risk: "Low" },
  { name: "Mid-Risk", range: "5–35%", target: "20%", assets: "AERO, DEGEN, LP tokens", protocols: "Aerodrome, Uniswap V3", risk: "Medium" },
  { name: "Degen", range: "0–15%", target: "10%", assets: "New launches, momentum plays", protocols: "Uniswap V3, Aerodrome", risk: "High" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Navbar />

      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-6 flex gap-8">
          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-28">
              <p className="font-heading text-xs font-bold text-muted uppercase tracking-wider mb-4">
                Documentation
              </p>
              <nav className="space-y-1">
                {sections.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer text-left ${
                        activeSection === s.id
                          ? "bg-card-solid text-foreground font-medium"
                          : "text-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {s.label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-border">
                <a
                  href="https://github.com/CortexProtocolBase/Cortex-Protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors"
                >
                  <GitBranch className="w-4 h-4" />
                  View on GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </aside>

          {/* ── Content ── */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {/* Overview */}
            <section id="overview" className="mb-16">
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
                CORTEX Protocol Documentation
              </h1>
              <p className="mt-3 text-muted leading-relaxed">
                CORTEX is a decentralized, AI-managed investment vault protocol built on Base.
                Users deposit ETH or USDC, and an autonomous AI agent manages a diversified
                portfolio across the Base DeFi ecosystem — allocating across lending, liquidity
                provision, and momentum strategies.
              </p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Chain", value: "Base (8453)" },
                  { label: "Standard", value: "ERC-4626" },
                  { label: "AI Engine", value: "Claude" },
                  { label: "License", value: "MIT" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <p className="text-xs text-muted">{item.label}</p>
                    <p className="font-heading text-sm font-semibold text-foreground mt-1">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-card border border-border rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-3">How It Works</h3>
                <ol className="space-y-3 text-sm text-muted">
                  <li className="flex gap-3">
                    <span className="font-mono text-primary shrink-0">01</span>
                    <span><strong className="text-foreground">Deposit</strong> — Users deposit ETH or USDC into the CORTEX vault on Base and receive cVault shares proportional to their deposit.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-primary shrink-0">02</span>
                    <span><strong className="text-foreground">AI Manages</strong> — Every 10 minutes, the AI agent analyzes market conditions, sentiment, and risk — then allocates capital across Core, Mid-Risk, and Degen tiers.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-mono text-primary shrink-0">03</span>
                    <span><strong className="text-foreground">Earn Yield</strong> — As the AI generates returns, your cVault share value increases. Withdraw anytime with a 0.5% fee.</span>
                  </li>
                </ol>
              </div>
            </section>

            {/* Architecture */}
            <section id="architecture" className="mb-16">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-4">
                Architecture
              </h2>
              <p className="text-muted text-sm mb-6">
                CORTEX is built as a full-stack protocol with on-chain smart contracts, an off-chain AI agent, and a real-time web interface.
              </p>

              <div className="bg-card border border-border rounded-2xl p-6 font-mono text-sm text-muted leading-relaxed">
                <p className="text-foreground font-semibold mb-3">System Flow</p>
                <pre className="overflow-x-auto whitespace-pre text-xs">{`User deposits ETH/USDC
  └─► CortexVault.deposit() → mints cVault shares
        │
        ├─► Cron: /api/cron/snapshot (every 5m)
        │     └─► Reads vault state → stores in Supabase
        │
        ├─► Cron: /api/cron/ai-cycle (every 10m)
        │     ├─► collector.ts → fetch prices, TVL, sentiment
        │     ├─► analyzer.ts → Claude API analysis
        │     ├─► guardrails.ts → validate tier bounds, rate limits
        │     └─► executor.ts → vault.executeStrategy(target, calldata)
        │           ├─► Uniswap V3 (swaps)
        │           ├─► Aerodrome (LPs)
        │           ├─► Aave V3 (lending)
        │           └─► Compound V3 (lending)
        │
        ├─► Cron: /api/cron/indexer (every 5m)
        │     └─► Syncs on-chain events → Supabase
        │
        └─► Frontend reads from Supabase + contract
              └─► Real-time updates via Supabase Realtime`}</pre>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Globe, label: "Frontend", desc: "Next.js 16, React 19, TailwindCSS, Recharts" },
                  { icon: Code, label: "Contracts", desc: "Solidity 0.8.20, Foundry, OpenZeppelin" },
                  { icon: Database, label: "Database", desc: "Supabase (PostgreSQL + Realtime)" },
                  { icon: Brain, label: "AI Engine", desc: "Claude API (Anthropic SDK)" },
                  { icon: Zap, label: "DEX Layer", desc: "Uniswap V3, Aerodrome, Aave, Compound" },
                  { icon: Shield, label: "Oracle", desc: "Chainlink + CoinGecko with fallback" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
                      <Icon className="w-5 h-5 text-muted shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Smart Contracts */}
            <section id="contracts" className="mb-16">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-4">
                Smart Contracts
              </h2>
              <p className="text-muted text-sm mb-6">
                All contracts are deployed on Base mainnet and verified. Source code is in the{" "}
                <code className="bg-card-solid px-1.5 py-0.5 rounded text-xs text-foreground">contracts/</code> directory.
              </p>

              <div className="space-y-4">
                {contracts.map((c) => (
                  <div key={c.name} className="bg-card border border-border rounded-2xl p-5 hover:border-border-hover transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading text-base font-semibold text-foreground">{c.name}</h3>
                      <a
                        href={`https://basescan.org/address/${c.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        BaseScan <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs font-mono text-muted mb-2 break-all">{c.address}</p>
                    <p className="text-sm text-muted">{c.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Vault */}
            <section id="vault" className="mb-16">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-4">
                Vault (ERC-4626)
              </h2>
              <p className="text-muted text-sm mb-6">
                The CORTEX Vault follows the ERC-4626 tokenized vault standard. Users deposit assets and receive cVault shares that represent their proportional ownership of the vault.
              </p>

              <h3 className="font-heading font-semibold text-foreground mb-3">Fee Structure</h3>
              <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
                {feeStructure.map((fee, i) => (
                  <div key={fee.label} className={`flex items-center justify-between px-5 py-4 ${i < feeStructure.length - 1 ? "border-b border-border" : ""}`}>
                    <div>
                      <p className="text-sm font-medium text-foreground">{fee.label}</p>
                      <p className="text-xs text-muted mt-0.5">{fee.description}</p>
                    </div>
                    <span className="font-heading text-sm font-semibold text-foreground shrink-0 ml-4">{fee.value}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-heading font-semibold text-foreground mb-3">Allocation Tiers</h3>
              <p className="text-muted text-sm mb-4">
                The AI allocates capital across three governance-controlled tiers. $CORTEX holders vote on the allocation bands.
              </p>
              <div className="space-y-3">
                {allocationTiers.map((tier) => (
                  <div key={tier.name} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-heading text-sm font-semibold text-foreground">{tier.name}</h4>
                      <span className={`text-xs rounded-full px-2 py-0.5 ${tier.risk === "Low" ? "bg-primary/10 text-primary" : tier.risk === "Medium" ? "bg-card-solid text-muted" : "bg-card-solid text-foreground"}`}>
                        {tier.risk} Risk
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div><span className="text-muted">Target:</span> <span className="text-foreground font-medium ml-1">{tier.target}</span></div>
                      <div><span className="text-muted">Range:</span> <span className="text-foreground font-medium ml-1">{tier.range}</span></div>
                      <div><span className="text-muted">Assets:</span> <span className="text-foreground ml-1">{tier.assets}</span></div>
                      <div><span className="text-muted">Protocols:</span> <span className="text-foreground ml-1">{tier.protocols}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Agent */}
            <section id="ai-agent" className="mb-16">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-4">
                AI Agent
              </h2>
              <p className="text-muted text-sm mb-6">
                The CORTEX AI agent is an autonomous decision-making system that runs every 10 minutes.
                It uses Claude (Anthropic) to analyze market conditions and execute portfolio decisions.
              </p>

              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <h3 className="font-heading font-semibold text-foreground mb-4">Decision Cycle</h3>
                <div className="space-y-3">
                  {[
                    { step: "Collect", desc: "Fetches real-time prices from Chainlink and CoinGecko, on-chain TVL and volume data, and social sentiment from Farcaster and Twitter." },
                    { step: "Analyze", desc: "Sends market data to Claude API with system prompt defining tier rules, risk constraints, and allocation targets. Claude returns a structured decision." },
                    { step: "Validate", desc: "Guardrails check: tier allocation bounds, max trades per hour (20), minimum confidence (60%), max position size, and slippage limits." },
                    { step: "Execute", desc: "Approved trades are encoded as calldata and sent through the vault's executeStrategy() function to the target DEX protocol." },
                    { step: "Log", desc: "Full reasoning — market summary, sentiment scores, risk assessment, decision, and executed trades — is stored in Supabase for transparency." },
                  ].map((item, i) => (
                    <div key={item.step} className="flex gap-3">
                      <span className="font-mono text-primary text-xs shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <span className="text-sm font-medium text-foreground">{item.step}</span>
                        <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-3">Guardrails</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    "Core allocation: 50–90%",
                    "Mid-Risk allocation: 5–35%",
                    "Degen allocation: 0–15%",
                    "Max 20 trades per hour",
                    "Min 60% confidence to trade",
                    "Max 1.5% price impact (Core)",
                    "Max 3% price impact (Degen)",
                    "Emergency pause by governance (66% supermajority)",
                  ].map((rule) => (
                    <div key={rule} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-muted">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Governance */}
            <section id="governance" className="mb-16">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-4">
                Governance
              </h2>
              <p className="text-muted text-sm mb-6">
                CORTEX is governed by $CORTEX token holders. The protocol uses OpenZeppelin Governor
                with a timelock for all parameter changes.
              </p>

              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <h3 className="font-heading font-semibold text-foreground mb-3">Parameters</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: "Quorum", value: "4% of total supply" },
                    { label: "Voting Period", value: "3 days" },
                    { label: "Voting Delay", value: "1 day" },
                    { label: "Timelock", value: "24 hours" },
                    { label: "Proposal Threshold", value: "100,000 CORTEX" },
                  ].map((p) => (
                    <div key={p.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-muted">{p.label}</span>
                      <span className="text-foreground font-medium">{p.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-3">What Can Be Governed</h3>
                <ul className="space-y-2 text-sm text-muted">
                  <li>Allocation tier bands (Core, Mid-Risk, Degen ranges)</li>
                  <li>Fee structure (management, performance, withdrawal)</li>
                  <li>Whitelisted protocols and assets</li>
                  <li>AI trade rate limits and confidence thresholds</li>
                  <li>Max slippage parameters</li>
                  <li>Emergency pause (66% supermajority — bypasses timelock)</li>
                </ul>
              </div>
            </section>

            {/* Staking */}
            <section id="staking" className="mb-16">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-4">
                Staking
              </h2>
              <p className="text-muted text-sm mb-6">
                Stake $CORTEX tokens to earn a share of protocol fees. Lock your tokens longer for higher multipliers.
                Rewards are distributed weekly in WETH/USDC.
              </p>

              <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6">
                <div className="grid grid-cols-4 gap-4 px-5 py-3 bg-card-solid text-xs text-muted font-medium">
                  <span>Duration</span>
                  <span>Multiplier</span>
                  <span>Effective APR</span>
                  <span>Unlock</span>
                </div>
                {lockTiers.map((tier) => (
                  <div key={tier.duration} className="grid grid-cols-4 gap-4 px-5 py-3 border-t border-border text-sm">
                    <span className="text-foreground font-medium">{tier.duration}</span>
                    <span className="text-primary font-mono">{tier.multiplier}</span>
                    <span className="text-muted">{tier.apr}</span>
                    <span className="text-muted">{tier.duration === "No Lock" ? "Anytime" : `After ${tier.duration.toLowerCase()}`}</span>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-3">Fee Distribution</h3>
                <p className="text-sm text-muted mb-3">
                  Protocol fees (2% management + 20% performance) are split:
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm text-foreground font-medium">50% → Stakers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary/60" />
                    <span className="text-sm text-foreground font-medium">50% → Treasury</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Risk */}
            <section id="risk" className="mb-16">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-4">
                Risk Management
              </h2>
              <p className="text-muted text-sm mb-6">
                CORTEX tracks comprehensive risk metrics and uses multiple layers of protection.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Sharpe Ratio", desc: "Risk-adjusted return" },
                  { label: "Max Drawdown", desc: "Worst peak-to-trough" },
                  { label: "Value at Risk", desc: "95% confidence loss bound" },
                  { label: "Win Rate", desc: "Profitable trade percentage" },
                ].map((m) => (
                  <div key={m.label} className="bg-card border border-border rounded-xl p-4">
                    <p className="text-xs text-muted">{m.label}</p>
                    <p className="text-xs text-muted mt-1">{m.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-3">Safety Mechanisms</h3>
                <ul className="space-y-2 text-sm text-muted">
                  <li><strong className="text-foreground">Tier Bounds</strong> — Core never drops below 50%, Degen never exceeds 15%</li>
                  <li><strong className="text-foreground">Slippage Protection</strong> — Max 0.5% for stable pairs, 1.5% for Core, 3% for Degen</li>
                  <li><strong className="text-foreground">Rate Limiting</strong> — Max 20 trades per hour, minimum 60% AI confidence</li>
                  <li><strong className="text-foreground">Multi-Source Oracle</strong> — Chainlink + CoinGecko with 2% deviation alert</li>
                  <li><strong className="text-foreground">Emergency Brake</strong> — 66% governance supermajority can pause the AI and trigger full withdrawal</li>
                  <li><strong className="text-foreground">Transaction Simulation</strong> — Every trade is simulated before execution to catch reverts</li>
                </ul>
              </div>
            </section>

            {/* API Reference */}
            <section id="api" className="mb-16">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-4">
                API Reference
              </h2>
              <p className="text-muted text-sm mb-4">
                All endpoints are available at{" "}
                <code className="bg-card-solid px-1.5 py-0.5 rounded text-xs text-foreground">https://www.cortexprotocol.net</code>
              </p>

              <div className="bg-card border border-border rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-muted" />
                  <h3 className="font-heading font-semibold text-foreground">Authentication</h3>
                </div>
                <p className="text-sm text-muted">
                  Most endpoints are public. Token-gated endpoints require the{" "}
                  <code className="bg-card-solid px-1.5 py-0.5 rounded text-xs text-foreground">x-wallet-address</code>{" "}
                  header with a wallet holding 10,000+ $CORTEX tokens.
                </p>
              </div>

              <div className="space-y-2">
                {endpoints.map((ep, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl px-4 py-3 hover:border-border-hover transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-primary/10 text-primary text-xs font-mono font-bold rounded px-2 py-0.5 shrink-0">
                        {ep.method}
                      </span>
                      <code className="text-sm text-foreground font-mono truncate">{ep.path}</code>
                      {ep.auth !== "Public" && (
                        <span className="text-xs bg-card-solid text-muted rounded-full px-2 py-0.5 shrink-0">
                          {ep.auth}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-1 ml-[52px]">{ep.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contributing */}
            <section id="contributing" className="mb-16">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-4">
                Contributing
              </h2>
              <p className="text-muted text-sm mb-6">
                CORTEX is open source and we welcome contributions. The codebase is TypeScript
                throughout with Solidity smart contracts.
              </p>

              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <h3 className="font-heading font-semibold text-foreground mb-4">Getting Started</h3>
                <div className="bg-[#0c0c0e] rounded-xl p-4 font-mono text-sm text-muted overflow-x-auto">
                  <p><span className="text-primary">$</span> git clone https://github.com/CortexProtocolBase/Cortex-Protocol.git</p>
                  <p><span className="text-primary">$</span> cd Cortex-Protocol</p>
                  <p><span className="text-primary">$</span> npm install</p>
                  <p><span className="text-primary">$</span> cp .env.example .env.local</p>
                  <p><span className="text-primary">$</span> npm run dev</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                <h3 className="font-heading font-semibold text-foreground mb-4">Running Contract Tests</h3>
                <div className="bg-[#0c0c0e] rounded-xl p-4 font-mono text-sm text-muted overflow-x-auto">
                  <p><span className="text-primary">$</span> cd contracts</p>
                  <p><span className="text-primary">$</span> forge install</p>
                  <p><span className="text-primary">$</span> forge test</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-heading font-semibold text-foreground mb-3">Project Structure</h3>
                <div className="bg-[#0c0c0e] rounded-xl p-4 font-mono text-xs text-muted overflow-x-auto leading-relaxed">
                  <pre>{`src/
├── app/                 Pages and API routes
│   ├── api/v1/         Public REST API
│   ├── api/cron/       Automated cron jobs
│   └── [page]/         Frontend pages
├── lib/
│   ├── ai/             AI agent (collector, analyzer, executor)
│   ├── dex/            DEX adapters (Uniswap, Aerodrome, Aave, Compound)
│   ├── oracle/         Price feeds (Chainlink, CoinGecko)
│   ├── sentiment/      Social sentiment (Farcaster, Twitter)
│   ├── risk/           Risk calculators
│   ├── notifications/  Alert dispatchers
│   └── indexer/        On-chain event sync
├── hooks/              Wagmi contract hooks
└── components/         React UI components
contracts/
├── src/                Solidity contracts
├── test/               Foundry tests
└── script/             Deploy scripts`}</pre>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
