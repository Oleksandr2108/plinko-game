"use client";

import { AutoBetForm } from "@/features/auto-bet";
import { BetModeTabs, useBetModeStore } from "@/features/bet-mode";
import { DropBallButton } from "@/features/drop-ball";
import { PlaceBetForm } from "@/features/place-bet";
import { RiskSelector, RowsSlider } from "@/features/select-risk";
import { useBetPanel } from "../model/useBetPanel";
import Image from "next/image";

import IconFullScreen from "../../../../public/icons/fullScreenIcon.svg";
import IconSettings from "../../../../public/icons/settingIcon.svg";

export function BetPanel() {
  const mode = useBetModeStore((state) => state.mode);
  const {
    activeSeed,
    errorMessage,
    gameConfig,
    isLoading,
    isSubmitting,
    placeManualBet,
    startAutoBet,
  } = useBetPanel();

  const riskLevels = gameConfig?.risks.map(
    (risk) => risk.toLowerCase() as "low" | "medium" | "high",
  );
  const minRows = gameConfig?.rows[0];
  const maxRows = gameConfig?.rows.at(-1);

  return (
    <aside className="w-full flex items-center justify-between flex-col  max-w-82  h-screen border-r border-(--borderColor) bg-[rgba(26,31,46,0.92)] px-4 pt-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
      <div className="w-full space-y-5">
        <BetModeTabs />
        {isLoading ? (
          <p className="text-sm text-(--text)">Loading bet panel...</p>
        ) : null}
        <PlaceBetForm />
        <RiskSelector levels={riskLevels} />
        <RowsSlider
          minRows={minRows}
          maxRows={maxRows}
        />
        {errorMessage ? (
          <p className="text-sm text-(--colorError)">{errorMessage}</p>
        ) : null}
        {mode === "auto" ? (
          <AutoBetForm
            onStart={startAutoBet}
            isPending={isSubmitting}
          />
        ) : (
          <DropBallButton
            onClick={placeManualBet}
            isPending={isSubmitting}
          />
        )}
      </div>
      <div className="-mx-4 flex h-16 w-[calc(100%+2rem)] items-center justify-between border-t border-(--borderColor) px-4 py-6">
        <Image
          src={IconFullScreen}
          alt="Full Screen"
        />
        <Image
          src={IconSettings}
          alt="Settings"
        />
      </div>
    </aside>
  );
}
