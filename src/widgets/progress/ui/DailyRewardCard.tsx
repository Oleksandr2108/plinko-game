import { memo } from "react";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Progression } from "@/entities/progression";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";
import { playSuccessSound } from "@/shared/lib/audio";
import BetIcon from "../../../../public/icons/betIcon.svg";
import DailyRewardIcon from "../../../../public/icons/progress_DailyReward.svg";
import DailyRewardStreakIcon from "../../../../public/icons/progress_DailyRewardStreak.svg";
import DailyRewardTime from "../../../../public/icons/progress_DailyRewardTime.svg";
import { mergeProgression } from "../model/mergeProgression";
import { formatCredits } from "./progressFormat";

const formatAvailability = (nextClaimAt: string) => {
  const diffMs = new Date(nextClaimAt).getTime() - Date.now();

  if (!Number.isFinite(diffMs) || diffMs <= 0) {
    return "Available soon";
  }

  const totalMinutes = Math.ceil(diffMs / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours <= 0) {
    return `Available in ${minutes}m`;
  }

  if (minutes === 0) {
    return `Available in ${hours}h`;
  }

  return `Available in ${hours}h ${minutes}m`;
};

function DailyRewardCardBase({ progression }: { progression: Progression }) {
  const queryClient = useQueryClient();
  const { daily } = progression;
  const claimMutation = useMutation({
    mutationFn: plinkoApi.claimDailyReward,
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
  const streakDays = Math.max(1, daily.streak);

  return (
    <section className="w-full max-w-[864px] rounded-[10px] border border-[var(--dailyRewardBorder)] [background:var(--dailyRewardBg)] p-4">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src={DailyRewardIcon}
                alt=""
                aria-hidden="true"
                className="h-5 w-5"
              />
              <p className="text-[16px] font-bold leading-tight text-(--colorWhite)">
                Daily Reward
              </p>
            </div>
            <p className="mt-1 text-[14px] text-(--text)">
              Day {Math.min(streakDays, 7)} of 7
            </p>
          </div>
        </div>

        <div className="text-right text-[14px] font-semibold">
          <p className="inline-flex items-center gap-1 text-(--dailyRewardCredits)">
            <Image
              src={BetIcon}
              alt=""
              aria-hidden="true"
              className="h-4 w-4"
            />
            {formatCredits(daily.reward.credits)}
          </p>
          <p className="mt-1 text-(--colorXp)">+{daily.reward.xp} XP</p>
        </div>
      </div>
      {daily.canClaim ? (
        <button
          type="button"
          onClick={() => {
            playSuccessSound();
            claimMutation.mutate();
          }}
          disabled={claimMutation.isPending}
          className="w-full rounded-[10px] [background:var(--dailyRewardButtonBg)] px-4 py-3.5 text-[16px] font-bold text-(--colorWhite) transition-opacity disabled:cursor-not-allowed disabled:opacity-55"
        >
          {claimMutation.isPending ? "Claiming..." : "Claim Now"}
        </button>
      ) : (
        <div className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--dailyRewardMutedBg)] px-4 py-3.5 text-[16px] font-medium text-(--text)">
          <Image
            src={DailyRewardTime}
            alt=""
            aria-hidden="true"
            className="h-4 w-4"
          />
          {formatAvailability(daily.nextClaimAt)}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between border-t border-[var(--dailyRewardBorder)] pt-4 text-[14px] text-(--text)">
        <span>Current streak</span>
        <span className="inline-flex items-center gap-1 text-(--dailyRewardStreak)">
          <Image
            src={DailyRewardStreakIcon}
            alt=""
            aria-hidden="true"
            className="h-4 w-4"
          />
          {streakDays} days
        </span>
      </div>
    </section>
  );
}

export const DailyRewardCard = memo(
  DailyRewardCardBase,
  (previous, next) =>
    previous.progression.daily.canClaim === next.progression.daily.canClaim &&
    previous.progression.daily.streak === next.progression.daily.streak &&
    previous.progression.daily.nextClaimAt ===
      next.progression.daily.nextClaimAt &&
    previous.progression.daily.reward.credits ===
      next.progression.daily.reward.credits &&
    previous.progression.daily.reward.xp === next.progression.daily.reward.xp,
);
