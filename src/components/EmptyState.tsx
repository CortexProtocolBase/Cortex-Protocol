import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
interface EmptyStateProps { icon?: LucideIcon; title: string; description?: string; action?: { label: string; onClick: () => void }; }
export default function EmptyState({ icon: Icon = Inbox, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <Icon className="w-10 h-10 text-muted mb-4" />
      <h3 className="font-heading text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted max-w-sm mb-4">{description}</p>}
      {action && <button onClick={action.onClick} className="bg-foreground text-background rounded-lg px-4 py-2 text-sm font-medium cursor-pointer hover:opacity-90">{action.label}</button>}
    </div>
  );
}
