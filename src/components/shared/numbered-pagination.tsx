"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationItemType = number | "...";

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
): PaginationItemType[] {
  // If total pages <= 5, show all pages
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: PaginationItemType[] = [];
  
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

  const handlePageClick = (page: number, e: React.MouseEvent) => {
    if (onPageChange && !isLoading) {
      e.preventDefault();
      onPageChange(page);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4 sm:gap-3 w-full">
      {/* Page info */}
      <div className="text-sm text-gray-600 text-center sm:text-left whitespace-nowrap">
        Page {currentPage} of {totalPages}
      </div>

      <Pagination className="justify-center sm:justify-end mx-0 w-auto">
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              href={buildHref(currentPage - 1)}
              scroll={false}
              onClick={(e) => {
                if (!canGoPrevious || isLoading) {
                  e.preventDefault();
                  return;
                }
                handlePageClick(currentPage - 1, e);
              }}
              className={
                !canGoPrevious || isLoading
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              aria-disabled={!canGoPrevious || isLoading}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {pageNumbers.map((item, index) => {
            if (item === "...") {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const pageNum = item as number;
            const isCurrent = pageNum === currentPage;

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  href={buildHref(pageNum)}
                  isActive={isCurrent}
                  scroll={false}
                  onClick={(e) => {
                    if (isCurrent || isLoading) {
                      e.preventDefault();
                      return;
                    }
                    handlePageClick(pageNum, e);
                  }}
                  className={
                    isCurrent
                      ? "bg-[#278fb6] text-white hover:bg-[#278fb6]/90 hover:text-white border-[#278fb6] font-semibold"
                      : isLoading
                      ? "text-slate-400 opacity-50 cursor-not-allowed"
                      : "text-slate-700 hover:bg-slate-50"
                  }
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              href={buildHref(currentPage + 1)}
              scroll={false}
              onClick={(e) => {
                if (!canGoNext || isLoading) {
                  e.preventDefault();
                  return;
                }
                handlePageClick(currentPage + 1, e);
              }}
              className={
                !canGoNext || isLoading
                  ? "pointer-events-none opacity-50"
                  : ""
              }
              aria-disabled={!canGoNext || isLoading}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}