import { create } from "zustand";
import type { Ball } from "@/entities/ball";
import { useUserStore } from "@/entities/user";

interface PendingDropResult {
  ball: Ball;
  launchDelayMs: number;
}

interface DropBallState {
  isDropping: boolean;
  activeDrops: PendingDropResult[];
  history: Ball[];
  settledSlotIndex: number | null;
  setIsDropping: (v: boolean) => void;
  enqueueResult: (ball: Ball) => void;
  enqueueResults: (results: Ball[]) => void;
  completeActiveDrop: (ballId: string) => void;
}

export const useDropBallStore = create<DropBallState>((set, get) => ({
  isDropping: false,
  activeDrops: [],
  history: [],
  settledSlotIndex: null,
  setIsDropping: (isDropping) => set({ isDropping }),
  enqueueResult: (ball) =>
    set((state) => ({
      activeDrops: [
        ...state.activeDrops,
        {
          ball,
          launchDelayMs: 0,
        },
      ],
      isDropping: true,
    })),
  enqueueResults: (results) =>
    set((state) => {
      const nextDrops = results.map((ball, index) => ({
        ball,
        launchDelayMs: index * 500,
      }));

      return {
        activeDrops: [...state.activeDrops, ...nextDrops],
        isDropping: true,
      };
    }),
  completeActiveDrop: (ballId) => {
    const activeDrop = get().activeDrops.find(
      (drop) => drop.ball.id === ballId,
    );

    if (!activeDrop) {
      return;
    }

    const currentUser = useUserStore.getState().user;

    if (currentUser) {
      useUserStore.getState().setUser({
        ...currentUser,
        balance:
          currentUser.balance +
          (activeDrop.ball.payout - activeDrop.ball.betAmount),
      });
    }

    set((state) => {
      return {
        activeDrops: state.activeDrops.filter(
          (drop) => drop.ball.id !== ballId,
        ),
        history: [activeDrop.ball, ...state.history].slice(0, 50),
        settledSlotIndex: activeDrop.ball.slotIndex,
        isDropping: state.activeDrops.some((drop) => drop.ball.id !== ballId),
      };
    });
  },
}));
