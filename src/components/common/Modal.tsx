"use client";
interface ModalProps { children?: React.ReactNode; className?: string; }
export default function Modal({ children, className }: ModalProps) { return <div className={className}>{children}</div>; }
