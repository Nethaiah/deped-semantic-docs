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
import { useState, useEffect } from "react";

export type SearchMode = "rag" | "keyword";

// College to Department mapping
const COLLEGE_DEPARTMENTS: Record<string, string[]> = {
  CAS: ["Communication", "Psychology"],
  CCS: ["Computer Science", "Information Technology"],
  CBAA: [
    "Accountancy",
    "Accounting Information Systems",
    "Entrepreneurship",
    "Tourism Management",
  ],
  COED: [
    "Secondary Education Major in Science",
    "Secondary Education Major in Mathematics",
    "Secondary Education Major in English",
    "Secondary Education Major in PE",
    "Elementary Education",
  ],
  COE: ["Mechanical Engineering"],
};

export type SearchFilterValues = {
  yearFrom: string;
  yearTo: string;
  college: string;
  department: string;
  keywords: string;
  searchMode: SearchMode;
};

type SearchFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: SearchFilterValues;
  onValuesChange: (next: SearchFilterValues) => void;
  onApply: (newValues: SearchFilterValues) => void;
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
  // Local state to track pending changes
  const [localValues, setLocalValues] = useState<SearchFilterValues>(values);

  // Sync local values with props when dialog opens or values change externally
  useEffect(() => {
    if (open) {
      setLocalValues(values);
    }
  }, [open, values]);

  const filtersDisabled = localValues.searchMode === "rag";

  // Get departments based on selected college
  const availableDepartments = localValues.college
    ? COLLEGE_DEPARTMENTS[localValues.college] || []
    : [];

  const isDepartmentDisabled = !localValues.college || filtersDisabled;

  // Handle college change - reset department when college changes
  const handleCollegeChange = (val: string) => {
    const newCollege = val === "_all" ? "" : val;
    setLocalValues({
      ...localValues,
      college: newCollege,
      department: "", // Reset department when college changes
    });
  };

  // Handler for applying filters - commits local changes to parent
  const handleApply = () => {
    onValuesChange(localValues);
    onApply(localValues);
  };

  // Handler for resetting filters
  const handleReset = () => {
    onReset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search Filters</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 ">
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
                {localValues.searchMode === "rag"
                  ? "AI-powered semantic understanding (filters disabled)"
                  : "Traditional keyword matching with filters"}
              </p>
            </div>
            <Switch
              id="search-mode"
              checked={localValues.searchMode === "rag"}
              onCheckedChange={(checked) =>
                setLocalValues({
                  ...localValues,
                  searchMode: checked ? "rag" : "keyword",
                })
              }
              className="data-[state=checked]:bg-[#278fb6] cursor-pointer"
            />
          </div>

          {/* Filter Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Year Range */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="year-from"
                className="text-xs font-semibold text-slate-700"
              >
                Year From
              </label>
              <input
                id="year-from"
                type="number"
                placeholder="e.g., 2020"
                value={localValues.yearFrom}
                onChange={(e) =>
                  setLocalValues({ ...localValues, yearFrom: e.target.value })
                }
                disabled={filtersDisabled}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#278fb6] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors cursor-text"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="year-to"
                className="text-xs font-semibold text-slate-700"
              >
                Year To
              </label>
              <input
                id="year-to"
                type="number"
                placeholder="e.g., 2025"
                value={localValues.yearTo}
                onChange={(e) =>
                  setLocalValues({ ...localValues, yearTo: e.target.value })
                }
                disabled={filtersDisabled}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#278fb6] disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors cursor-text"
              />
            </div>

            {/* College */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="college"
                className="text-xs font-semibold text-slate-700"
              >
                College
              </label>
              <Select
                value={localValues.college || "_all"}
                onValueChange={handleCollegeChange}
                disabled={filtersDisabled}
              >
                <SelectTrigger
                  id="college"
                  className="w-full disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer"
                  disabled={filtersDisabled}
                >
                  <SelectValue placeholder="All Colleges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all" className="cursor-pointer">
                    All Colleges
                  </SelectItem>
                  {Object.keys(COLLEGE_DEPARTMENTS).map((col) => (
                    <SelectItem key={col} value={col} className="cursor-pointer">
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="department"
                className="text-xs font-semibold text-slate-700"
              >
                Department
              </label>
              <Select
                value={localValues.department || "_all"}
                onValueChange={(val) =>
                  setLocalValues({ ...localValues, department: val === "_all" ? "" : val })
                }
                disabled={isDepartmentDisabled}
              >
                <SelectTrigger
                  id="department"
                  className={`w-full ${isDepartmentDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  disabled={isDepartmentDisabled}
                >
                  <SelectValue placeholder={!localValues.college && !filtersDisabled ? "Select a college first" : "All Departments"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all" className="cursor-pointer">
                    All Departments
                  </SelectItem>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept} className="cursor-pointer">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Keywords */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label
                htmlFor="keywords"
                className="text-xs font-semibold text-slate-700"
              >
                Keywords
              </label>
              <input
                id="keywords"
                type="text"
                placeholder="e.g., machine learning, AI (comma separated)"
                value={localValues.keywords}
                onChange={(e) =>
                  setLocalValues({ ...localValues, keywords: e.target.value })
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
              onClick={handleReset}
              className="w-full cursor-pointer"
            >
              Reset All
            </Button>
            <Button
              onClick={handleApply}
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
