export const GAME_CONFIG = {
  rows: { min: 8, max: 16, default: 12 },
  risk: {
    levels: ["low", "medium", "high"] as const,
    default: "medium" as const,
  },
  bet: { min: 0.1, max: 1_000_000, default: 1 },
} as const;

export const API_BASE_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://plinko-be-stanish.fly.dev/api/v1";

export type RiskLevel = (typeof GAME_CONFIG.risk.levels)[number];
