"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Activity, BarChart3, Wallet, Bell, Settings } from "lucide-react";
const navItems = [
  { href: "/admin", label: "Overview", icon: Activity },
  { href: "/admin/treasury", label: "Treasury", icon: Wallet },
  { href: "/admin/alerts", label: "Alerts", icon: Bell },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [key, setKey] = useState("");
  if (!authed) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full">
        <div className="flex items-center gap-2 mb-6"><Shield className="w-5 h-5 text-primary" /><h1 className="font-heading text-lg font-bold">Admin Access</h1></div>
        <input type="password" placeholder="Admin key" value={key} onChange={e => setKey(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground mb-4 outline-none focus:border-primary" />
        <button onClick={() => { if (key) { localStorage.setItem("admin_key", key); setAuthed(true); } }} className="w-full bg-foreground text-background rounded-xl py-3 font-heading font-bold cursor-pointer hover:opacity-90">Enter</button>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-56 border-r border-border p-4 flex flex-col gap-1">
        <div className="flex items-center gap-2 mb-6 px-3"><Shield className="w-5 h-5 text-primary" /><span className="font-heading font-bold text-sm">CORTEX Admin</span></div>
        {navItems.map(item => { const Icon = item.icon; const active = pathname === item.href; return (
          <Link key={item.href} href={item.href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${active ? "bg-card-solid text-foreground" : "text-muted hover:text-foreground"}`}><Icon className="w-4 h-4" />{item.label}</Link>
        ); })}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
