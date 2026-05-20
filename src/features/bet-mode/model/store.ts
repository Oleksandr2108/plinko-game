import { create } from "zustand";

export type BetMode = "manual" | "auto";

interface BetModeState {
  mode: BetMode;
  setMode: (mode: BetMode) => void;
}

export const useBetModeStore = create<BetModeState>((set) => ({
  mode: "auto",
  setMode: (mode) => set({ mode }),
}));
