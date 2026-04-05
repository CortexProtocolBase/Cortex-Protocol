"use client";
interface SharePriceProps { children?: React.ReactNode; className?: string; }
export default function SharePrice({ children, className }: SharePriceProps) { return <div className={className}>{children}</div>; }
