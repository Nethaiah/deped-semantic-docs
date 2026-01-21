"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";

export default function VerifyEmailClient() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const handleVerification = async () => {
      const supabase = createClient();
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace('#', '?'));

      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error) {
          setStatus('error');
          return;
        }
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email_confirmed_at) {
          setStatus('success');
        } else {
          setStatus('error');
        }
        return;
      }

      // fallback - check if user already has verified session
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    };

    handleVerification();
  }, []);


  if (status === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner className="size-6"/>
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-green-600 font-medium">Email verified successfully!</p>
          <p className="text-gray-600 text-sm mt-2">
            <button
              onClick={() => router.replace('/login')}
              className="text-blue-600 hover:underline"
            >
              Go to login
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-8 h-8 bg-red-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Verification failed</p>
          <p className="text-gray-600 text-sm mt-2">
            This link is invalid or has expired. Please request a new verification email.
          </p>
          <button
            onClick={() => router.replace('/register')}
            className="mt-4 text-blue-600 hover:underline text-sm"
          >
            Back to registration
          </button>
        </div>
      </div>
    );
  }

  return null;
}

