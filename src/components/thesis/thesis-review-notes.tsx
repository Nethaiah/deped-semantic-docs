"use client";

import { MessageSquareWarning } from "lucide-react";

interface Props {
  notes?: string;
}

export default function ThesisReviewNotes({ notes }: Props) {
  if (!notes) return null;

  return (
    <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-5 mb-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="bg-amber-100/80 dark:bg-amber-900/50 p-2.5 rounded-lg shrink-0 mt-0.5 shadow-xs border border-amber-200/50 dark:border-amber-800/50">
          <MessageSquareWarning className="w-5 h-5 text-amber-600 dark:text-amber-400" strokeWidth={2.5} />
        </div>
        <div className="space-y-1.5 flex-1 pt-0.5">
          <h3 className="font-bold text-amber-900 dark:text-amber-200 text-[15px] tracking-tight">
            Reviewer Remarks
          </h3>
          <p className="text-[14px] leading-relaxed text-amber-800/90 dark:text-amber-200/80 whitespace-pre-wrap">
            {notes}
          </p>
        </div>
      </div>
    </div>
  );
}
