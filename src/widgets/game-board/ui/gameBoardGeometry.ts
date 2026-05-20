export const BOARD_PADDING = 24;
export const SLOT_SPACING = 80;
export const SLOT_WIDTH = 56;
export const SLOT_HEIGHT = 28;
export const PIN_SPACING_Y = 34;
export const SLOT_GAP = 22;
export const BALL_STEP_MS = 140;
export const PEG_APPROACH_Y = 10;
export const PEG_HOP_X = 16;
export const PEG_HOP_Y = 8;
export const SLOT_LANDING_OFFSET = 10;

export interface BoardMetrics {
  width: number;
  height: number;
  pyramidHeight: number;
  slotY: number;
}

export interface PinPoint {
  x: number;
  y: number;
  key: string;
}

export interface PinRow {
  rowIndex: number;
  pins: PinPoint[];
}

export interface SlotTone {
  stroke: string;
  fill: string;
  text: string;
}

export const formatMultiplier = (value: number) => {
  return `${Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1)}x`;
};

export const getSlotTone = (value: number): SlotTone => {
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

export const buildBallPath = (rows: number): BoardMetrics => {
  const horizontalInset = BOARD_PADDING + SLOT_WIDTH / 2;
  const width = rows * SLOT_SPACING + horizontalInset * 2;
  const pyramidHeight = (rows + 1) * PIN_SPACING_Y + BOARD_PADDING * 2;
  const slotY = pyramidHeight + SLOT_GAP;
  const height = slotY + SLOT_HEIGHT + BOARD_PADDING;

  return { width, height, pyramidHeight, slotY };
};

export const getSlotCenterX = (rows: number, slotIndex: number) => {
  const { width } = buildBallPath(rows);

  return width / 2 - (rows * SLOT_SPACING) / 2 + slotIndex * SLOT_SPACING;
};

export const getPinX = (rows: number, rowIndex: number, pinIndex: number) => {
  const { width } = buildBallPath(rows);
  const pinCount = rowIndex + 2;
  const startX = width / 2 - ((pinCount - 1) * SLOT_SPACING) / 2;

  return startX + pinIndex * SLOT_SPACING;
};

export const getPinY = (rowIndex: number) => {
  return BOARD_PADDING + rowIndex * PIN_SPACING_Y;
};

export const buildPinRows = (rows: number): PinRow[] => {
  return Array.from({ length: rows }, (_, rowIndex) => ({
    rowIndex,
    pins: Array.from({ length: rowIndex + 2 }, (_, pinIndex) => ({
      x: getPinX(rows, rowIndex, pinIndex),
      y: getPinY(rowIndex),
      key: `${rowIndex}-${pinIndex}`,
    })),
  }));
};

export const getBallKeyframes = (
  rows: number,
  path: string,
  slotIndex?: number,
) => {
  const { width, slotY } = buildBallPath(rows);
  const points = [{ x: width / 2, y: BOARD_PADDING - PIN_SPACING_Y * 0.8 }];
  let offset = 0;

  path
    .slice(0, rows)
    .split("")
    .forEach((direction, rowIndex, directions) => {
      const horizontalDirection = direction === "R" ? 1 : -1;
      const nextDirection = directions[rowIndex + 1];
      const hopDirection = nextDirection
        ? nextDirection === "R"
          ? 1
          : -1
        : horizontalDirection;

      offset += direction === "R" ? 1 : -1;
      const pegX = width / 2 + offset * (SLOT_SPACING / 2);
      const pegY = getPinY(rowIndex);

      points.push({
        x: pegX - horizontalDirection * 6,
        y: pegY - PEG_APPROACH_Y,
      });
      points.push({
        x: pegX,
        y: pegY,
      });
      points.push({
        x: pegX + hopDirection * PEG_HOP_X,
        y: pegY - PEG_HOP_Y,
      });
    });

  points.push({
    x:
      typeof slotIndex === "number"
        ? getSlotCenterX(rows, slotIndex)
        : width / 2 + offset * (SLOT_SPACING / 2),
    y: slotY - SLOT_LANDING_OFFSET,
  });

  return points;
};
