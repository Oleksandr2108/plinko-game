"use client";

import { useUserStore } from "../model/store";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function BalanceBadge() {
  const balance = useUserStore((state) => state.user?.balance ?? 0);

  return (
    <span className="inline-flex items-center gap-1 text-sm text-(--text)">
      <span className="inline-block h-2.5 w-2.5 rounded-full bg-(--colorAccess)" />
      {formatter.format(balance)}
    </span>
  );
}
