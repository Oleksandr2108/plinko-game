import type { Bet, BetList } from "@/entities/bet";
import type { ApiRiskLevel, GameConfig } from "@/entities/game";
import type {
  ClaimRewardResult,
  ClaimedReward,
  Progression,
  ProgressionDaily,
  ProgressionMission,
  ProgressionReward,
} from "@/entities/progression";
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

interface RawProgressionRewardResponse {
  credits: string;
  xp: number;
}

interface RawProgressionDailyResponse {
  reward: RawProgressionRewardResponse;
  canClaim: boolean;
  streak: number;
  nextClaimAt: string;
}

interface RawProgressionMissionResponse {
  creditReward: string;
  id: string | null;
  key: string;
  type: unknown;
  title: string;
  description: string;
  periodKey: string;
  target: number;
  progress: number;
  status: unknown;
  xpReward: number;
  claimable: boolean;
  completedAt: string | null;
  claimedAt: string | null;
}

interface RawProgressionResponse {
  daily: RawProgressionDailyResponse;
  missions: {
    daily: RawProgressionMissionResponse[];
    starter: RawProgressionMissionResponse[];
  };
  level: number;
  xp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpIntoCurrentLevel: number;
}

interface RawClaimedRewardResponse {
  source: "DAILY_BONUS" | "MISSION";
  missionId?: string;
  missionKey?: string;
  credits: string;
  balanceAfter: string;
  sourceKey: string;
  periodKey: string;
  xp: number;
  levelBefore: number;
  levelAfter: number;
}

interface RawClaimRewardResponse {
  reward: RawClaimedRewardResponse;
  progression: RawProgressionResponse;
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
  progression: ["progression"] as const,
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

const stringifyEnum = (value: unknown) => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (value && typeof value === "object") {
    const firstValue = Object.values(value).find(
      (item) => typeof item === "string" || typeof item === "number",
    );

    if (firstValue !== undefined) {
      return String(firstValue);
    }
  }

  return String(value ?? "");
};

const mapProgressionReward = (
  reward: RawProgressionRewardResponse,
): ProgressionReward => ({
  credits: fromMinimalUnits(reward.credits),
  xp: reward.xp,
});

const mapProgressionDaily = (
  daily: RawProgressionDailyResponse,
): ProgressionDaily => ({
  reward: mapProgressionReward(daily.reward),
  canClaim: daily.canClaim,
  streak: daily.streak,
  nextClaimAt: daily.nextClaimAt,
});

const mapProgressionMission = (
  mission: RawProgressionMissionResponse,
): ProgressionMission => ({
  id: mission.id,
  key: mission.key,
  type: stringifyEnum(mission.type),
  title: mission.title,
  description: mission.description,
  periodKey: mission.periodKey,
  target: mission.target,
  progress: mission.progress,
  status: stringifyEnum(mission.status),
  xpReward: mission.xpReward,
  creditReward: fromMinimalUnits(mission.creditReward),
  claimable: mission.claimable,
  completedAt: mission.completedAt,
  claimedAt: mission.claimedAt,
});

const mapProgression = (
  progression: RawProgressionResponse,
): Progression => ({
  daily: mapProgressionDaily(progression.daily),
  missions: {
    daily: progression.missions.daily.map(mapProgressionMission),
    starter: progression.missions.starter.map(mapProgressionMission),
  },
  level: progression.level,
  xp: progression.xp,
  xpForCurrentLevel: progression.xpForCurrentLevel,
  xpForNextLevel: progression.xpForNextLevel,
  xpIntoCurrentLevel: progression.xpIntoCurrentLevel,
});

const mapClaimedReward = (
  reward: RawClaimedRewardResponse,
): ClaimedReward => ({
  source: reward.source,
  missionId: reward.missionId,
  missionKey: reward.missionKey,
  credits: fromMinimalUnits(reward.credits),
  balanceAfter: fromMinimalUnits(reward.balanceAfter),
  sourceKey: reward.sourceKey,
  periodKey: reward.periodKey,
  xp: reward.xp,
  levelBefore: reward.levelBefore,
  levelAfter: reward.levelAfter,
});

const mapClaimRewardResult = (
  result: RawClaimRewardResponse,
): ClaimRewardResult => ({
  reward: mapClaimedReward(result.reward),
  progression: mapProgression(result.progression),
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

  async getProgression() {
    const { data } =
      await apiClient.get<RawProgressionResponse>("/progression/me");
    return mapProgression(data);
  },

  async claimDailyReward() {
    const { data } = await apiClient.post<RawClaimRewardResponse>(
      "/progression/daily/claim",
    );
    return mapClaimRewardResult(data);
  },

  async claimMissionReward(missionId: string) {
    const { data } = await apiClient.post<RawClaimRewardResponse>(
      `/progression/missions/${missionId}/claim`,
    );
    return mapClaimRewardResult(data);
  },
};
