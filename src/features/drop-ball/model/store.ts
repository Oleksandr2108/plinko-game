import { create } from "zustand";
import type { Ball } from "@/entities/ball";
import { useUserStore } from "@/entities/user";

interface PendingDropResult {
  ball: Ball;
  launchDelayMs: number;
}

interface DropBallState {
  isDropping: boolean;
  reservedBetAmount: number;
  activeDrops: PendingDropResult[];
  history: Ball[];
  settledSlotIndex: number | null;
  setIsDropping: (v: boolean) => void;
  reserveBetAmount: (amount: number) => boolean;
  releaseReservedBetAmount: (amount: number) => void;
  enqueueResult: (ball: Ball) => void;
  enqueueResults: (results: Ball[]) => void;
  completeActiveDrop: (ballId: string) => void;
}

export const useDropBallStore = create<DropBallState>((set, get) => ({
  isDropping: false,
  reservedBetAmount: 0,
  activeDrops: [],
  history: [],
  settledSlotIndex: null,
  setIsDropping: (isDropping) => set({ isDropping }),
  reserveBetAmount: (amount) => {
    if (!Number.isFinite(amount) || amount <= 0) {
      return false;
    }

    const currentUser = useUserStore.getState().user;
    const availableBalance = (currentUser?.balance ?? 0) - get().reservedBetAmount;

    if (availableBalance < amount) {
      return false;
    }

    set((state) => ({
      reservedBetAmount: state.reservedBetAmount + amount,
      isDropping: true,
    }));

    return true;
  },
  releaseReservedBetAmount: (amount) =>
    set((state) => {
      const reservedBetAmount = Math.max(0, state.reservedBetAmount - amount);

      return {
        reservedBetAmount,
        isDropping: state.activeDrops.length > 0 || reservedBetAmount > 0,
      };
    }),
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
      const reservedBetAmount = Math.max(
        0,
        state.reservedBetAmount - activeDrop.ball.betAmount,
      );
      const activeDrops = state.activeDrops.filter(
        (drop) => drop.ball.id !== ballId,
      );

      return {
        activeDrops,
        reservedBetAmount,
        history: [activeDrop.ball, ...state.history].slice(0, 50),
        settledSlotIndex: activeDrop.ball.slotIndex,
        isDropping: activeDrops.length > 0 || reservedBetAmount > 0,
      };
    });
  },
}));
