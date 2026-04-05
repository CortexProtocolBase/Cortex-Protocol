"use client";
interface ApyDisplayProps { children?: React.ReactNode; className?: string; }
export default function ApyDisplay({ children, className }: ApyDisplayProps) { return <div className={className}>{children}</div>; }
