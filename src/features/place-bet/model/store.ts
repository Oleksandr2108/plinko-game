import { create } from "zustand";
import { GAME_CONFIG } from "@/shared/config";

interface PlaceBetState {
  amount: number;
  setAmount: (v: number) => void;
  halveAmount: () => void;
  doubleAmount: () => void;
  setMaxAmount: (maxAmount?: number) => void;
}

const roundAmount = (amount: number) => Math.round(amount * 100) / 100;

const clampAmount = (amount: number) => {
  if (!Number.isFinite(amount)) {
    return GAME_CONFIG.bet.default;
  }

  return Math.min(
    GAME_CONFIG.bet.max,
    Math.max(GAME_CONFIG.bet.min, roundAmount(amount)),
  );
};

export const usePlaceBetStore = create<PlaceBetState>((set) => ({
  amount: GAME_CONFIG.bet.default,
  setAmount: (amount) => set({ amount: clampAmount(amount) }),
  halveAmount: () =>
    set((state) => ({ amount: clampAmount(state.amount / 2) })),
  doubleAmount: () =>
    set((state) => ({ amount: clampAmount(state.amount * 2) })),
  setMaxAmount: (maxAmount) =>
    set({ amount: clampAmount(maxAmount ?? GAME_CONFIG.bet.max) }),
}));
