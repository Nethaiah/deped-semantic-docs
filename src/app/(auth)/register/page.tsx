"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type RegisterSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";

export default function Register() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setIsCheckingAuth(false);
          return; // No session, user can register
        }

        // Verify user is still valid
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          await supabase.auth.signOut(); // clear broken session
          setIsCheckingAuth(false);
          return;
        }

        // User has a valid session, redirect to documents
        router.replace('/dashboard');

        if (user.email_confirmed_at) {
          toast.success("You're already logged in! Redirecting to dashboard.", {
            duration: 5000,
            position: "bottom-right"
          });
        } else {
          toast.info("You've already registered. Please check your email to verify your account.", {
            duration: 5000,
            position: "bottom-right"
          });
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
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw { error: data.error, status: response.status };
      }

      form.reset({
        fullName: "",
        email: "",
        password: "",
        terms: false,
      });

      toast.success("Registration successful! Please check your email and click the verification link.", { duration: 5000, position: "bottom-right" });
      
      // Redirect to login page after successful registration
      setTimeout(() => {
        router.push('/login');
      }, 2000);

    } catch (err: any) {
      const message = err?.error || err?.message || "Registration failed";
      if (err?.status === 409 || message.toLowerCase().includes('already exists')) {
        toast.error("Email already exists. Please use a different email address.", { duration: 5000, position: "bottom-right" });
      } else {
        toast.error(message, { duration: 5000, position: "bottom-right" });
      }
    }
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
        {/* Left Side - Image Placeholder */}
        <div className="hidden lg:flex lg:w-[60%] bg-gradient-to-br from-rose-500 via-red-600 to-pink-500 p-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400 rounded-full opacity-20 blur-3xl"></div>

          {/* Content over the placeholder */}
          <div className="relative z-10 flex flex-col justify-between w-full">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">
                Join GNN Semantic Docs
              </h2>
              <p className="text-green-100 text-base">
                Start managing your documents intelligently today
              </p>
            </div>

            {/* Placeholder for image */}
            <div className="flex items-center justify-center flex-1">
              <div className="w-full h-72 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
                <p className="text-white/60 text-base">Image Placeholder</p>
                {/* <Image
                  src="/register-image.png"
                  alt="Description"
                  width={400}
                  height={400}
                  className="rounded-2xl"
                /> */}
              </div>
            </div>

            <div className="text-green-100 text-xs">
              © 2025 GNN Semantic Docs. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="flex w-full lg:w-[40%] items-center justify-center bg-white px-8 py-12">
          <div className="w-full max-w-sm">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Create your account
              </h1>
              <p className="text-gray-600 text-sm">
                Get started with your free account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...form.register("fullName")}
                  aria-invalid={!!form.formState.errors.fullName || undefined}
                  className={`w-full text-gray-900 rounded-lg border px-3.5 py-2.5 text-sm transition focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10 ${form.formState.errors.fullName ? "border-red-500" : "border-gray-300"}`}
                />
                {form.formState.errors.fullName && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>

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
                  className={`w-full text-gray-900 rounded-lg border px-3.5 py-2.5 text-sm transition focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10 ${form.formState.errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {form.formState.errors.email && (
                  <p className="mt-1.5 text-xs text-red-600">
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
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...form.register("password")}
                  aria-invalid={!!form.formState.errors.password || undefined}
                  className={`w-full text-gray-900 rounded-lg border px-3.5 py-2.5 text-sm transition focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-500/10 ${form.formState.errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Must be at least 8 characters
                </p>
                {form.formState.errors.password && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  {...form.register("terms")}
                  aria-invalid={!!form.formState.errors.terms || undefined}
                  className={`h-4 w-4 mt-0.5 rounded border ${form.formState.errors.terms ? "border-red-500" : "border-gray-300"} text-green-600 focus:ring-green-500`}
                />
                <label htmlFor="terms" className="ml-2 text-xs text-gray-700">
                  I agree to the{" "}
                  <Link
                    href="#"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {form.formState.errors.terms && (
                <p className="mt-1.5 text-xs text-red-600">
                  {form.formState.errors.terms.message as string}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/30 transition hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/40 focus:outline-none focus:ring-4 focus:ring-green-500/50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner className="size-4" />
                    Creating...
                  </div>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-3 text-xs text-gray-500">
                Or sign up with
              </span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Sign up Buttons */}
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <Spinner className="size-4" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
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
            <p className="mt-6 text-center text-xs text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-green-600 hover:text-green-700"
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
