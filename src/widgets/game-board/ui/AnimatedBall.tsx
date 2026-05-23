"use client";

import { useEffect, useMemo, useState } from "react";
import { BALL_STEP_MS, getBallKeyframes } from "./gameBoardGeometry";

export function AnimatedBall({
  rows,
  path,
  slotIndex,
  enabled = true,
  delayMs = 0,
  onComplete,
}: {
  rows: number;
  path: string;
  slotIndex?: number;
  enabled?: boolean;
  delayMs?: number;
  onComplete?: () => void;
}) {
  const frames = useMemo(
    () => getBallKeyframes(rows, path, slotIndex),
    [path, rows, slotIndex],
  );
  const [frameIndex, setFrameIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(!enabled || delayMs === 0);

  useEffect(() => {
    if (!enabled || delayMs === 0) {
      setHasStarted(true);
      return;
    }

    setHasStarted(false);

    const timeoutId = window.setTimeout(() => {
      setHasStarted(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, enabled, path, rows, slotIndex]);

  useEffect(() => {
    setFrameIndex(enabled ? 0 : Math.max(frames.length - 1, 0));
  }, [enabled, frames.length, path, rows, slotIndex]);

  const activeFrame =
    frames[Math.min(frameIndex, Math.max(frames.length - 1, 0))];

  useEffect(() => {
    if (frames.length === 0 || !enabled || !hasStarted) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setFrameIndex((current) => {
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

    const timeoutId = window.setTimeout(() => {
      onComplete();
    }, BALL_STEP_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, frameIndex, frames.length, hasStarted, onComplete]);

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
