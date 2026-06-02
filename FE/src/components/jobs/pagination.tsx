type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

type PageItem = number | "start-ellipsis" | "end-ellipsis";

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);

  if (currentPage <= 3) {
    pages.add(2);
    pages.add(3);
    pages.add(4);
  }

  if (currentPage >= totalPages - 2) {
    pages.add(totalPages - 1);
    pages.add(totalPages - 2);
    pages.add(totalPages - 3);
  }

  const sortedPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((first, second) => first - second);

  return sortedPages.flatMap((page, index) => {
    const previousPage = sortedPages[index - 1];
    if (previousPage && page - previousPage > 1) {
      return [page === totalPages ? "end-ellipsis" : "start-ellipsis", page];
    }

    return [page];
  });
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const safeTotalPages = Math.max(totalPages, 0);
  const safeCurrentPage =
    safeTotalPages > 0 ? Math.min(Math.max(currentPage, 1), safeTotalPages) : 1;
  const canPaginate = safeTotalPages > 1;
  const pageItems = canPaginate ? getPageItems(safeCurrentPage, safeTotalPages) : [];

  function handlePageChange(page: number) {
    if (page < 1 || page > safeTotalPages || page === safeCurrentPage) {
      return;
    }

    onPageChange(page);
  }

  return (
    <nav aria-label="Pagination" className="flex min-h-11 items-center justify-center px-1">
      <div className="grid w-full max-w-2xl grid-cols-[5.5rem_minmax(0,1fr)_5.5rem] items-center gap-2 sm:grid-cols-[7rem_minmax(0,1fr)_7rem]">
        <button
          type="button"
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          disabled={!canPaginate || safeCurrentPage === 1}
          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex min-w-0 items-center justify-center gap-1 overflow-x-auto px-1">
          {pageItems.map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                onClick={() => handlePageChange(item)}
                aria-current={item === safeCurrentPage ? "page" : undefined}
                className={`h-10 w-10 shrink-0 rounded-xl text-sm font-semibold transition ${
                  item === safeCurrentPage
                    ? "bg-primary text-white shadow-sm"
                    : "border border-line bg-white text-slate-600 hover:border-primary hover:text-primary"
                }`}
              >
                {item}
              </button>
            ) : (
              <span
                key={item}
                className="flex h-10 w-10 shrink-0 items-center justify-center text-sm font-semibold text-slate-400"
              >
                ...
              </span>
            )
          )}
        </div>
        <button
          type="button"
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          disabled={!canPaginate || safeCurrentPage === safeTotalPages}
          className="h-10 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
