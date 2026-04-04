"use client";
interface RadioProps { children?: React.ReactNode; className?: string; }
export default function Radio({ children, className }: RadioProps) { return <div className={className}>{children}</div>; }
