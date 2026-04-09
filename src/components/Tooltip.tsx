"use client";
import { useState, useRef, type ReactNode } from "react";
interface TooltipProps { children: ReactNode; content: string; position?: "top" | "bottom"; }
export default function Tooltip({ children, content, position = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const posClass = position === "top" ? "bottom-full mb-2" : "top-full mt-2";
  return (
    <div className="relative inline-flex" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && <div className={`absolute left-1/2 -translate-x-1/2 ${posClass} bg-card-solid border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground whitespace-nowrap z-50 pointer-events-none`}>{content}</div>}
    </div>
  );
}
