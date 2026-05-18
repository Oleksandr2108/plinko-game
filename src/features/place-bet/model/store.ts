import { create } from "zustand";
import { GAME_CONFIG } from "@/shared/config";

interface PlaceBetState {
  amount: number;
  setAmount: (v: number) => void;
}

export const usePlaceBetStore = create<PlaceBetState>((set) => ({
  amount: GAME_CONFIG.bet.default,
  setAmount: (amount) => set({ amount }),
}));
