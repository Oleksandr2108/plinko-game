"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ApiRiskLevel } from "@/entities/game";
import { useBetHistory } from "../model/useBetHistory";
import BackArrowIcon from "../../../../public/icons/backArrowsItem.svg";
import FilterIcon from "../../../../public/icons/filterIcon.svg";
import BetIcon from "../../../../public/icons/betIcon.svg";
import Image from "next/image";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const riskToneMap: Record<ApiRiskLevel, string> = {
  LOW: " bg-(--bgAccess) text-(--colorAccess)",
  MEDIUM: " bg-(--bgMedium) text-[#f0b100]",
  HIGH: " bg-(--bgError) text-(--colorError)",
};

export function BetHistoryPage() {
  const [riskFilter, setRiskFilter] = useState<"ALL" | ApiRiskLevel>("ALL");
  const [rowsFilter, setRowsFilter] = useState<string>("ALL");
  const { data, isLoading, error } = useBetHistory(50);

  const filteredBets = useMemo(() => {
    const items = data?.items ?? [];

    return items.filter((bet) => {
      const matchesRisk = riskFilter === "ALL" || bet.risk === riskFilter;
      const matchesRows =
        rowsFilter === "ALL" || bet.rows === Number(rowsFilter);

      return matchesRisk && matchesRows;
    });
  }, [data?.items, riskFilter, rowsFilter]);

  return (
    <main className="min-h-screen ">
      <div className=" bg-[rgba(17,22,30,0.92)]">
        <div className="flex items-center gap-4 border-b border-(--borderColor) px-6 py-2.5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-[10px] border border-(--borderColor) bg-(--bgSecondaryTab) px-4 py-2 text-[16px] font-medium text-(--secondaryText) transition-colors hover:bg-(--bgTabActive)"
          >
            <Image
              src={BackArrowIcon}
              alt="Back Arrow Icon"
            />
            Back to Game
          </Link>
          <h1 className="text-[24px] font-bold text-white">Bet History</h1>
        </div>

        <div className="mx-auto flex w-full max-w-310 flex-col gap-3 px-4 py-3 lg:py-4">
          <section className="rounded-[10px] border border-(--borderColor) bg-[rgba(30,36,56,0.55)] px-4 py-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-(--secondaryText)">
              <Image
                src={FilterIcon}
                alt="Filter Icon"
              />
              <span className="font-medium text-[14px]">Filters:</span>
              <label className="flex items-center gap-2">
                <span className="text-(--text)">Risk:</span>
                <select
                  value={riskFilter}
                  onChange={(event) =>
                    setRiskFilter(event.target.value as "ALL" | ApiRiskLevel)
                  }
                  className="rounded-md border border-(--borderColor) bg-(--bgTab) px-2 py-1 text-[11px] text-white outline-none"
                >
                  <option value="ALL">All</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </label>
              <label className="flex items-center gap-2">
                <span className="text-(--text)">Rows:</span>
                <select
                  value={rowsFilter}
                  onChange={(event) => setRowsFilter(event.target.value)}
                  className="rounded-md border border-(--borderColor) bg-(--bgTab) px-2 py-1 text-[11px] text-white outline-none"
                >
                  <option value="ALL">All</option>
                  {Array.from({ length: 9 }, (_, index) => 8 + index).map(
                    (rows) => (
                      <option
                        key={rows}
                        value={rows}
                      >
                        {rows}
                      </option>
                    ),
                  )}
                </select>
              </label>
            </div>
          </section>

          {isLoading ? (
            <p className="px-2 text-sm text-(--text)">Loading history...</p>
          ) : error ? (
            <p className="px-2 text-sm text-(--colorError)">
              Failed to load history.
            </p>
          ) : filteredBets.length ? (
            filteredBets.map((bet) => {
              const profit = bet.payout - bet.amount;
              const profitTone =
                profit >= 0 ? "text-(--colorAccess)" : "text-(--colorError)";

              return (
                <article
                  key={bet.betId}
                  className="rounded-[10px] border border-(--borderColor) bg-[rgba(30,36,56,0.55)] px-3 py-3"
                >
                  <div className="grid grid-cols-[1.6fr_1.4fr_0.8fr_0.8fr_0.8fr_0.8fr_1fr] items-center gap-3 text-[12px] text-(--text)">
                    <div>
                      <p className="mb-1 text-[12px] text-(--colorSmallText)">
                        Time
                      </p>
                      <p className="text-[14px] text-(--secondaryText)">
                        {bet.createdAt
                          ? dateFormatter.format(new Date(bet.createdAt))
                          : "Unknown"}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[12px] text-(--colorSmallText)">
                        Settings
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] text-(--secondaryText)">
                          {bet.rows} rows
                        </span>
                        <span
                          className={[
                            "rounded-md  px-1.5 py-0.5 text-[12px] font-normal uppercase",
                            riskToneMap[bet.risk],
                          ].join(" ")}
                        >
                          {bet.risk}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-[12px] text-(--colorSmallText)">
                        Multiplier
                      </p>
                      <p className="text-[20px] font-bold text-(--colorAccess)">
                        {bet.multiplier.toFixed(1)}x
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[12px] text-(--colorSmallText)">
                        Bet Amount
                      </p>
                      <p className="text-[14px] text-(--secondaryText)">
                        {numberFormatter.format(bet.amount)}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[12px] text-(--colorSmallText)">
                        Payout
                      </p>
                      <p className="text-[14px] text-(--secondaryText)">
                        {numberFormatter.format(bet.payout)}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-[12px] text-(--colorSmallText)">
                        Profit
                      </p>
                      <p className={`text-[14px] font-medium ${profitTone}`}>
                        {profit >= 0 ? "+" : ""}
                        {numberFormatter.format(profit)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="mb-1 text-[12px] text-(--colorSmallText)">
                        Balance After
                      </p>
                      <div className="inline-flex items-center gap-1">
                        <Image
                          src={BetIcon}
                          alt="Bet Icon"
                        />
                        <p className="text-[14px] text-(--secondaryText)">
                          {numberFormatter.format(bet.balanceAfter)}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="px-2 text-sm text-(--text)">No bets found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
