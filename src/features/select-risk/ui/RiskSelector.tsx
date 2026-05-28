"use client";

import { useShallow } from "zustand/react/shallow";
import { GAME_CONFIG } from "@/shared/config";
import type { RiskLevel } from "@/shared/config";
import { useSelectRiskStore } from "../model/store";

export function RiskSelector({
  levels,
  disabled = false,
}: {
  levels?: RiskLevel[];
  disabled?: boolean;
}) {
  const [risk, setRisk] = useSelectRiskStore(
    useShallow((state) => [state.risk, state.setRisk]),
  );
  const riskLevels = levels ?? GAME_CONFIG.risk.levels;

  return (
    <div className="space-y-3">
      <p className="font-medium text-(--secondaryText) text-[14px]">Risk</p>
      <div className="grid grid-cols-3 gap-2">
        {riskLevels.map((level) => {
          const active = risk === level;
          const activeClass =
            level === "low"
              ? "border-(--colorAccess) bg-(--bgAccess) text-(--colorAccess)"
              : level === "medium"
                ? "border-(--colorMedium) bg-(--bgMedium) text-(--colorMedium)"
                : "border-(--colorError) bg-(--bgError) text-(--colorError)";

          return (
            <button
              key={level}
              type="button"
              disabled={disabled}
              onClick={() => setRisk(level)}
              className={[
                "rounded-[10px] border flex items-center justify-center py-2 font-medium uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                disabled ? "cursor-not-allowed" : "cursor-pointer",
                active
                  ? activeClass
                  : "border-(--borderColor) bg-(--bgTab) text-(--text)",
              ].join(" ")}
            >
              {level}
            </button>
          );
        })}
      </div>
    </div>
  );
}
