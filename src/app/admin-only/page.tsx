import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export default function AdminOnlyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Admin Access Required
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          This page is restricted to administrators only. You don't have the necessary permissions to access this content.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <p className="text-sm text-gray-500">
            Need admin access? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
