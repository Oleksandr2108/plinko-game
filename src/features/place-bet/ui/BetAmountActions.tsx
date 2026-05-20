"use client";

import { useUserStore } from "@/entities/user";
import { usePlaceBetStore } from "../model/store";

interface BetAmountActionsButtonsProps {
  onClick: () => void;
  label: string;
}
export function BetAmountActionsButtons({
  onClick,
  label,
}: BetAmountActionsButtonsProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-(--borderTab) bg-(--bgTabActive) px-3 py-2 text-sm font-semibold text-(--secondaryText)"
    >
      {label}
    </button>
  );
}

export function BetAmountActions() {
  const halveAmount = usePlaceBetStore((state) => state.halveAmount);
  const doubleAmount = usePlaceBetStore((state) => state.doubleAmount);
  const setMaxAmount = usePlaceBetStore((state) => state.setMaxAmount);
  const balance = useUserStore((state) => state.user?.balance ?? 0);

  return (
    <div className="grid grid-cols-3 gap-2">
      <BetAmountActionsButtons
        onClick={halveAmount}
        label="1/2"
      />
      <BetAmountActionsButtons
        onClick={doubleAmount}
        label="2X"
      />
      <BetAmountActionsButtons
        onClick={() => setMaxAmount(balance)}
        label="MAX"
      />
    </div>
  );
}
