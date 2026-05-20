"use client";

import { useAutoBetStore } from "../model/store";

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
      <span className="block text-sm font-medium text-white">{label}</span>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full rounded-xl border border-(--borderColor) bg-(--inputBg) px-4 py-3 text-white outline-none"
      />
    </label>
  );
}

export function AutoBetForm({
  onStart,
  isPending,
}: {
  onStart?: () => void | Promise<void>;
  isPending?: boolean;
}) {
  const numberOfBets = useAutoBetStore((state) => state.numberOfBets);
  const stopOnProfit = useAutoBetStore((state) => state.stopOnProfit);
  const stopOnLoss = useAutoBetStore((state) => state.stopOnLoss);
  const setNumberOfBets = useAutoBetStore((state) => state.setNumberOfBets);
  const setStopOnProfit = useAutoBetStore((state) => state.setStopOnProfit);
  const setStopOnLoss = useAutoBetStore((state) => state.setStopOnLoss);

  return (
    <div className="space-y-4">
      <Field
        label="Number of Bets"
        value={numberOfBets}
        onChange={setNumberOfBets}
        min={1}
      />
      <div className="grid grid-cols-2 gap-3">
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
      <button
        type="button"
        onClick={onStart}
        disabled={isPending}
        className="w-full rounded-xl px-4 py-3 text-lg font-semibold text-white"
        style={{ background: "var(--buttonBg)" }}
      >
        {isPending ? "Running..." : "Start Auto"}
      </button>
    </div>
  );
}
