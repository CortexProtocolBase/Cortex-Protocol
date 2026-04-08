"use client";

import { useWallet } from "@/contexts/WalletContext";
import { Wallet } from "lucide-react";

/**
 * Wraps a page's content. If the wallet is not connected,
 * blurs the background and shows a connect wallet overlay.
 */
export default function WalletGate({ children }: { children: React.ReactNode }) {
  const { connected, setShowModal } = useWallet();

  if (connected) return <>{children}</>;

  return (
    <div className="relative min-h-screen">
      {/* Blurred background — render the page content behind the overlay */}
      <div className="pointer-events-none select-none blur-[6px] opacity-40">
        {children}
      </div>

      {/* Overlay */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/60 backdrop-blur-sm">
        <div className="flex flex-col items-center text-center px-6 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-6">
            <Wallet className="w-7 h-7 text-muted" />
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-sm text-muted mb-6">
            Connect a wallet to access the CORTEX Protocol dashboard, vault, and all protocol features.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="cursor-pointer bg-foreground text-background rounded-xl px-8 py-3 font-heading font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
