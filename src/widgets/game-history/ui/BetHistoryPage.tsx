"use client";

import { useMemo, useState } from "react";
import type { ApiRiskLevel } from "@/entities/game";
import { useBetHistory } from "../model/useBetHistory";
import { BetHistoryCard } from "./BetHistoryCard";
import { BetHistoryFilters } from "./BetHistoryFilters";
import { BetHistoryPagination } from "./BetHistoryPagination";

const ITEMS_PER_PAGE = 8;

export function BetHistoryPage() {
  const [riskFilter, setRiskFilter] = useState<"ALL" | ApiRiskLevel>("ALL");
  const [rowsFilter, setRowsFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBets.length / ITEMS_PER_PAGE),
  );
  const activePage = Math.min(currentPage, totalPages);
  const paginatedBets = useMemo(() => {
    const startIndex = (activePage - 1) * ITEMS_PER_PAGE;

    return filteredBets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [activePage, filteredBets]);

  return (
    <main className="min-h-full">
      <div>
        <div className="mx-auto flex w-full max-w-310 flex-col gap-3 px-3 py-3 sm:px-4 lg:py-4">
          <BetHistoryFilters
            riskFilter={riskFilter}
            rowsFilter={rowsFilter}
            onRiskChange={(value) => {
              setRiskFilter(value);
              setCurrentPage(1);
            }}
            onRowsChange={(value) => {
              setRowsFilter(value);
              setCurrentPage(1);
            }}
          />

          {isLoading ? (
            <p className="px-2 text-sm text-(--text)">Loading history...</p>
          ) : error ? (
            <p className="px-2 text-sm text-(--colorError)">
              Failed to load history.
            </p>
          ) : filteredBets.length ? (
            <>
              {paginatedBets.map((bet) => (
                <BetHistoryCard
                  key={bet.betId}
                  bet={bet}
                />
              ))}
              <BetHistoryPagination
                currentPage={activePage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <p className="px-2 text-sm text-(--text)">No bets found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
