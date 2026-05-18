export const GAME_CONFIG = {
  rows: { min: 8, max: 16, default: 12 },
  risk: {
    levels: ["low", "medium", "high"] as const,
    default: "medium" as const,
  },
  bet: { min: 0.1, max: 1000, default: 1 },
} as const;

export type RiskLevel = (typeof GAME_CONFIG.risk.levels)[number];
