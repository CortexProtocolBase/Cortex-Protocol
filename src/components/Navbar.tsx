"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

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
  const pathname = usePathname();

  return (
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
          <button className="cursor-pointer hidden md:inline-flex items-center bg-foreground text-background text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity duration-300">
            Connect Wallet
          </button>

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
            <button className="cursor-pointer mt-2 bg-foreground text-background text-sm font-medium px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity duration-300">
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
