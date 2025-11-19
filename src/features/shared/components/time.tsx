"use client";

import { useCurrentTime } from "@/lib/time-utils";

export default function ClientTimeDisplay() {
  const { formattedTime, formattedDate } = useCurrentTime();

  return (
    <div className="text-right">
      <div className="text-3xl text-[#333] font-bold tracking-[0.2rem]">
        {formattedTime}
      </div>
      <div className="text-lg text-[#333]">{formattedDate}</div>
    </div>
  );
}