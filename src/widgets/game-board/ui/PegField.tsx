import type { PinRow } from "./gameBoardGeometry";

export function PegField({
  pinRows,
  radius = 3.3,
}: {
  pinRows: PinRow[];
  radius?: number;
}) {
  return (
    <>
      {pinRows.flatMap((row) =>
        row.pins.map((pin) => (
          <circle
            key={pin.key}
            cx={pin.x}
            cy={pin.y}
            r={radius}
            fill="var(--colorPeg)"
            opacity="0.9"
          />
        )),
      )}
    </>
  );
}
