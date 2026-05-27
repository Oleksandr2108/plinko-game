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
            fill="#8b95a7"
            opacity="0.9"
          />
        )),
      )}
    </>
  );
}
