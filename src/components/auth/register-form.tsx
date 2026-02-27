"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { register } from "@/server/auth/register";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import TermsDialog from "@/components/auth/terms-dialog";
import PrivacyDialog from "@/components/auth/privacy-dialog";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

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

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-8 py-10 sm:px-10 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Create your account
          </h2>
          <p className="text-gray-500 text-sm">
            Get started with Doculens today
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Full name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <User className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                {...form.register("fullName")}
                aria-invalid={!!form.formState.errors.fullName || undefined}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    form.handleSubmit(onSubmit)();
                  }
                }}
                className={`w-full text-gray-900 rounded-lg border pl-10 pr-4 py-2.5 text-sm transition focus:border-[#278fb6] focus:outline-none focus:ring-4 focus:ring-[#278fb6]/10 ${
                  form.formState.errors.fullName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
            </div>
            {form.formState.errors.fullName && (
              <p className="mt-1.5 text-sm text-red-600">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
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

          {/* Password */}
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
            <p className="mt-1.5 text-xs text-gray-400">
              Must be at least 8 characters
            </p>
            {form.formState.errors.password && (
              <p className="mt-1.5 text-sm text-red-600">
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
                className={`cursor-pointer h-4 w-4 mt-0.5 rounded border ${
                  form.formState.errors.terms
                    ? "border-red-500"
                    : "border-gray-300"
                } text-[#278fb6] focus:ring-[#278fb6]`}
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <TermsDialog>Terms of Service</TermsDialog>{" "}
                and{" "}
                <PrivacyDialog>Privacy Policy</PrivacyDialog>
              </label>
            </div>
            {form.formState.errors.terms && (
              <p className="mt-1.5 text-sm text-red-600">
                {form.formState.errors.terms.message as string}
              </p>
            )}
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
                Creating...
              </div>
            ) : (
              "Create account"
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-xs text-gray-400">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-600">
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
  );
}
