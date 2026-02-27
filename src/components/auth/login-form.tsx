"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/server/auth/login";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      toast.success("Email verified successfully! You can now sign in.", {
        duration: 5000,
        position: "bottom-right",
      });
    }
  }, [searchParams]);

  async function onSubmit(values: LoginSchema) {
    form.clearErrors();
    const result = await login({
      email: values.email,
      password: values.password,
    });
    if (result?.error) {
      toast.error(result.error || "Invalid email or password", {
        duration: 5000,
        position: "bottom-right",
      });
      return;
    }
    toast.success("Login successful! Welcome back 👋", {
      duration: 3000,
      position: "bottom-right",
    });
    router.replace("/dashboard");
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-8 py-10 sm:px-10 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Welcome back
          </h2>
          <p className="text-gray-500 text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
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

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...form.register("password")}
                aria-invalid={!!form.formState.errors.password || undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    form.handleSubmit(onSubmit)();
                  }
                }}
                className={`w-full text-gray-900 rounded-lg border pl-10 pr-11 py-2.5 text-sm transition focus:border-[#278fb6] focus:outline-none focus:ring-4 focus:ring-[#278fb6]/10 ${
                  form.formState.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? (
                  <Eye className="h-4 w-4 cursor-pointer" />
                ) : (
                  <EyeOff className="h-4 w-4 cursor-pointer" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="mt-1.5 text-sm text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
            <div className="mt-2 text-right">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#278fb6] hover:text-[#278fb6]/80"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="w-full cursor-pointer rounded-lg bg-[#278fb6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#278fb6]/90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#278fb6]/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner className="size-4" />
                Signing in...
              </div>
            ) : (
              "Log in"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-xs text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#278fb6] hover:text-[#278fb6]/80"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}
