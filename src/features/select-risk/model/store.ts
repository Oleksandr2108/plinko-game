import { create } from "zustand";
import { GAME_CONFIG, type RiskLevel } from "@/shared/config";

interface SelectRiskState {
  risk: RiskLevel;
  rows: number;
  setRisk: (v: RiskLevel) => void;
  setRows: (v: number) => void;
}

export const useSelectRiskStore = create<SelectRiskState>((set) => ({
  risk: GAME_CONFIG.risk.default,
  rows: GAME_CONFIG.rows.default,
  setRisk: (risk) => set({ risk }),
  setRows: (rows) => set({ rows }),
}));
