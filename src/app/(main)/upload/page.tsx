import UploadForm from "@/components/upload/upload-file"
import { getCurrentUserRole } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function Page() {
  const userRole = await getCurrentUserRole();
  if (!userRole?.isAdmin) {
    redirect("/dashboard");
  }


  return (
    <div className="p-5 lg:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Upload Research Document</h1>
        <p className="text-sm text-gray-600">
          Submit theses, IMRADS, or abstracts to the RDC repository for indexing and semantic search.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg p-5 lg:p-6 shadow-sm">
        <UploadForm />
      </div>
    </div>  
  )
}
