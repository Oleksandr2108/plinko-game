"use client";

import { GAME_CONFIG } from "@/shared/config";
import { useSelectRiskStore } from "../model/store";

export function RowsSlider({
  minRows = GAME_CONFIG.rows.min,
  maxRows = GAME_CONFIG.rows.max,
}: {
  minRows?: number;
  maxRows?: number;
}) {
  const rows = useSelectRiskStore((state) => state.rows);
  const setRows = useSelectRiskStore((state) => state.setRows);

  return (
    <div className="space-y-3 border-b border-(--borderColor) pb-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-white">Rows</p>
        <span className="rounded-xl border border-(--borderColor) bg-[#11161f] px-3 py-1 text-lg font-semibold text-(--colorAccess)">
          {rows}
        </span>
      </div>
      <input
        type="range"
        min={minRows}
        max={maxRows}
        value={rows}
        onChange={(event) => setRows(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#2b2b26] accent-(--colorAccess)"
      />
      <div className="flex justify-between text-sm text-(--text)">
        <span>{minRows}</span>
        <span>{maxRows}</span>
      </div>
    </div>
  );
}
