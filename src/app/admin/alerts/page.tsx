"use client";
import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
interface Alert { id: string; severity: string; title: string; message: string; timestamp: number; acknowledged: boolean; }
const severityIcon = { info: Info, warning: AlertTriangle, error: XCircle, critical: AlertTriangle };
const severityColor = { info: "text-muted", warning: "text-yellow-500", error: "text-red-500", critical: "text-red-600" };
export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  useEffect(() => {
    const key = localStorage.getItem("admin_key") || "";
    fetch("/api/admin/alerts", { headers: { Authorization: `Bearer ${key}` } })
      .then(r => r.json()).then(d => setAlerts(d.data || []));
  }, []);
  const acknowledge = async (id: string) => {
    const key = localStorage.getItem("admin_key") || "";
    await fetch("/api/admin/alerts", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ id, action: "acknowledge" }) });
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-6">Alerts</h1>
      <div className="space-y-3">
        {alerts.map(alert => {
          const Icon = severityIcon[alert.severity as keyof typeof severityIcon] || Info;
          const color = severityColor[alert.severity as keyof typeof severityColor] || "text-muted";
          return (
            <div key={alert.id} className={`bg-card border border-border rounded-2xl p-4 flex items-start gap-3 ${alert.acknowledged ? "opacity-50" : ""}`}>
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${color}`} />
              <div className="flex-1"><p className="text-sm font-medium text-foreground">{alert.title}</p><p className="text-xs text-muted mt-1">{alert.message}</p></div>
              {!alert.acknowledged && <button onClick={() => acknowledge(alert.id)} className="text-xs text-primary hover:underline cursor-pointer shrink-0">Acknowledge</button>}
            </div>
          );
        })}
        {alerts.length === 0 && <p className="text-muted text-sm">No alerts</p>}
      </div>
    </div>
  );
}
