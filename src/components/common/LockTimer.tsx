"use client";
interface LockTimerProps { children?: React.ReactNode; className?: string; }
export default function LockTimer({ children, className }: LockTimerProps) { return <div className={className}>{children}</div>; }
