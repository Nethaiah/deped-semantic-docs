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
import { updatePassword } from "@/server/auth/reset-password";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error || !user) {
          toast.error(
            "Session expired. Please request a new password reset link.",
            { duration: 5000, position: "bottom-right" }
          );
          router.replace("/forgot-password");
          return;
        }

        setUserEmail(user.email || "");
        setUserName(
          user.user_metadata?.name || user.user_metadata?.full_name || ""
        );
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("Auth check error:", error);
        toast.error("An error occurred. Please try again.", {
          duration: 5000,
          position: "bottom-right",
        });
        router.replace("/forgot-password");
      }
    };

    checkAuth();
  }, [router, supabase]);

  async function onSubmit(values: ResetPasswordSchema) {
    form.clearErrors();
    const result = await updatePassword(
      values.newPassword,
      values.confirmPassword
    );

    if (result?.error) {
      toast.error(result.error, { duration: 5000, position: "bottom-right" });
      return;
    }

    if (result?.success) {
      toast.success("Password successfully updated! Redirecting to login...", {
        duration: 3000,
        position: "bottom-right",
      });
      await supabase.auth.signOut();
      router.replace("/login");
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center gap-3">
          <Spinner className="size-6" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-8 py-10 sm:px-10 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Reset Password
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your new password below.
          </p>
        </div>

        {/* User Info Display */}
        {(userName || userEmail) && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            {userName && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Name:</span> {userName}
              </p>
            )}
            {userEmail && (
              <p className="text-sm text-gray-700 mt-0.5">
                <span className="font-medium">Email:</span> {userEmail}
              </p>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* New Password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...form.register("newPassword")}
                aria-invalid={
                  !!form.formState.errors.newPassword || undefined
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    form.handleSubmit(onSubmit)();
                  }
                }}
                className={`w-full text-gray-900 rounded-lg border pl-10 pr-11 py-2.5 text-sm transition focus:border-[#278fb6] focus:outline-none focus:ring-4 focus:ring-[#278fb6]/10 ${
                  form.formState.errors.newPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition"
              >
                {showNewPassword ? (
                  <Eye className="h-4 w-4 cursor-pointer" />
                ) : (
                  <EyeOff className="h-4 w-4 cursor-pointer" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              Must be at least 8 characters
            </p>
            {form.formState.errors.newPassword && (
              <p className="mt-1.5 text-sm text-red-600">
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                {...form.register("confirmPassword")}
                aria-invalid={
                  !!form.formState.errors.confirmPassword || undefined
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    form.handleSubmit(onSubmit)();
                  }
                }}
                className={`w-full text-gray-900 rounded-lg border pl-10 pr-11 py-2.5 text-sm transition focus:border-[#278fb6] focus:outline-none focus:ring-4 focus:ring-[#278fb6]/10 ${
                  form.formState.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition"
              >
                {showConfirmPassword ? (
                  <Eye className="h-4 w-4 cursor-pointer" />
                ) : (
                  <EyeOff className="h-4 w-4 cursor-pointer" />
                )}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-600">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full cursor-pointer rounded-lg bg-[#278fb6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#278fb6]/90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#278fb6]/30 disabled:opacity-60 disabled:cursor-not-allowed"
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
        <p className="mt-8 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#278fb6] hover:text-[#278fb6]/80"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
