import { memo } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Progression, ProgressionMission } from "@/entities/progression";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";
import { playSuccessSound } from "@/shared/lib/audio";
import DailyMissionItemIcon from "../../../../public/icons/progress_DailyMissionsItem.svg";
import BetIcon from "../../../../public/icons/betIcon.svg";
import { mergeProgression } from "../model/mergeProgression";
import { ProgressBar } from "./ProgressBar";
import { clampPercent, formatCredits, numberFormatter } from "./progressFormat";

function MissionCardBase({ mission }: { mission: ProgressionMission }) {
  const queryClient = useQueryClient();
  const progressPercent =
    mission.target > 0 ? (mission.progress / mission.target) * 100 : 0;
  const isClaimed = Boolean(mission.claimedAt);
  const canClaim = mission.claimable && Boolean(mission.id) && !isClaimed;
  const claimMutation = useMutation({
    mutationFn: (missionId: string) => plinkoApi.claimMissionReward(missionId),
    onSuccess: (result) => {
      queryClient.setQueryData<Progression | undefined>(
        PLINKO_QUERY_KEYS.progression,
        (previous) => mergeProgression(previous, result.progression),
      );
      queryClient.invalidateQueries({
        queryKey: PLINKO_QUERY_KEYS.currentUser,
      });
    },
  });

  const buttonStatusClass = isClaimed
    ? "border-[var(--colorError)] bg-[var(--bgError)] text-[var(--colorError)] hover:bg-[rgba(251,44,54,0.35)]"
    : canClaim
      ? "border-[var(--colorAccess)] bg-[var(--bgAccess)] text-[var(--colorAccess)] hover:bg-[rgba(0,201,80,0.35)] cursor-pointer"
      : "border-[var(--colorMedium)] bg-[var(--bgMedium)] text-[var(--colorMedium)] hover:bg-[rgba(240,177,0,0.35)]";

  return (
    <article className="w-full max-w-[864px] rounded-[10px] border border-[rgba(43,127,255,0.3)] bg-[linear-gradient(135deg,rgba(17,35,62,0.9),rgba(22,43,74,0.72))] p-4">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-[rgba(43,127,255,0.35)] bg-[rgba(43,127,255,0.16)]">
          <Image
            src={DailyMissionItemIcon}
            alt=""
            aria-hidden="true"
            className="h-5 w-5"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold text-white">
                {mission.title}
              </p>
              <p className=" truncate text-[12px] text-(--text)">
                {mission.description}
              </p>
            </div>
          </div>

          <div className="mb-1 flex items-center justify-between text-[12px] text-(--text) font-normal">
            <span>
              {numberFormatter.format(mission.progress)} /{" "}
              {numberFormatter.format(mission.target)}
            </span>
            <span>{Math.floor(clampPercent(progressPercent))}%</span>
          </div>
          <ProgressBar value={progressPercent} />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[12px] font-semibold">
              <span className="text-(--colorMedium) flex items-center gap-2">
                <Image
                  src={BetIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                {formatCredits(mission.creditReward)}
              </span>
              <span className="text-[#5aa7ff] font-medium">
                +{mission.xpReward} XP
              </span>
            </div>
            <button
              type="button"
              disabled={!canClaim || claimMutation.isPending}
              onClick={() => {
                if (!mission.id) return;
                playSuccessSound();
                claimMutation.mutate(mission.id);
              }}
              className={`rounded-[8px] border px-3 py-1.5 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${buttonStatusClass}`}
            >
              {isClaimed
                ? "Claimed"
                : claimMutation.isPending
                  ? "Claiming..."
                  : canClaim
                    ? "Claim"
                    : "In Progress"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export const MissionCard = memo(MissionCardBase);
