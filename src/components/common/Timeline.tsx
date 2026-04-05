"use client";
interface TimelineProps { children?: React.ReactNode; className?: string; }
export default function Timeline({ children, className }: TimelineProps) { return <div className={className}>{children}</div>; }
