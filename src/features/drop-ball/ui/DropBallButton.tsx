"use client";

import { Button } from "@/shared/ui";

export function DropBallButton({
  onClick,
  isPending,
}: {
  onClick?: () => void | Promise<void>;
  isPending?: boolean;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={isPending}
    >
      {isPending ? "Submitting..." : "Bet"}
    </Button>
  );
}
