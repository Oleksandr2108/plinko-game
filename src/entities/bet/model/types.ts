import type { RiskLevel } from "@/shared/config";

export interface Bet {
  id: string;
  amount: number;
  riskLevel: RiskLevel;
  rows: number;
  status: "pending" | "settled";
}
