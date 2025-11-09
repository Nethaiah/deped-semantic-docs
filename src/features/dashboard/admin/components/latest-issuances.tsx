"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getBadgeVariant } from "@/features/shared/lib/badge-variants";

type Issuance = {
  id: string;
  code: string;
  title: string;
  issuedDate: string;
  tags: string[];
  office: string;
  slug: string;
};

// Format date to "Month Day" format
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    month: 'long', 
    day: 'numeric' ,
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

export default function LatestIssuances({ data }: { data: Issuance[] }) {
  const router = useRouter();

  return (
    <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Latest Issuance
        </h2>
        <button className="text-sm text-[#008c8b] hover:underline font-medium">
          Show all
        </button>
      </div>

      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-xs font-[800] text-gray-600 uppercase tracking-wide">
              Created
            </th>
            <th className="py-3 px-4 text-xs font-[800] text-gray-600 uppercase tracking-wide">
              Title
            </th>
            <th className="py-3 px-4 text-xs font-[800] text-gray-600 uppercase tracking-wide">
              Tags
            </th>
            <th className="py-3 px-4 text-xs font-[800] text-gray-600 uppercase tracking-wide">
              Issuer
            </th>
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((issuance, index) => (
              <tr
                key={issuance.id}
                onClick={() => router.push(`/view/${issuance.slug}`)}
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                  index !== data.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <td className="py-4 px-4 text-md text-gray-600">
                  {formatDate(issuance.issuedDate)}
                </td>

                <td className="py-4 px-4 text-md text-gray-900 max-w-[250px]">
                  <Link
                    href={`/view/${issuance.slug}`}
                    className="block hover:opacity-80 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="truncate" title={`${issuance.code} ${issuance.title}`}>
                      <span className="font-bold text-[#008c8b] mr-2">{issuance.code}</span>
                      <br />
                      <span className="text-gray-900">{issuance.title}</span>
                    </div>
                  </Link>
                </td>

                {/* 🔹 Tags */}
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {issuance.tags.slice(0, 2).map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant={getBadgeVariant(tag)}>
                        {tag}
                      </Badge>
                    ))}
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
  );
}