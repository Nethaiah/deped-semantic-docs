import { Badge } from "@/components/ui/badge";
import { CalendarDays, Building2 } from "lucide-react";
import { getBadgeVariant, getDynamicBadgeClasses } from "@/lib/badge-variants";
import type { DocumentData } from "@/server/documents/get-document-data";

type Props = {
  doc: DocumentData;
};

export default function DocumentInfoSidebar({ doc }: Props) {
  return (
    <div>
      <h3 className="text-xl font-bold text-slate-800">{doc.code}</h3>
      <p className="text-slate-600 text-sm mt-1">{doc.title}</p>
      
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center gap-3 text-slate-600">
          <CalendarDays className="h-4 w-4" />
          <span>Issued: {doc.issuedDate}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Building2 className="h-4 w-4" />
          <span>Issuer: {doc.office}</span>
        </div>
        {doc.tags && doc.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {doc.tags.map((t) => {
              const variant = getBadgeVariant(t);
              return (
                <Badge
                  key={t}
                  size="md"
                  {...(variant === "dynamic"
                    ? { className: getDynamicBadgeClasses(t) }
                    : { variant })}
                >
                  {t}
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
