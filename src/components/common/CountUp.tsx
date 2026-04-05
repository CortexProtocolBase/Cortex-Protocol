"use client";
interface CountUpProps { children?: React.ReactNode; className?: string; }
export default function CountUp({ children, className }: CountUpProps) { return <div className={className}>{children}</div>; }
