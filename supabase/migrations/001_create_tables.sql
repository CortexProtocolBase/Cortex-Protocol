-- Vault Snapshots
CREATE TABLE IF NOT EXISTS vault_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  total_assets NUMERIC NOT NULL,
  share_price NUMERIC NOT NULL DEFAULT 1.0,
  total_shares NUMERIC NOT NULL DEFAULT 0,
  depositor_count INTEGER NOT NULL DEFAULT 0,
  core_alloc NUMERIC NOT NULL DEFAULT 70,
  mid_alloc NUMERIC NOT NULL DEFAULT 20,
  degen_alloc NUMERIC NOT NULL DEFAULT 10,
  idle_cash NUMERIC NOT NULL DEFAULT 0
);

-- Trades
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  action_type TEXT NOT NULL CHECK (action_type IN ('swap', 'add_lp', 'remove_lp', 'stake', 'unstake')),
  asset_in TEXT NOT NULL,
  asset_out TEXT,
  amount_in NUMERIC NOT NULL,
  amount_out NUMERIC,
  protocol TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('core', 'mid', 'degen')),
  reasoning TEXT,
  reasoning_hash TEXT,
  confidence NUMERIC,
  pnl NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'completed'
);

-- User Positions
CREATE TABLE IF NOT EXISTS user_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  shares NUMERIC NOT NULL DEFAULT 0,
  deposited_value NUMERIC NOT NULL DEFAULT 0,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Deposits
CREATE TABLE IF NOT EXISTS deposits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash TEXT UNIQUE,
  wallet_address TEXT NOT NULL,
  asset TEXT NOT NULL DEFAULT 'USDC',
  amount NUMERIC NOT NULL,
  shares_received NUMERIC NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Withdrawals
CREATE TABLE IF NOT EXISTS withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tx_hash TEXT UNIQUE,
  wallet_address TEXT NOT NULL,
  shares_burned NUMERIC NOT NULL,
  assets_received NUMERIC NOT NULL,
  fee_charged NUMERIC DEFAULT 0,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
