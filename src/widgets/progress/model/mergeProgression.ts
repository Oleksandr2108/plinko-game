import type { Progression, ProgressionMission } from "@/entities/progression";

const isSameMission = (
  previous: ProgressionMission,
  next: ProgressionMission,
) => {
  return (
    previous.id === next.id &&
    previous.key === next.key &&
    previous.type === next.type &&
    previous.title === next.title &&
    previous.description === next.description &&
    previous.periodKey === next.periodKey &&
    previous.target === next.target &&
    previous.progress === next.progress &&
    previous.status === next.status &&
    previous.xpReward === next.xpReward &&
    previous.creditReward === next.creditReward &&
    previous.claimable === next.claimable &&
    previous.completedAt === next.completedAt &&
    previous.claimedAt === next.claimedAt
  );
};

const mergeMissions = (
  previous: ProgressionMission[],
  next: ProgressionMission[],
) => {
  let changed = previous.length !== next.length;
  const previousByKey = new Map(
    previous.map((mission) => [mission.key, mission]),
  );

  const merged = next.map((mission) => {
    const previousMission = previousByKey.get(mission.key);

    if (previousMission && isSameMission(previousMission, mission)) {
      return previousMission;
    }

    changed = true;
    return mission;
  });

  return changed ? merged : previous;
};

export const mergeProgression = (
  previous: Progression | undefined,
  next: Progression,
) => {
  if (!previous) {
    return next;
  }

  const dailyMissions = mergeMissions(
    previous.missions.daily,
    next.missions.daily,
  );
  const starterMissions = mergeMissions(
    previous.missions.starter,
    next.missions.starter,
  );

  return {
    ...next,
    missions: {
      daily: dailyMissions,
      starter: starterMissions,
    },
  };
};
