"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { resetPasswordForEmail } from "@/features/auth/forgot-password/server/actions";

export default function ForgotPasswordForm() {
  const router = useRouter();

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordSchema) {
    form.clearErrors();
    const result = await resetPasswordForEmail(values.email);
    
    if (result?.error) {
      toast.error(result.error, { duration: 5000, position: "bottom-right" });
      return;
    }
    
    if (result?.success) {
      toast.success("Password reset link sent to your email.", { 
        duration: 5000, 
        position: "bottom-right" 
      });
      
      router.push("/login");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
        {/* Left Side - Image Placeholder */}
        <div className="hidden lg:flex lg:w-[60%] bg-gradient-to-br from-purple-500 via-purple-700 to-pink-500 p-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>

          {/* Content over the placeholder */}
          <div className="relative z-10 flex flex-col justify-between w-full">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Reset Your Password
              </h2>
              <p className="text-purple-100 text-base">
                Don't worry, we'll help you get back into your account
              </p>
            </div>

            {/* Placeholder for image */}
            <div className="flex items-center justify-center flex-1">
              <div className="w-full h-72 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                <p className="text-white/60 text-base">Image Placeholder</p>
              </div>
            </div>

            <div className="text-purple-100 text-xs">
              © 2025 GNN Semantic Docs. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="flex w-full lg:w-[40%] items-center justify-center bg-white px-8 py-12">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-600 text-sm">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...form.register("email")}
                  aria-invalid={!!form.formState.errors.email || undefined}
                  className={`w-full text-gray-900 rounded-lg border px-3.5 py-2.5 text-sm transition focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/10 ${form.formState.errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {form.formState.errors.email && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/30 transition hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/40 focus:outline-none focus:ring-4 focus:ring-purple-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner className="size-4" />
                    Sending...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            {/* Back to login link */}
            <p className="mt-6 text-center text-xs text-gray-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-semibold text-purple-600 hover:text-purple-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

