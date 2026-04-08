-- Enable RLS on all tables
ALTER TABLE vault_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_reasoning_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE staking_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE indexer_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_alerts ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read" ON vault_snapshots FOR SELECT USING (true);
CREATE POLICY "Public read" ON trades FOR SELECT USING (true);
CREATE POLICY "Public read" ON user_positions FOR SELECT USING (true);
CREATE POLICY "Public read" ON deposits FOR SELECT USING (true);
CREATE POLICY "Public read" ON withdrawals FOR SELECT USING (true);
CREATE POLICY "Public read" ON ai_reasoning_logs FOR SELECT USING (true);
CREATE POLICY "Public read" ON governance_proposals FOR SELECT USING (true);
CREATE POLICY "Public read" ON staking_positions FOR SELECT USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_trades_tier ON trades(tier);
CREATE INDEX IF NOT EXISTS idx_deposits_wallet ON deposits(wallet_address);
CREATE INDEX IF NOT EXISTS idx_withdrawals_wallet ON withdrawals(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_positions_wallet ON user_positions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_staking_wallet ON staking_positions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_snapshots_timestamp ON vault_snapshots(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_logs_timestamp ON ai_reasoning_logs(timestamp DESC);
