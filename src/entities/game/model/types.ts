export type ApiRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface GameConfig {
  rows: number[];
  risks: ApiRiskLevel[];
  minBet: number;
  maxBet: number;
  payoutTables: Record<ApiRiskLevel, Record<string, number[]>>;
}
