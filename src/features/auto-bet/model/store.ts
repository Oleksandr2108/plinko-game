import { create } from "zustand";

interface AutoBetState {
  numberOfBets: number;
  stopOnProfit: number;
  stopOnLoss: number;
  isAutoRunning: boolean;
  completedBets: number;
  setNumberOfBets: (value: number) => void;
  setStopOnProfit: (value: number) => void;
  setStopOnLoss: (value: number) => void;
  setIsAutoRunning: (value: boolean) => void;
  setCompletedBets: (value: number) => void;
  incrementCompletedBets: () => void;
}

const clampNonNegative = (value: number) =>
  Number.isFinite(value) ? Math.max(0, Math.round(value * 100) / 100) : 0;

export const useAutoBetStore = create<AutoBetState>((set) => ({
  numberOfBets: 10,
  stopOnProfit: 0,
  stopOnLoss: 0,
  isAutoRunning: false,
  completedBets: 0,
  setNumberOfBets: (numberOfBets) =>
    set({ numberOfBets: Math.max(1, Math.floor(numberOfBets || 1)) }),
  setStopOnProfit: (stopOnProfit) =>
    set({ stopOnProfit: clampNonNegative(stopOnProfit) }),
  setStopOnLoss: (stopOnLoss) =>
    set({ stopOnLoss: clampNonNegative(stopOnLoss) }),
  setIsAutoRunning: (isAutoRunning) => set({ isAutoRunning }),
  setCompletedBets: (completedBets) => set({ completedBets }),
  incrementCompletedBets: () =>
    set((state) => ({ completedBets: (state.completedBets || 0) + 1 })),
}));
