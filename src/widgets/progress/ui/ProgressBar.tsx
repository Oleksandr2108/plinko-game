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
    <div className="h-2 overflow-hidden rounded-full bg-[#0d1118]">
      <div
        className={[
          "h-full rounded-full transition-[width]",
          variant === "level"
            ? "bg-[linear-gradient(90deg,#2b7fff_0%,#ad46ff_100%)]"
            : "bg-(--colorAccess)",
        ].join(" ")}
        style={{ width: `${clampPercent(value)}%` }}
      />
    </div>
  );
}

export const ProgressBar = memo(ProgressBarBase);
