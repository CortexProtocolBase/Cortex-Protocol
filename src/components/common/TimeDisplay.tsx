"use client";
interface TimeDisplayProps { children?: React.ReactNode; className?: string; }
export default function TimeDisplay({ children, className }: TimeDisplayProps) { return <div className={className}>{children}</div>; }
