import { create } from "zustand";
import type { Ball } from "@/entities/ball";
import { useUserStore } from "@/entities/user";

interface PendingDropResult {
  ball: Ball;
  balanceAfter: number;
}

interface DropBallState {
  isDropping: boolean;
  activeDrop: PendingDropResult | null;
  queue: PendingDropResult[];
  history: Ball[];
  settledSlotIndex: number | null;
  setIsDropping: (v: boolean) => void;
  enqueueResult: (ball: Ball, balanceAfter: number) => void;
  completeActiveDrop: () => void;
}

export const useDropBallStore = create<DropBallState>((set, get) => ({
  isDropping: false,
  activeDrop: null,
  queue: [],
  history: [],
  settledSlotIndex: null,
  setIsDropping: (isDropping) => set({ isDropping }),
  enqueueResult: (ball, balanceAfter) =>
    set((state) => {
      const nextResult: PendingDropResult = {
        ball,
        balanceAfter,
      };

      if (!state.activeDrop) {
        return {
          activeDrop: nextResult,
          isDropping: true,
        };
      }

      return {
        queue: [...state.queue, nextResult],
        isDropping: true,
      };
    }),
  completeActiveDrop: () => {
    const activeDrop = get().activeDrop;

    if (!activeDrop) {
      return;
    }

    const currentUser = useUserStore.getState().user;

    if (currentUser) {
      useUserStore.getState().setUser({
        ...currentUser,
        balance: activeDrop.balanceAfter,
      });
    }

    set((state) => {
      const [nextActiveDrop, ...restQueue] = state.queue;

      return {
        activeDrop: nextActiveDrop ?? null,
        queue: restQueue,
        history: [activeDrop.ball, ...state.history].slice(0, 50),
        settledSlotIndex: activeDrop.ball.slotIndex,
        isDropping: Boolean(nextActiveDrop),
      };
    });
  },
}));
