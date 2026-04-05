"use client";
interface PulseIndicatorProps { children?: React.ReactNode; className?: string; }
export default function PulseIndicator({ children, className }: PulseIndicatorProps) { return <div className={className}>{children}</div>; }
