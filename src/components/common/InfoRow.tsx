"use client";
interface InfoRowProps { children?: React.ReactNode; className?: string; }
export default function InfoRow({ children, className }: InfoRowProps) { return <div className={className}>{children}</div>; }
