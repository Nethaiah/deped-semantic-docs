'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* Mimicking the EXACT style block from src/components/auth/login-form.tsx */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 px-8 py-10 sm:px-10 sm:py-12 text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Authentication Error
          </h2>
        </div>

        {/* Message */}
        <p className="text-gray-500 text-sm mb-8 leading-relaxed px-2">
          {error.message || "An unexpected authentication error occurred. Please try logging in again or request a new link if necessary."}
        </p>

        {/* Actions */}
        <div className="space-y-4 w-full flex flex-col items-center">
          <button
            onClick={() => reset()}
            className="w-full cursor-pointer rounded-lg bg-[#278fb6] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#278fb6]/90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#278fb6]/30"
          >
            Try Again
          </button>
          
          <Link
            href="/forgot-password"
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
          >
            Request New Reset Link
          </Link>
          
          <div className="pt-4 flex items-center justify-center w-full">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#278fb6] hover:text-[#278fb6]/80 transition-colors"
            >
              &larr; Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
