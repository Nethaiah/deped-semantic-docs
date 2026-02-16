"use client";

import { useTransition } from "react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString, debounce } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  initialQuery?: string;
  initialSort?: string;
};

export default function BookmarkControls({
  initialQuery = "",
  initialSort = "date_desc",
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [query, setQuery] = useQueryState(
    "q",
    parseAsString.withDefault(initialQuery).withOptions({ shallow: false })
  );
  const [sortBy, setSortBy] = useQueryState("sort", {
    defaultValue: initialSort,
    shallow: false,
  });

  const handleSortChange = (newSort: string) => {
    startTransition(() => {
      setSortBy(newSort);
      const params = new URLSearchParams();
      params.set("page", "1");
      if (query?.trim()) params.set("q", query.trim());
      if (newSort !== "date_desc") params.set("sort", newSort);
      router.push(`/bookmarks?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, department, college, advisor..."
            value={query}
            onChange={(e) =>
              setQuery(e.target.value, {
                limitUrlUpdates:
                  e.target.value === "" ? undefined : debounce(500),
              })
            }
            className="w-full rounded-lg border border-gray-300 bg-white pl-12 pr-4 py-3 text-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Sort Dropdown */}
        <Select
          value={sortBy || "date_desc"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full lg:w-48 py-6">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Newest First</SelectItem>
            <SelectItem value="date_asc">Oldest First</SelectItem>
            <SelectItem value="title_asc">Title A-Z</SelectItem>
            <SelectItem value="title_desc">Title Z-A</SelectItem>
            <SelectItem value="year_desc">Year (Newest)</SelectItem>
            <SelectItem value="year_asc">Year (Oldest)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
