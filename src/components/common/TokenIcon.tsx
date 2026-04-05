"use client";
interface TokenIconProps { children?: React.ReactNode; className?: string; }
export default function TokenIcon({ children, className }: TokenIconProps) { return <div className={className}>{children}</div>; }
