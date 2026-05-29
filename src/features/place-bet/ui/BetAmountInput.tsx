"use client";

import { useShallow } from "zustand/react/shallow";
import { BalanceBadge } from "@/entities/user";
import { usePlaceBetStore } from "../model/store";

export function BetAmountInput() {
  const [amount, setAmount] = usePlaceBetStore(
    useShallow((state) => [state.amount, state.setAmount]),
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-(--secondaryText) text-[14px]">
          Bet Amount
        </span>
        <BalanceBadge />
      </div>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          min="0.1"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          className="w-full  bg-(--bgTabActive) text-[14px] text-(--inputText) outline-none rounded-xl px-10 py-2.5  border border-(--borderTab) "
        />
        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-(--colorAccess) text-sm font-bold text-(--colorWhite)">
          +
        </span>
      </div>
    </div>
  );
}
