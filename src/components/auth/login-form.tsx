"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/server/auth/login";
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

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

    // Listen for cross-tab logins (e.g. user verifies email in another tab)
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/dashboard");
        router.refresh(); // Force a server re-render to catch the new auth cookies
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams, router]);

  const [isPending, startTransition] = useTransition();

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
    startTransition(() => {
      router.replace("/dashboard");
    });
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
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email" className="font-semibold text-gray-700">
                    Email address
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <Mail className="h-4 w-4 text-gray-400" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      className="py-2.5 text-sm"
                    />
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password" className="font-semibold text-gray-700">
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <Lock className="h-4 w-4 text-gray-400" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      aria-invalid={fieldState.invalid}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      className="py-2.5 text-sm"
                    />
                    <InputGroupAddon align="inline-end">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="flex items-center text-gray-400 hover:text-gray-600 transition"
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4 cursor-pointer" />
                        ) : (
                          <EyeOff className="h-4 w-4 cursor-pointer" />
                        )}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <div className="mt-2 text-right">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-[#278fb6] hover:text-[#278fb6]/80"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          {/* Submit Button */}
          <button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting || isPending}
            className="w-full cursor-pointer rounded-lg bg-[#278fb6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#278fb6]/90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#278fb6]/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {form.formState.isSubmitting || isPending ? (
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
