"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Shield, TrendingDown, Activity, Target, Award, BarChart3, AlertTriangle } from "lucide-react";
interface RiskData { sharpeRatio: number; sortinoRatio: number; maxDrawdown: number; volatility: number; winRate: number; profitFactor: number; calmarRatio: number; valueAtRisk95: number; riskLevel: string; riskScore: number; factors: string[]; recommendations: string[]; }
export default function RiskPage() {
  const [data, setData] = useState<RiskData | null>(null);
  useEffect(() => {
    fetch("/api/v1/risk/metrics").then(r => r.json()).then(d => setData(d.data)).catch(() => setData(null));
  }, []);
  if (!data) return <><Navbar /><main className="pt-28 pb-20 max-w-5xl mx-auto px-6"><div className="bg-card border border-border rounded-2xl p-10 text-center"><p className="text-muted text-lg">Unable to load risk data. Please try again later.</p></div></main></>;
  const metrics = [
    { label: "Sharpe Ratio", value: data.sharpeRatio.toFixed(2), icon: Award },
    { label: "Sortino Ratio", value: data.sortinoRatio.toFixed(2), icon: Award },
    { label: "Max Drawdown", value: data.maxDrawdown.toFixed(1) + "%", icon: TrendingDown },
    { label: "Volatility", value: data.volatility.toFixed(1) + "%", icon: Activity },
    { label: "Win Rate", value: data.winRate.toFixed(0) + "%", icon: Target },
    { label: "Profit Factor", value: data.profitFactor.toFixed(2), icon: BarChart3 },
    { label: "Calmar Ratio", value: data.calmarRatio.toFixed(2), icon: Award },
    { label: "VaR (95%)", value: data.valueAtRisk95.toFixed(1) + "%", icon: Shield },
  ];
  const levelColor = { low: "text-primary", moderate: "text-yellow-500", elevated: "text-orange-500", high: "text-red-500", critical: "text-red-600" };
  return (
    <><Navbar />
    <main className="pt-28 pb-20 max-w-5xl mx-auto px-6">
      <h1 className="font-heading text-3xl font-bold tracking-tight mb-2">Risk Dashboard</h1>
      <p className="text-muted mb-8">Portfolio risk metrics and assessment</p>
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading font-semibold">Risk Assessment</h2>
          <span className={`font-heading text-lg font-bold ${levelColor[data.riskLevel as keyof typeof levelColor] || "text-muted"}`}>{data.riskLevel.toUpperCase()} ({data.riskScore}/100)</span>
        </div>
        <div className="w-full h-3 bg-card-solid rounded-full overflow-hidden mb-4"><div className="h-full bg-primary rounded-full transition-all" style={{ width: data.riskScore + "%" }} /></div>
        {data.factors.length > 0 && <div className="mb-3"><p className="text-xs text-muted mb-2">Risk Factors:</p>{data.factors.map((f, i) => <p key={i} className="text-sm text-foreground">• {f}</p>)}</div>}
        {data.recommendations.length > 0 && <div><p className="text-xs text-muted mb-2">Recommendations:</p>{data.recommendations.map((r, i) => <p key={i} className="text-sm text-primary">• {r}</p>)}</div>}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => { const Icon = m.icon; return (
          <div key={m.label} className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 text-muted mb-2"><Icon className="w-4 h-4" /><span className="text-xs uppercase tracking-wider">{m.label}</span></div>
            <p className="text-xl font-bold text-foreground">{m.value}</p>
          </div>
        ); })}
      </div>
    </main></>
  );
}
