export interface ProgressionReward {
  credits: number;
  xp: number;
}

export interface ProgressionDaily {
  reward: ProgressionReward;
  canClaim: boolean;
  streak: number;
  nextClaimAt: string;
}

export interface ProgressionMission {
  id: string | null;
  key: string;
  type: string;
  title: string;
  description: string;
  periodKey: string;
  target: number;
  progress: number;
  status: string;
  xpReward: number;
  creditReward: number;
  claimable: boolean;
  completedAt: string | null;
  claimedAt: string | null;
}

export interface ProgressionMissions {
  daily: ProgressionMission[];
  starter: ProgressionMission[];
}

export interface Progression {
  daily: ProgressionDaily;
  missions: ProgressionMissions;
  level: number;
  xp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpIntoCurrentLevel: number;
}

export interface ClaimedReward {
  source: "DAILY_BONUS" | "MISSION";
  missionId?: string;
  missionKey?: string;
  credits: number;
  balanceAfter: number;
  sourceKey: string;
  periodKey: string;
  xp: number;
  levelBefore: number;
  levelAfter: number;
}

export interface ClaimRewardResult {
  reward: ClaimedReward;
  progression: Progression;
}
