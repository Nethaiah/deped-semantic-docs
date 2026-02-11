"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationItem = number | "...";

interface NumberedPaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  siblings?: number;
}

/**
 * Generate array of page numbers with ellipsis
 * @param current - Current page number
 * @param total - Total number of pages
 * @param siblings - Number of siblings to show on each side of current page
 */
function generatePageNumbers(
  current: number,
  total: number,
  siblings: number = 3
): PaginationItem[] {
  // If total pages <= 5, show all pages
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: PaginationItem[] = [];
  
  // Always include first page
  items.push(1);

  // Calculate the range of pages to show around current page
  const leftSiblingIndex = Math.max(current - siblings, 2);
  const rightSiblingIndex = Math.min(current + siblings, total - 1);

  // Should we show left ellipsis?
  const showLeftEllipsis = leftSiblingIndex > 2;
  // Should we show right ellipsis?
  const showRightEllipsis = rightSiblingIndex < total - 1;

  // Add left ellipsis if needed
  if (showLeftEllipsis) {
    items.push("...");
  }

  // Add the range of pages around current
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    items.push(i);
  }

  // Add right ellipsis if needed
  if (showRightEllipsis) {
    items.push("...");
  }

  // Always include last page
  if (total > 1) {
    items.push(total);
  }

  return items;
}

export default function NumberedPagination({
  currentPage,
  totalPages,
  buildHref,
  onPageChange,
  isLoading = false,
  siblings = 3,
}: NumberedPaginationProps) {
  // Don't show pagination if only 1 page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = generatePageNumbers(currentPage, totalPages, siblings);
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageClick = (page: number) => {
    if (onPageChange && !isLoading) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full sm:flex-row sm:justify-between">
      {/* Page info */}
      <div className="text-sm text-gray-600 text-center sm:text-left">
        Page {currentPage} of {totalPages}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Link
          href={buildHref(currentPage - 1)}
          onClick={(e) => {
            if (!canGoPrevious || isLoading) {
              e.preventDefault();
              return;
            }
            handlePageClick(currentPage - 1);
          }}
          className={`
            flex items-center gap-1 px-3 py-2 text-sm rounded-md border
            ${
              !canGoPrevious || isLoading
                ? "pointer-events-none opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 cursor-pointer"
            }
          `}
          aria-disabled={!canGoPrevious || isLoading}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>

        {/* Page Numbers */}
        {pageNumbers.map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm text-gray-400"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const pageNum = item as number;
          const isCurrent = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={buildHref(pageNum)}
              onClick={(e) => {
                if (isCurrent || isLoading) {
                  e.preventDefault();
                  return;
                }
                handlePageClick(pageNum);
              }}
              className={`
                px-3 py-2 text-sm rounded-md border min-w-[40px] text-center
                ${
                  isCurrent
                    ? "bg-[#278fb6] text-white border-[#278fb6] font-semibold cursor-default"
                    : isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50 cursor-pointer"
                }
              `}
              aria-label={`Go to page ${pageNum}`}
              aria-current={isCurrent ? "page" : undefined}
            >
              {pageNum}
            </Link>
          );
        })}

        {/* Next Button */}
        <Link
          href={buildHref(currentPage + 1)}
          onClick={(e) => {
            if (!canGoNext || isLoading) {
              e.preventDefault();
              return;
            }
            handlePageClick(currentPage + 1);
          }}
          className={`
            flex items-center gap-1 px-3 py-2 text-sm rounded-md border
            ${
              !canGoNext || isLoading
                ? "pointer-events-none opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50 cursor-pointer"
            }
          `}
          aria-disabled={!canGoNext || isLoading}
          aria-label="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}