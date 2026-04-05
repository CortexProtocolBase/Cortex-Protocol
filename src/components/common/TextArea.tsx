"use client";
interface TextAreaProps { children?: React.ReactNode; className?: string; }
export default function TextArea({ children, className }: TextAreaProps) { return <div className={className}>{children}</div>; }
