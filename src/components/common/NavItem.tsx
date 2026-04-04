"use client";
interface NavItemProps { children?: React.ReactNode; className?: string; }
export default function NavItem({ children, className }: NavItemProps) { return <div className={className}>{children}</div>; }
