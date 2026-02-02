import UploadForm from "../../features/upload/components/upload-file"
import { requireAdmin } from "@/lib/auth-utils";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }
  
  await requireAdmin();

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
