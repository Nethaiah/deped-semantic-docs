"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { register } from "@/features/auth/register/server/actions";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const supabase = createClient();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      terms: false,
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
          await supabase.auth.signOut();
          setIsCheckingAuth(false);
          return;
        }

        router.replace("/dashboard");

        if (user.email_confirmed_at) {
          toast.success("You're already logged in! Redirecting to dashboard.", {
            duration: 5000,
            position: "bottom-right",
          });
        } else {
          toast.info(
            "You've already registered. Please check your email to verify your account.",
            {
              duration: 5000,
              position: "bottom-right",
            }
          );
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  async function onSubmit(values: RegisterSchema) {
    form.setValue("terms", !!values.terms);
    form.clearErrors();
    const result = await register({
      name: values.fullName,
      email: values.email,
      password: values.password,
    });
    if (result?.error) {
      toast.error(result.error, { duration: 5000, position: "bottom-right" });
      return;
    }
    form.reset({ fullName: "", email: "", password: "", terms: false });
    toast.success(
      "Registration successful! Please check your email and click the verification link.",
      { duration: 5000, position: "bottom-right" }
    );
    router.push("/login");
  }

  async function handleGoogleSignUp() {
    setIsGoogleLoading(true);
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Google sign-up failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No OAuth URL received");
      }
    } catch (err: any) {
      const message = err?.error || err?.message || "Google sign-up failed";
      toast.error(message, { duration: 5000, position: "bottom-right" });
      setIsGoogleLoading(false);
    }
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
              <div className="flex flex-col ">
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
              © 2025 Documents. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex flex-col w-auto lg:w-[35%] xl:w-[30%] bg-white m-6 lg:my-8 lg:mr-8 rounded-lg shadow-2xl">
          {/* Register Form */}
          <div className="flex-1 flex items-center justify-center px-8 py-12">
            <div className="w-full">
              {/* Header */}
              <div className="mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-3">
                  Create your account
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  Get started with your account
                </p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm lg:text-base font-medium text-gray-700 mb-2"
                  >
                    Full name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...form.register("fullName")}
                      aria-invalid={
                        !!form.formState.errors.fullName || undefined
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      className={`w-full text-gray-900 rounded-lg border pl-11 pr-4 py-2 lg:py-3.5 text-base transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
                        form.formState.errors.fullName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {form.formState.errors.fullName && (
                    <p className="mt-2 text-sm text-red-600">
                      {form.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm lg:text-base font-medium text-gray-700 mb-2"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
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
                      className={`w-full text-gray-900 rounded-lg border pl-11 pr-4 py-2 lg:py-3.5 text-base transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
                        form.formState.errors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm lg:text-base font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...form.register("password")}
                      aria-invalid={
                        !!form.formState.errors.password || undefined
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      className={`w-full text-gray-900 rounded-lg border pl-11 pr-12 py-2 lg:py-3.5 text-base transition focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 ${
                        form.formState.errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-[12px] lg:text-sm text-gray-500">
                    Must be at least 8 characters
                  </p>
                  {form.formState.errors.password && (
                    <p className="mt-2 text-sm text-red-600">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div>
                  <div className="flex items-start">
                    <input
                      id="terms"
                      type="checkbox"
                      {...form.register("terms")}
                      aria-invalid={!!form.formState.errors.terms || undefined}
                      className={`h-4 w-4 mt-0.5 rounded border ${
                        form.formState.errors.terms
                          ? "border-red-500"
                          : "border-gray-300"
                      } text-blue-600 focus:ring-blue-500`}
                    />
                    <label
                      htmlFor="terms"
                      className="ml-2 text-sm text-gray-700"
                    >
                      I agree to the{" "}
                      <Link
                        href="#"
                        className="text-[#278fb6] hover:text-[#278fb6]/80 font-medium"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="#"
                        className="text-[#278fb6] hover:text-[#278fb6]/80 font-medium"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {form.formState.errors.terms && (
                    <p className="mt-2 text-sm text-red-600">
                      {form.formState.errors.terms.message as string}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={form.formState.isSubmitting}
                  className="w-full cursor-pointer rounded-lg bg-[#278fb6] px-4 py-3 lg:py-3.5 text-md lg:text-base font-semibold text-white shadow-lg shadow-[#278fb6]/30 transition hover:bg-[#278fb6] hover:shadow-xl hover:shadow-[#278fb6]/40 focus:outline-none focus:ring-4 focus:ring-[#278fb6]/50 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner className="size-5" />
                      Creating...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-4 text-sm text-gray-500">
                  Or sign up with
                </span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Social Sign up Button */}
              <div className="grid grid-cols-1 gap-4">
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 lg:py-3.5 text-md lg:text-base font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isGoogleLoading ? (
                    <Spinner className="size-5" />
                  ) : (
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  )}
                  {isGoogleLoading ? "Signing up..." : "Google"}
                </button>
              </div>

              {/* Login link */}
              <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{" "}
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
          Process Smarter. Extract Faster.{" "}
          <span className="text-[#66b2b6]">Understand More.</span>
        </p>
        <p className="mt-2 text-gray-300 text-xs">
          © 2025 Documents. All rights reserved.
        </p>
      </div>
    </div>
  );
}
