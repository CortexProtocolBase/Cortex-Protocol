import type { LucideIcon } from "lucide-react";
interface StatCardProps { label: string; value: string; icon?: LucideIcon; accent?: boolean; trend?: { value: string; positive: boolean }; }
export default function StatCard({ label, value, icon: Icon, accent, trend }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-border-hover transition-all duration-300">
      <div className="flex items-center gap-2 mb-2">{Icon && <Icon size={16} className="text-muted" />}<span className="text-muted text-xs font-medium">{label}</span></div>
      <p className={`font-heading text-lg font-bold ${accent ? "text-primary" : "text-foreground"}`}>{value}</p>
      {trend && <p className={`text-xs mt-1 ${trend.positive ? "text-primary" : "text-red-500"}`}>{trend.positive ? "+" : ""}{trend.value}</p>}
    </div>
  );
}
