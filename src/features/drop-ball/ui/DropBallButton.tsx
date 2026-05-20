"use client";

import { Button } from "@/shared/ui";
import { useDropBallStore } from "../model/store";

export function DropBallButton({
  onClick,
  isPending,
}: {
  onClick?: () => void | Promise<void>;
  isPending?: boolean;
}) {
  const isDropping = useDropBallStore((state) => state.isDropping);
  const disabled = isPending || isDropping;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
    >
      {disabled ? "Dropping..." : "Bet"}
    </Button>
  );
}
