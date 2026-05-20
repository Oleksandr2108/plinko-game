"use client";

import { useBetHistory } from "../model/useBetHistory";

export function GameHistory() {
  const { data, isLoading, error } = useBetHistory();

  return (
    <section className="rounded-[24px] border border-(--borderColor) bg-[rgba(26,31,46,0.92)] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Game History</h2>
        {isLoading ? (
          <span className="text-sm text-(--text)">Loading...</span>
        ) : null}
      </div>
      {error ? (
        <p className="text-sm text-(--colorError)">Failed to load history.</p>
      ) : null}
      <div className="space-y-3">
        {data?.items.length ? (
          data.items.map((bet) => (
            <div
              key={bet.betId}
              className="grid grid-cols-4 gap-2 rounded-xl border border-(--borderColor) bg-(--inputBg) px-3 py-2 text-sm"
            >
              <span className="text-white">{bet.risk}</span>
              <span className="text-(--text)">{bet.rows} rows</span>
              <span className="text-(--text)">x{bet.multiplier}</span>
              <span
                className={
                  bet.payout >= bet.amount
                    ? "text-(--colorAccess)"
                    : "text-(--colorError)"
                }
              >
                {bet.payout.toFixed(2)}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-(--text)">No bets yet.</p>
        )}
      </div>
    </section>
  );
}
