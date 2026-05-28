export function BetHistoryPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-3 text-sm text-(--secondaryText)">
      <div className="mx-auto flex max-w-full items-center gap-1 overflow-x-auto rounded-[14px] border border-(--borderColor) bg-[rgba(30,36,56,0.55)] p-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-(--secondaryText) transition-colors hover:bg-(--bgTabActive) hover:text-white disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          aria-label="Previous page"
        >
          &larr;
        </button>

        {pageNumbers.map((pageNumber) => {
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={[
                "flex h-9 min-w-9 shrink-0 items-center justify-center rounded-[10px] px-3 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-(--bgTabActive) text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                  : "text-(--secondaryText) hover:bg-(--bgTabActive) hover:text-white",
              ].join(" ")}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-(--secondaryText) transition-colors hover:bg-(--bgTabActive) hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
