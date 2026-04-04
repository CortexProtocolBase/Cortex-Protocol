"use client";
interface IconButtonProps { children?: React.ReactNode; className?: string; }
export default function IconButton({ children, className }: IconButtonProps) { return <div className={className}>{children}</div>; }
