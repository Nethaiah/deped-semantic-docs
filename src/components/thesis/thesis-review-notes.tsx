"use client";

import { MessageSquareWarning } from "lucide-react";

interface Props {
  notes?: string;
}

export default function ThesisReviewNotes({ notes }: Props) {
  if (!notes) return null;

  return (
    <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <MessageSquareWarning className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" strokeWidth={2.5} />
        <div className="space-y-1 flex-1">
          <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
            Reviewer Remarks
          </h3>
          <p className="text-sm leading-relaxed text-amber-800/90 dark:text-amber-200/80 whitespace-pre-wrap">
            {notes}
          </p>
        </div>
      </div>
    </div>
  );
}
