export const FEES = {
  management: 0.02,
  performance: 0.20,
  withdrawal: 0.005,
  deposit: 0,
} as const;
export const FEE_LABELS: Record<keyof typeof FEES, string> = {
  management: "2% annualized",
  performance: "20% of profits",
  withdrawal: "0.5%",
  deposit: "Free",
};
