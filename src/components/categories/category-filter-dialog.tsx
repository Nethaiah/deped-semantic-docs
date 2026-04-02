"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-context";

export type CollegeFilterFormValues = {
  yearFrom: string;
  yearTo: string;
  department: string;
};

type CollegeFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: CollegeFilterFormValues;
  onValuesChange: (next: CollegeFilterFormValues) => void;
  onApply: () => void;
  onReset: () => void;
  departments: string[];
};

export default function CollegeFilterDialog({
  open,
  onOpenChange,
  values,
  onValuesChange,
  onApply,
  onReset,
  departments,
}: CollegeFilterDialogProps) {
  const { theme } = useTheme();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Thesis Papers</DialogTitle>
          <DialogDescription className="sr-only">
            Filter the thesis papers by specifying year and department.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Year Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="year-from"
                className="text-xs font-semibold text-slate-700"
              >
                Year From
              </Label>
              <Input
                id="year-from"
                type="number"
                placeholder="e.g., 2020"
                value={values.yearFrom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onValuesChange({ ...values, yearFrom: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="year-to"
                className="text-xs font-semibold text-slate-700"
              >
                Year To
              </Label>
              <Input
                id="year-to"
                type="number"
                placeholder="e.g., 2025"
                value={values.yearTo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onValuesChange({ ...values, yearTo: e.target.value })
                }
              />
            </div>
          </div>

          {/* Department Dropdown */}
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="department"
              className="text-xs font-semibold text-slate-700"
            >
              Department
            </Label>
            <Select
              value={values.department || "_all"}
              onValueChange={(val) =>
                onValuesChange({ ...values, department: val === "_all" ? "" : val })
              }
            >
              <SelectTrigger id="department" className="w-full cursor-pointer">
                <SelectValue placeholder="All departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_all" className="cursor-pointer">All departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept} className="cursor-pointer">
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Footer with Grid Layout */}
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
              className={`w-full ${theme.primaryBgClass} ${theme.primaryHoverBgClass} cursor-pointer`}
            >
              Apply Filters
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
