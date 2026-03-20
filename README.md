<div align="center">

<img src="public/cortex-logo.png" alt="CORTEX Protocol" width="120" />

# CORTEX PROTOCOL

**Decentralized AI-Managed Investment Vault on Base**

[![Live App](https://img.shields.io/badge/Live_App-cortexprotocol.net-3B82F6?style=for-the-badge&logo=vercel&logoColor=white)](https://www.cortexprotocol.net/)
[![Network](https://img.shields.io/badge/Network-Base_L2-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)](https://base.org)
[![Standard](https://img.shields.io/badge/Vault-ERC--4626-1a1a2e?style=for-the-badge)](https://eips.ethereum.org/EIPS/eip-4626)
[![Token](https://img.shields.io/badge/Token-%24CORTEX-60A5FA?style=for-the-badge)](https://www.cortexprotocol.net/)

---

*Autonomous AI trading. Democratic governance. Full transparency.*

[Launch App](https://www.cortexprotocol.net/) · [Twitter/X](https://x.com/CortexBase) · [GitHub](https://github.com/CortexProtocolBase/Cortex-Protocol)

</div>

---

## Overview

CORTEX is a decentralized, AI-managed investment vault protocol built natively on **Base** (Coinbase's Layer 2). Users deposit ETH or USDC into a shared vault that is autonomously managed by a multi-model AI agent. The AI executes a mixed investment strategy across the Base DeFi ecosystem — trading, providing liquidity, and farming yield — while governance over risk parameters is handled entirely by **$CORTEX** token holders.

Every trade the AI makes, along with its reasoning, is logged on-chain and displayed on a public real-time dashboard. No black boxes. No hidden allocations. Full transparency from day one.

<br />

<div align="center">

| Base L2 | ERC-4626 Vault | 2 / 20 Fee Model | Mixed Strategy |
|:-------:|:--------------:|:----------------:|:--------------:|
| Low fees, high throughput | Tokenized vault standard | Management + Performance | Core · Mid-Risk · Degen |

</div>

---

## How It Works

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────────┐
│   User       │────▶│   CORTEX Vault    │────▶│   AI Agent        │
│   Deposits   │     │   (ERC-4626)      │     │   (Multi-Model)   │
│   ETH/USDC   │     │   Issues cVault   │     │   Analyzes &      │
│              │     │   share tokens    │     │   Executes Trades │
└──────────────┘     └──────────────────┘     └───────────────────┘
                              │                         │
                              │                         ▼
                     ┌────────▼─────────┐     ┌───────────────────┐
                     │  Governance       │     │  Trade Executor   │
                     │  $CORTEX holders  │────▶│  On-chain         │
                     │  set risk params  │     │  guardrails       │
                     └──────────────────┘     └───────────────────┘
```

1. **Connect & Deposit** — Users deposit ETH or USDC and receive cVault shares proportional to the vault's total AUM.
2. **AI Manages Capital** — The AI agent continuously analyzes market data, sentiment, and on-chain metrics, then executes trades through the Trade Executor contract.
3. **Portfolio Allocation** — Capital is distributed across three risk tiers governed by token holders:
   - **Core (70%)** — WETH, cbBTC, USDC yield on Aave/Compound
   - **Mid-Risk (20%)** — Established Base tokens, Aerodrome pools
   - **Degen (10%)** — New launches, momentum plays
4. **Profit Distribution** — As the AI generates returns, cVault share value increases. Users withdraw anytime. A 2% management fee and 20% performance fee (above high-water mark) are split between the treasury and $CORTEX stakers.
5. **Governance** — $CORTEX holders vote on allocation bands, asset whitelists, fee adjustments, and can trigger an emergency pause via supermajority vote.

---

## Key Features

<table>
<tr>
<td width="50%">

### Autonomous AI Trading
A multi-model AI agent executes trades 24/7, rebalancing across DeFi protocols on Base using real-time market analysis, sentiment data from Farcaster/CT, and on-chain metrics.

</td>
<td width="50%">

### Democratic Risk Governance
$CORTEX token holders vote on risk allocation bands, asset whitelists, max position sizes, fee parameters, and emergency pause mechanisms.

</td>
</tr>
<tr>
<td width="50%">

### Full On-Chain Transparency
Every AI trade, its reasoning, and the portfolio state are logged on-chain and displayed on the public dashboard. Every decision is auditable.

</td>
<td width="50%">

### Revenue Sharing
Protocol fees (management + performance) are distributed to $CORTEX stakers weekly in WETH/USDC. Longer lock periods earn higher multipliers (up to 2.5x).

</td>
</tr>
</table>

---

## $CORTEX Token

| Parameter | Value |
|-----------|-------|
| **Name** | Cortex Protocol |
| **Symbol** | CORTEX |
| **Network** | Base (Chain ID 8453) |
| **Standard** | ERC-20 + ERC20Votes + ERC20Permit |
| **Total Supply** | 1,000,000,000 (fixed, non-mintable) |
| **Launch** | Clank.r (Base) |

### Utility

- **Governance** — Vote on risk parameters, asset whitelists, fees, upgrades, and emergency actions
- **Fee Revenue Share** — Stake $CORTEX to earn protocol fees (WETH/USDC) distributed weekly
- **Staking Multiplier** — 1x (no lock) → 1.5x (1 month) → 2x (3 months) → 2.5x (6 months)
- **Dashboard Tiers** — Access premium AI insights at 10K / 100K / 1M CORTEX thresholds
- **Proposal Creation** — Submit governance proposals with 100K+ CORTEX
- **Emergency Brake** — Supermajority (66%) can pause AI and trigger full withdrawal

---

## AI Agent Architecture

The CORTEX AI Agent is an off-chain multi-module pipeline that runs on a 10-minute cycle:

```
Data Collector → Market Analyzer → Sentiment Engine → Risk Assessor → Strategy Planner → Trade Encoder → Executor
```

| Module | Purpose | Technology |
|--------|---------|------------|
| Data Collector | Prices, TVL, liquidity, social signals | Python, aiohttp, web3.py |
| Market Analyzer | Technical indicators (RSI, MACD, Bollinger) | pandas, ta-lib, numpy |
| Sentiment Engine | Farcaster/CT sentiment scoring per asset | Claude API, NLP pipeline |
| Risk Assessor | Portfolio VaR, risk scoring, rebalance signals | Custom ML, scikit-learn |
| Strategy Planner | Trade action generation with reasoning | LangGraph, Claude API |
| Trade Executor | On-chain execution with guardrails | web3.py, AWS KMS |

### Security Guardrails

- On-chain allocation band enforcement — AI cannot exceed governance-set limits
- Whitelisted assets only — Trade Executor rejects non-approved tokens
- Rate limiting — Max 20 trades/hour enforced on-chain
- Simulation-first — Every trade simulated via `eth_call` before submission
- Kill switch — Governance can revoke AI executor role instantly
- Full audit trail — Every proposal, reasoning, and outcome stored permanently

---

## Smart Contracts

| Contract | Purpose |
|----------|---------|
| **CortexVault.sol** | ERC-4626 tokenized vault — deposits, withdrawals, share accounting |
| **CortexToken.sol** | ERC-20 governance token with vote delegation and staking |
| **TradeExecutor.sol** | Gatekeeper between AI and DeFi — validates all trades against guardrails |
| **CortexGovernor.sol** | OpenZeppelin Governor + Timelock — proposal creation, voting, execution |
| **FeeDistributor.sol** | Merkle-based fee distribution to $CORTEX stakers |
| **AssetRegistry.sol** | Governance-controlled whitelist of approved assets, protocols, and oracles |

Built on **Solidity 0.8.24+** with **OpenZeppelin 5.x** base contracts. Compiled and tested with **Foundry**.

---

## Tech Stack

<table>
<tr>
<td><strong>Frontend</strong></td>
<td>Next.js 16 · TypeScript · TailwindCSS · shadcn/ui · Recharts · Framer Motion</td>
</tr>
<tr>
<td><strong>Web3</strong></td>
<td>Wagmi v2 · Viem · Phantom & Coinbase Wallet</td>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>Next.js API Routes · Supabase (PostgreSQL) · Upstash Redis · Vercel Cron</td>
</tr>
<tr>
<td><strong>AI Agent</strong></td>
<td>Python · LangChain/LangGraph · Claude API · Custom ML Models</td>
</tr>
<tr>
<td><strong>Contracts</strong></td>
<td>Solidity 0.8.24+ · Foundry · OpenZeppelin 5.x · Base Mainnet</td>
</tr>
<tr>
<td><strong>Infrastructure</strong></td>
<td>Vercel · Supabase · AWS KMS · Cloudflare</td>
</tr>
</table>

---

## Fee Structure

| Fee | Rate | Details |
|-----|------|---------|
| Deposit | **0%** | Free |
| Management | **2%** annualized | Accrued on total AUM per block |
| Performance | **20%** | On net new profits above high-water mark only |
| Withdrawal | **0.5%** | Remains in vault (benefits remaining depositors) |

All fees are split 50/50 between the protocol treasury and $CORTEX stakers. The performance fee uses a **high-water mark mechanism** — no performance fee is charged until the vault recovers past its all-time-high share price.

---

## Development

```bash
# Clone the repository
git clone https://github.com/CortexProtocolBase/Cortex-Protocol.git
cd Cortex-Protocol

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

---

## API Endpoints

All endpoints are available at `/api/v1/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vault/stats` | Vault AUM, share price, APY, depositor count |
| GET | `/vault/user/:address` | User position, P&L, deposit history |
| GET | `/portfolio` | Current allocations, tier breakdown, risk metrics |
| GET | `/trades` | Paginated trade log with filtering |
| GET | `/trades/:id` | Single trade detail with full AI reasoning |
| GET | `/ai/insights` | AI analysis, sentiment scores, confidence |
| GET | `/ai/reasoning-feed` | AI decision log with outcomes |
| GET | `/governance/proposals` | Active and past governance proposals |
| GET | `/staking/info/:address` | Staking position, rewards, lock status |
| GET | `/performance` | Historical returns, Sharpe ratio, benchmarks |

---

## Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| **Phase 1** | Foundation — Token launch, vault contract, frontend, AI v0.1 | In Progress |
| **Phase 2** | AI Paper Trading — Full pipeline, public simulated trades, audit | Upcoming |
| **Phase 3** | Mainnet Launch — Live vault, real capital execution, deposit caps | Upcoming |
| **Phase 4** | Governance & Premium — Staking, fee distribution, token-gated tiers | Planned |
| **Phase 5** | Expansion — Multi-vault strategies, cross-chain, SDK | Planned |

---

## Security

- All contracts will be audited by a reputable firm before mainnet launch
- Built on battle-tested OpenZeppelin 5.x base contracts
- No admin keys or owner-only functions that can drain funds
- AI signing key secured via AWS KMS (hardware security module)
- Backend deployed on isolated infrastructure with encrypted storage
- All connections use TLS 1.3 with strict CSP headers

---

<div align="center">

**CORTEX Protocol**

Autonomous Intelligence · Democratic Control · Full Transparency

[Website](https://www.cortexprotocol.net/) · [Twitter/X](https://x.com/CortexBase) · [GitHub](https://github.com/CortexProtocolBase/Cortex-Protocol)

</div>
