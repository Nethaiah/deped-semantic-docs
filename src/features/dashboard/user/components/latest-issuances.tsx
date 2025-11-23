"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  getBadgeVariant,
  getDynamicBadgeClasses,
} from "@/features/shared/lib/badge-variants";
import { getLatestIssuances } from "@/features/shared/server/get-latest-issuances";
import { Funnel } from "lucide-react";
import { Button } from "@/components/ui/button";
import IssuancesFilterDialog from "@/features/shared/components/issuances-filter-dialog";
import NumberedPagination from "@/features/shared/components/numbered-pagination";

type Issuance = {
  id: string;
  code: string;
  title: string;
  issuedDate: string;
  tags: string[];
  office: string;
  slug: string;
};

// Format date to "Month Day, Year" format
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

export default function LatestIssuances({
  initialData,
  initialTotalPages = 1,
}: {
  initialData: Issuance[];
  initialTotalPages?: number;
}) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formFilters, setFormFilters] = useState({
    fromDate: "",
    toDate: "",
    issuer: "",
    issuerLevel: "",
    code: "",
    title: "",
    tags: "",
    docType: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<{
    issuerLevel?: "Central" | "Division";
    docType?: "Order" | "Memorandum";
  }>({});

  const loadPage = async (page: number, overrideFilters?: {
    issuerLevel?: "Central" | "Division";
    docType?: "Order" | "Memorandum";
  }) => {
    setIsLoading(true);
    try {
      const result = await getLatestIssuances(
        page,
        10,
        overrideFilters ?? appliedFilters
      );
      setData(result.data);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error loading page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onApplyFilters = async () => {
    const nextApplied: {
      issuerLevel?: "Central" | "Division";
      docType?: "Order" | "Memorandum";
    } = {
      issuerLevel: (formFilters.issuerLevel as "Central" | "Division") || undefined,
      docType: (formFilters.docType as "Order" | "Memorandum") || undefined,
    };
    setAppliedFilters(nextApplied);
    setIsFilterOpen(false);
    await loadPage(1, nextApplied);
  };

  const onResetFilters = async () => {
    setFormFilters({
      fromDate: "",
      toDate: "",
      issuer: "",
      issuerLevel: "",
      code: "",
      title: "",
      tags: "",
      docType: "",
    });
    setAppliedFilters({});
    setIsFilterOpen(false);
    await loadPage(1, {});
  };

  const activeFilterCount = [
    appliedFilters.issuerLevel,
    appliedFilters.docType,
  ].filter(Boolean).length;

  // For numbered pagination - we don't use actual URLs, just trigger loadPage
  const buildHref = (page: number) => {
    return "#"; // Dummy href since we handle navigation programmatically
  };

  const handlePageChange = (page: number) => {
    loadPage(page);
  };

  return (
    <div className="col-span-2 bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          Latest Issuance
        </h2>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <span className="text-xs font-semibold text-slate-600 px-2 py-1 rounded-md bg-slate-100 border border-slate-200">
              {activeFilterCount} active
            </span>
          )}
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(true)}
          >
            <Funnel className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <IssuancesFilterDialog
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            values={formFilters}
            onValuesChange={setFormFilters}
            onApply={onApplyFilters}
            onReset={onResetFilters}
          />
        </div>
      </div>

      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide">
                Created
              </th>
              <th className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide">
                Title
              </th>
              <th className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide">
                Tags
              </th>
              <th className="py-3 px-4 text-xs font-[800] text-slate-700 uppercase tracking-wide">
                Issuer
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((issuance, index) => (
                <tr
                  key={issuance.id}
                  onClick={() => router.push(`/view/${issuance.id}`)}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                    index !== data.length - 1 ? "border-b border-slate-200" : ""
                  }`}
                >
                  <td className="py-4 px-4 text-md text-slate-600">
                    {formatDate(issuance.issuedDate)}
                  </td>

                  <td className="py-4 px-4 text-md text-slate-900 max-w-[250px]">
                    <Link
                      href={`/view/${issuance.id}`}
                      className="block hover:opacity-80 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="truncate"
                        title={`${issuance.code} ${issuance.title}`}
                      >
                        <span className="font-bold text-[#278fb6] mr-2">
                          {issuance.code}
                        </span>
                        <br />
                        <span className="text-slate-900">{issuance.title}</span>
                      </div>
                    </Link>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {issuance.tags.slice(0, 2).map((tag, tagIndex) => {
                        const variant = getBadgeVariant(tag);
                        if (variant === "dynamic") {
                          return (
                            <span
                              key={tagIndex}
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getDynamicBadgeClasses(
                                tag
                              )}`}
                            >
                              {tag}
                            </span>
                          );
                        }
                        return (
                          <Badge key={tagIndex} variant={variant}>
                            {tag}
                          </Badge>
                        );
                      })}
                      {issuance.tags.length > 2 && (
                        <span
                          className="text-xs text-slate-500 font-semibold cursor-default"
                          title={issuance.tags.slice(2).join(", ")}
                        >
                          +{issuance.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-md text-slate-600">
                    <span className="text-slate-500 text-sm">
                      {issuance.office}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500">
                  No issuances found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Numbered Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
        <NumberedPagination
          currentPage={currentPage}
          totalPages={totalPages}
          buildHref={buildHref}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}