interface ProgressBarProps { value: number; max?: number; color?: string; height?: string; showLabel?: boolean; }
export default function ProgressBar({ value, max = 100, color = "bg-primary", height = "h-2", showLabel = false }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className={`w-full ${height} bg-card-solid rounded-full overflow-hidden`}><div className={`${color} ${height} rounded-full transition-all duration-500`} style={{ width: pct + "%" }} /></div>
      {showLabel && <p className="text-xs text-muted mt-1">{Math.round(pct)}%</p>}
    </div>
  );
}
