import { Suspense } from "react";
import { notFound } from "next/navigation";

import TrackThesisView from "@/components/thesis/track-thesis-view";
import BackButton from "@/components/thesis/back-button";
import ThesisInfoSidebar from "@/components/thesis/thesis-info";
import ThesisActions from "@/components/thesis/thesis-actions";
import ThesisAbstract from "@/components/thesis/thesis-abstract";
import DocumentPDFViewer from "@/components/thesis/pdf-viewer/pdf-viewer";
import SimilarTheses from "@/components/thesis/similar-theses";
import { Skeleton } from "@/components/ui/skeleton";

import {
  getThesisById,
  getSimilarTheses,
} from "@/server/theses/get-thesis-data";
import { checkBookmark } from "@/server/bookmarks/check-bookmark";

type Props = {
  params: Promise<{ thesisId: string }>;
};

/* ── Sidebar skeleton (thesis info + actions) ── */
function SidebarSkeleton() {
  return (
    <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-xl border border-gray-200">
      <Skeleton className="w-full h-6 mb-2 rounded" />
      <Skeleton className="w-3/4 h-6 mb-4 rounded" />
      <div className="flex items-start gap-3 mt-3">
        <Skeleton className="w-4 h-4 rounded flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="w-16 h-4 mb-1 rounded" />
          <Skeleton className="w-40 h-4 rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="w-32 h-4 rounded" />
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-slate-200">
        <Skeleton className="w-16 h-3 mb-2 rounded" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-6 rounded-full" />
          ))}
        </div>
      </div>
      <div className="mt-6 border-t pt-4 space-y-2">
        <Skeleton className="w-full h-10 rounded-md" />
        <Skeleton className="w-full h-10 rounded-md" />
        <Skeleton className="w-full h-10 rounded-md" />
      </div>
    </div>
  );
}

/* ── Abstract skeleton ── */
function AbstractSkeleton() {
  return (
    <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-xl border border-gray-200">
      <div className="flex gap-2 mb-4">
        <Skeleton className="w-24 h-9 rounded-md" />
        <Skeleton className="w-24 h-9 rounded-md" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-4 rounded ${i % 3 === 2 ? "w-4/5" : "w-full"}`}
          />
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <Skeleton className="w-48 h-5 mb-3 rounded" />
        <Skeleton className="w-full h-10 rounded-lg" />
      </div>
    </div>
  );
}

/* ── Similar theses skeleton ── */
function SimilarSkeleton() {
  return (
    <div className="bg-card text-card-foreground p-4 sm:p-5 rounded-xl border border-gray-200">
      <Skeleton className="w-32 h-5 mb-4 sm:mb-6 rounded" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 rounded-md">
            <Skeleton className="w-full h-4 mb-1 rounded" />
            <Skeleton className="w-3/4 h-4 mb-2 rounded" />
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-3 rounded" />
              <Skeleton className="w-12 h-3 rounded" />
            </div>
            <Skeleton className="w-20 h-4 mt-2 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Async data sections ── */
async function ThesisSidebar({ thesisId }: { thesisId: string }) {
  const { data: thesis, error } = await getThesisById(thesisId);
  const { bookmarked } = await checkBookmark(thesisId);

  if (error || !thesis) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Thesis Not Found
        </h2>
        <p className="text-slate-600">
          The thesis you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ThesisInfoSidebar thesis={thesis} />
      <ThesisActions
        sourcePath={thesis.sourcePath}
        thesisId={thesis.thesisId}
        initialBookmarked={bookmarked}
      />
    </div>
  );
}

async function ThesisMainContent({ thesisId }: { thesisId: string }) {
  const { data: thesis } = await getThesisById(thesisId);

  if (!thesis) return null;

  return (
    <ThesisAbstract
      abstract={thesis.abstract}
      summary={thesis.summary}
      thesisId={thesis.thesisId}
    />
  );
}

async function ThesisPDFSection({ thesisId }: { thesisId: string }) {
  const { data: thesis } = await getThesisById(thesisId);

  if (!thesis) return null;

  return (
    <DocumentPDFViewer sourcePath={thesis.sourcePath} thesisId={thesis.thesisId} title={thesis.title} />
  );
}

async function ThesisSimilarSection({ thesisId }: { thesisId: string }) {
  const similar = await getSimilarTheses(thesisId, 3);
  return <SimilarTheses similar={similar} />;
}

/* ── Page ── */
export default async function ViewThesisPage({ params }: Props) {
  const { thesisId } = await params;

  return (
    <>
      <TrackThesisView thesisId={thesisId} />

      <div className="p-5 lg:p-8 w-full">
        {/* Back Button — renders instantly */}
        <div className="mb-4">
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar — Thesis Info + Actions */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            <Suspense fallback={<SidebarSkeleton />}>
              <ThesisSidebar thesisId={thesisId} />
            </Suspense>
          </div>

          {/* Main Content — Abstract & Q&A */}
          <div className="col-span-1 lg:col-span-6 space-y-6">
            <Suspense fallback={<AbstractSkeleton />}>
              <ThesisMainContent thesisId={thesisId} />
            </Suspense>
          </div>

          {/* Right Sidebar — PDF Viewer + Similar Theses */}
          <div className="col-span-1 lg:col-span-3 space-y-6">
            <Suspense
              fallback={
                <div className="bg-card text-card-foreground rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                    <Skeleton className="w-32 h-6 rounded" />
                    <Skeleton className="w-8 h-8 rounded" />
                  </div>
                  <Skeleton className="w-full h-[500px]" />
                </div>
              }
            >
              <ThesisPDFSection thesisId={thesisId} />
            </Suspense>

            <Suspense fallback={<SimilarSkeleton />}>
              <ThesisSimilarSection thesisId={thesisId} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}