import UploadForm from "./_components/upload-form"

export default function Page() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">DepEd Document Publisher</h1>
        <p className="text-sm text-gray-600">
          Submit new Memoranda, Orders, or Advisories for Division-wide circulation.
        </p>
      </div>

      {/* Form Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <UploadForm />
      </div>
    </div>  
  )
}
