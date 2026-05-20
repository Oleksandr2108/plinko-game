"use client";

import { useBetModeStore, type BetMode } from "../model/store";

const tabs: BetMode[] = ["manual", "auto"];

export function BetModeTabs() {
  const mode = useBetModeStore((state) => state.mode);
  const setMode = useBetModeStore((state) => state.setMode);

  return (
    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-(--borderColor) bg-[#11161f] p-1">
      {tabs.map((tab) => {
        const active = mode === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => setMode(tab)}
            className={[
              "rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors",
              active
                ? "border border-(--borderColor) bg-[#1a2030] text-white"
                : "text-(--text)",
            ].join(" ")}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
