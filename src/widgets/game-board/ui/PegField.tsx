import type { PinRow } from "./gameBoardGeometry";

export function PegField({ pinRows }: { pinRows: PinRow[] }) {
  return (
    <>
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
    </>
  );
}
