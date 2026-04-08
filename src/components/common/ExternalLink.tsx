import { ExternalLink as ExternalLinkIcon } from "lucide-react";

interface ExternalLinkProps { href: string; children: React.ReactNode; className?: string; showIcon?: boolean; }

export default function ExternalLink({ href, children, className = "", showIcon = true }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-1 text-primary hover:underline transition-colors ${className}`}>
      {children}
      {showIcon && <ExternalLinkIcon className="w-3 h-3" />}
    </a>
  );
}
