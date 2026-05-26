import Image from "next/image";
import type { ProgressionMission } from "@/entities/progression";
import DailyMissionItemIcon from "../../../../public/icons/progress_DailyMissionsItem.svg";
import { ProgressBar } from "./ProgressBar";
import {
  clampPercent,
  formatCredits,
  formatMissionType,
  numberFormatter,
} from "./progressFormat";

export function MissionCard({
  mission,
  isPending,
  onClaim,
}: {
  mission: ProgressionMission;
  isPending: boolean;
  onClaim: (missionId: string) => void;
}) {
  const progressPercent =
    mission.target > 0 ? (mission.progress / mission.target) * 100 : 0;
  const isClaimed = Boolean(mission.claimedAt);
  const canClaim = mission.claimable && Boolean(mission.id) && !isClaimed;

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
              <p className="mt-1 truncate text-[12px] text-(--text)">
                {mission.description}
              </p>
            </div>
            <span className="shrink-0 rounded-md border border-[#235b93] bg-[rgba(35,91,147,0.35)] px-2 py-1 text-[11px] font-medium text-[#70b7ff]">
              {formatMissionType(mission.type)}
            </span>
          </div>

          <div className="mb-2 flex items-center justify-between text-[12px] text-(--secondaryText)">
            <span>
              {numberFormatter.format(mission.progress)} /{" "}
              {numberFormatter.format(mission.target)}
            </span>
            <span>{Math.floor(clampPercent(progressPercent))}%</span>
          </div>
          <ProgressBar value={progressPercent} />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[12px] font-semibold">
              <span className="text-(--colorAccess)">
                + {formatCredits(mission.creditReward)}
              </span>
              <span className="text-[#5aa7ff]">+ {mission.xpReward} XP</span>
            </div>
            <button
              type="button"
              disabled={!canClaim || isPending}
              onClick={() => mission.id && onClaim(mission.id)}
              className="rounded-[8px] border border-(--borderColor) bg-(--bgTabActive) px-3 py-1.5 text-[12px] font-semibold text-(--secondaryText) transition-colors hover:bg-(--bgSecondaryTab) disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending
                ? "Claiming..."
                : isClaimed
                  ? "Claimed"
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
