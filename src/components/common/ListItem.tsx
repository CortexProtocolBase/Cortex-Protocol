"use client";
interface ListItemProps { children?: React.ReactNode; className?: string; }
export default function ListItem({ children, className }: ListItemProps) { return <div className={className}>{children}</div>; }
