import type { RiskLevel, RiskAssessment, PortfolioRisk } from "./types";
export function assessRisk(metrics: { volatility: number; maxDrawdown: number; concentration: number; protocolExposure: Record<string, number> }): RiskAssessment {
  const factors: string[] = []; const recommendations: string[] = [];
  let score = 0;
  // Volatility
  if (metrics.volatility > 30) { score += 30; factors.push("High volatility: " + metrics.volatility + "%"); recommendations.push("Reduce degen tier exposure"); }
  else if (metrics.volatility > 15) { score += 15; factors.push("Moderate volatility: " + metrics.volatility + "%"); }
  // Drawdown
  if (metrics.maxDrawdown > 20) { score += 25; factors.push("Large max drawdown: " + metrics.maxDrawdown + "%"); recommendations.push("Tighten stop-loss parameters"); }
  else if (metrics.maxDrawdown > 10) { score += 10; factors.push("Moderate drawdown risk"); }
  // Concentration
  if (metrics.concentration > 0.5) { score += 20; factors.push("High concentration risk"); recommendations.push("Diversify across more protocols"); }
  // Protocol exposure
  for (const [protocol, exposure] of Object.entries(metrics.protocolExposure)) {
    if (exposure > 40) { score += 15; factors.push(`Over-exposed to ${protocol}: ${exposure}%`); recommendations.push(`Reduce ${protocol} allocation below 40%`); }
  }
  let level: RiskLevel = "low";
  if (score >= 70) level = "critical"; else if (score >= 50) level = "high"; else if (score >= 30) level = "elevated"; else if (score >= 15) level = "moderate";
  return { level, score: Math.min(100, score), factors, recommendations, timestamp: Math.floor(Date.now() / 1000) };
}
