import { Suspense } from "react";
import Search from "@/components/search/search";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-4 md:p-8 bg-gray-50 flex-1 w-full flex flex-col animate-pulse"></div>}>
      <Search />
    </Suspense>
  );
}
