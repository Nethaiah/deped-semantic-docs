"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function TruncatedText({
  text,
  className,
  style,
  children,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      const el = textRef.current;
      if (el) {
        setIsTruncated(
          el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight
        );
      }
    };

    // Check on mount
    checkTruncation();
    
    // Check on resize
    window.addEventListener("resize", checkTruncation);
    return () => window.removeEventListener("resize", checkTruncation);
  }, [text]);

  // The div itself handles the truncation classes (like 'truncate' or 'line-clamp-2')
  const content = (
    <div ref={textRef} className={cn(className)} style={style}>
      {children || text}
    </div>
  );

  if (!isTruncated) {
    return content;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {/* We wrap again to avoid conflicting ref issues with Radix TooltipTrigger */}
          <div className="cursor-pointer text-left">{content}</div>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
