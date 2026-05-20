"use client";

import { GAME_CONFIG } from "@/shared/config";
import type { RiskLevel } from "@/shared/config";
import { useSelectRiskStore } from "../model/store";

export function RiskSelector({ levels }: { levels?: RiskLevel[] }) {
  const risk = useSelectRiskStore((state) => state.risk);
  const setRisk = useSelectRiskStore((state) => state.setRisk);
  const riskLevels = levels ?? GAME_CONFIG.risk.levels;

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-white">Risk</p>
      <div className="grid grid-cols-3 gap-2">
        {riskLevels.map((level) => {
          const active = risk === level;

          return (
            <button
              key={level}
              type="button"
              onClick={() => setRisk(level)}
              className={[
                "rounded-xl border px-3 py-3 text-sm font-semibold uppercase transition-colors",
                active
                  ? "border-(--colorAccess) bg-[rgba(0,201,80,0.12)] text-(--colorAccess)"
                  : "border-(--borderColor) bg-(--inputBg) text-(--secondaryText)",
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
