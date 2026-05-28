"use client";

import { useShallow } from "zustand/react/shallow";
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
  const [halveAmount, doubleAmount, setMaxAmount] = usePlaceBetStore(
    useShallow((state) => [
      state.halveAmount,
      state.doubleAmount,
      state.setMaxAmount,
    ]),
  );
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
