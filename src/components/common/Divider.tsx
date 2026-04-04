"use client";
interface DividerProps { children?: React.ReactNode; className?: string; }
export default function Divider({ children, className }: DividerProps) { return <div className={className}>{children}</div>; }
