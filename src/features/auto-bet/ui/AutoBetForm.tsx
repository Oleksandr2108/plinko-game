"use client";

import { useGameSettingsStore } from "@/features/game-settings";
import { playBetSound, primeGameSounds } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { useAutoBetStore } from "../model/store";
import { useShallow } from "zustand/react/shallow";

function Field({
  label,
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-[14px] font-medium text-(--secondaryText)">
        {label}
      </span>
      <input
        type="text"
        inputMode="decimal"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-lg border border-(--borderColor) bg-(--inputBg) px-4 py-2 text-white outline-none"
      />
    </label>
  );
}

export function AutoBetForm({
  onStart,
  onStop,
  isPending,
}: {
  onStart?: () => void | Promise<void>;
  onStop?: () => void;
  isPending?: boolean;
}) {
  const [
    numberOfBets,
    stopOnProfit,
    stopOnLoss,
    setNumberOfBets,
    setStopOnProfit,
    setStopOnLoss,
    completedBets,
  ] = useAutoBetStore(
    useShallow((state) => [
      state.numberOfBets,
      state.stopOnProfit,
      state.stopOnLoss,
      state.setNumberOfBets,
      state.setStopOnProfit,
      state.setStopOnLoss,
      state.completedBets,
    ]),
  );
  const soundEnabled = useGameSettingsStore((state) => state.soundEnabled);

  const handleStart = async () => {
    await primeGameSounds();

    if (soundEnabled) {
      playBetSound();
    }

    await onStart?.();
  };

  return (
    <div className="space-y-4 pt-4 border-t  border-(--borderColor)">
      <Field
        label="Number of Bets"
        value={numberOfBets}
        onChange={setNumberOfBets}
        min={1}
      />
      <div className="grid grid-cols-2 gap-3 mt-4">
        <Field
          label="Stop on Profit"
          value={stopOnProfit}
          onChange={setStopOnProfit}
          step={0.01}
        />
        <Field
          label="Stop on Loss"
          value={stopOnLoss}
          onChange={setStopOnLoss}
          step={0.01}
        />
      </div>
      {isPending ? (
        <Button
          onClick={() => onStop?.()}
          className="w-full"
          style={{
            boxShadow:
              "0 4px 6px -4px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(90deg, #fb2c36 0%, #e7000b 100%)",
            fontWeight: 700,
            fontSize: 18,
            lineHeight: "156%",
            letterSpacing: "-0.02em",
            textAlign: "center",
            color: "#fff",
          }}
        >
          {`Stop (${completedBets}/${numberOfBets})`}
        </Button>
      ) : (
        <Button
          onClick={handleStart}
          disabled={isPending}
        >
          Start Auto
        </Button>
      )}
    </div>
  );
}
