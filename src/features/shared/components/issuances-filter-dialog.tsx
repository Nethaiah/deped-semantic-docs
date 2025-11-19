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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={onReset}
            className="w-full sm:w-auto mr-3"
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