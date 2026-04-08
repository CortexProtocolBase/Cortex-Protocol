interface InfoRowProps { label: string; value: React.ReactNode; border?: boolean; }

export default function InfoRow({ label, value, border = true }: InfoRowProps) {
  return (
    <div className={`flex items-center justify-between py-3 ${border ? "border-b border-border last:border-0" : ""}`}>
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm text-foreground font-medium">{value}</span>
    </div>
  );
}
