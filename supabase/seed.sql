-- ═══════════════════════════════════════════════════════════════════════
-- CORTEX Protocol — Seed Data
-- Run this in Supabase Dashboard → SQL Editor AFTER rls-policies.sql
-- ═══════════════════════════════════════════════════════════════════════

-- ─── vault_snapshots (30 days of daily snapshots for charts) ────────

INSERT INTO vault_snapshots (timestamp, total_assets, share_price, total_shares, depositor_count, core_alloc, mid_alloc, degen_alloc, idle_cash)
VALUES
  ('2026-02-19T00:00:00Z', 9800000,  1.012, 9682213,  2410, 0.70, 0.20, 0.10, 50000),
  ('2026-02-20T00:00:00Z', 9950000,  1.015, 9802956,  2425, 0.70, 0.20, 0.10, 48000),
  ('2026-02-21T00:00:00Z', 10100000, 1.019, 9911678,  2440, 0.71, 0.19, 0.10, 45000),
  ('2026-02-22T00:00:00Z', 10250000, 1.023, 10019550, 2458, 0.71, 0.19, 0.10, 42000),
  ('2026-02-23T00:00:00Z', 10380000, 1.027, 10107108, 2472, 0.70, 0.20, 0.10, 40000),
  ('2026-02-24T00:00:00Z', 10500000, 1.031, 10184288, 2490, 0.70, 0.20, 0.10, 38000),
  ('2026-02-25T00:00:00Z', 10620000, 1.034, 10270793, 2505, 0.69, 0.21, 0.10, 36000),
  ('2026-02-26T00:00:00Z', 10750000, 1.038, 10356455, 2518, 0.69, 0.21, 0.10, 35000),
  ('2026-02-27T00:00:00Z', 10880000, 1.041, 10451489, 2530, 0.70, 0.20, 0.10, 33000),
  ('2026-02-28T00:00:00Z', 10950000, 1.044, 10488506, 2545, 0.70, 0.20, 0.10, 32000),
  ('2026-03-01T00:00:00Z', 11050000, 1.047, 10553963, 2560, 0.70, 0.20, 0.10, 30000),
  ('2026-03-02T00:00:00Z', 11150000, 1.050, 10619048, 2575, 0.71, 0.19, 0.10, 28000),
  ('2026-03-03T00:00:00Z', 11280000, 1.053, 10712251, 2590, 0.71, 0.19, 0.10, 27000),
  ('2026-03-04T00:00:00Z', 11380000, 1.056, 10776515, 2605, 0.70, 0.20, 0.10, 25000),
  ('2026-03-05T00:00:00Z', 11480000, 1.058, 10850662, 2620, 0.70, 0.20, 0.10, 24000),
  ('2026-03-06T00:00:00Z', 11550000, 1.061, 10886900, 2635, 0.70, 0.20, 0.10, 22000),
  ('2026-03-07T00:00:00Z', 11650000, 1.063, 10959549, 2648, 0.69, 0.21, 0.10, 21000),
  ('2026-03-08T00:00:00Z', 11750000, 1.066, 11022327, 2660, 0.69, 0.21, 0.10, 20000),
  ('2026-03-09T00:00:00Z', 11820000, 1.068, 11067416, 2675, 0.70, 0.20, 0.10, 19000),
  ('2026-03-10T00:00:00Z', 11900000, 1.071, 11111111, 2690, 0.70, 0.20, 0.10, 18000),
  ('2026-03-11T00:00:00Z', 11980000, 1.073, 11165424, 2705, 0.70, 0.20, 0.10, 17000),
  ('2026-03-12T00:00:00Z', 12050000, 1.075, 11209302, 2720, 0.71, 0.19, 0.10, 16000),
  ('2026-03-13T00:00:00Z', 12100000, 1.077, 11234911, 2735, 0.71, 0.19, 0.10, 15000),
  ('2026-03-14T00:00:00Z', 12150000, 1.079, 11260426, 2748, 0.70, 0.20, 0.10, 14000),
  ('2026-03-15T00:00:00Z', 12200000, 1.081, 11285847, 2760, 0.70, 0.20, 0.10, 13500),
  ('2026-03-16T00:00:00Z', 12250000, 1.082, 11322551, 2775, 0.70, 0.20, 0.10, 13000),
  ('2026-03-17T00:00:00Z', 12300000, 1.084, 11346863, 2790, 0.70, 0.20, 0.10, 12000),
  ('2026-03-18T00:00:00Z', 12330000, 1.085, 11364055, 2810, 0.70, 0.20, 0.10, 11500),
  ('2026-03-19T00:00:00Z', 12370000, 1.086, 11390423, 2830, 0.70, 0.20, 0.10, 11000),
  ('2026-03-20T00:00:00Z', 12400000, 1.087, 11407543, 2847, 0.70, 0.20, 0.10, 10000);

-- ─── user_positions (sample users) ──────────────────────────────────

INSERT INTO user_positions (wallet_address, shares, deposited_value, last_updated)
VALUES
  ('0xAb3000000000000000000000000000000007f200', 22567.40, 21684.59, '2026-03-10T14:22:00Z'),
  ('0x1f40000000000000000000000000000000008a10', 15230.00, 14500.00, '2026-03-05T10:30:00Z'),
  ('0xc920000000000000000000000000000000003d40', 8450.50,  8000.00,  '2026-02-28T16:00:00Z');

-- ─── deposits ───────────────────────────────────────────────────────

INSERT INTO deposits (tx_hash, wallet_address, asset, amount, shares_received, timestamp)
VALUES
  ('0xdep001', '0xAb3000000000000000000000000000000007f200', 'USDC', 5000,    4600,   '2026-03-10T14:22:00Z'),
  ('0xdep002', '0xAb3000000000000000000000000000000007f200', 'ETH',  10000,   9250,   '2025-12-01T09:15:00Z'),
  ('0xdep003', '0xAb3000000000000000000000000000000007f200', 'USDC', 8684.59, 8757.40, '2025-10-15T11:30:00Z'),
  ('0xdep004', '0x1f40000000000000000000000000000000008a10', 'ETH',  14500,   15230,   '2026-03-05T10:30:00Z'),
  ('0xdep005', '0xc920000000000000000000000000000000003d40', 'USDC', 8000,    8450.50, '2026-02-28T16:00:00Z');

-- ─── withdrawals ────────────────────────────────────────────────────

INSERT INTO withdrawals (tx_hash, wallet_address, shares_burned, assets_received, fee_charged, timestamp)
VALUES
  ('0xwth001', '0xAb3000000000000000000000000000000007f200', 1840, 2000, 10.00, '2026-01-20T16:45:00Z'),
  ('0xwth002', '0x1f40000000000000000000000000000000008a10', 500,  540,  2.70,  '2026-03-12T08:00:00Z');

-- ─── trades ─────────────────────────────────────────────────────────

INSERT INTO trades (tx_hash, timestamp, action_type, asset_in, asset_out, amount_in, amount_out, protocol, tier, reasoning, reasoning_hash, confidence, pnl, status)
VALUES
  ('0xabc1', '2026-03-20T16:00:00Z', 'swap',      'USDC', 'WETH',  12400, 12524, 'Uniswap',   'core',     'ETH showing strong momentum on Base. Rotating 5% of idle USDC into WETH to capture upside. Confidence: 84%.', NULL, 0.84, 124,  'executed'),
  ('0xabc2', '2026-03-20T15:00:00Z', 'add_lp',    'AERO', 'USDC',  8200,  NULL,  'Aerodrome', 'mid',      'Aerodrome AERO/USDC pool APY spiked to 32%. Adding LP to capture elevated yield before normalization.', NULL, 0.88, 287,  'executed'),
  ('0xabc3', '2026-03-20T13:00:00Z', 'remove_lp', 'DEGEN','WETH',  3100,  3011,  'Uniswap',   'degen',    'DEGEN sentiment turning negative. Reducing LP exposure by 40% to lock in remaining gains.', NULL, 0.79, -89,  'executed'),
  ('0xabc4', '2026-03-20T10:00:00Z', 'stake',     'WETH', 'aWETH', 15600, 15600, 'Aave',      'core',     'Aave lending rate increased to 5.8%. Staking idle WETH for yield generation.', NULL, 0.91, 42,   'executed'),
  ('0xabc5', '2026-03-20T06:00:00Z', 'swap',      'WETH', 'USDC',  6800,  7112,  'Uniswap',   'core',     'Taking partial profit on WETH position after 8% run-up. Rebalancing Core tier toward target allocation.', NULL, 0.86, 312,  'executed'),
  ('0xabc6', '2026-03-19T12:00:00Z', 'add_lp',    'cbBTC','WETH',  22400, NULL,  'Aerodrome', 'core',     'BTC-ETH correlation stable. Adding to LP for 12.1% APY yield farming.', NULL, 0.90, 156,  'executed'),
  ('0xabc7', '2026-03-19T10:00:00Z', 'swap',      'USDC', 'DEGEN', 1800,  1755,  'Uniswap',   'degen',    'DEGEN community event detected. Small speculative position within Degen allocation budget.', NULL, 0.72, -45,  'executed'),
  ('0xabc8', '2026-03-18T14:00:00Z', 'unstake',   'aUSDC','USDC',  10200, 10289, 'Aave',      'core',     'Unstaking USDC from Aave to redeploy into higher-yield Aerodrome LP opportunity.', NULL, 0.85, 89,   'executed'),
  ('0xabc9', '2026-03-18T10:00:00Z', 'swap',      'AERO', 'USDC',  4500,  4734,  'Aerodrome', 'mid',      'AERO reward harvesting. Converting earned AERO rewards to USDC to compound.', NULL, 0.87, 234,  'executed'),
  ('0xabca', '2026-03-17T08:00:00Z', 'add_lp',    'XYZ',  'WETH',  2200,  NULL,  'Uniswap',   'degen',    'Momentum signal detected on token XYZ. Small position within Degen risk budget.', NULL, 0.68, -120, 'executed');

-- ─── ai_reasoning_logs ──────────────────────────────────────────────

INSERT INTO ai_reasoning_logs (timestamp, cycle_id, market_summary, sentiment_data, risk_assessment, decision, confidence, trades_proposed, trades_executed)
VALUES
  (
    '2026-03-20T17:30:00Z', 1042,
    'Base DeFi ecosystem showing strength with TVL up 3.2% over 24h. ETH holding above key support with bullish structure. Aerodrome volumes elevated post-incentive refresh. Degen sector mixed — DEGEN token under distribution pressure while newer launches showing momentum. Overall sentiment leans constructive; maintaining current allocation with slight risk-on bias.',
    '{"ETH": 0.72, "USDC": 0.1, "AERO": 0.45, "cbBTC": 0.61, "DEGEN": -0.23, "Overall": 0.52}',
    '{"volatility": 0.121, "maxDrawdown": -0.083, "sharpeRatio": 2.4, "regime": "Bullish"}',
    'hold', 0.87, '[]', '[]'
  ),
  (
    '2026-03-20T17:00:00Z', 1041,
    'ETH momentum score crossed 0.7 threshold. Executing rotation from USDC into WETH within Core allocation budget. Market structure remains constructive.',
    '{"ETH": 0.71, "USDC": 0.1, "AERO": 0.44, "cbBTC": 0.60, "DEGEN": -0.20, "Overall": 0.50}',
    '{"volatility": 0.118, "maxDrawdown": -0.079, "sharpeRatio": 2.3, "regime": "Bullish"}',
    'trade', 0.84,
    '[{"action": "swap", "from": "USDC", "to": "WETH", "amount": 12400}]',
    '[{"action": "swap", "from": "USDC", "to": "WETH", "amount": 12400, "txHash": "0xabc1"}]'
  ),
  (
    '2026-03-20T16:30:00Z', 1040,
    'Market regime still Bullish. Aave/Compound rates stable. DEGEN sentiment declining but position small enough to hold through volatility.',
    '{"ETH": 0.70, "USDC": 0.1, "AERO": 0.43, "cbBTC": 0.59, "DEGEN": -0.18, "Overall": 0.49}',
    '{"volatility": 0.115, "maxDrawdown": -0.078, "sharpeRatio": 2.3, "regime": "Bullish"}',
    'hold', 0.86, '[]', '[]'
  ),
  (
    '2026-03-20T16:00:00Z', 1039,
    'Core tier drifted to 67.2% (target 70%). Rebalancing: moving $8.2k from USDC reserves into Aerodrome AERO/USDC LP to restore tier balance.',
    '{"ETH": 0.69, "USDC": 0.1, "AERO": 0.46, "cbBTC": 0.58, "DEGEN": -0.15, "Overall": 0.48}',
    '{"volatility": 0.112, "maxDrawdown": -0.075, "sharpeRatio": 2.2, "regime": "Bullish"}',
    'rebalance', 0.82,
    '[{"action": "add_lp", "pool": "AERO/USDC", "amount": 8200}]',
    '[{"action": "add_lp", "pool": "AERO/USDC", "amount": 8200, "txHash": "0xabc2"}]'
  ),
  (
    '2026-03-20T13:00:00Z', 1038,
    'DEGEN sentiment score dropped below -0.2 threshold. Removing 40% of DEGEN/WETH LP position ($3.1k) to secure remaining gains before further decline.',
    '{"ETH": 0.68, "USDC": 0.1, "AERO": 0.42, "cbBTC": 0.57, "DEGEN": -0.25, "Overall": 0.45}',
    '{"volatility": 0.125, "maxDrawdown": -0.085, "sharpeRatio": 2.1, "regime": "Bullish"}',
    'trade', 0.79,
    '[{"action": "remove_lp", "pool": "DEGEN/WETH", "amount": 3100}]',
    '[{"action": "remove_lp", "pool": "DEGEN/WETH", "amount": 3100, "txHash": "0xabc3"}]'
  );

-- ─── governance_proposals ───────────────────────────────────────────

INSERT INTO governance_proposals (id, proposal_id, proposer, title, description, votes_for, votes_against, status, created_at, voting_ends_at)
VALUES
  (
    'PROP-001', 1,
    '0xAb3000000000000000000000000000000007f200',
    'Adjust Core Allocation Band to 60-85%',
    'This proposal adjusts the Core tier allocation band from 50-90% to 60-85%, tightening the range to reduce volatility while maintaining competitive yields. The AI agent would operate within narrower bounds, reducing tail risk.',
    268000000, 132000000, 'active',
    '2026-03-18T10:00:00Z', '2026-03-23T10:00:00Z'
  ),
  (
    'PROP-002', 2,
    '0x1f40000000000000000000000000000000008a10',
    'Increase AI Trade Rate to 30/hour',
    'Increase the maximum AI trade rate from 20 to 30 per hour to allow faster rebalancing during volatile markets. This would enable the agent to respond more quickly to rapid market movements.',
    216000000, 184000000, 'active',
    '2026-03-16T14:00:00Z', '2026-03-26T14:00:00Z'
  ),
  (
    'PROP-003', 3,
    '0xc920000000000000000000000000000000003d40',
    'Reduce Performance Fee to 15%',
    'Lower the performance fee from 20% to 15% to attract more depositors and remain competitive with other DeFi vault protocols. The reduced fee would still provide significant protocol revenue at current TVL.',
    312000000, 88000000, 'passed',
    '2026-03-01T09:00:00Z', '2026-03-04T09:00:00Z'
  );

-- ─── staking_positions ──────────────────────────────────────────────

INSERT INTO staking_positions (wallet_address, amount, lock_duration, multiplier, rewards_claimed, staked_at, unlocks_at)
VALUES
  ('0xAb3000000000000000000000000000000007f200', 25000,  90,  2.0, 0.145, '2026-02-14T00:00:00Z', '2026-05-15T00:00:00Z'),
  ('0x1f40000000000000000000000000000000008a10', 50000,  180, 2.5, 0.320, '2026-01-10T00:00:00Z', '2026-07-10T00:00:00Z'),
  ('0xc920000000000000000000000000000000003d40', 10000,  30,  1.5, 0.052, '2026-03-01T00:00:00Z', '2026-03-31T00:00:00Z');
