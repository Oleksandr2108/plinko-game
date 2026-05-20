"use client";

import { useUserStore } from "@/entities/user";
import { usePlaceBetStore } from "../model/store";

export function BetAmountActions() {
  const halveAmount = usePlaceBetStore((state) => state.halveAmount);
  const doubleAmount = usePlaceBetStore((state) => state.doubleAmount);
  const setMaxAmount = usePlaceBetStore((state) => state.setMaxAmount);
  const balance = useUserStore((state) => state.user?.balance ?? 0);

  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={halveAmount}
        className="rounded-xl border border-(--borderColor) bg-(--inputBg) px-3 py-2 text-sm font-semibold text-(--secondaryText)"
      >
        1/2
      </button>
      <button
        type="button"
        onClick={doubleAmount}
        className="rounded-xl border border-(--borderColor) bg-(--inputBg) px-3 py-2 text-sm font-semibold text-(--secondaryText)"
      >
        2X
      </button>
      <button
        type="button"
        onClick={() => setMaxAmount(balance)}
        className="rounded-xl border border-(--borderColor) bg-(--inputBg) px-3 py-2 text-sm font-semibold text-(--secondaryText)"
      >
        MAX
      </button>
    </div>
  );
}
