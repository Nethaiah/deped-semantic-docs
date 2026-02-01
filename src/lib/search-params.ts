import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

// Bookmark search params
export const bookmarkSortOptions = [
  "date_desc",
  "date_asc",
  "title_asc",
  "title_desc",
  "year_desc",
  "year_asc",
] as const;

export type BookmarkSortOption = (typeof bookmarkSortOptions)[number];

export const bookmarkSearchParams = {
  page: parseAsInteger.withDefault(1),
  q: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(bookmarkSortOptions).withDefault("date_desc"),
};

export const bookmarkSearchParamsCache = createSearchParamsCache(bookmarkSearchParams);

// Theses table filter params
export const thesesFilterParams = {
  page: parseAsInteger.withDefault(1),
  yearFrom: parseAsString.withDefault(""),
  yearTo: parseAsString.withDefault(""),
  department: parseAsString.withDefault(""),
  college: parseAsString.withDefault(""),
  title: parseAsString.withDefault(""),
};

export const thesesFilterParamsCache = createSearchParamsCache(thesesFilterParams);

