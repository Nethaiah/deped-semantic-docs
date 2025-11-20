"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export type SearchMode = "rag" | "keyword";

export type SearchFilterValues = {
  fromDate: string;
  toDate: string;
  issuer: string;
  issuerLevel: string;
  code: string;
  title: string;
  tags: string;
  docType: string;
  searchMode: SearchMode;
};

type SearchFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: SearchFilterValues;
  onValuesChange: (next: SearchFilterValues) => void;
  onApply: () => void;
  onReset: () => void;
};

export default function SearchFilterDialog({
  open,
  onOpenChange,
  values,
  onValuesChange,
  onApply,
  onReset,
}: SearchFilterDialogProps) {
  const filtersDisabled = values.searchMode === "rag";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search Filters</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="search-mode"
                className="text-sm font-semibold text-slate-900"
              >
                Semantic Search
              </label>
              <p className="text-xs text-slate-600">
                {values.searchMode === "rag"
                  ? "AI-powered semantic understanding (filters disabled)"
                  : "Traditional keyword matching with filters"}
              </p>
            </div>
            <Switch
              id="search-mode"
              checked={values.searchMode === "rag"}
              onCheckedChange={(checked) =>
                onValuesChange({
                  ...values,
                  searchMode: checked ? "rag" : "keyword",
                })
              }
              className="data-[state=checked]:bg-[#278fb6] cursor-pointer"
            />
          </div>

          {/* Filter Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Range */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="from-date"
                className="text-xs font-semibold text-slate-700"
              >
                From Date
              </label>
              <input
                id="from-date"
                type="date"
                value={values.fromDate}
                onChange={(e) =>
                  onValuesChange({ ...values, fromDate: e.target.value })
                }
                disabled={filtersDisabled}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#278fb6] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors cursor-text"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="to-date"
                className="text-xs font-semibold text-slate-700"
              >
                To Date
              </label>
              <input
                id="to-date"
                type="date"
                value={values.toDate}
                onChange={(e) =>
                  onValuesChange({ ...values, toDate: e.target.value })
                }
                disabled={filtersDisabled}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#278fb6] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors cursor-text"
              />
            </div>

            {/* Issuer Level */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="issuer-level"
                className="text-xs font-semibold text-slate-700"
              >
                Issuer Level
              </label>
              <Select
                value={values.issuerLevel}
                onValueChange={(val) =>
                  onValuesChange({ ...values, issuerLevel: val })
                }
                disabled={filtersDisabled}
              >
                <SelectTrigger
                  id="issuer-level"
                  className="w-full disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
                  disabled={filtersDisabled}
                >
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Central" className="cursor-pointer">
                    Central
                  </SelectItem>
                  <SelectItem value="Division" className="cursor-pointer">
                    Division
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Document Type */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="doc-type"
                className="text-xs font-semibold text-slate-700"
              >
                Document Type
              </label>
              <Select
                value={values.docType}
                onValueChange={(val) =>
                  onValuesChange({ ...values, docType: val })
                }
                disabled={filtersDisabled}
              >
                <SelectTrigger
                  id="doc-type"
                  className="w-full disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
                  disabled={filtersDisabled}
                >
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Order" className="cursor-pointer">
                    Order
                  </SelectItem>
                  <SelectItem value="Memorandum" className="cursor-pointer">
                    Memorandum
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Document Number */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="doc-number"
                className="text-xs font-semibold text-slate-700"
              >
                Document Number
              </label>
              <input
                id="doc-number"
                type="text"
                placeholder="e.g. RM 123, DM 2024-001"
                value={values.code}
                onChange={(e) =>
                  onValuesChange({ ...values, code: e.target.value })
                }
                disabled={filtersDisabled}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#278fb6] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors placeholder:text-slate-400"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="title"
                className="text-xs font-semibold text-slate-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Search in title"
                value={values.title}
                onChange={(e) =>
                  onValuesChange({ ...values, title: e.target.value })
                }
                disabled={filtersDisabled}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#278fb6] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors placeholder:text-slate-400"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label
                htmlFor="tags"
                className="text-xs font-semibold text-slate-700"
              >
                Tags
              </label>
              <input
                id="tags"
                type="text"
                placeholder="e.g. policy, finance, HR (comma separated)"
                value={values.tags}
                onChange={(e) =>
                  onValuesChange({ ...values, tags: e.target.value })
                }
                disabled={filtersDisabled}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#278fb6] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Info Message when filters are disabled */}
          {filtersDisabled && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <svg
                className="w-5 h-5 text-[#278fb6] mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs text-blue-800">
                <strong>Semantic Search Mode:</strong> Filters are disabled. The
                AI will understand your query contextually and return the most
                relevant results.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="w-full sm:justify-start sm:space-x-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Button
              variant="outline"
              onClick={onReset}
              className="w-full cursor-pointer"
            >
              Reset All
            </Button>
            <Button
              onClick={onApply}
              className="w-full bg-[#278fb6] hover:bg-[#278fb6]/80 cursor-pointer"
            >
              Apply Filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}