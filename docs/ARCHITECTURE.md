# CORTEX Protocol Architecture

## Stack
- Frontend: Next.js 16, React 19, TailwindCSS
- Smart Contracts: Solidity 0.8.20, Foundry
- Database: Supabase (PostgreSQL + Realtime)
- AI: Claude API via Anthropic SDK
- Chain: Base L2 (Chain ID 8453)

## Key Modules
- `/src/lib/dex/` - DEX integration (Uniswap, Aerodrome, Aave, Compound)
- `/src/lib/oracle/` - Price feeds (Chainlink + CoinGecko)
- `/src/lib/sentiment/` - Social sentiment (Farcaster, Twitter, on-chain)
- `/src/lib/ai/` - AI agent with Claude reasoning
- `/src/lib/risk/` - Risk metrics and assessment
- `/src/lib/notifications/` - Multi-channel notifications
