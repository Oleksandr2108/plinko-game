import Image from "next/image";
import type { Progression } from "@/entities/progression";
import DailyRewardIcon from "../../../../public/icons/progress_DailyReward.svg";
import { dateFormatter, formatCredits } from "./progressFormat";

export function DailyRewardCard({
  progression,
  isPending,
  onClaim,
}: {
  progression: Progression;
  isPending: boolean;
  onClaim: () => void;
}) {
  const { daily } = progression;

  return (
    <section className="w-full max-w-216 rounded-[10px] border border-[#66351d] bg-[linear-gradient(135deg,rgba(38,31,28,0.92),rgba(49,25,33,0.72))] px-4 py-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-2">
          <Image
            src={DailyRewardIcon}
            alt=""
            aria-hidden="true"
            className="mt-0.5 h-4 w-4"
          />
          <div>
            <p className="text-[16px] font-bold text-white">Daily Reward</p>
            <p className="mt-1 text-[12px] text-(--text)">
              Current streak: {daily.streak} days
            </p>
          </div>
        </div>
        <div className="text-right text-[12px] font-semibold">
          <p className="text-(--colorAccess)">
            + {formatCredits(daily.reward.credits)}
          </p>
          <p className="mt-1 text-[#5aa7ff]">+ {daily.reward.xp} XP</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClaim}
        disabled={!daily.canClaim || isPending}
        className="w-full rounded-[10px] bg-[linear-gradient(90deg,#ff7a1a,#fb2c36)] px-4 py-3 text-[14px] font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isPending
          ? "Claiming..."
          : daily.canClaim
            ? "Claim Now"
            : "Claimed"}
      </button>
      <div className="mt-4 flex items-center justify-between text-[12px] text-(--text)">
        <span>Next reward</span>
        <span className="text-[#f0b100]">
          {dateFormatter.format(new Date(daily.nextClaimAt))}
        </span>
      </div>
    </section>
  );
}
