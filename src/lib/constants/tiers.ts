export const TIERS = {
  core: { name: "Core", min: 50, max: 90, target: 70, color: "#3B82F6" },
  mid: { name: "Mid-Risk", min: 5, max: 35, target: 20, color: "#60A5FA" },
  degen: { name: "Degen", min: 0, max: 15, target: 10, color: "#93C5FD" },
} as const;
export type TierKey = keyof typeof TIERS;
