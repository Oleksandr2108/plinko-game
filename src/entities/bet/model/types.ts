import type { ApiRiskLevel } from "@/entities/game";

export interface BetSeedRef {
  serverSeedHash: string;
  clientSeed: string;
  nonce: number;
}

export interface Bet {
  betId: string;
  amount: number;
  rows: number;
  risk: ApiRiskLevel;
  path: string;
  bucketIndex: number;
  multiplier: number;
  payout: number;
  balanceAfter: number;
  seed?: BetSeedRef;
  createdAt?: string;
}

export interface BetList {
  items: Bet[];
  nextCursor: string | null;
}
