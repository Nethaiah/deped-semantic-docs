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
            {
              duration: 5000,
              position: "bottom-right",
            }
          );
          router.replace("/forgot-password");
          return;
        }

        // Set user info for display
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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover lg:bg-contain bg-left bg-no-repeat lg:bg-repeat"
          style={{
            backgroundImage: `url('/depedbuilding2.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/50 to-black/80" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Left Side - Logo and Tagline */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-12 lg:flex-1 lg:w-[65%] xl:w-[70%]">
          {/* Logo/Title - Top Left */}
          <div>
            <a
              href="/"
              className="flex items-center justify-center lg:justify-start gap-2 w-full"
            >
              <img
                src="/Logo.png"
                alt="DocuLens Logo"
                className="w-12 h-12 sm:w-15 sm:h-15 object-contain drop-shadow-lg"
              />
              <div className="flex flex-col">
                <h1
                  className="text-2xl lg:text-3xl font-bold text-white/90"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  Doculens
                </h1>
                <p
                  className="text-[#66b2b6] text-xs sm:text-sm"
                  style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
                >
                  See the core of every issuance.
                </p>
              </div>
            </a>
          </div>

          {/* Tagline - Bottom Left (hidden on mobile) */}
          <div className="hidden lg:block max-w-3xl">
            <p
              className="text-white/90 font-bold text-2xl xl:text-4xl 2xl:text-5xl leading-tight"
              style={{ textShadow: "2px 2px 8px rgba(0,0,0,0.6)" }}
            >
              Process Smarter. Extract Faster.{" "}
              <span className="text-[#66b2b6]">Understand More.</span>
            </p>
            <p
              className="mt-4 text-gray-200 text-sm xl:text-base 2xl:text-lg"
              style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
            >
              Doculens simplifies your workflow by transforming scanned
              documents into organized, searchable, and actionable
              information—instantly.
            </p>
            <div
              className="mt-4 text-white/60 text-xs xl:text-sm"
              style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.5)" }}
            >
              © 2025 Doculens. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side - Reset Password Form */}
        <div className="flex flex-col w-auto lg:w-[35%] xl:w-[30%] bg-white m-6 lg:m-8 rounded-lg shadow-2xl">
          {/* Reset Password Form */}
          <div className="flex-1 flex items-center justify-center px-8 py-12">
            <div className="w-full">
              {/* Header */}
              <div className="mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-3">
                  Reset Password
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  Enter your new password below.
                </p>
              </div>

              {/* User Info Display */}
              {(userName || userEmail) && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm lg:text-base font-medium text-gray-700 mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
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
                      className={`w-full text-gray-900 rounded-lg border pl-11 pr-12 py-2 lg:py-3.5 text-base transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
                        form.formState.errors.newPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showNewPassword ? (
                        <Eye className="h-5 w-5 cursor-pointer" />
                      ) : (
                        <EyeOff className="h-5 w-5 cursor-pointer" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-[12px] lg:text-sm text-gray-500">
                    Must be at least 8 characters
                  </p>
                  {form.formState.errors.newPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {form.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm lg:text-base font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
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
                      className={`w-full text-gray-900 rounded-lg border pl-11 pr-12 py-2 lg:py-3.5 text-base transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
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
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-5 w-5 cursor-pointer" />
                      ) : (
                        <EyeOff className="h-5 w-5 cursor-pointer" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full cursor-pointer rounded-lg bg-[#278fb6] px-4 py-3 lg:py-3.5 text-md lg:text-base font-semibold text-white shadow-lg shadow-[#278fb6]/30 transition hover:bg-[#278fb6] hover:shadow-xl hover:shadow-[#278fb6]/40 focus:outline-none focus:ring-4 focus:ring-[#278fb6]/50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner className="size-5" />
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
        </div>
      </div>

      {/* Mobile-only tagline footer */}
      <div className="lg:hidden relative z-10 bg-black/40 backdrop-blur-sm p-6 text-center">
        <p className="text-white/90 font-semibold text-sm">
          Set New Password.{" "}
          <span className="text-[#66b2b6]">Secure Your Account.</span>
        </p>
        <p className="mt-2 text-gray-300 text-xs">
          © 2025 Doculens. All rights reserved.
        </p>
      </div>
    </div>
  );
}
