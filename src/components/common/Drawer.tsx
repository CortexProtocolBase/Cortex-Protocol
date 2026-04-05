"use client";
interface DrawerProps { children?: React.ReactNode; className?: string; }
export default function Drawer({ children, className }: DrawerProps) { return <div className={className}>{children}</div>; }
