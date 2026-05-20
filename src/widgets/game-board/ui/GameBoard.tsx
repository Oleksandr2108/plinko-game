"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDropBallStore } from "@/features/drop-ball";
import { useSelectRiskStore } from "@/features/select-risk";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";

const BOARD_PADDING = 24;
const SLOT_SPACING = 80;
const SLOT_WIDTH = 56;
const SLOT_HEIGHT = 28;
const PIN_SPACING_Y = 34;
const SLOT_GAP = 22;
const BALL_STEP_MS = 140;

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
    return {
      stroke: "var(--colorError)",
      fill: "var(--bgError)",
      text: "var(--colorError)",
    };
  }

  if (value >= 2) {
    return {
      stroke: "#f0b100",
      fill: "var(--bgMedium)",
      text: "#f0b100",
    };
  }

  return {
    stroke: "var(--colorAccess)",
    fill: "var(--bgAccess)",
    text: "var(--colorAccess)",
  };
};

const buildBallPath = (rows: number) => {
  const horizontalInset = BOARD_PADDING + SLOT_WIDTH / 2;
  const width = rows * SLOT_SPACING + horizontalInset * 2;
  const pyramidHeight = (rows + 1) * PIN_SPACING_Y + BOARD_PADDING * 2;
  const slotY = pyramidHeight + SLOT_GAP;
  const height = slotY + SLOT_HEIGHT + BOARD_PADDING;

  return { width, height, pyramidHeight, slotY };
};

const getSlotCenterX = (rows: number, slotIndex: number) => {
  const { width } = buildBallPath(rows);

  return width / 2 - (rows * SLOT_SPACING) / 2 + slotIndex * SLOT_SPACING;
};

const getPinX = (rows: number, rowIndex: number, pinIndex: number) => {
  const { width } = buildBallPath(rows);
  const pinCount = rowIndex + 2;
  const startX = width / 2 - ((pinCount - 1) * SLOT_SPACING) / 2;

  return startX + pinIndex * SLOT_SPACING;
};

const getPinY = (rowIndex: number) => {
  return BOARD_PADDING + rowIndex * PIN_SPACING_Y;
};

const getBallKeyframes = (rows: number, path: string, slotIndex?: number) => {
  const { width, slotY } = buildBallPath(rows);
  const points = [{ x: width / 2, y: BOARD_PADDING - PIN_SPACING_Y * 0.8 }];
  let offset = 0;

  path
    .slice(0, rows)
    .split("")
    .forEach((direction, rowIndex) => {
      offset += direction === "R" ? 1 : -1;
      points.push({
        x: width / 2 + offset * (SLOT_SPACING / 2),
        y: getPinY(rowIndex) + PIN_SPACING_Y / 2,
      });
    });

  points.push({
    x:
      typeof slotIndex === "number"
        ? getSlotCenterX(rows, slotIndex)
        : width / 2 + offset * (SLOT_SPACING / 2),
    y: slotY + SLOT_HEIGHT / 2,
  });

  return points;
};

function AnimatedBall({
  rows,
  path,
  slotIndex,
}: {
  rows: number;
  path: string;
  slotIndex?: number;
}) {
  const frames = useMemo(
    () => getBallKeyframes(rows, path, slotIndex),
    [path, rows, slotIndex],
  );
  const [frameIndex, setFrameIndex] = useState(0);
  const activeFrame =
    frames[Math.min(frameIndex, Math.max(frames.length - 1, 0))];

  useEffect(() => {
    if (frames.length === 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setFrameIndex((current) => {
        if (current >= frames.length - 1) {
          window.clearInterval(intervalId);
          return current;
        }

        return current + 1;
      });
    }, BALL_STEP_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [frames]);

  if (!activeFrame) {
    return null;
  }

  return (
    <circle
      cx={activeFrame.x}
      cy={activeFrame.y}
      r="6"
      fill="#f8fafc"
      className="drop-shadow-[0_0_12px_rgba(255,255,255,0.65)]"
      style={{
        transition: `cx ${BALL_STEP_MS}ms linear, cy ${BALL_STEP_MS}ms linear`,
      }}
    />
  );
}

export function GameBoard() {
  const rows = useSelectRiskStore((state) => state.rows);
  const risk = useSelectRiskStore((state) => state.risk);
  const latestBall = useDropBallStore((state) => state.history[0]);
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
  const pinRows = useMemo(
    () =>
      Array.from({ length: rows }, (_, rowIndex) => ({
        rowIndex,
        pins: Array.from({ length: rowIndex + 2 }, (_, pinIndex) => ({
          x: getPinX(rows, rowIndex, pinIndex),
          y: getPinY(rowIndex),
          key: `${rowIndex}-${pinIndex}`,
        })),
      })),
    [rows],
  );

  return (
    <section className="flex min-h-screen flex-1 flex-col  bg-[radial-gradient(circle_at_top,rgba(30,38,56,0.45),rgba(15,20,25,0)_40%),rgba(17,22,30,0.94)] px-6 py-10 lg:px-10">
      <div className="mx-auto flex w-full flex-1 flex-col justify-center">
        <div className="mx-auto w-full max-w-6xl">
          <div
            className="relative mx-auto w-full"
            style={{
              maxWidth: `${boardMetrics.width}px`,
            }}
          >
            <svg
              viewBox={`0 0 ${boardMetrics.width} ${boardMetrics.height}`}
              className="block h-auto w-full overflow-visible"
              preserveAspectRatio="xMidYMin meet"
              role="presentation"
            >
              {pinRows.flatMap((row) =>
                row.pins.map((pin) => (
                  <circle
                    key={pin.key}
                    cx={pin.x}
                    cy={pin.y}
                    r="3.3"
                    fill="#8b95a7"
                    opacity="0.9"
                  />
                )),
              )}

              {multipliers.map((multiplier, index) => {
                const tone = getSlotTone(multiplier);
                const slotCenterX = slotCenters[index];
                const isWinningSlot =
                  latestBall?.rows === rows && latestBall.slotIndex === index;

                return (
                  <g
                    key={`${rows}-${risk}-${index}`}
                    transform={`translate(${slotCenterX - SLOT_WIDTH / 2} ${boardMetrics.slotY})`}
                  >
                    <rect
                      x="0"
                      y="0"
                      rx="8"
                      ry="8"
                      width={SLOT_WIDTH}
                      height={SLOT_HEIGHT}
                      fill={tone.fill}
                      stroke={tone.stroke}
                      strokeWidth={isWinningSlot ? 2 : 1}
                    />
                    {isWinningSlot ? (
                      <rect
                        x="-2"
                        y="-2"
                        rx="10"
                        ry="10"
                        width={SLOT_WIDTH + 4}
                        height={SLOT_HEIGHT + 4}
                        fill="none"
                        stroke="rgba(255,255,255,0.28)"
                        strokeWidth="1"
                      />
                    ) : null}
                    <text
                      x={SLOT_WIDTH / 2}
                      y={SLOT_HEIGHT / 2 + 4}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill={tone.text}
                    >
                      {formatMultiplier(multiplier)}
                    </text>
                  </g>
                );
              })}

              {latestBall?.rows === rows ? (
                <AnimatedBall
                  key={latestBall.id}
                  rows={rows}
                  path={latestBall.path}
                  slotIndex={latestBall.slotIndex}
                />
              ) : null}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
