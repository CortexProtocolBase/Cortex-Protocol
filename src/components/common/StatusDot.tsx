type Status = "active" | "inactive" | "warning" | "error";
const colors: Record<Status, string> = { active: "bg-primary", inactive: "bg-muted", warning: "bg-yellow-500", error: "bg-red-500" };

export default function StatusDot({ status = "active", label }: { status?: Status; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${colors[status]}`} />
      {label && <span className="text-xs text-muted">{label}</span>}
    </span>
  );
}
