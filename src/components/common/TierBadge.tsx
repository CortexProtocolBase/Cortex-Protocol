type Tier = "Core" | "Mid-Risk" | "Degen";
const styles: Record<Tier, string> = { Core: "bg-primary/10 text-primary", "Mid-Risk": "bg-card-solid text-foreground", Degen: "bg-card-solid text-muted" };

export default function TierBadge({ tier }: { tier: Tier }) {
  return <span className={`text-xs rounded-full px-2 py-0.5 ${styles[tier] || styles.Core}`}>{tier}</span>;
}
