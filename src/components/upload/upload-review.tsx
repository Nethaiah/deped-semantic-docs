"use client";

import { useEffect, useState, useCallback } from "react";
import PDFViewer from "@/components/thesis/pdf-viewer/manage-pdf-viewer";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  FileText,
  ArrowLeft,
  BookOpen,
  Users,
  Calendar,
  Building2,
  UserCheck,
  Tag,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import {
  UploadApiService,
  type ReviewData,
  type ApprovePayload,
} from "@/lib/api/rag-api";
import { toast } from "sonner";

const COLLEGES = [
  { code: "CCS", name: "College of Computing Studies" },
  { code: "COED", name: "College of Education" },
  { code: "CAS", name: "College of Arts and Sciences" },
  { code: "CBAA", name: "College of Business Administration and Accountancy" },
  { code: "COE", name: "College of Engineering" },
];

interface UploadReviewProps {
  uploadId: string;
}

export default function UploadReview({ uploadId }: UploadReviewProps) {
  const router = useRouter();
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("full_text");

  // Editable fields (pre-filled from extracted data)
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [advisor, setAdvisor] = useState("");
  const [keywords, setKeywords] = useState("");
  const [abstract, setAbstract] = useState("");
  const [summary, setSummary] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const fetchReview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const reviewData = await UploadApiService.getUploadReview(uploadId);
      setData(reviewData);

      // Pre-fill form with extracted data
      setTitle(reviewData.title || "");
      setAuthors((reviewData.authors || []).join(", "));
      setYear(reviewData.year?.toString() || "");
      setCollege(reviewData.college || "");
      setDepartment(reviewData.department || "");
      setAdvisor(reviewData.advisor || "");
      setKeywords((reviewData.keywords || []).join(", "));
      setAbstract(reviewData.abstract || "");
      setSummary(reviewData.summary || "");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load review data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [uploadId]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      const payload: ApprovePayload = {
        title: title.trim() || undefined,
        authors: authors
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        year: year ? parseInt(year, 10) : undefined,
        college: college || undefined,
        department: department.trim() || undefined,
        advisor: advisor.trim() || undefined,
        keywords: keywords
          .split(",")
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean),
        abstract: abstract.trim() || undefined,
        summary: summary.trim() || undefined,
        review_notes: reviewNotes.trim() || undefined,
      };

      const result = await UploadApiService.approveUpload(uploadId, payload);
      toast.success("Thesis approved and published!", {
        description: `Thesis ID: ${result.thesis_id}`,
        duration: 6000,
      });
      router.push("/upload");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Approval failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    setSubmitting(true);
    try {
      await UploadApiService.rejectUpload(uploadId, {
        reason: rejectReason.trim() || "Rejected by admin",
      });
      toast.success("Upload rejected");
      router.push("/upload");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Rejection failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Build PDF URL for the iframe — uses FastAPI proxy to fetch from R2
  const pdfUrl = data ? UploadApiService.getPendingPdfUrl(uploadId) : "";

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-[600px] rounded-lg" />
          <Skeleton className="h-[600px] rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-center">
        <AlertTriangle className="mx-auto h-10 w-10 text-destructive mb-3" />
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/upload")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Uploads
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const isReviewable = data.status === "review_ready" || data.status === "failed";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/upload")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold">Review Thesis Upload</h2>
            <p className="text-sm text-muted-foreground">
              Compare the PDF with extracted text and metadata, then approve or
              reject.
            </p>
          </div>
        </div>
        <Badge
          variant={data.status === "review_ready" ? "outline" : "secondary"}
          className="text-xs"
        >
          {data.status.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      {/* Side-by-side layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[700px]">
        {/* LEFT: PDF Viewer */}
        <div className="rounded-lg border bg-card overflow-hidden flex flex-col" style={{ height: '700px' }}>
          {pdfUrl ? (
            <PDFViewer
              file={pdfUrl}
              title={data.original_filename || "Thesis PDF"}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p className="text-sm">No PDF available</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Extracted Content */}
        <div className="rounded-lg border bg-card overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b bg-muted/30 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              AI-Extracted Content
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Editable Metadata */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Metadata (Editable)
              </h3>

              <div className="space-y-1.5">
                <Label htmlFor="review-title" className="text-xs flex items-center gap-1">
                  <BookOpen className="h-3 w-3" /> Title
                </Label>
                <Input
                  id="review-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={!isReviewable || submitting}
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="review-authors" className="text-xs flex items-center gap-1">
                  <Users className="h-3 w-3" /> Authors
                </Label>
                <Input
                  id="review-authors"
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
                  placeholder="Comma-separated"
                  disabled={!isReviewable || submitting}
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="review-year" className="text-xs flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Year
                  </Label>
                  <Input
                    id="review-year"
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    disabled={!isReviewable || submitting}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="review-college" className="text-xs flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> College
                  </Label>
                  <Select
                    value={college}
                    onValueChange={setCollege}
                    disabled={!isReviewable || submitting}
                  >
                    <SelectTrigger id="review-college" className="text-sm">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLLEGES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="review-dept" className="text-xs flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> Department
                  </Label>
                  <Input
                    id="review-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    disabled={!isReviewable || submitting}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="review-advisor" className="text-xs flex items-center gap-1">
                    <UserCheck className="h-3 w-3" /> Advisor
                  </Label>
                  <Input
                    id="review-advisor"
                    value={advisor}
                    onChange={(e) => setAdvisor(e.target.value)}
                    disabled={!isReviewable || submitting}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="review-keywords" className="text-xs flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Keywords
                </Label>
                <Input
                  id="review-keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Comma-separated keywords"
                  disabled={!isReviewable || submitting}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Abstract */}
            <div className="space-y-1.5">
              <Label htmlFor="review-abstract" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Abstract
              </Label>
              <Textarea
                id="review-abstract"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                disabled={!isReviewable || submitting}
                rows={5}
                className="text-sm resize-y"
              />
            </div>

            {/* AI Summary */}
            <div className="space-y-1.5">
              <Label htmlFor="review-summary" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                AI-Generated Summary
              </Label>
              <Textarea
                id="review-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                disabled={!isReviewable || submitting}
                rows={4}
                className="text-sm resize-y"
              />
            </div>

            {/* Extracted Text (Tabbed) */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                Extracted Text
              </span>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-8">
                  <TabsTrigger value="full_text" className="text-xs">
                    Full Text
                  </TabsTrigger>
                  <TabsTrigger value="by_page" className="text-xs">
                    By Page ({data.extracted_pages?.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="full_text" className="mt-2">
                  <div className="rounded-lg border bg-muted/20 p-3 max-h-[400px] overflow-y-auto">
                    <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">
                      {data.extracted_text || "No text extracted yet."}
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="by_page" className="mt-2">
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {(data.extracted_pages || []).map((page) => (
                      <div
                        key={page.page_number}
                        className="rounded-lg border bg-muted/20 p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-[10px]">
                            Page {page.page_number}
                          </Badge>
                          {page.has_table && (
                            <Badge variant="outline" className="text-[10px]">
                              Table
                            </Badge>
                          )}
                          {page.has_figure && (
                            <Badge variant="outline" className="text-[10px]">
                              Figure
                            </Badge>
                          )}
                          {page.has_equation && (
                            <Badge variant="outline" className="text-[10px]">
                              Equation
                            </Badge>
                          )}
                        </div>
                        <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed">
                          {page.text || "(empty)"}
                        </pre>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Review Notes */}
            {isReviewable && (
              <div className="space-y-1.5">
                <Label htmlFor="review-notes" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Review Notes (Optional)
                </Label>
                <Textarea
                  id="review-notes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Any notes about this review..."
                  disabled={submitting}
                  rows={2}
                  className="text-sm resize-y"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isReviewable && (
            <div className="px-4 py-3 border-t bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Rejection reason..."
                  className="text-sm w-48 h-8"
                  disabled={submitting}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleReject}
                  disabled={submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  Reject
                </Button>
              </div>
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={submitting || !title.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {submitting ? (
                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                ) : (
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                )}
                Approve & Publish
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
