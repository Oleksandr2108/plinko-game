"use client";

import { useEffect, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import type { Ball } from "@/entities/ball";
import type { Bet } from "@/entities/bet";
import { useUserStore } from "@/entities/user";
import { useAutoBetStore } from "@/features/auto-bet";
import { useDropBallStore } from "@/features/drop-ball";
import { usePlaceBetStore } from "@/features/place-bet";
import { useSelectRiskStore } from "@/features/select-risk";
import { PLINKO_QUERY_KEYS, plinkoApi } from "@/shared/api/plinko";

const mapBetToBall = (bet: Bet): Ball => ({
  id: bet.betId,
  slotIndex: bet.bucketIndex,
  multiplier: bet.multiplier,
  betAmount: bet.amount,
  payout: bet.payout,
  path: bet.path,
  rows: bet.rows,
});

const extractErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(" ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  return "Request failed. Please try again.";
};

const buildBetInput = () => ({
  amount: usePlaceBetStore.getState().amount,
  rows: useSelectRiskStore.getState().rows,
  risk: useSelectRiskStore.getState().risk,
});

const applyBetResult = (bet: Bet) => {
  useDropBallStore.getState().enqueueResult(mapBetToBall(bet));
};

interface UseBetPanelResult {
  gameConfig: typeof plinkoApi extends { getGameConfig: () => Promise<infer T> }
    ? T | undefined
    : never;
  activeSeed: typeof plinkoApi extends { getActiveSeed: () => Promise<infer T> }
    ? T | undefined
    : never;
  isLoading: boolean;
  isManualSubmitting: boolean;
  isAutoSubmitting: boolean;
  errorMessage: string | undefined;
  placeManualBet: () => Promise<void>;
  startAutoBet: () => Promise<void>;
  stopAutoBet: () => void;
}

export function useBetPanel(): UseBetPanelResult {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);
  const isDropping = useDropBallStore((state) => state.isDropping);

  const gameConfigQuery = useQuery({
    queryKey: PLINKO_QUERY_KEYS.gameConfig,
    queryFn: plinkoApi.getGameConfig,
    staleTime: 60_000,
  });

  const currentUserQuery = useQuery({
    queryKey: PLINKO_QUERY_KEYS.currentUser,
    queryFn: plinkoApi.getCurrentUser,
  });

  const activeSeedQuery = useQuery({
    queryKey: PLINKO_QUERY_KEYS.activeSeed,
    queryFn: plinkoApi.getActiveSeed,
  });

  useEffect(() => {
    if (currentUserQuery.data && !isDropping) {
      setUser(currentUserQuery.data);
    }
  }, [currentUserQuery.data, isDropping, setUser]);

  useEffect(() => {
    if (!gameConfigQuery.data) {
      return;
    }

    const rows = gameConfigQuery.data.rows;
    const currentRows = useSelectRiskStore.getState().rows;

    if (!rows.includes(currentRows)) {
      useSelectRiskStore.getState().setRows(rows[0]);
    }

    const currentAmount = usePlaceBetStore.getState().amount;
    const clampedAmount = Math.min(
      gameConfigQuery.data.maxBet,
      Math.max(gameConfigQuery.data.minBet, currentAmount),
    );

    if (clampedAmount !== currentAmount) {
      usePlaceBetStore.getState().setAmount(clampedAmount);
    }
  }, [gameConfigQuery.data]);

  const finalizeBetFlow = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: PLINKO_QUERY_KEYS.currentUser,
      }),
      queryClient.invalidateQueries({ queryKey: PLINKO_QUERY_KEYS.activeSeed }),
      queryClient.invalidateQueries({ queryKey: ["bet-history"] }),
    ]);
  };

  const manualBetMutation = useMutation({
    mutationFn: async () => {
      useDropBallStore.getState().setIsDropping(true);
      return plinkoApi.placeBet(buildBetInput());
    },
    onSuccess: (bet) => {
      applyBetResult(bet);
    },
    onError: () => {
      useDropBallStore.getState().setIsDropping(false);
    },
    onSettled: async () => {
      await finalizeBetFlow();
    },
  });

  const autoBetMutation = useMutation({
    mutationFn: async () => {
      useDropBallStore.getState().setIsDropping(true);

      // mark auto-running and reset completed count
      useAutoBetStore.getState().setIsAutoRunning(true);
      useAutoBetStore.getState().setCompletedBets(0);

      const { numberOfBets, stopOnProfit, stopOnLoss } =
        useAutoBetStore.getState();

      let totalDelta = 0;
      const bets = [];

      for (let index = 0; index < numberOfBets; index += 1) {
        // allow external stop
        if (!useAutoBetStore.getState().isAutoRunning) {
          break;
        }

        const bet = await plinkoApi.placeBet(buildBetInput());
        bets.push(bet);

        totalDelta += bet.payout - bet.amount;

        // enqueue a single result immediately so the ball drops per-bet
        useDropBallStore.getState().enqueueResult(mapBetToBall(bet));

        // increment completed bets counter for UI
        useAutoBetStore.getState().incrementCompletedBets();

        if (stopOnProfit > 0 && totalDelta >= stopOnProfit) {
          break;
        }

        if (stopOnLoss > 0 && totalDelta <= -stopOnLoss) {
          break;
        }

        // if we're going to perform another bet, wait 0.7s between requests
        if (
          index < numberOfBets - 1 &&
          useAutoBetStore.getState().isAutoRunning
        ) {
          await new Promise((resolve) => setTimeout(resolve, 700));
        }
      }

      return bets;
    },
    onError: () => {
      useDropBallStore.getState().setIsDropping(false);
    },
    onSettled: async () => {
      // ensure auto-running flag is cleared
      useAutoBetStore.getState().setIsAutoRunning(false);

      await finalizeBetFlow();
    },
  });

  const stopAutoBet = () => {
    useAutoBetStore.getState().setIsAutoRunning(false);
    useDropBallStore.getState().setIsDropping(false);
  };

  const errorMessage = useMemo(() => {
    return [
      gameConfigQuery.error,
      currentUserQuery.error,
      activeSeedQuery.error,
      manualBetMutation.error,
      autoBetMutation.error,
    ]
      .filter(Boolean)
      .map((error) => extractErrorMessage(error))[0];
  }, [
    activeSeedQuery.error,
    autoBetMutation.error,
    currentUserQuery.error,
    gameConfigQuery.error,
    manualBetMutation.error,
  ]);

  return {
    gameConfig: gameConfigQuery.data,
    activeSeed: activeSeedQuery.data,
    isLoading:
      gameConfigQuery.isLoading ||
      currentUserQuery.isLoading ||
      activeSeedQuery.isLoading,
    isManualSubmitting: manualBetMutation.isPending,
    isAutoSubmitting: autoBetMutation.isPending,
    errorMessage,
    placeManualBet: async () => {
      await manualBetMutation.mutateAsync();
    },
    startAutoBet: async () => {
      await autoBetMutation.mutateAsync();
    },
    stopAutoBet,
  };
}
