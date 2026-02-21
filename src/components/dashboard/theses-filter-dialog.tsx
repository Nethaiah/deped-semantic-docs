"use client";

import React from "react";
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

export type ThesesFilterFormValues = {
  yearFrom: string;
  yearTo: string;
  department: string;
  college: string;
  title: string;
};

type ThesesFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: ThesesFilterFormValues;
  onValuesChange: (next: ThesesFilterFormValues) => void;
  onApply: () => void;
  onReset: () => void;
  departments?: string[];
  colleges?: string[];
};

export default function ThesesFilterDialog({
  open,
  onOpenChange,
  values,
  onValuesChange,
  onApply,
  onReset,
  colleges = [],
}: ThesesFilterDialogProps) {
  // Get departments based on selected college
  const availableDepartments = values.college
    ? COLLEGE_DEPARTMENTS[values.college] || []
    : [];

  const isDepartmentDisabled = !values.college;

  // Handle college change - reset department when college changes
  const handleCollegeChange = (val: string) => {
    const newCollege = val === "_all" ? "" : val;
    onValuesChange({
      ...values,
      college: newCollege,
      department: "", // Reset department when college changes
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Theses</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                value={values.yearFrom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onValuesChange({ ...values, yearFrom: e.target.value })
                }
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
                className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                value={values.yearTo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onValuesChange({ ...values, yearTo: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="college"
                className="text-xs font-semibold text-slate-700"
              >
                College
              </label>
              <Select
                value={values.college || "_all"}
                onValueChange={handleCollegeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Colleges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">All Colleges</SelectItem>
                  {Object.keys(COLLEGE_DEPARTMENTS).map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="department"
                className="text-xs font-semibold text-slate-700"
              >
                Department
              </label>
              <Select
                value={values.department || "_all"}
                onValueChange={(val) =>
                  onValuesChange({ ...values, department: val === "_all" ? "" : val })
                }
                disabled={isDepartmentDisabled}
              >
                <SelectTrigger className={`w-full ${isDepartmentDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <SelectValue placeholder={isDepartmentDisabled ? "Select a college first" : "All Departments"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="_all">All Departments</SelectItem>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
              placeholder="Search by title..."
              className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
              value={values.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onValuesChange({ ...values, title: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter className="w-full sm:justify-start sm:space-x-0 mb-3">
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
