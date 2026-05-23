"use client";

import { AutoBetForm } from "@/features/auto-bet";
import { BetModeTabs, useBetModeStore } from "@/features/bet-mode";
import { DropBallButton } from "@/features/drop-ball";
import { PlaceBetForm } from "@/features/place-bet";
import { RiskSelector, RowsSlider } from "@/features/select-risk";
import { useBetPanel } from "../model/useBetPanel";
import { BetPanelFooter } from "./BetPanelFooter";

export function BetPanel() {
  const mode = useBetModeStore((state) => state.mode);
  const {
    errorMessage,
    gameConfig,
    isLoading,
    isAutoSubmitting,
    isManualSubmitting,
    placeManualBet,
    startAutoBet,
  } = useBetPanel();

  const riskLevels = gameConfig?.risks.map(
    (risk) => risk.toLowerCase() as "low" | "medium" | "high",
  );
  const minRows = gameConfig?.rows[0];
  const maxRows = gameConfig?.rows.at(-1);

  return (
    <aside className="relative z-10 flex h-screen w-full max-w-82 shrink-0 flex-col items-center justify-between border-r border-(--borderColor) bg-[rgba(26,31,46,0.92)] px-4 pt-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
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
            isPending={isAutoSubmitting}
          />
        ) : (
          <DropBallButton
            onClick={placeManualBet}
            isPending={isManualSubmitting}
          />
        )}
      </div>
      <BetPanelFooter />
    </aside>
  );
}
