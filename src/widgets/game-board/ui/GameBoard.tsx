"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDropBallStore } from "@/features/drop-ball";
import { useGameSettingsStore } from "@/features/game-settings";
import { useSelectRiskStore } from "@/features/select-risk";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";
import { AnimatedBall } from "./AnimatedBall";
import {
  buildBallPath,
  buildPinRows,
  getSlotCenterX,
} from "./gameBoardGeometry";
import { MultiplierSlots } from "./MultiplierSlots";
import { PegField } from "./PegField";

const riskToApiMap = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
} as const;

export function GameBoard() {
  const rows = useSelectRiskStore((state) => state.rows);
  const risk = useSelectRiskStore((state) => state.risk);
  const activeDrop = useDropBallStore((state) => state.activeDrop);
  const settledSlotIndex = useDropBallStore((state) => state.settledSlotIndex);
  const completeActiveDrop = useDropBallStore(
    (state) => state.completeActiveDrop,
  );
  const animationsEnabled = useGameSettingsStore(
    (state) => state.animationsEnabled,
  );
  const gameConfigQuery = useQuery({
    queryKey: PLINKO_QUERY_KEYS.gameConfig,
    queryFn: plinkoApi.getGameConfig,
    staleTime: 60_000,
  });

  const apiRisk = riskToApiMap[risk];
  const multipliers = useMemo(
    () => gameConfigQuery.data?.payoutTables[apiRisk]?.[String(rows)] ?? [],
    [apiRisk, gameConfigQuery.data, rows],
  );
  const boardMetrics = useMemo(() => buildBallPath(rows), [rows]);
  const slotCenters = useMemo(
    () => multipliers.map((_, index) => getSlotCenterX(rows, index)),
    [multipliers, rows],
  );
  const pinRows = useMemo(() => buildPinRows(rows), [rows]);

  return (
    <section className="flex min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(30,38,56,0.45),rgba(15,20,25,0)_40%),rgba(17,22,30,0.94)] px-6 lg:px-10">
      <div className="mx-auto flex w-full flex-1 flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl">
          <div
            className="relative mx-auto w-full"
            style={{
              maxWidth: `${boardMetrics.width}px`,
            }}
          >
            <svg
              viewBox={`0 0 ${boardMetrics.width} ${boardMetrics.height}`}
              className="pointer-events-none block h-auto w-full overflow-visible"
              preserveAspectRatio="xMidYMin meet"
              role="presentation"
            >
              <PegField pinRows={pinRows} />

              <MultiplierSlots
                multipliers={multipliers}
                rows={rows}
                risk={risk}
                slotCenters={slotCenters}
                slotY={boardMetrics.slotY}
                winningSlotIndex={
                  activeDrop?.ball.rows === rows
                    ? undefined
                    : (settledSlotIndex ?? undefined)
                }
              />

              {activeDrop?.ball.rows === rows ? (
                <AnimatedBall
                  key={activeDrop.ball.id}
                  rows={rows}
                  path={activeDrop.ball.path}
                  slotIndex={activeDrop.ball.slotIndex}
                  enabled={animationsEnabled}
                  onComplete={completeActiveDrop}
                />
              ) : null}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
