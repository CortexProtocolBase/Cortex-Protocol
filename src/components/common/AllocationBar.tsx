"use client";
interface AllocationBarProps { children?: React.ReactNode; className?: string; }
export default function AllocationBar({ children, className }: AllocationBarProps) { return <div className={className}>{children}</div>; }
