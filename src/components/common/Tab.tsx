"use client";
interface TabProps { children?: React.ReactNode; className?: string; }
export default function Tab({ children, className }: TabProps) { return <div className={className}>{children}</div>; }
