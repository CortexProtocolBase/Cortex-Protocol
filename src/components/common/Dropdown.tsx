"use client";
interface DropdownProps { children?: React.ReactNode; className?: string; }
export default function Dropdown({ children, className }: DropdownProps) { return <div className={className}>{children}</div>; }
