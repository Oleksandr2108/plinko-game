import { create } from "zustand";
import type { Ball } from "@/entities/ball";

interface DropBallState {
  isDropping: boolean;
  history: Ball[];
  setIsDropping: (v: boolean) => void;
  addResult: (ball: Ball) => void;
}

export const useDropBallStore = create<DropBallState>((set) => ({
  isDropping: false,
  history: [],
  setIsDropping: (isDropping) => set({ isDropping }),
  addResult: (ball) =>
    set((s) => ({
      history: [ball, ...s.history].slice(0, 50),
      isDropping: false,
    })),
}));
