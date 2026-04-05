"use client";
interface AccordionItemProps { children?: React.ReactNode; className?: string; }
export default function AccordionItem({ children, className }: AccordionItemProps) { return <div className={className}>{children}</div>; }
