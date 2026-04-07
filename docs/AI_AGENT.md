# AI Agent

## Overview
The CORTEX AI agent runs every 10 minutes as a cron job. It uses Claude (claude-sonnet) to analyze market conditions and make portfolio decisions.

## Decision Flow
1. Collect market data (prices, TVL, volume)
2. Analyze sentiment (Farcaster, Twitter, on-chain)
3. Assess risk (volatility, drawdown, exposure)
4. Generate decision: HOLD, TRADE, or REBALANCE
5. Validate against guardrails (tier bounds, rate limits, slippage)
6. Execute trades via DEX router
7. Log reasoning to Supabase

## Guardrails
- Max 20 trades per hour
- Core: 50-90% allocation
- Mid: 5-35% allocation
- Degen: 0-15% allocation
- Max 1.5% price impact (core), 3% (degen)
- Confidence threshold: 60%
