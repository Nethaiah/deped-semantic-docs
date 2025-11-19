"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type IssuancesFilterFormValues = {
  fromDate: string;
  toDate: string;
  issuer: string;
  issuerLevel: string;
  code: string;
  title: string;
  tags: string;
  docType: string;
};

type IssuancesFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: IssuancesFilterFormValues;
  onValuesChange: (next: IssuancesFilterFormValues) => void;
  onApply: () => void;
  onReset: () => void;
};

export default function IssuancesFilterDialog({
  open,
  onOpenChange,
  values,
  onValuesChange,
  onApply,
  onReset,
}: IssuancesFilterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Filter Issuances</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filter Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Range */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="from-date" className="text-xs font-semibold text-slate-700">
                From Date
              </label>
              <input
                id="from-date"
                type="date"
                value={values.fromDate}
                onChange={(e) => onValuesChange({ ...values, fromDate: e.target.value })}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="to-date" className="text-xs font-semibold text-slate-700">
                To Date
              </label>
              <input
                id="to-date"
                type="date"
                value={values.toDate}
                onChange={(e) => onValuesChange({ ...values, toDate: e.target.value })}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>

            {/* Issuer Level */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="issuer-level" className="text-xs font-semibold text-slate-700">
                Issuer Level
              </label>
              <Select 
                value={values.issuerLevel} 
                onValueChange={(val) => onValuesChange({ ...values, issuerLevel: val })}
              >
                <SelectTrigger id="issuer-level" className="w-full">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Central">Central</SelectItem>
                  <SelectItem value="Division">Division</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Document Type */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="doc-type" className="text-xs font-semibold text-slate-700">
                Document Type
              </label>
              <Select 
                value={values.docType} 
                onValueChange={(val) => onValuesChange({ ...values, docType: val })}
              >
                <SelectTrigger id="doc-type" className="w-full">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Order">Order</SelectItem>
                  <SelectItem value="Memorandum">Memorandum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Document Number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="doc-number" className="text-xs font-semibold text-slate-700">
                Document Number
              </label>
              <input
                id="doc-number"
                type="text"
                placeholder="e.g. RM 123, DM 2024-001"
                value={values.code}
                onChange={(e) => onValuesChange({ ...values, code: e.target.value })}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder:text-slate-400"
              />
            </div>

            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-xs font-semibold text-slate-700">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Search in title"
                value={values.title}
                onChange={(e) => onValuesChange({ ...values, title: e.target.value })}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder:text-slate-400"
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="tags" className="text-xs font-semibold text-slate-700">
                Tags
              </label>
              <input
                id="tags"
                type="text"
                placeholder="e.g. policy, finance, HR (comma separated)"
                value={values.tags}
                onChange={(e) => onValuesChange({ ...values, tags: e.target.value })}
                className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            Reset All
          </Button>
          <Button 
            onClick={onApply}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}