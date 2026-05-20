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
  const progress =
    maxRows === minRows ? 100 : ((rows - minRows) / (maxRows - minRows)) * 100;

  return (
    <div className="space-y-3  ">
      <div className="flex items-center justify-between">
        <p className="font-medium text-(--secondaryText) text-[14px]">Rows</p>
        <span className="flex h-7.5 w-10 items-center justify-center rounded-[10px] border border-(--borderColor) bg-(--bgTab) font-bold text-(--colorAccess)">
          {rows}
        </span>
      </div>
      <input
        type="range"
        min={minRows}
        max={maxRows}
        value={rows}
        onChange={(event) => setRows(Number(event.target.value))}
        className="plinko-range h-5 w-full cursor-pointer appearance-none bg-transparent"
        style={{
          ["--range-progress" as string]: `${progress}%`,
        }}
      />
      <div className="flex justify-between text-sm text-(--text)">
        <span>{minRows}</span>
        <span>{maxRows}</span>
      </div>
      
    </div>
  );
}
