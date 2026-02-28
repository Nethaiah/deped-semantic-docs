"use client";

import { useTransition } from "react";
import { SearchIcon, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString, debounce } from "nuqs";
import { Input } from "@/components/ui/input";
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
    <div className="flex flex-row gap-2 mb-6 w-full">
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by title, department, college, advisor..."
          value={query || ""}
          onChange={(e) =>
            setQuery(e.target.value, {
              limitUrlUpdates:
                e.target.value === "" ? undefined : debounce(500),
            })
          }
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-background text-base md:text-sm"
        />
      </div>

      {/* Sort Dropdown */}
      <div className="flex gap-2 shrink-0">
        <Select
          value={sortBy || "date_desc"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="!h-10 w-10 sm:w-40 lg:w-48 p-0 sm:px-3 flex items-center justify-center sm:justify-between shrink-0 [&>svg:last-child]:hidden sm:[&>svg:last-child]:block bg-white">
            <ArrowUpDown className="h-4 w-4 sm:hidden shrink-0 text-muted-foreground m-auto" />
            <span className="hidden sm:inline-block truncate text-left w-full">
              <SelectValue placeholder="Sort by" />
            </span>
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
