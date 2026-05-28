"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AutoBetForm } from "@/features/auto-bet";
import { BetModeTabs, useBetModeStore } from "@/features/bet-mode";
import { DropBallButton, useDropBallStore } from "@/features/drop-ball";
import { usePlaceBetStore } from "@/features/place-bet/model/store";
import { PlaceBetForm } from "@/features/place-bet";
import { useSelectRiskStore } from "@/features/select-risk/model/store";
import { RiskSelector, RowsSlider } from "@/features/select-risk";
import { useBetPanel } from "../model/useBetPanel";
import { BetPanelFooter } from "./BetPanelFooter";
import IconSettings from "../../../../public/icons/settingIcon.svg";

const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function BetPanelContent({ showFooter = true }: { showFooter?: boolean }) {
  const mode = useBetModeStore((state) => state.mode);
  const isDropping = useDropBallStore((state) => state.isDropping);
  const {
    errorMessage,
    gameConfig,
    isLoading,
    isAutoSubmitting,
    isManualSubmitting,
    placeManualBet,
    startAutoBet,
    stopAutoBet,
  } = useBetPanel();

  const riskLevels = gameConfig?.risks.map(
    (risk) => risk.toLowerCase() as "low" | "medium" | "high",
  );
  const minRows = gameConfig?.rows[0];
  const maxRows = gameConfig?.rows.at(-1);

  return (
    <>
      <div className="w-full space-y-5">
        <BetModeTabs />
        {isLoading ? (
          <p className="text-sm text-(--text)">Loading bet panel...</p>
        ) : null}
        <PlaceBetForm />
        <RiskSelector
          levels={riskLevels}
          disabled={isDropping}
        />
        <RowsSlider
          minRows={minRows}
          maxRows={maxRows}
          disabled={isDropping}
        />
        {errorMessage ? (
          <p className="text-sm text-(--colorError)">{errorMessage}</p>
        ) : null}
        {mode === "auto" ? (
          <AutoBetForm
            onStart={startAutoBet}
            onStop={stopAutoBet}
            isPending={isAutoSubmitting}
          />
        ) : (
          <DropBallButton
            onClick={placeManualBet}
            isPending={isManualSubmitting}
          />
        )}
      </div>
      {showFooter ? <BetPanelFooter /> : null}
    </>
  );
}

export function BetPanel({ className }: { className?: string }) {
  return (
    <aside
      className={[
        "relative z-10 flex w-full max-w-82 shrink-0 flex-col items-center justify-between border-r border-(--borderColor) bg-[rgba(26,31,46,0.92)] px-4 pt-4 shadow-[0_18px_40px_rgba(0,0,0,0.35)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <BetPanelContent />
    </aside>
  );
}

export function MobileBetPanel() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openPanel = () => setIsOpen(true);

    window.addEventListener("open-mobile-bet-panel", openPanel);

    return () => {
      window.removeEventListener("open-mobile-bet-panel", openPanel);
    };
  }, []);

  return (
    <>
      <MobileBetDock
        isHidden={isOpen}
        onOpen={() => setIsOpen(true)}
      />

      {isOpen ? (
        <div className="pointer-events-none fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close bet panel"
            onClick={() => setIsOpen(false)}
            className="pointer-events-auto absolute bottom-[65px] right-0 top-0 w-[max(46px,calc(100vw-319px))] bg-transparent"
          />
          <aside className="pointer-events-auto absolute bottom-[65px] left-0 top-0 flex w-[min(319px,calc(100vw-46px))] flex-col border-r border-(--borderColor) bg-[#1a1f2e] shadow-[18px_0_55px_rgba(0,0,0,0.42)]">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close bet panel"
              className="absolute right-[-16px] top-4 z-10 flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#2a2f3e] text-[20px] leading-none text-(--secondaryText)"
            >
              x
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4">
              <BetPanelContent showFooter={false} />
            </div>
            <div className="shrink-0 px-4">
              <BetPanelFooter />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function MobileBetDock({
  isHidden,
  onOpen,
}: {
  isHidden: boolean;
  onOpen: () => void;
}) {
  const mode = useBetModeStore((state) => state.mode);
  const amount = usePlaceBetStore((state) => state.amount);
  const risk = useSelectRiskStore((state) => state.risk);
  const rows = useSelectRiskStore((state) => state.rows);
  const {
    isAutoSubmitting,
    isManualSubmitting,
    placeManualBet,
    startAutoBet,
    stopAutoBet,
  } = useBetPanel();
  const isPending = mode === "auto" ? isAutoSubmitting : isManualSubmitting;

  const handlePrimaryClick = () => {
    if (mode === "auto") {
      if (isAutoSubmitting) {
        stopAutoBet();
        return;
      }

      void startAutoBet();
      return;
    }

    void placeManualBet();
  };

  return (
    <section
      className={[
        "mx-4 mb-4 shrink-0 rounded-[10px] border border-(--borderColor) bg-[#1a1f2e] p-[13px] shadow-[0_25px_25px_rgba(0,0,0,0.25)] md:hidden",
        isHidden ? "pointer-events-none invisible" : "visible",
      ].join(" ")}
    >
      <div className="mb-2 flex h-8 items-center gap-2">
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open bet panel"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] bg-[#2a2f3e]"
        >
          <Image
            src={IconSettings}
            alt=""
            aria-hidden="true"
            className="h-4 w-4"
          />
        </button>
        <p className="min-w-0 truncate text-[12px] leading-4 text-(--text)">
          {amountFormatter.format(amount)} • {risk.toUpperCase()} • {rows} rows
        </p>
      </div>
      <button
        type="button"
        onClick={handlePrimaryClick}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] text-[16px] font-bold text-white shadow-[0_10px_15px_rgba(0,0,0,0.1)]"
        style={{
          background: "var(--buttonBg)",
        }}
      >
        {isPending ? (
          <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white/70" />
        ) : null}
        {isPending ? "Playing..." : mode === "auto" ? "Start Auto" : "Bet"}
      </button>
    </section>
  );
}
