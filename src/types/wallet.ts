export type WalletType = 'phantom' | 'metamask' | 'coinbase';

export interface EVMProvider {
  isPhantom?: boolean;
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  selectedAddress?: string | null;
  isConnected?: boolean;
}

// Window type augmentation is handled in contexts/WalletContext.tsx
// to avoid conflicts with other type declarations

export interface WalletInfo {
  type: WalletType;
  name: string;
  desc: string;
  installUrl: string;
}
