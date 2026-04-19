"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, ListChecks } from "lucide-react";
import UploadFile from "@/components/upload/upload-file";
import UploadStatus from "@/components/upload/upload-status";

export default function UploadPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentTab = searchParams.get("tab") || "upload";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    if (value === "upload") {
      params.delete("page");
      params.delete("status");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="upload" className="flex items-center gap-1.5">
          <Upload className="h-3.5 w-3.5" />
          Upload
        </TabsTrigger>
        <TabsTrigger value="status" className="flex items-center gap-1.5">
          <ListChecks className="h-3.5 w-3.5" />
          Status & Review
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload">
        <UploadFile />
      </TabsContent>

      <TabsContent value="status">
        <UploadStatus />
      </TabsContent>
    </Tabs>
  );
}