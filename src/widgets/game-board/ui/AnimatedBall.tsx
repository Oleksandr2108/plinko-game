"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGameSettingsStore } from "@/features/game-settings";
import { playBallTickSound, playProfitSound } from "@/shared/lib";
import {
  BALL_STEP_MS,
  DESKTOP_BOARD_LAYOUT,
  getBallKeyframes,
  type BoardLayout,
} from "./gameBoardGeometry";

export function AnimatedBall({
  rows,
  path,
  slotIndex,
  enabled = true,
  delayMs = 0,
  layout = DESKTOP_BOARD_LAYOUT,
  onComplete,
}: {
  rows: number;
  path: string;
  slotIndex?: number;
  enabled?: boolean;
  delayMs?: number;
  layout?: BoardLayout;
  onComplete?: () => void;
}) {
  const frames = useMemo(
    () => getBallKeyframes(rows, path, slotIndex, layout),
    [layout, path, rows, slotIndex],
  );
  const soundEnabled = useGameSettingsStore((state) => state.soundEnabled);
  const [animatedFrameIndex, setAnimatedFrameIndex] = useState(0);
  const [hasDelayElapsed, setHasDelayElapsed] = useState(
    !enabled || delayMs === 0,
  );
  const lastTickFrameIndexRef = useRef<number | null>(null);
  const hasPlayedProfitSoundRef = useRef(false);
  const pegContactFrames = useMemo(
    () =>
      Array.from(
        { length: Math.min(rows, path.length) },
        (_, index) => 2 + index * 3,
      ),
    [path.length, rows],
  );
  const hasStarted = !enabled || delayMs === 0 || hasDelayElapsed;
  const frameIndex = enabled
    ? animatedFrameIndex
    : Math.max(frames.length - 1, 0);

  useEffect(() => {
    if (!enabled || delayMs === 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setHasDelayElapsed(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, enabled, path, rows, slotIndex]);

  useEffect(() => {
    lastTickFrameIndexRef.current = null;
    hasPlayedProfitSoundRef.current = false;
  }, [delayMs, enabled, path, rows, slotIndex]);

  const activeFrame =
    frames[Math.min(frameIndex, Math.max(frames.length - 1, 0))];

  useEffect(() => {
    if (!enabled || !hasStarted || !soundEnabled) {
      return;
    }

    if (!pegContactFrames.includes(frameIndex)) {
      return;
    }

    if (lastTickFrameIndexRef.current === frameIndex) {
      return;
    }

    playBallTickSound();
    lastTickFrameIndexRef.current = frameIndex;
  }, [enabled, frameIndex, hasStarted, pegContactFrames, soundEnabled]);

  useEffect(() => {
    if (frames.length === 0 || !enabled || !hasStarted) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setAnimatedFrameIndex((current) => {
        if (current >= frames.length - 1) {
          window.clearInterval(intervalId);
          return current;
        }

        return current + 1;
      });
    }, BALL_STEP_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled, frames, hasStarted]);

  useEffect(() => {
    if (!onComplete || frames.length === 0) {
      return;
    }

    if (!enabled) {
      if (soundEnabled && !hasPlayedProfitSoundRef.current) {
        playProfitSound();
        hasPlayedProfitSoundRef.current = true;
      }

      const timeoutId = window.setTimeout(() => {
        onComplete();
      }, 0);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    if (frameIndex !== frames.length - 1) {
      return;
    }

    if (!hasStarted) {
      return;
    }

    if (soundEnabled && !hasPlayedProfitSoundRef.current) {
      playProfitSound();
      hasPlayedProfitSoundRef.current = true;
    }

    const timeoutId = window.setTimeout(() => {
      onComplete();
    }, BALL_STEP_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    enabled,
    frameIndex,
    frames.length,
    hasStarted,
    onComplete,
    soundEnabled,
  ]);

  if (!activeFrame || (enabled && !hasStarted)) {
    return null;
  }

  return (
    <circle
      cx={activeFrame.x}
      cy={activeFrame.y}
      r="6"
      fill="#f8fafc"
      className="drop-shadow-[0_0_12px_rgba(255,255,255,0.65)]"
      style={{
        transition: enabled
          ? `cx ${BALL_STEP_MS}ms linear, cy ${BALL_STEP_MS}ms linear`
          : "none",
      }}
    />
  );
}
