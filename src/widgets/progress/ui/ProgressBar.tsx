import { memo } from "react";
import { clampPercent } from "./progressFormat";

function ProgressBarBase({
  value,
  variant = "level",
}: {
  value: number;
  variant?: "default" | "level";
}) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-(--bgTrack)">
      <div
        className={[
          "h-full rounded-full transition-[width]",
          variant === "level"
            ? "[background:var(--progressGradient)]"
            : "bg-(--colorAccess)",
        ].join(" ")}
        style={{ width: `${clampPercent(value)}%` }}
      />
    </div>
  );
}

export const ProgressBar = memo(ProgressBarBase);
