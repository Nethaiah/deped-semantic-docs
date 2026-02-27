"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { resetPasswordForEmail } from "@/server/auth/forgot-password";
import { Mail } from "lucide-react";

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
        position: "bottom-right",
      });
      router.push("/login");
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-8 py-10 sm:px-10 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Forgot Password?
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...form.register("email")}
                aria-invalid={!!form.formState.errors.email || undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    form.handleSubmit(onSubmit)();
                  }
                }}
                className={`w-full text-gray-900 rounded-lg border pl-10 pr-4 py-2.5 text-sm transition focus:border-[#278fb6] focus:outline-none focus:ring-4 focus:ring-[#278fb6]/10 ${
                  form.formState.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            {form.formState.errors.email && (
              <p className="mt-1.5 text-sm text-red-600">
                {form.formState.errors.email.message}
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
                Sending...
              </div>
            ) : (
              "Send Reset Link"
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
