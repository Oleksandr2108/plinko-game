import Image from "next/image";
import type { ApiRiskLevel } from "@/entities/game";

import FilterIcon from "../../../../public/icons/filterIcon.svg";

export function BetHistoryFilters({
  riskFilter,
  rowsFilter,
  onRiskChange,
  onRowsChange,
}: {
  riskFilter: "ALL" | ApiRiskLevel;
  rowsFilter: string;
  onRiskChange: (value: "ALL" | ApiRiskLevel) => void;
  onRowsChange: (value: string) => void;
}) {
  return (
    <section className="rounded-[10px] border border-(--borderColor) bg-[rgba(30,36,56,0.55)] px-4 py-3">
      <div className="grid grid-cols-2 gap-3 text-xs text-(--secondaryText) sm:flex sm:flex-wrap sm:items-center">
        <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
          <Image
            src={FilterIcon}
            alt="Filter Icon"
            className="h-4 w-4"
          />
          <span className="text-[14px] font-medium">Filters</span>
        </div>
        <label className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <span className="text-[12px] text-(--text)">Risk</span>
          <select
            value={riskFilter}
            onChange={(event) =>
              onRiskChange(event.target.value as "ALL" | ApiRiskLevel)
            }
            className="h-9 w-full rounded-md border border-(--borderColor) bg-(--bgTab) px-2 text-[12px] text-white outline-none sm:h-auto sm:w-auto sm:py-1 sm:text-[11px]"
          >
            <option value="ALL">All</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>
        <label className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
          <span className="text-[12px] text-(--text)">Rows</span>
          <select
            value={rowsFilter}
            onChange={(event) => onRowsChange(event.target.value)}
            className="h-9 w-full rounded-md border border-(--borderColor) bg-(--bgTab) px-2 text-[12px] text-white outline-none sm:h-auto sm:w-auto sm:py-1 sm:text-[11px]"
          >
            <option value="ALL">All</option>
            {Array.from({ length: 9 }, (_, index) => 8 + index).map((rows) => (
              <option
                key={rows}
                value={rows}
              >
                {rows}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
