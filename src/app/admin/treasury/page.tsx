"use client";
import { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
interface Balance { asset: string; balance: number; }
export default function TreasuryPage() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [treasury, setTreasury] = useState("");
  useEffect(() => {
    const key = localStorage.getItem("admin_key") || "";
    fetch("/api/admin/treasury", { headers: { Authorization: `Bearer ${key}` } })
      .then(r => r.json()).then(d => { setBalances(d.data?.balances || []); setTreasury(d.data?.treasury || ""); });
  }, []);
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-2">Treasury</h1>
      <p className="text-muted text-sm mb-6 font-mono">{treasury}</p>
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="grid grid-cols-3 gap-4 text-xs text-muted pb-3 border-b border-border"><span>Asset</span><span>Balance</span><span>Value</span></div>
        {balances.map(b => (
          <div key={b.asset} className="grid grid-cols-3 gap-4 py-3 border-b border-border last:border-0">
            <span className="text-sm text-foreground font-medium flex items-center gap-2"><Wallet className="w-4 h-4 text-muted" />{b.asset}</span>
            <span className="text-sm text-foreground">{b.balance.toLocaleString()}</span>
            <span className="text-sm text-muted">—</span>
          </div>
        ))}
      </div>
    </div>
  );
}
