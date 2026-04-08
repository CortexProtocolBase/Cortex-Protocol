"use client";

import { useWallet } from "@/contexts/WalletContext";
import { X, ExternalLink, Loader2 } from "lucide-react";
import type { WalletType } from "@/types/wallet";

/* ── Wallet definitions ── */

const wallets: {
  type: WalletType;
  name: string;
  desc: string;
  installUrl: string;
}[] = [
  {
    type: "phantom",
    name: "Phantom",
    desc: "Multi-chain wallet for Base",
    installUrl: "https://phantom.app/",
  },
  {
    type: "metamask",
    name: "MetaMask",
    desc: "The most popular EVM wallet",
    installUrl: "https://metamask.io/download/",
  },
  {
    type: "coinbase",
    name: "Coinbase Wallet",
    desc: "Self-custody wallet by Coinbase",
    installUrl: "https://www.coinbase.com/wallet/downloads",
  },
];

const isInstalled = (type: WalletType): boolean => {
  if (typeof window === "undefined") return false;
  const w = window as any;
  if (type === "phantom") return !!w.phantom?.ethereum;
  if (type === "metamask")
    return !!w.ethereum?.isMetaMask && !w.ethereum?.isPhantom;
  if (type === "coinbase")
    return !!w.coinbaseWalletExtension || !!w.ethereum?.isCoinbaseWallet;
  return false;
};

/* ── Wallet icons ── */

function PhantomIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="512" height="512" rx="105" fill="#AB9FF2" />
      <path
        d="M9 402.313C9 458.146 37.7123 471 67.5731 471C130.74 471 178.211 413.56 206.541 368.171C203.095 378.212 201.181 388.254 201.181 397.895C201.181 424.405 215.729 443.284 244.441 443.284C283.872 443.284 325.984 407.133 347.805 368.171C346.274 373.794 345.508 379.016 345.508 383.836C345.508 402.313 355.462 413.962 375.752 413.962C439.684 413.962 504 295.467 504 191.834C504 111.097 464.951 40 366.947 40C194.673 40 9 260.119 9 402.313ZM307.608 182.997C307.608 162.913 318.327 148.855 334.023 148.855C349.336 148.855 360.056 162.913 360.056 182.997C360.056 203.081 349.336 217.541 334.023 217.541C318.327 217.541 307.608 203.081 307.608 182.997ZM389.534 182.997C389.534 162.913 400.253 148.855 415.949 148.855C431.262 148.855 441.981 162.913 441.981 182.997C441.981 203.081 431.262 217.541 415.949 217.541C400.253 217.541 389.534 203.081 389.534 182.997Z"
        fill="white"
      />
    </svg>
  );
}

function MetaMaskIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 318 318"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M274.1 35.5L174.6 109.4L193 65.8L274.1 35.5Z" fill="#E2761B" />
      <path d="M44.4 35.5L143.1 110.1L125.6 65.8L44.4 35.5Z" fill="#E4761B" />
      <path d="M238.3 206.8L211.8 247.4L268.5 263L284.8 207.7L238.3 206.8Z" fill="#E4761B" />
      <path d="M33.9 207.7L50.1 263L106.8 247.4L80.3 206.8L33.9 207.7Z" fill="#E4761B" />
      <path d="M103.6 138.2L87.8 162.1L143.8 164.6L141.9 104.4L103.6 138.2Z" fill="#E4761B" />
      <path d="M214.9 138.2L176 103.7L174.6 164.6L230.5 162.1L214.9 138.2Z" fill="#E4761B" />
      <path d="M106.8 247.4L140.6 230.9L111.4 208.1L106.8 247.4Z" fill="#E4761B" />
      <path d="M177.9 230.9L211.8 247.4L207.1 208.1L177.9 230.9Z" fill="#E4761B" />
      <path d="M211.8 247.4L177.9 230.9L180.6 253.4L180.3 262.3L211.8 247.4Z" fill="#D7C1B3" />
      <path d="M106.8 247.4L138.3 262.3L138.1 253.4L140.6 230.9L106.8 247.4Z" fill="#D7C1B3" />
      <path d="M138.8 193.5L110.6 185.2L130.5 176.1L138.8 193.5Z" fill="#233447" />
      <path d="M179.7 193.5L188 176.1L208 185.2L179.7 193.5Z" fill="#233447" />
      <path d="M106.8 247.4L111.6 206.8L80.3 207.7L106.8 247.4Z" fill="#CD6116" />
      <path d="M207 206.8L211.8 247.4L238.3 207.7L207 206.8Z" fill="#CD6116" />
      <path d="M230.5 162.1L174.6 164.6L179.8 193.5L188.1 176.1L208.1 185.2L230.5 162.1Z" fill="#CD6116" />
      <path d="M110.6 185.2L130.6 176.1L138.8 193.5L144 164.6L87.8 162.1L110.6 185.2Z" fill="#CD6116" />
      <path d="M87.8 162.1L111.4 208.1L110.6 185.2L87.8 162.1Z" fill="#E4751F" />
      <path d="M208.1 185.2L207.1 208.1L230.5 162.1L208.1 185.2Z" fill="#E4751F" />
      <path d="M144 164.6L138.8 193.5L145.4 228.4L146.9 182.7L144 164.6Z" fill="#E4751F" />
      <path d="M174.6 164.6L171.9 182.6L173.1 228.4L179.8 193.5L174.6 164.6Z" fill="#E4751F" />
      <path d="M179.8 193.5L173.1 228.4L177.9 230.9L207.1 208.1L208.1 185.2L179.8 193.5Z" fill="#F6851B" />
      <path d="M110.6 185.2L111.4 208.1L140.6 230.9L145.4 228.4L138.8 193.5L110.6 185.2Z" fill="#F6851B" />
      <path d="M180.3 262.3L180.6 253.4L178.1 251.2H140.4L138.1 253.4L138.3 262.3L106.8 247.4L117.8 256.4L140.1 271.9H178.4L200.8 256.4L211.8 247.4L180.3 262.3Z" fill="#C0AD9E" />
      <path d="M177.9 230.9L173.1 228.4H145.4L140.6 230.9L138.1 253.4L140.4 251.2H178.1L180.6 253.4L177.9 230.9Z" fill="#161616" />
      <path d="M280.3 31.2L290.9 80.7L279.1 126L287.4 132.1L278.8 138.8L287.4 145.5L278.8 153.4L286.2 158.7L265.5 182.7L211.8 164.9L211.3 164.6L193 148.5L280.3 31.2Z" fill="#763D16" />
      <path d="M37.7 31.2L125 148.5L106.8 164.6L106.2 164.9L52.5 182.7L31.8 158.7L39.2 153.4L30.6 145.5L39.2 138.8L30.6 132.1L39.2 126L27.1 80.7L37.7 31.2Z" fill="#763D16" />
      <path d="M265.5 182.7L211.8 164.9L230.5 162.1L207.1 208.1L238.3 207.7L265.5 182.7Z" fill="#F6851B" />
      <path d="M52.5 182.7L80.3 207.7L111.4 208.1L87.8 162.1L106.8 164.9L52.5 182.7Z" fill="#F6851B" />
    </svg>
  );
}

function CoinbaseIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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

const walletIcons: Record<WalletType, () => React.ReactElement> = {
  phantom: PhantomIcon,
  metamask: MetaMaskIcon,
  coinbase: CoinbaseIcon,
};

/* ── Modal ── */

export default function WalletModal() {
  const { showModal, setShowModal, connect, connecting } = useWallet();

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !connecting && setShowModal(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 bg-[#0e0e11] border border-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-heading text-base font-bold tracking-tight text-foreground">
              Connect Wallet
            </h3>
            <p className="text-xs text-muted mt-0.5">
              Select a wallet to connect on Base
            </p>
          </div>
          <button
            onClick={() => !connecting && setShowModal(false)}
            className="cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition text-muted hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Wallet list */}
        <div className="p-4 space-y-2">
          {wallets.map((w) => {
            const installed = isInstalled(w.type);
            const Icon = walletIcons[w.type];
            return (
              <button
                key={w.type}
                onClick={() => connect(w.type)}
                disabled={connecting}
                className="cursor-pointer w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-white/[0.02] hover:bg-white/[0.06] hover:border-border-hover transition-all group disabled:opacity-60"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center ring-1 ring-border group-hover:ring-primary/30 transition overflow-hidden shrink-0">
                  <Icon />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {w.name}
                    </span>
                    {installed ? (
                      <span className="text-[9px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                        Detected
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono bg-card-solid text-muted px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        Install <ExternalLink size={8} />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted mt-0.5">{w.desc}</p>
                </div>
                {connecting && (
                  <Loader2 size={16} className="animate-spin text-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Network badge */}
        <div className="px-5 pb-2">
          <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-primary/5 border border-primary/10">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[10px] font-mono text-primary font-medium">
              Base Network (ETH)
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 pt-1">
          <p className="text-[10px] text-muted text-center leading-relaxed">
            By connecting, you agree to the Terms of Service. Your keys never
            leave your wallet.
          </p>
        </div>
      </div>
    </div>
  );
}
