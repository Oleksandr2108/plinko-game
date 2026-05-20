"use client";

import { BalanceBadge } from "@/entities/user";
import { usePlaceBetStore } from "../model/store";

export function BetAmountInput() {
  const amount = usePlaceBetStore((state) => state.amount);
  const setAmount = usePlaceBetStore((state) => state.setAmount);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-white">Bet Amount</span>
        <BalanceBadge />
      </div>
      <label className="flex items-center gap-3 rounded-xl border border-(--borderColor) bg-(--inputBg) px-4 py-3">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-(--colorAccess) text-sm font-bold text-white">
          +
        </span>
        <input
          type="number"
          min="0.1"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          className="w-full bg-transparent text-lg text-white outline-none"
        />
      </label>
    </div>
  );
}
