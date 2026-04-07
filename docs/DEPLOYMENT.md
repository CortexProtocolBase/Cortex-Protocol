# Deployment Guide

## Prerequisites
- Node.js 20+
- Foundry (for contracts)
- Vercel CLI
- Supabase project

## Environment Variables
See `.env.example` for all required variables.

## Deploy Frontend
```bash
npm install
npx vercel --prod
```

## Deploy Contracts
```bash
cd contracts
forge script script/Deploy.s.sol --rpc-url $BASE_RPC_URL --broadcast
```

## Verify Contracts
```bash
forge verify-contract $ADDRESS src/CortexVault.sol:CortexVault --chain base
```
