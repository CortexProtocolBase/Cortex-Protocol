"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, ExternalLink, Settings, Copy, Check } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

const navLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Vault", href: "/vault" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Trades", href: "/trades" },
  { label: "AI", href: "/ai" },
  { label: "Governance", href: "/governance" },
  { label: "Stake", href: "/stake" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const {
    connected,
    walletAddress,
    fullWalletAddress,
    networkStatus,
    disconnect,
    setShowModal,
  } = useWallet();

  // Close dropdown on click outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const handleCopy = () => {
    if (!fullWalletAddress) return;
    navigator.clipboard.writeText(fullWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const walletButton = connected ? (
    networkStatus === "wrong_network" ? (
      <button
        onClick={() => setShowModal(true)}
        className="cursor-pointer inline-flex items-center bg-red-500/20 text-red-400 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
      >
        Wrong Network
      </button>
    ) : (
      <div className="relative" ref={dropdownRef}>
        {/* Wallet address button */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="cursor-pointer flex items-center gap-2 text-sm font-medium text-foreground bg-white/[0.06] px-3 py-2 rounded-lg hover:bg-white/[0.08] transition-colors duration-200"
        >
          <span className="font-mono">{walletAddress}</span>
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-[#0e0e11] border border-border rounded-xl shadow-xl overflow-hidden z-50">
            {/* Copy Address */}
            <button
              onClick={handleCopy}
              className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm text-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
            >
              {copied ? <Check size={15} className="text-primary" /> : <Copy size={15} />}
              {copied ? "Copied!" : "Copy Address"}
            </button>

            {/* BaseScan */}
            <a
              href={`https://basescan.org/address/${fullWalletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setDropdownOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted hover:text-foreground hover:bg-white/[0.04] transition-colors"
            >
              <ExternalLink size={15} />
              View on BaseScan
            </a>

            {/* Settings (greyed out) */}
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-muted/40 cursor-default">
              <Settings size={15} />
              Settings
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Disconnect */}
            <button
              onClick={() => {
                setDropdownOpen(false);
                disconnect();
              }}
              className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/[0.04] transition-colors"
            >
              <LogOut size={15} />
              Disconnect
            </button>
          </div>
        )}
      </div>
    )
  ) : (
    <button
      onClick={() => setShowModal(true)}
      className="cursor-pointer inline-flex items-center bg-foreground text-background text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300"
    >
      Connect Wallet
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="cursor-pointer flex items-center gap-2">
          <Image
            src="/transparentcortex.png"
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
            return connected ? (
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
            ) : (
              <span
                key={link.href}
                className="text-sm text-muted/40 cursor-default select-none"
              >
                {link.label}
              </span>
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
              return connected ? (
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
              ) : (
                <span
                  key={link.href}
                  className="text-sm px-3 py-2.5 text-muted/40 cursor-default select-none"
                >
                  {link.label}
                </span>
              );
            })}
            <div className="mt-2">{walletButton}</div>
          </div>
        </div>
      )}
    </nav>
  );
}
