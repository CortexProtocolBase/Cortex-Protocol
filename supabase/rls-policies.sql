-- ═══════════════════════════════════════════════════════════════════════
-- CORTEX Protocol — RLS Policies (Public Read Access)
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════

-- Enable RLS and add public read policy for each table.
-- DROP POLICY IF EXISTS ensures idempotency (safe to re-run).

-- vault_snapshots
ALTER TABLE vault_snapshots ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON vault_snapshots;
CREATE POLICY "Public read" ON vault_snapshots FOR SELECT USING (true);

-- user_positions
ALTER TABLE user_positions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON user_positions;
CREATE POLICY "Public read" ON user_positions FOR SELECT USING (true);

-- deposits
ALTER TABLE deposits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON deposits;
CREATE POLICY "Public read" ON deposits FOR SELECT USING (true);

-- withdrawals
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON withdrawals;
CREATE POLICY "Public read" ON withdrawals FOR SELECT USING (true);

-- trades
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON trades;
CREATE POLICY "Public read" ON trades FOR SELECT USING (true);

-- ai_reasoning_logs
ALTER TABLE ai_reasoning_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON ai_reasoning_logs;
CREATE POLICY "Public read" ON ai_reasoning_logs FOR SELECT USING (true);

-- governance_proposals
ALTER TABLE governance_proposals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON governance_proposals;
CREATE POLICY "Public read" ON governance_proposals FOR SELECT USING (true);

-- staking_positions
ALTER TABLE staking_positions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read" ON staking_positions;
CREATE POLICY "Public read" ON staking_positions FOR SELECT USING (true);
