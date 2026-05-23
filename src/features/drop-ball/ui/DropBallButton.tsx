"use client";

import { useGameSettingsStore } from "@/features/game-settings";
import { playBetSound, primeGameSounds } from "@/shared/lib";
import { Button } from "@/shared/ui";

export function DropBallButton({
  onClick,
  isPending,
}: {
  onClick?: () => void | Promise<void>;
  isPending?: boolean;
}) {
  const soundEnabled = useGameSettingsStore((state) => state.soundEnabled);

  const handleClick = async () => {
    await primeGameSounds();

    if (soundEnabled) {
      playBetSound();
    }

    await onClick?.();
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "Submitting..." : "Bet"}
    </Button>
  );
}
