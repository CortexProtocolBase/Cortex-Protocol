"use client";
import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

export default function LockTimer({ unlockDate, className = "" }: { unlockDate: Date | string; className?: string }) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = new Date(unlockDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Unlocked"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [unlockDate]);
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
      <Lock className="w-3 h-3 text-muted" />
      <span className="text-foreground font-medium">{timeLeft}</span>
    </span>
  );
}
