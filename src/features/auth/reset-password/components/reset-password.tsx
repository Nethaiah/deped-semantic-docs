"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { updatePassword } from "@/features/auth/reset-password/server/actions";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const supabase = createClient();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          toast.error("Session expired. Please request a new password reset link.", {
            duration: 5000,
            position: "bottom-right"
          });
          router.replace("/forgot-password");
          return;
        }

        // Set user info for display
        setUserEmail(user.email || "");
        setUserName(user.user_metadata?.name || user.user_metadata?.full_name || "");
        
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("An error occurred. Please try again.", {
          duration: 5000,
          position: "bottom-right"
        });
        router.replace("/forgot-password");
      }
    };

    checkAuth();
  }, [router, supabase]);

  async function onSubmit(values: ResetPasswordSchema) {
    form.clearErrors();
    const result = await updatePassword(values.newPassword, values.confirmPassword);
    
    if (result?.error) {
      toast.error(result.error, { duration: 5000, position: "bottom-right" });
      return;
    }
    
    if (result?.success) {
      toast.success("Password successfully updated! Redirecting to login...", { 
        duration: 3000, 
        position: "bottom-right" 
      });
      
      // Sign out the user after password reset
      await supabase.auth.signOut();
      
      router.replace("/login");
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex items-center gap-3">
          <Spinner className="size-6" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
        {/* Left Side - Image Placeholder */}
        <div className="hidden lg:flex lg:w-[60%] bg-gradient-to-br from-indigo-500 via-indigo-700 to-blue-500 p-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>

          {/* Content over the placeholder */}
          <div className="relative z-10 flex flex-col justify-between w-full">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Set New Password
              </h2>
              <p className="text-indigo-100 text-base">
                Choose a strong password to secure your account
              </p>
            </div>

            {/* Placeholder for image */}
            <div className="flex items-center justify-center flex-1">
              <div className="w-full h-72 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                <p className="text-white/60 text-base">Image Placeholder</p>
              </div>
            </div>

            <div className="text-indigo-100 text-xs">
              © 2025 GNN Semantic Docs. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="flex w-full lg:w-[40%] items-center justify-center bg-white px-8 py-12">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 text-sm">
                Enter your new password below.
              </p>
            </div>

            {/* User Info Display */}
            {(userName || userEmail) && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {userName && (
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Name:</span> {userName}
                  </p>
                )}
                {userEmail && (
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Email:</span> {userEmail}
                  </p>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("newPassword")}
                  aria-invalid={!!form.formState.errors.newPassword || undefined}
                  className={`w-full text-gray-900 rounded-lg border px-3.5 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 ${form.formState.errors.newPassword ? "border-red-500" : "border-gray-300"}`}
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
                {form.formState.errors.newPassword && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {form.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("confirmPassword")}
                  aria-invalid={!!form.formState.errors.confirmPassword || undefined}
                  className={`w-full text-gray-900 rounded-lg border px-3.5 py-2.5 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 ${form.formState.errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                />
                {form.formState.errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/40 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner className="size-4" />
                    Updating...
                  </div>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>

            {/* Back to login link */}
            <p className="mt-6 text-center text-xs text-gray-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

