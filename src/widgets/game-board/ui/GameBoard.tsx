"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";
import { useDropBallStore } from "@/features/drop-ball";
import { useGameSettingsStore } from "@/features/game-settings";
import { useSelectRiskStore } from "@/features/select-risk";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";
import { AnimatedBall } from "./AnimatedBall";
import {
  buildBallPath,
  buildPinRows,
  DESKTOP_BOARD_LAYOUT,
  getSlotCenterX,
  MOBILE_BOARD_LAYOUT,
} from "./gameBoardGeometry";
import { MultiplierSlots } from "./MultiplierSlots";
import { PegField } from "./PegField";

const riskToApiMap = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
} as const;

const useMobileBoardLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mediaQuery.matches);

    update();
    mediaQuery.addEventListener("change", update);

    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isMobile;
};

export function GameBoard() {
  const isMobileLayout = useMobileBoardLayout();
  const boardLayout = isMobileLayout
    ? MOBILE_BOARD_LAYOUT
    : DESKTOP_BOARD_LAYOUT;
  const [rows, risk] = useSelectRiskStore(
    useShallow((state) => [state.rows, state.risk]),
  );
  const [activeDrops, settledSlotIndex, completeActiveDrop] = useDropBallStore(
    useShallow((state) => [
      state.activeDrops,
      state.settledSlotIndex,
      state.completeActiveDrop,
    ]),
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
  const boardMetrics = useMemo(
    () => buildBallPath(rows, boardLayout),
    [boardLayout, rows],
  );
  const slotCenters = useMemo(
    () =>
      multipliers.map((_, index) => getSlotCenterX(rows, index, boardLayout)),
    [boardLayout, multipliers, rows],
  );
  const pinRows = useMemo(
    () => buildPinRows(rows, boardLayout),
    [boardLayout, rows],
  );
  const visibleDrops = useMemo(
    () => activeDrops.filter((drop) => drop.ball.rows === rows),
    [activeDrops, rows],
  );
  const hasVisibleActiveDrop = visibleDrops.length > 0;

  return (
    <section className="flex min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(30,38,56,0.45),rgba(15,20,25,0)_40%),rgba(17,22,30,0.94)] px-2 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full flex-1 flex-col justify-start overflow-hidden pt-0 sm:justify-center sm:pt-0">
        <div className="mx-auto w-full max-w-6xl">
          <div
            className="relative mx-auto w-full max-h-[calc(100dvh-244px)] sm:max-h-none"
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
              <PegField
                pinRows={pinRows}
                radius={isMobileLayout ? 3 : 3.3}
              />

              <MultiplierSlots
                multipliers={multipliers}
                rows={rows}
                risk={risk}
                slotCenters={slotCenters}
                slotY={boardMetrics.slotY}
                slotWidth={boardLayout.slotWidth}
                slotHeight={boardLayout.slotHeight}
                winningSlotIndex={
                  hasVisibleActiveDrop
                    ? undefined
                    : (settledSlotIndex ?? undefined)
                }
              />

              {visibleDrops.map((drop) => (
                <AnimatedBall
                  key={`${drop.ball.id}-${animationsEnabled ? "animated" : "static"}`}
                  rows={rows}
                  path={drop.ball.path}
                  slotIndex={drop.ball.slotIndex}
                  enabled={animationsEnabled}
                  delayMs={animationsEnabled ? drop.launchDelayMs : 0}
                  layout={boardLayout}
                  onComplete={() => completeActiveDrop(drop.ball.id)}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
