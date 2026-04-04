"use client";
interface MenuProps { children?: React.ReactNode; className?: string; }
export default function Menu({ children, className }: MenuProps) { return <div className={className}>{children}</div>; }
