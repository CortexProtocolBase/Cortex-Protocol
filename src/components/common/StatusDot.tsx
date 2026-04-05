"use client";
interface StatusDotProps { children?: React.ReactNode; className?: string; }
export default function StatusDot({ children, className }: StatusDotProps) { return <div className={className}>{children}</div>; }
