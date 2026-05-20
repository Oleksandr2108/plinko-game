import {
  formatMultiplier,
  getSlotTone,
  SLOT_HEIGHT,
  SLOT_WIDTH,
} from "./gameBoardGeometry";

export function MultiplierSlots({
  multipliers,
  rows,
  risk,
  slotCenters,
  slotY,
  winningSlotIndex,
}: {
  multipliers: number[];
  rows: number;
  risk: "low" | "medium" | "high";
  slotCenters: number[];
  slotY: number;
  winningSlotIndex?: number;
}) {
  return (
    <>
      {multipliers.map((multiplier, index) => {
        const tone = getSlotTone(multiplier);
        const slotCenterX = slotCenters[index];
        const isWinningSlot = winningSlotIndex === index;

        return (
          <g
            key={`${rows}-${risk}-${index}`}
            transform={`translate(${slotCenterX - SLOT_WIDTH / 2} ${slotY})`}
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
    </>
  );
}
