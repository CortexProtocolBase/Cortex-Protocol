# CORTEX Protocol API

Base URL: `https://www.cortexprotocol.net/api/v1`

## Endpoints

### GET /vault/stats
Returns current vault TVL, share price, and depositor count.

### GET /vault/user/:address
Returns user position, P&L, and transaction history.

### GET /trades
Paginated trade history with filtering.

### GET /ai/insights
AI confidence and sentiment data. Token-gated (10K CORTEX minimum).

### GET /governance/proposals
Active and past governance proposals.

### GET /risk/metrics
Portfolio risk metrics including Sharpe ratio and VaR.
