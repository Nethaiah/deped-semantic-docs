import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Invalid or Expired Link
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          The password reset link you clicked is invalid or has expired. 
          Please request a new password reset link.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/forgot-password"
            className="w-full inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Request New Reset Link
          </Link>
          
          <Link
            href="/login"
            className="w-full inline-block px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

