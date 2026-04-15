"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-context";

interface BatchActionBarProps {
  selectedCount: number;
  onDeselectAll: () => void;
  isProcessing?: boolean;
  children: React.ReactNode;
}

/**
 * Animated batch-action bar.
 * Slides down when `selectedCount > 0`, slides back up when deselected.
 */
export function BatchActionBar({
  selectedCount,
  onDeselectAll,
  isProcessing,
  children,
}: BatchActionBarProps) {
  const { theme } = useTheme();
  const isVisible = selectedCount > 0;

  return (
    <div
      className={`
        grid transition-all duration-300 ease-in-out
        ${isVisible ? "grid-rows-[1fr] opacity-100 mb-4" : "grid-rows-[0fr] opacity-0 mb-0"}
      `}
    >
      <div className="overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          {/* Left — selection info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold text-white"
                style={{ backgroundColor: theme.primary }}
              >
                {selectedCount}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {selectedCount === 1 ? "item" : "items"} selected
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeselectAll}
              disabled={isProcessing}
              className="h-7 gap-1.5 text-xs text-gray-500 hover:text-gray-800"
            >
              <X className="h-3.5 w-3.5" />
              Deselect all
            </Button>
          </div>

          {/* Right — action buttons (provided by parent) */}
          <div className="flex items-center gap-2 flex-wrap">{children}</div>
        </div>
      </div>
    </div>
  );
}
