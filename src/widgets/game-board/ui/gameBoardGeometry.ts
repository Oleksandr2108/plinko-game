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

export interface BoardLayout {
  paddingX: number;
  paddingTop: number;
  paddingBottom: number;
  pinSpacingX: number;
  pinSpacingY: number;
  slotSpacing: number;
  slotWidth: number;
  slotHeight: number;
  slotGapFromLastPin: number;
  pegApproachY: number;
  pegHopX: number;
  pegHopY: number;
  slotLandingOffset: number;
}

export const DESKTOP_BOARD_LAYOUT: BoardLayout = {
  paddingX: BOARD_PADDING,
  paddingTop: BOARD_PADDING,
  paddingBottom: BOARD_PADDING,
  pinSpacingX: SLOT_SPACING,
  pinSpacingY: PIN_SPACING_Y,
  slotSpacing: SLOT_SPACING,
  slotWidth: SLOT_WIDTH,
  slotHeight: SLOT_HEIGHT,
  slotGapFromLastPin: PIN_SPACING_Y * 2 + BOARD_PADDING + SLOT_GAP,
  pegApproachY: PEG_APPROACH_Y,
  pegHopX: PEG_HOP_X,
  pegHopY: PEG_HOP_Y,
  slotLandingOffset: SLOT_LANDING_OFFSET,
};

export const MOBILE_BOARD_LAYOUT: BoardLayout = {
  paddingX: 0,
  paddingTop: 56,
  paddingBottom: 0,
  pinSpacingX: 28,
  pinSpacingY: 35,
  slotSpacing: 39,
  slotWidth: 37,
  slotHeight: 26,
  slotGapFromLastPin: 68,
  pegApproachY: 10,
  pegHopX: 9,
  pegHopY: 8,
  slotLandingOffset: 10,
};

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

export const buildBallPath = (
  rows: number,
  layout: BoardLayout = DESKTOP_BOARD_LAYOUT,
): BoardMetrics => {
  const horizontalInset = layout.paddingX + layout.slotWidth / 2;
  const width = rows * layout.slotSpacing + horizontalInset * 2;
  const lastPinY = layout.paddingTop + Math.max(rows - 1, 0) * layout.pinSpacingY;
  const slotY = lastPinY + layout.slotGapFromLastPin;
  const pyramidHeight = slotY;
  const height = slotY + layout.slotHeight + layout.paddingBottom;

  return { width, height, pyramidHeight, slotY };
};

export const getSlotCenterX = (
  rows: number,
  slotIndex: number,
  layout: BoardLayout = DESKTOP_BOARD_LAYOUT,
) => {
  const { width } = buildBallPath(rows, layout);

  return width / 2 - (rows * layout.slotSpacing) / 2 + slotIndex * layout.slotSpacing;
};

export const getPinX = (
  rows: number,
  rowIndex: number,
  pinIndex: number,
  layout: BoardLayout = DESKTOP_BOARD_LAYOUT,
) => {
  const { width } = buildBallPath(rows, layout);
  const pinCount = rowIndex + 2;
  const startX = width / 2 - ((pinCount - 1) * layout.pinSpacingX) / 2;

  return startX + pinIndex * layout.pinSpacingX;
};

export const getPinY = (
  rowIndex: number,
  layout: BoardLayout = DESKTOP_BOARD_LAYOUT,
) => {
  return layout.paddingTop + rowIndex * layout.pinSpacingY;
};

export const buildPinRows = (
  rows: number,
  layout: BoardLayout = DESKTOP_BOARD_LAYOUT,
): PinRow[] => {
  return Array.from({ length: rows }, (_, rowIndex) => ({
    rowIndex,
    pins: Array.from({ length: rowIndex + 2 }, (_, pinIndex) => ({
      x: getPinX(rows, rowIndex, pinIndex, layout),
      y: getPinY(rowIndex, layout),
      key: `${rowIndex}-${pinIndex}`,
    })),
  }));
};

export const getBallKeyframes = (
  rows: number,
  path: string,
  slotIndex?: number,
  layout: BoardLayout = DESKTOP_BOARD_LAYOUT,
) => {
  const { width, slotY } = buildBallPath(rows, layout);
  const points = [{ x: width / 2, y: layout.paddingTop - layout.pinSpacingY * 0.8 }];
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
      const pegX = width / 2 + offset * (layout.pinSpacingX / 2);
      const pegY = getPinY(rowIndex, layout);

      points.push({
        x: pegX - horizontalDirection * 6,
        y: pegY - layout.pegApproachY,
      });
      points.push({
        x: pegX,
        y: pegY,
      });
      points.push({
        x: pegX + hopDirection * layout.pegHopX,
        y: pegY - layout.pegHopY,
      });
    });

  points.push({
    x:
      typeof slotIndex === "number"
        ? getSlotCenterX(rows, slotIndex, layout)
        : width / 2 + offset * (layout.pinSpacingX / 2),
    y: slotY - layout.slotLandingOffset,
  });

  return points;
};
