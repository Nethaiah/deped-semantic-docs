"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SearchMode = "rag" | "keyword";

export default function SearchModeSelect({
  mode,
  onChange,
  disabled,
}: {
  mode: SearchMode;
  onChange: (mode: SearchMode) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-700">Search Mode</label>
      <Select
        value={mode}
        onValueChange={(val) => onChange(val as SearchMode)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[320px]">
          <SelectValue placeholder="Select search mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rag">RAG Search (AI-powered with semantic understanding)</SelectItem>
          <SelectItem value="keyword">Keyword Search (Traditional text matching)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
