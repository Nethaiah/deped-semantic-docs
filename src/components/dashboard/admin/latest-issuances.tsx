"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import {
  getBadgeVariant,
  getDynamicBadgeClasses,
} from "@/lib/badge-variants";
import { getLatestIssuances } from "@/server/documents/get-latest-issuances";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

  const loadPage = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await getLatestIssuances(page, 10);
      setData(result.data);
      setCurrentPage(result.currentPage);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error("Error loading page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      loadPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      loadPage(currentPage + 1);
    }
  };

  return (
    <div className="col-span-2 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Issuances
        </h2>
      </div>

      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-xs font-[800] text-gray-700 uppercase tracking-wide">
                Created
              </th>
              <th className="py-3 px-4 text-xs font-[800] text-gray-700 uppercase tracking-wide">
                Title
              </th>
              <th className="py-3 px-4 text-xs font-[800] text-gray-700 uppercase tracking-wide">
                Tags
              </th>
              <th className="py-3 px-4 text-xs font-[800] text-gray-700 uppercase tracking-wide">
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
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    index !== data.length - 1 ? "border-b border-gray-200" : ""
                  }`}
                >
                  <td className="py-4 px-4 text-md text-gray-600">
                    {formatDate(issuance.issuedDate)}
                  </td>

                  <td className="py-4 px-4 text-md text-gray-900 max-w-[250px]">
                    <Link
                      href={`/view/${issuance.id}`}
                      className="block hover:opacity-80 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className="truncate"
                        title={`${issuance.code} ${issuance.title}`}
                      >
                        <span className="font-bold text-[#008c8b] mr-2">
                          {issuance.code}
                        </span>
                        <br />
                        <span className="text-gray-900">{issuance.title}</span>
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
                          className="text-xs text-gray-500 font-semibold cursor-default"
                          title={issuance.tags.slice(2).join(", ")}
                        >
                          +{issuance.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4 text-md text-gray-600">
                    <span className="text-gray-500 text-sm">
                      {issuance.office}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No issuances found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1 || isLoading}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm text-gray-700"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || isLoading}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm text-gray-700"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
