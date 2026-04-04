"use client";
interface LinkProps { children?: React.ReactNode; className?: string; }
export default function Link({ children, className }: LinkProps) { return <div className={className}>{children}</div>; }
