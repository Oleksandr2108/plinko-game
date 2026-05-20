import type { Bet, BetList } from "@/entities/bet";
import type { ApiRiskLevel, GameConfig } from "@/entities/game";
import type { ActiveSeed } from "@/entities/seed";
import type { User } from "@/entities/user";
import type { RiskLevel } from "@/shared/config";
import { fromMinimalUnits, toMinimalUnits } from "@/shared/lib";
import { apiClient } from "./index";

interface RawUserResponse {
  id: string;
  email: string;
  balance: string;
  createdAt: string;
}

interface RawGameConfigResponse {
  rows: number[];
  risks: ApiRiskLevel[];
  minBet: string;
  maxBet: string;
  payoutTables: Record<ApiRiskLevel, Record<string, number[]>>;
}

interface RawActiveSeedResponse {
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
}

interface RawBetResponse {
  betId: string;
  amount: string;
  rows: number;
  risk: ApiRiskLevel;
  path: string;
  bucketIndex: number;
  multiplier: string;
  payout: string;
  balanceAfter: string;
  seed?: {
    serverSeedHash: string;
    clientSeed: string;
    nonce: number;
  };
  createdAt?: string;
}

interface RawBetListResponse {
  items: RawBetResponse[];
  nextCursor: string | null;
}

export interface ListBetsParams {
  limit?: number;
  cursor?: string;
  rows?: number;
}

export const PLINKO_QUERY_KEYS = {
  gameConfig: ["game-config"] as const,
  currentUser: ["current-user"] as const,
  activeSeed: ["active-seed"] as const,
  betHistory: (params: ListBetsParams = {}) => ["bet-history", params] as const,
};

const riskToApiMap: Record<RiskLevel, ApiRiskLevel> = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
};

const mapUser = (user: RawUserResponse): User => ({
  id: user.id,
  email: user.email,
  balance: fromMinimalUnits(user.balance),
  createdAt: user.createdAt,
});

const mapGameConfig = (config: RawGameConfigResponse): GameConfig => ({
  rows: config.rows,
  risks: config.risks,
  minBet: fromMinimalUnits(config.minBet),
  maxBet: fromMinimalUnits(config.maxBet),
  payoutTables: config.payoutTables,
});

const mapBet = (bet: RawBetResponse): Bet => ({
  betId: bet.betId,
  amount: fromMinimalUnits(bet.amount),
  rows: bet.rows,
  risk: bet.risk,
  path: bet.path,
  bucketIndex: bet.bucketIndex,
  multiplier: Number(bet.multiplier),
  payout: fromMinimalUnits(bet.payout),
  balanceAfter: fromMinimalUnits(bet.balanceAfter),
  seed: bet.seed,
  createdAt: bet.createdAt,
});

export const plinkoApi = {
  async getGameConfig() {
    const { data } = await apiClient.get<RawGameConfigResponse>("/game/config");
    return mapGameConfig(data);
  },

  async getCurrentUser() {
    const { data } = await apiClient.get<RawUserResponse>("/users/me");
    return mapUser(data);
  },

  async getActiveSeed() {
    const { data } =
      await apiClient.get<RawActiveSeedResponse>("/seeds/active");
    return data satisfies ActiveSeed;
  },

  async placeBet(input: { amount: number; rows: number; risk: RiskLevel }) {
    const { data } = await apiClient.post<RawBetResponse>("/bets", {
      amount: toMinimalUnits(input.amount),
      rows: input.rows,
      risk: riskToApiMap[input.risk],
    });

    return mapBet(data);
  },

  async listBets(params: ListBetsParams = {}) {
    const { data } = await apiClient.get<RawBetListResponse>("/bets", {
      params,
    });

    const result: BetList = {
      items: data.items.map(mapBet),
      nextCursor: data.nextCursor,
    };

    return result;
  },
};
