"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { useAccount, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { base } from "wagmi/chains";
import WalletModal from "./WalletModal";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Vault", href: "/vault" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Trades", href: "/trades" },
  { label: "AI", href: "/ai" },
  { label: "Governance", href: "/governance" },
  { label: "Stake", href: "/stake" },
];

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const pathname = usePathname();

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== base.id;

  const walletButton = isConnected ? (
    isWrongNetwork ? (
      <button
        onClick={() => switchChain({ chainId: base.id })}
        className="cursor-pointer inline-flex items-center bg-red-500/20 text-red-400 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
      >
        Wrong Network
      </button>
    ) : (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground bg-white/[0.06] px-3 py-2 rounded-lg">
          {truncateAddress(address!)}
        </span>
        <button
          onClick={() => disconnect()}
          className="cursor-pointer text-muted hover:text-foreground transition-colors duration-300 p-2"
          aria-label="Disconnect wallet"
        >
          <LogOut size={16} />
        </button>
      </div>
    )
  ) : (
    <button
      onClick={() => setModalOpen(true)}
      className="cursor-pointer inline-flex items-center bg-foreground text-background text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300"
    >
      Connect Wallet
    </button>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="cursor-pointer flex items-center gap-2">
            <Image
              src="/cortex-logo.png"
              alt="Cortex"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="font-heading text-lg font-bold tracking-tight text-foreground">
              CORTEX
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`cursor-pointer text-sm transition-colors duration-300 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Connect Wallet + Mobile toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex">{walletButton}</div>

            {/* Mobile hamburger */}
            <button
              className="cursor-pointer md:hidden text-muted hover:text-foreground transition-colors duration-300"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`cursor-pointer text-sm px-3 py-2.5 rounded-lg transition-colors duration-300 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-2">{walletButton}</div>
            </div>
          </div>
        )}
      </nav>

      <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
