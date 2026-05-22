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
      <div className="flex flex-wrap items-center gap-3 text-xs text-(--secondaryText)">
        <Image
          src={FilterIcon}
          alt="Filter Icon"
        />
        <span className="text-[14px] font-medium">Filters:</span>
        <label className="flex items-center gap-2">
          <span className="text-(--text)">Risk:</span>
          <select
            value={riskFilter}
            onChange={(event) =>
              onRiskChange(event.target.value as "ALL" | ApiRiskLevel)
            }
            className="rounded-md border border-(--borderColor) bg-(--bgTab) px-2 py-1 text-[11px] text-white outline-none"
          >
            <option value="ALL">All</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-(--text)">Rows:</span>
          <select
            value={rowsFilter}
            onChange={(event) => onRowsChange(event.target.value)}
            className="rounded-md border border-(--borderColor) bg-(--bgTab) px-2 py-1 text-[11px] text-white outline-none"
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
