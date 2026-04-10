# Wallet Integration

## Supported Wallets
- Phantom
- MetaMask
- Coinbase Wallet

## Connection Flow
1. User clicks Connect Wallet
2. WalletModal shows available wallets
3. Provider requests accounts via EIP-1193
4. WalletContext stores state + localStorage
5. Event listeners track account/chain changes

## Disconnect
- Clears localStorage
- Resets all context state
- Greys out navigation links
