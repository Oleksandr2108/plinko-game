"use client";

import { useQuery } from "@tanstack/react-query";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";
import DailyMissionsIcon from "../../../../public/icons/progress_DailyMissions.svg";
import StarterMissionsIcon from "../../../../public/icons/progress_StarterMissions.svg";
import { DailyRewardCard } from "./DailyRewardCard";
import { LevelCard } from "./LevelCard";
import { MissionSection } from "./MissionSection";
import { ProgressToolbar } from "./ProgressToolbar";

export function ProgressPage() {
  const progressionQuery = useQuery({
    queryKey: PLINKO_QUERY_KEYS.progression,
    queryFn: plinkoApi.getProgression,
  });

  return (
    <main className="min-h-full">
      <ProgressToolbar />
      <div className="mx-auto flex w-[calc(100%-32px)] max-w-[864px] flex-col gap-4 py-4">
        {progressionQuery.isLoading ? (
          <p className="px-2 text-sm text-(--text)">Loading progress...</p>
        ) : progressionQuery.error ? (
          <p className="px-2 text-sm text-(--colorError)">
            Failed to load progress.
          </p>
        ) : progressionQuery.data ? (
          <>
            <LevelCard progression={progressionQuery.data} />
            <DailyRewardCard progression={progressionQuery.data} />
            <MissionSection
              icon={DailyMissionsIcon}
              title="Daily Missions"
              missions={progressionQuery.data.missions.daily}
            />
            <MissionSection
              icon={StarterMissionsIcon}
              title="Starter Missions"
              missions={progressionQuery.data.missions.starter}
            />
          </>
        ) : null}
      </div>
    </main>
  );
}
