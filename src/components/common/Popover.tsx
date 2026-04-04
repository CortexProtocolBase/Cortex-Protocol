"use client";
interface PopoverProps { children?: React.ReactNode; className?: string; }
export default function Popover({ children, className }: PopoverProps) { return <div className={className}>{children}</div>; }
