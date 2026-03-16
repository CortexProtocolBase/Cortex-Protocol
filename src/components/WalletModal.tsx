"use client";

import { useEffect } from "react";
import { useConnect, useAccount } from "wagmi";
import { X } from "lucide-react";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WalletModal({ open, onClose }: WalletModalProps) {
  const { connect, connectors, isPending, error } = useConnect();
  const { isConnected } = useAccount();

  // Auto-close on successful connect
  useEffect(() => {
    if (isConnected && open) onClose();
  }, [isConnected, open, onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const phantomConnector = connectors.find((c) => c.id === "phantom");
  const coinbaseConnector = connectors.find(
    (c) => c.id === "coinbaseWalletSDK"
  );

  const hasPhantom =
    typeof window !== "undefined" && !!window.phantom?.ethereum;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0e0e11] border border-border rounded-xl p-6 max-w-sm w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-lg font-bold text-foreground">
            Connect Wallet
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-muted hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Wallet options */}
        <div className="flex flex-col gap-3">
          {/* Phantom */}
          {hasPhantom ? (
            <button
              onClick={() => phantomConnector && connect({ connector: phantomConnector })}
              disabled={isPending}
              className="cursor-pointer flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-border bg-white/[0.03] hover:bg-white/[0.06] transition-colors disabled:opacity-50"
            >
              <svg width="24" height="24" viewBox="0 0 128 128" fill="none">
                <rect width="128" height="128" rx="26" fill="#AB9FF2" />
                <path
                  d="M110.5 64.7C110.5 93.4 87.2 107.5 64 107.5C35.3 107.5 17.5 88.4 17.5 64C17.5 39.6 35.3 20.5 64 20.5C87.2 20.5 110.5 36 110.5 64.7Z"
                  fill="url(#phantom-grad)"
                />
                <path
                  d="M44.4 65.8C44.4 69.2 41.7 72 38.3 72C34.9 72 32.2 69.2 32.2 65.8C32.2 62.4 34.9 59.6 38.3 59.6C41.7 59.6 44.4 62.4 44.4 65.8Z"
                  fill="white"
                />
                <path
                  d="M66.4 65.8C66.4 69.2 63.7 72 60.3 72C56.9 72 54.2 69.2 54.2 65.8C54.2 62.4 56.9 59.6 60.3 59.6C63.7 59.6 66.4 62.4 66.4 65.8Z"
                  fill="white"
                />
                <defs>
                  <linearGradient id="phantom-grad" x1="64" y1="20.5" x2="64" y2="107.5">
                    <stop stopColor="#534BB1" />
                    <stop offset="1" stopColor="#551BF9" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-sm font-medium text-foreground">
                {isPending ? "Connecting…" : "Phantom"}
              </span>
            </button>
          ) : (
            <a
              href="https://phantom.app/download"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-border bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 128 128" fill="none">
                <rect width="128" height="128" rx="26" fill="#AB9FF2" />
                <path
                  d="M110.5 64.7C110.5 93.4 87.2 107.5 64 107.5C35.3 107.5 17.5 88.4 17.5 64C17.5 39.6 35.3 20.5 64 20.5C87.2 20.5 110.5 36 110.5 64.7Z"
                  fill="url(#phantom-grad2)"
                />
                <path
                  d="M44.4 65.8C44.4 69.2 41.7 72 38.3 72C34.9 72 32.2 69.2 32.2 65.8C32.2 62.4 34.9 59.6 38.3 59.6C41.7 59.6 44.4 62.4 44.4 65.8Z"
                  fill="white"
                />
                <path
                  d="M66.4 65.8C66.4 69.2 63.7 72 60.3 72C56.9 72 54.2 69.2 54.2 65.8C54.2 62.4 56.9 59.6 60.3 59.6C63.7 59.6 66.4 62.4 66.4 65.8Z"
                  fill="white"
                />
                <defs>
                  <linearGradient id="phantom-grad2" x1="64" y1="20.5" x2="64" y2="107.5">
                    <stop stopColor="#534BB1" />
                    <stop offset="1" stopColor="#551BF9" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-sm font-medium text-muted">
                Install Phantom
              </span>
            </a>
          )}

          {/* Coinbase Wallet */}
          <button
            onClick={() => coinbaseConnector && connect({ connector: coinbaseConnector })}
            disabled={isPending}
            className="cursor-pointer flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-border bg-white/[0.03] hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <svg width="24" height="24" viewBox="0 0 128 128" fill="none">
              <rect width="128" height="128" rx="26" fill="#0052FF" />
              <circle cx="64" cy="64" r="36" fill="white" />
              <rect x="50" y="50" width="28" height="28" rx="4" fill="#0052FF" />
            </svg>
            <span className="text-sm font-medium text-foreground">
              {isPending ? "Connecting…" : "Coinbase Wallet"}
            </span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 text-xs text-red-400 text-center">
            {error.message.length > 120
              ? error.message.slice(0, 120) + "…"
              : error.message}
          </p>
        )}
      </div>
    </div>
  );
}
