"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/server/auth/login";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Eye, EyeOff, Lock, User } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

const neutralInputClass =
  "h-10 rounded-xl border border-[#1C402E]/18 bg-white/18 shadow-[0_12px_24px_-24px_rgba(15,23,42,0.3)] backdrop-blur-md transition focus-within:border-[#1C402E]/28 focus-within:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:border-[#1C402E]/28 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-[#1C402E]/8";

const authInputControlClass =
  "h-10 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:#173726] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset] [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_transparent] [&:-webkit-autofill]:[caret-color:#173726] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset] [&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset]";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      studentId: "",
      password: "",
    },
  });

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/dashboard");
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [searchParams, router]);

  async function onSubmit(values: LoginSchema) {
    form.clearErrors();
    const result = await login({
      studentId: values.studentId,
      password: values.password,
    });

    if (result?.error) {
      toast.error(result.error || "Invalid user ID or password", {
        duration: 5000,
        position: "bottom-right",
      });
      return;
    }

    toast.success("Login successful! Welcome back.", {
      duration: 3000,
      position: "bottom-right",
    });
    form.reset({
      studentId: "",
      password: "",
    });

    startTransition(() => {
      router.replace("/dashboard");
    });
  }

  function handleMoveToRegister() {
    form.reset({
      studentId: "",
      password: "",
    });
    setShowPassword(false);
  }

  function handleMoveToForgotPassword() {
    form.reset({
      studentId: "",
      password: "",
    });
    setShowPassword(false);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm leading-5 text-gray-600">
          Enter your user ID and password to continue to your account.
        </p>
      </div>

      <FieldGroup className="gap-4">
        <Controller
          name="studentId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="studentId"
                className="text-sm font-semibold text-gray-700"
              >
                User ID
              </FieldLabel>
              <InputGroup className={neutralInputClass}>
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <User className="h-4 w-4 text-[#1C402E]/55" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="studentId"
                  type="text"
                  placeholder="000-0000"
                  {...field}
                  aria-invalid={fieldState.invalid}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                  className={authInputControlClass}
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
              <FieldLabel
                htmlFor="password"
                className="text-sm font-semibold text-gray-700"
              >
                Password
              </FieldLabel>
              <InputGroup className={neutralInputClass}>
                <InputGroupAddon align="inline-start">
                  <InputGroupText>
                    <Lock className="h-4 w-4 text-[#1C402E]/55" />
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
                  className={authInputControlClass}
                />
                <InputGroupAddon align="inline-end">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center text-[#1C402E]/45 transition hover:text-[#1C402E]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <Eye className="h-4 w-4 cursor-pointer" />
                    ) : (
                      <EyeOff className="h-4 w-4 cursor-pointer" />
                    )}
                  </button>
                </InputGroupAddon>
              </InputGroup>
              <div className="mt-2 flex justify-end">
                <Link
                  href="/forgot-password"
                  onClick={handleMoveToForgotPassword}
                  className="text-sm font-medium text-[#1C402E] transition hover:text-[#087830]"
                >
                  Forgot Password?
                </Link>
              </div>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>

      <button
        type="submit"
        disabled={form.formState.isSubmitting || isPending}
        className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#163726] px-4 text-sm font-semibold text-white shadow-[0_18px_32px_-18px_rgba(22,55,38,0.8)] transition hover:bg-[#1C402E] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting || isPending ? (
          <>
            <Spinner className="size-4" />
            Signing in...
          </>
        ) : (
          <>
            Log in
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <div className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          onClick={handleMoveToRegister}
          className="font-semibold text-[#1C402E] transition hover:text-[#087830]"
        >
          Sign up here
        </Link>
      </div>
    </form>
  );
}
