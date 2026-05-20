"use client";

import { useQuery } from "@tanstack/react-query";
import { useSelectRiskStore } from "@/features/select-risk";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";

const riskToApiMap = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
} as const;

const formatMultiplier = (value: number) => {
  return `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}x`;
};

const getSlotTone = (value: number) => {
  if (value >= 20) {
    return "border-(--colorError) bg-(--bgError) text-(--colorError)";
  }

  if (value >= 2) {
    return "border-[#f0b100] bg-(--bgMedium) text-[#f0b100]";
  }

  return "border-(--colorAccess) bg-(--bgAccess) text-(--colorAccess)";
};

export function GameBoard() {
  const rows = useSelectRiskStore((state) => state.rows);
  const risk = useSelectRiskStore((state) => state.risk);
  const gameConfigQuery = useQuery({
    queryKey: PLINKO_QUERY_KEYS.gameConfig,
    queryFn: plinkoApi.getGameConfig,
    staleTime: 60_000,
  });

  const apiRisk = riskToApiMap[risk];
  const multipliers =
    gameConfigQuery.data?.payoutTables[apiRisk]?.[String(rows)] ?? [];

  return (
    <section className="flex min-h-screen flex-1 flex-col justify-between bg-[radial-gradient(circle_at_top,_rgba(30,38,56,0.45),_rgba(15,20,25,0)_40%),rgba(17,22,30,0.94)] px-6 py-10 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5">
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-center gap-5 sm:gap-6"
            >
              {Array.from({ length: rowIndex + 2 }, (_, pinIndex) => (
                <span
                  key={`${rowIndex}-${pinIndex}`}
                  className="h-1.5 w-1.5 rounded-full bg-[#7f8ba0] shadow-[0_0_0_1px_rgba(255,255,255,0.05)] sm:h-2 sm:w-2"
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-5xl justify-center">
        {gameConfigQuery.isLoading ? (
          <p className="text-sm text-(--text)">Loading board...</p>
        ) : multipliers.length ? (
          <div className="flex w-full max-w-4xl items-center justify-center gap-1.5 overflow-x-auto pb-2 sm:gap-2">
            {multipliers.map((multiplier, index) => (
              <div
                key={`${rows}-${risk}-${index}`}
                className={[
                  "min-w-12 rounded-lg border px-2 py-1.5 text-center text-[11px] font-semibold sm:min-w-14 sm:text-xs",
                  getSlotTone(multiplier),
                ].join(" ")}
              >
                {formatMultiplier(multiplier)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-(--text)">No payout table available.</p>
        )}
      </div>
    </section>
  );
}
