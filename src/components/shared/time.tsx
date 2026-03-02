"use client";

import { useCurrentTime } from "@/lib/time-utils";

export default function ClientTimeDisplay() {
  const { formattedTime, formattedDate } = useCurrentTime();

  return (
    <div className="flex flex-col items-start sm:items-end gap-0.5">
      <span className="text-xl sm:text-2xl font-bold tabular-nums tracking-widest text-foreground">
        {formattedTime}
      </span>
      <span className="text-xs sm:text-sm text-muted-foreground font-medium">
        {formattedDate}
      </span>
    </div>
  );
}
