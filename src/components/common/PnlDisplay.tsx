"use client";
interface PnlDisplayProps { children?: React.ReactNode; className?: string; }
export default function PnlDisplay({ children, className }: PnlDisplayProps) { return <div className={className}>{children}</div>; }
