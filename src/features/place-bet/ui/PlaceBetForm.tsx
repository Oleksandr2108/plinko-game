"use client";

import { BetAmountActions } from "./BetAmountActions";
import { BetAmountInput } from "./BetAmountInput";

export function PlaceBetForm() {
  return (
    <div className="space-y-3">
      <BetAmountInput />
      <BetAmountActions />
    </div>
  );
}
