"use client";

import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { getBadgeVariant, getDynamicBadgeClasses } from "@/lib/badge-variants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function DynamicTags({ tags }: { tags: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>(tags.length);
  
  const renderBadge = (kw: string) => {
    const variant = getBadgeVariant(kw);
    const dynamicClasses = variant === "dynamic" ? getDynamicBadgeClasses(kw) : "";
    
    return (
      <Badge
        key={kw}
        size="sm"
        className={`text-[10px] sm:text-xs whitespace-nowrap ${dynamicClasses}`}
        {...(variant !== "dynamic" && { variant })}
      >
        {kw}
      </Badge>
    );
  };

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver(() => {
      const container = containerRef.current;
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      const children = Array.from(container.children) as HTMLElement[];
      if (children.length === 0) return;

      const gap = 6; // gap-1.5 is exactly 6px (0.375rem)
      const plusWidth = 40; // safe approximation for a "+N" string pill
      
      let currentWidth = 0;
      let count = 0;
      const tagElements = children.slice(0, -1);
      
      for (let i = 0; i < tagElements.length; i++) {
        const childWidth = tagElements[i].getBoundingClientRect().width;
        
        // If it's the very last tag, we don't need room for the +N badge
        if (i === tagElements.length - 1) {
          if (currentWidth + childWidth <= containerWidth) {
            count++;
          }
          break;
        }
        
        // Ensure there is room for the current tag PLUS the potential +N badge
        if (currentWidth + childWidth + gap + plusWidth <= containerWidth) {
          currentWidth += childWidth + gap;
          count++;
        } else {
          break; // Stop immediately; no more fit
        }
      }
      
      // Never drop below 1 tag visible if the column is insanely squeezed, to prevent entirely empty cells
      setVisibleCount(Math.max(1, count));
    });
    
    observer.observe(containerRef.current);
    
    return () => observer.disconnect();
  }, [tags]);

  if (!tags || tags.length === 0) return <span className="text-slate-400 text-xs italic">-</span>;

  const visibleTags = tags.slice(0, visibleCount);
  const hiddenTags = tags.slice(visibleCount);

  return (
    <div className="relative w-full h-6">
      {/* Invisible flex ghost container for true DOM width measuring */}
      <div 
        ref={containerRef} 
        className="absolute top-0 left-0 w-full flex opacity-0 pointer-events-none z-[-1] gap-1.5 overflow-hidden"
      >
        {tags.map(t => <div key={t} className="shrink-0 leading-none flex items-center">{renderBadge(t)}</div>)}
        <div className="shrink-0 leading-none flex items-center"><Badge size="sm">+{tags.length}</Badge></div>
      </div>
      
      {/* Visually rendered container sliced by precise calculation */}
      <div className="absolute top-0 left-0 w-full flex gap-1.5 items-center overflow-hidden h-full">
        {visibleTags.map(renderBadge)}
        
        {hiddenTags.length > 0 && (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" size="sm" className="text-[10px] sm:text-xs cursor-help opacity-80 shrink-0">
                  +{hiddenTags.length}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[250px] z-[100]">
                <div className="flex flex-wrap gap-1 justify-center p-1">
                  {hiddenTags.map(renderBadge)}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}
