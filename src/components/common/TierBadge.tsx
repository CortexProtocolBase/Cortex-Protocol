"use client";
interface TierBadgeProps { children?: React.ReactNode; className?: string; }
export default function TierBadge({ children, className }: TierBadgeProps) { return <div className={className}>{children}</div>; }
