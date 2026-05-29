import {
  formatMultiplier,
  getSlotTone,
  DESKTOP_BOARD_LAYOUT,
  SLOT_HEIGHT,
  SLOT_WIDTH,
} from "./gameBoardGeometry";

export function MultiplierSlots({
  multipliers,
  rows,
  risk,
  slotCenters,
  slotY,
  slotWidth = SLOT_WIDTH,
  slotHeight = SLOT_HEIGHT,
  winningSlotIndex,
}: {
  multipliers: number[];
  rows: number;
  risk: "low" | "medium" | "high";
  slotCenters: number[];
  slotY: number;
  slotWidth?: number;
  slotHeight?: number;
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
            transform={`translate(${slotCenterX - slotWidth / 2} ${slotY})`}
          >
            <rect
              x="0"
              y="0"
              rx={slotWidth < DESKTOP_BOARD_LAYOUT.slotWidth ? 4 : 8}
              ry={slotWidth < DESKTOP_BOARD_LAYOUT.slotWidth ? 4 : 8}
              width={slotWidth}
              height={slotHeight}
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
                width={slotWidth + 4}
                height={slotHeight + 4}
                fill="none"
                stroke="var(--colorSlotStroke)"
                strokeWidth="1"
              />
            ) : null}
            <text
              x={slotWidth / 2}
              y={slotHeight / 2 + 4}
              textAnchor="middle"
              fontSize={slotWidth < DESKTOP_BOARD_LAYOUT.slotWidth ? 12 : 11}
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
