"use client";
interface SwitchProps { children?: React.ReactNode; className?: string; }
export default function Switch({ children, className }: SwitchProps) { return <div className={className}>{children}</div>; }
