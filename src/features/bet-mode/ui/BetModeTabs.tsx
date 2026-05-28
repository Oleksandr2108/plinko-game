"use client";

import { useShallow } from "zustand/react/shallow";
import { useBetModeStore, type BetMode } from "../model/store";

const tabs: BetMode[] = ["manual", "auto"];

export function BetModeTabs() {
  const [mode, setMode] = useBetModeStore(
    useShallow((state) => [state.mode, state.setMode]),
  );

  return (
    <div className="grid grid-cols-2 gap-1 rounded-[14px]  bg-(--bgTab) p-1 h-9">
      {tabs.map((tab) => {
        const active = mode === tab;

        return (
          <button
            key={tab}
            type="button"
            onClick={() => setMode(tab)}
            className={[
              "rounded-[14px] text-[14px] flex items-center justify-center font-medium capitalize transition-colors cursor-pointer",
              active
                ? "border border-(--borderColor) bg-(--bgTabActive) text-(--activeTabText)  "
                : "text-(--placeholderColor) ",
            ].join(" ")}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
