import { memo } from "react";
import Image from "next/image";
import type { Progression } from "@/entities/progression";
import LevelIcon from "../../../../public/icons/progress_Level.svg";
import { ProgressBar } from "./ProgressBar";
import { numberFormatter } from "./progressFormat";

function LevelCardBase({ progression }: { progression: Progression }) {
  const levelRange = Math.max(
    1,
    progression.xpForNextLevel - progression.xpForCurrentLevel,
  );
  const levelPercent = (progression.xpIntoCurrentLevel / levelRange) * 100;

  return (
    <section className="flex w-full max-w-[864px] flex-col justify-between rounded-[10px] border border-[#2a2f3e] bg-[#1a1f2e] p-4">
      <div className="flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={LevelIcon}
              alt=""
              aria-hidden="true"
              className="h-4 w-4"
            />
            <p className="text-[14px] font-bold text-white">
              Level {progression.level}
            </p>
          </div>
          <p className="text-[12px] font-medium text-(--secondaryText)">
            {numberFormatter.format(progression.xpIntoCurrentLevel)} /{" "}
            {numberFormatter.format(levelRange)} XP
          </p>
        </div>
        <ProgressBar
          value={levelPercent}
          variant="level"
        />
        <div className="flex items-center justify-between text-[12px] text-(--colorSmallText)">
          <p className="mt-1 text-[12px] text-(--text)">
            {numberFormatter.format(progression.xp)} total XP
          </p>
          <p>
            {numberFormatter.format(
              Math.max(0, progression.xpForNextLevel - progression.xp),
            )}{" "}
            XP to level {progression.level + 1}
          </p>
        </div>
      </div>
    </section>
  );
}

export const LevelCard = memo(
  LevelCardBase,
  (previous, next) =>
    previous.progression.level === next.progression.level &&
    previous.progression.xp === next.progression.xp &&
    previous.progression.xpForCurrentLevel ===
      next.progression.xpForCurrentLevel &&
    previous.progression.xpForNextLevel === next.progression.xpForNextLevel &&
    previous.progression.xpIntoCurrentLevel ===
      next.progression.xpIntoCurrentLevel,
);
