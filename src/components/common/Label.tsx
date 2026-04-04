"use client";
interface LabelProps { children?: React.ReactNode; className?: string; }
export default function Label({ children, className }: LabelProps) { return <div className={className}>{children}</div>; }
