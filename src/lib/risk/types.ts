export interface RiskMetrics { sharpeRatio: number; sortinoRatio: number; maxDrawdown: number; maxDrawdownDuration: number; volatility: number; winRate: number; profitFactor: number; calmarRatio: number; valueAtRisk95: number; }
export interface PortfolioRisk { totalExposure: number; concentrationRisk: number; liquidityRisk: number; correlationRisk: number; protocolRisk: Record<string, number>; tierExposure: { core: number; mid: number; degen: number }; }
export interface DrawdownEntry { startDate: string; endDate: string | null; depth: number; recovered: boolean; duration: number; }
export interface VaRResult { historical: number; parametric: number; confidence: number; horizon: number; portfolioValue: number; }
export type RiskLevel = "low" | "moderate" | "elevated" | "high" | "critical";
export interface RiskAssessment { level: RiskLevel; score: number; factors: string[]; recommendations: string[]; timestamp: number; }
