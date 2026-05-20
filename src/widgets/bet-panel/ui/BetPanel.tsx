"use client";

import { AutoBetForm } from "@/features/auto-bet";
import { BetModeTabs, useBetModeStore } from "@/features/bet-mode";
import { DropBallButton } from "@/features/drop-ball";
import { PlaceBetForm } from "@/features/place-bet";
import { RiskSelector, RowsSlider } from "@/features/select-risk";
import { useBetPanel } from "../model/useBetPanel";

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
    <aside className="w-full max-w-[328px] rounded-[24px] border border-(--borderColor) bg-[rgba(26,31,46,0.92)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
      <div className="space-y-5">
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
        {activeSeed ? (
          <div className="rounded-xl border border-(--borderColor) bg-[#11161f] px-4 py-3 text-xs text-(--text)">
            <p>Nonce: {activeSeed.nonce}</p>
            <p>Client Seed: {activeSeed.clientSeed}</p>
            <p>Seed Hash: {activeSeed.serverSeedHash.slice(0, 16)}...</p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
