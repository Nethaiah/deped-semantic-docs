"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  AlertTriangle,
  FileText,
  RotateCcw,
} from "lucide-react";
import {
  UploadApiService,
  type PendingThesisItem,
} from "@/lib/api/rag-api";
import { toast } from "sonner";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    variant: "secondary",
    icon: <Clock className="h-3 w-3" />,
  },
  processing: {
    label: "Processing",
    variant: "default",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
  },
  review_ready: {
    label: "Ready for Review",
    variant: "outline",
    icon: <Eye className="h-3 w-3" />,
  },
  completed: {
    label: "Completed",
    variant: "default",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  failed: {
    label: "Failed",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
  },
  rejected: {
    label: "Rejected",
    variant: "destructive",
    icon: <AlertTriangle className="h-3 w-3" />,
  },
};

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function UploadStatus() {
  const router = useRouter();
  const [uploads, setUploads] = useState<PendingThesisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const fetchUploads = useCallback(async () => {
    try {
      const filter = statusFilter === "all" ? undefined : statusFilter;
      const result = await UploadApiService.listUploads(filter);
      setUploads(result.items);
    } catch (error) {
      console.error("Failed to fetch uploads:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchUploads();

    // Auto-refresh every 10 seconds if there are processing items
    const interval = setInterval(() => {
      fetchUploads();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchUploads]);

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    try {
      await UploadApiService.retryUpload(id);
      toast.success("Retry started");
      fetchUploads();
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Retry failed";
      toast.error(msg);
    } finally {
      setRetryingId(null);
    }
  };

  const handleReview = (id: string) => {
    router.push(`/upload/review?id=${id}`);
  };

  const processingCount = uploads.filter(
    (u) => u.status === "processing" || u.status === "pending"
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Upload Status
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track processing progress and review uploaded theses.
            {processingCount > 0 && (
              <span className="ml-1 text-primary font-medium">
                {processingCount} item{processingCount !== 1 ? "s" : ""}{" "}
                processing...
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="review_ready">Ready for Review</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setLoading(true);
              fetchUploads();
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded" />
          ))}
        </div>
      ) : uploads.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            No uploads found. Upload a thesis to get started.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="h-9">Title</TableHead>
                <TableHead className="h-9 w-[100px]">College</TableHead>
                <TableHead className="h-9 w-[80px]">Size</TableHead>
                <TableHead className="h-9 w-[140px]">Status</TableHead>
                <TableHead className="h-9 w-[120px]">Uploaded</TableHead>
                <TableHead className="h-9 w-[100px] text-end">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploads.map((item) => {
                const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="py-2">
                      <div className="max-w-[300px]">
                        <p className="text-sm font-medium truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.original_filename}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      {item.college ? (
                        <Badge variant="secondary" className="text-xs">
                          {item.college}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">
                      {formatBytes(item.file_size_bytes)}
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge
                        variant={config.variant}
                        className="text-xs flex items-center gap-1 w-fit"
                      >
                        {config.icon}
                        {config.label}
                      </Badge>
                      {item.status_message && (
                        <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[140px] truncate">
                          {item.status_message}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="py-2 text-xs text-muted-foreground">
                      {formatDate(item.created_at)}
                    </TableCell>
                    <TableCell className="py-2 text-end">
                      <div className="flex items-center justify-end gap-1">
                        {item.status === "review_ready" && (
                          <Button
                            variant="default"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleReview(item.id)}
                          >
                            <Eye className="h-3 w-3 mr-1" /> Review
                          </Button>
                        )}
                        {(item.status === "failed" ||
                          item.status === "rejected") && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleRetry(item.id)}
                            disabled={retryingId === item.id}
                          >
                            {retryingId === item.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <RotateCcw className="h-3 w-3 mr-1" />
                            )}
                            Retry
                          </Button>
                        )}
                        {item.status === "completed" && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
