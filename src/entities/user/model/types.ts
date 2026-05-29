export interface UserProgression {
  level: number;
  xp: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpIntoCurrentLevel: number;
  dailyStreak: number;
}

export interface User {
  id: string;
  email: string;
  balance: number;
  nickname: string;
  avatarUrl: string | null;
  progression: UserProgression;
  createdAt?: string;
}
