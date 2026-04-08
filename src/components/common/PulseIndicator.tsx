interface PulseIndicatorProps { active?: boolean; color?: string; size?: "sm" | "md"; label?: string; }

export default function PulseIndicator({ active = true, color = "bg-primary", size = "sm", label }: PulseIndicatorProps) {
  const dotSize = size === "sm" ? "w-2 h-2" : "w-3 h-3";
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative flex">
        <span className={`${dotSize} rounded-full ${active ? color : "bg-muted"}`} />
        {active && <span className={`absolute inset-0 ${dotSize} rounded-full ${color} animate-ping opacity-75`} />}
      </span>
      {label && <span className="text-xs text-muted">{label}</span>}
    </span>
  );
}
