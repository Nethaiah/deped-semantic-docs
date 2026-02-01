import {
  getThesisById,
  getSimilarTheses,
} from "@/server/theses/get-thesis-data";
import ThesisInfoSidebar from "./thesis-info";
import ThesisActions from "./thesis-actions";
import ThesisAbstract from "./thesis-abstract";
import SimilarTheses from "./similar-theses";
import DocumentPDFViewer from "@/components/thesis/pdf-viewer/pdf-viewer";
import BackButton from "@/components/thesis/back-button";
import { checkBookmark } from "@/server/bookmarks/check-bookmark";

type Props = {
  thesisId: string;
};

export default async function ViewThesis({ thesisId }: Props) {
  const { data: thesis, error } = await getThesisById(thesisId);
  const similar = await getSimilarTheses(thesisId, 3);
  const { bookmarked } = await checkBookmark(thesisId);

  if (error || !thesis) {
    return (
      <div className="p-5 lg:p-8">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Thesis Not Found
          </h2>
          <p className="text-slate-600">
            The thesis you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8">
      <div className="mb-4">
        <BackButton />
      </div>

      <div className="grid grid-cols-13 gap-8">
        {/* Sidebar - Thesis Info */}
        <div className="col-span-13 lg:col-span-3">
          <ThesisInfoSidebar thesis={thesis} />
          <ThesisActions
            sourcePath={thesis.sourcePath}
            thesisId={thesis.thesisId}
            initialBookmarked={bookmarked}
          />
        </div>

        {/* Main Content - Abstract & Q&A */}
        <div className="col-span-13 lg:col-span-6 space-y-6">
          <ThesisAbstract 
            abstract={thesis.abstract}
            summary={thesis.summary} 
            thesisId={thesis.thesisId} 
          />
        </div>

        {/* Right Sidebar - PDF Viewer & Similar Theses */}
        <div className="col-span-13 lg:col-span-4 space-y-6">
          <DocumentPDFViewer 
            sourcePath={thesis.sourcePath} 
            title={thesis.title} 
          />
          <SimilarTheses similar={similar} />
        </div>
      </div>
    </div>
  );
}
