"use client";
interface KeyValueProps { children?: React.ReactNode; className?: string; }
export default function KeyValue({ children, className }: KeyValueProps) { return <div className={className}>{children}</div>; }
