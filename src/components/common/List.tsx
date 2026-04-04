"use client";
interface ListProps { children?: React.ReactNode; className?: string; }
export default function List({ children, className }: ListProps) { return <div className={className}>{children}</div>; }
