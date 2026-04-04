"use client";
interface ChipProps { children?: React.ReactNode; className?: string; }
export default function Chip({ children, className }: ChipProps) { return <div className={className}>{children}</div>; }
