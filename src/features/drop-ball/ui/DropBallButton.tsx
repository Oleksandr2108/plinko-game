"use client";

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
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl px-4 py-3 text-lg font-semibold text-white disabled:opacity-60"
      style={{ background: "var(--buttonBg)" }}
    >
      {disabled ? "Dropping..." : "Drop Ball"}
    </button>
  );
}
