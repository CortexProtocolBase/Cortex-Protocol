"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
const navLinks = [
  { href: "/vault", label: "Vault" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/trades", label: "Trades" },
  { href: "/strategy", label: "Strategy" },
  { href: "/ai", label: "AI" },
  { href: "/governance", label: "Governance" },
  { href: "/stake", label: "Stake" },
  { href: "/risk", label: "Risk" },
  { href: "/docs", label: "Docs" },
];
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} className="text-muted hover:text-foreground cursor-pointer p-2"><Menu className="w-5 h-5" /></button>
      {open && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-heading font-bold text-foreground">CORTEX</span>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-foreground cursor-pointer p-2"><X className="w-5 h-5" /></button>
          </div>
          <nav className="p-4 space-y-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`block px-4 py-3 rounded-xl text-sm transition-colors ${pathname === link.href ? "bg-card-solid text-foreground font-medium" : "text-muted hover:text-foreground"}`}>{link.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
