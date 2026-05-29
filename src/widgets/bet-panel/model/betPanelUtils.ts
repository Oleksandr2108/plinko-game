import { isAxiosError } from "axios";
import type { Ball } from "@/entities/ball";
import type { Bet } from "@/entities/bet";

export const mapBetToBall = (bet: Bet): Ball => ({
  id: bet.betId,
  slotIndex: bet.bucketIndex,
  multiplier: bet.multiplier,
  betAmount: bet.amount,
  payout: bet.payout,
  path: bet.path,
  rows: bet.rows,
});

export const extractBetPanelErrorMessage = (error: unknown) => {
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
