"use client";
interface TabPanelProps { children?: React.ReactNode; className?: string; }
export default function TabPanel({ children, className }: TabPanelProps) { return <div className={className}>{children}</div>; }
