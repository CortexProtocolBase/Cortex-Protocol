-- AI Reasoning Logs
CREATE TABLE IF NOT EXISTS ai_reasoning_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cycle_id INTEGER,
  market_summary TEXT,
  sentiment_data JSONB,
  risk_assessment JSONB,
  decision TEXT NOT NULL CHECK (decision IN ('hold', 'trade', 'rebalance')),
  confidence NUMERIC NOT NULL,
  trades_proposed JSONB,
  trades_executed JSONB
);

-- Governance Proposals
CREATE TABLE IF NOT EXISTS governance_proposals (
  id TEXT PRIMARY KEY,
  proposal_id INTEGER,
  proposer TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  votes_for NUMERIC NOT NULL DEFAULT 0,
  votes_against NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  voting_ends_at TIMESTAMPTZ NOT NULL
);

-- Staking Positions
CREATE TABLE IF NOT EXISTS staking_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  lock_duration INTEGER NOT NULL DEFAULT 0,
  multiplier NUMERIC NOT NULL DEFAULT 1.0,
  rewards_claimed NUMERIC NOT NULL DEFAULT 0,
  staked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unlocks_at TIMESTAMPTZ
);
