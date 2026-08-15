import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Max page buttons to display before inserting ellipses */
  siblingCount?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  // Generate range helper
  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalNumbers) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = range(1, leftItemCount);
      return [...leftRange, 'DOTS', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [1, 'DOTS', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, 'DOTS', ...middleRange, 'DOTS', totalPages];
    }

    return [];
  };

  const pages = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-center gap-1.5 pt-6 ${className}`}
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#181d2a] text-slate-300 ring-1 ring-white/[0.06] transition-all hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-[#181d2a] focus-visible:outline-2 focus-visible:outline-[#00a3ff]"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="h-4.5 w-4.5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pages.map((page, idx) => {
          if (page === 'DOTS') {
            return (
              <span
                key={`dots-${idx}`}
                className="flex h-10 w-8 items-center justify-center text-slate-500"
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const pageNumber = page as number;
          const isActive = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex h-10 min-w-10 px-3 items-center justify-center rounded-xl text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-[#00a3ff] ${
                isActive
                  ? 'bg-[#00a3ff] text-white shadow-md shadow-[#00a3ff]/20 font-bold'
                  : 'bg-[#181d2a] text-slate-300 ring-1 ring-white/[0.06] hover:bg-slate-800 hover:text-white'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#181d2a] text-slate-300 ring-1 ring-white/[0.06] transition-all hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-[#181d2a] focus-visible:outline-2 focus-visible:outline-[#00a3ff]"
        aria-label="Halaman berikutnya"
      >
        <ChevronRight className="h-4.5 w-4.5" />
      </button>
    </nav>
  );
};
