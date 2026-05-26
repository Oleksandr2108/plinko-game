"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";
import DailyMissionsIcon from "../../../../public/icons/progress_DailyMissions.svg";
import StarterMissionsIcon from "../../../../public/icons/progress_StarterMissions.svg";
import { DailyRewardCard } from "./DailyRewardCard";
import { LevelCard } from "./LevelCard";
import { MissionSection } from "./MissionSection";
import { ProgressToolbar } from "./ProgressToolbar";

export function ProgressPage() {
  const queryClient = useQueryClient();
  const progressionQuery = useQuery({
    queryKey: PLINKO_QUERY_KEYS.progression,
    queryFn: plinkoApi.getProgression,
  });

  const dailyClaimMutation = useMutation({
    mutationFn: plinkoApi.claimDailyReward,
    onSuccess: (result) => {
      queryClient.setQueryData(
        PLINKO_QUERY_KEYS.progression,
        result.progression,
      );
      queryClient.invalidateQueries({ queryKey: PLINKO_QUERY_KEYS.currentUser });
    },
  });

  const missionClaimMutation = useMutation({
    mutationFn: plinkoApi.claimMissionReward,
    onSuccess: (result) => {
      queryClient.setQueryData(
        PLINKO_QUERY_KEYS.progression,
        result.progression,
      );
      queryClient.invalidateQueries({ queryKey: PLINKO_QUERY_KEYS.currentUser });
    },
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
            <DailyRewardCard
              progression={progressionQuery.data}
              isPending={dailyClaimMutation.isPending}
              onClaim={() => dailyClaimMutation.mutate()}
            />
            <MissionSection
              icon={DailyMissionsIcon}
              title="Daily Missions"
              missions={progressionQuery.data.missions.daily}
              pendingMissionId={missionClaimMutation.variables ?? null}
              onClaim={(missionId) => missionClaimMutation.mutate(missionId)}
            />
            <MissionSection
              icon={StarterMissionsIcon}
              title="Starter Missions"
              missions={progressionQuery.data.missions.starter}
              pendingMissionId={missionClaimMutation.variables ?? null}
              onClaim={(missionId) => missionClaimMutation.mutate(missionId)}
            />
          </>
        ) : null}
      </div>
    </main>
  );
}
