"use client";

import { useEffect } from "react";
import { useConnect, useAccount } from "wagmi";
import { X } from "lucide-react";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

function PhantomIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="105" fill="#AB9FF2" />
      <path
        d="M9 402.313C9 458.146 37.7123 471 67.5731 471C130.74 471 178.211 413.56 206.541 368.171C203.095 378.212 201.181 388.254 201.181 397.895C201.181 424.405 215.729 443.284 244.441 443.284C283.872 443.284 325.984 407.133 347.805 368.171C346.274 373.794 345.508 379.016 345.508 383.836C345.508 402.313 355.462 413.962 375.752 413.962C439.684 413.962 504 295.467 504 191.834C504 111.097 464.951 40 366.947 40C194.673 40 9 260.119 9 402.313ZM307.608 182.997C307.608 162.913 318.327 148.855 334.023 148.855C349.336 148.855 360.056 162.913 360.056 182.997C360.056 203.081 349.336 217.541 334.023 217.541C318.327 217.541 307.608 203.081 307.608 182.997ZM389.534 182.997C389.534 162.913 400.253 148.855 415.949 148.855C431.262 148.855 441.981 162.913 441.981 182.997C441.981 203.081 431.262 217.541 415.949 217.541C400.253 217.541 389.534 203.081 389.534 182.997Z"
        fill="white"
      />
    </svg>
  );
}

function CoinbaseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1024" height="1024" rx="200" fill="#0052FF" />
      <circle cx="512" cy="512" r="350" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M437 437C437 421.536 449.536 409 465 409H559C574.464 409 587 421.536 587 437V587C587 602.464 574.464 615 559 615H465C449.536 615 437 602.464 437 587V437Z"
        fill="#0052FF"
      />
    </svg>
  );
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
              <PhantomIcon />
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
              <PhantomIcon />
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
            <CoinbaseIcon />
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
