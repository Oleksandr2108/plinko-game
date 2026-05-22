"use client";

import { useEffect, useMemo, useState } from "react";
import { BALL_STEP_MS, getBallKeyframes } from "./gameBoardGeometry";

export function AnimatedBall({
  rows,
  path,
  slotIndex,
  enabled = true,
  onComplete,
}: {
  rows: number;
  path: string;
  slotIndex?: number;
  enabled?: boolean;
  onComplete?: () => void;
}) {
  const frames = useMemo(
    () => getBallKeyframes(rows, path, slotIndex),
    [path, rows, slotIndex],
  );
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setFrameIndex(enabled ? 0 : Math.max(frames.length - 1, 0));
  }, [enabled, frames.length, path, rows, slotIndex]);

  const activeFrame =
    frames[Math.min(frameIndex, Math.max(frames.length - 1, 0))];

  useEffect(() => {
    if (frames.length === 0 || !enabled) {
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
  }, [enabled, frames]);

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

    const timeoutId = window.setTimeout(() => {
      onComplete();
    }, BALL_STEP_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [enabled, frameIndex, frames.length, onComplete]);

  if (!activeFrame) {
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
