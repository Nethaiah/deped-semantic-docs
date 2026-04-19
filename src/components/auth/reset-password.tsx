"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "@/components/ui/spinner";
import { updatePassword } from "@/server/auth/reset-password";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

const authInputClass =
  "h-10 rounded-xl border border-[#1C402E]/18 bg-transparent shadow-[0_12px_24px_-24px_rgba(15,23,42,0.22)] transition focus-within:border-[#1C402E]/28 focus-within:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:border-[#1C402E]/28 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-[#1C402E]/8";

const authInputControlClass =
  "h-10 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:#173726] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset] [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_transparent] [&:-webkit-autofill]:[caret-color:#173726] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset] [&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset]";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
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
          startTransition(() => {
            router.replace("/forgot-password");
          });
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
        startTransition(() => {
          router.replace("/forgot-password");
        });
      }
    };

    checkAuth();
  }, [router]);

  async function onSubmit(values: ResetPasswordSchema) {
    const supabase = createClient();
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
      startTransition(() => {
        router.replace("/login");
      });
    }
  }

  function handleMoveToLogin() {
    form.reset({
      newPassword: "",
      confirmPassword: "",
    });
    setShowNewPassword(false);
    setShowConfirmPassword(false);
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
          <FieldGroup>
            {/* New Password */}
            <Controller
              name="newPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="newPassword" className="font-semibold text-gray-700">
                    New Password
                  </FieldLabel>
                  <InputGroup className={authInputClass}>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <Lock className="h-4 w-4 text-gray-400" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter new password"
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
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="flex items-center text-gray-400 hover:text-gray-600 transition"
                      >
                        {showNewPassword ? (
                          <Eye className="h-4 w-4 cursor-pointer" />
                        ) : (
                          <EyeOff className="h-4 w-4 cursor-pointer" />
                        )}
                      </button>
                    </InputGroupAddon>
                  </InputGroup>
                  <p className="mt-1 text-xs text-gray-400">
                    Must be at least 8 characters
                  </p>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword" className="font-semibold text-gray-700">
                    Confirm Password
                  </FieldLabel>
                  <InputGroup className={authInputClass}>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <Lock className="h-4 w-4 text-gray-400" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="flex items-center text-gray-400 hover:text-gray-600 transition"
                      >
                        {showConfirmPassword ? (
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
                </Field>
              )}
            />
          </FieldGroup>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={form.formState.isSubmitting || isPending}
            className="w-full cursor-pointer rounded-lg bg-[#1C402E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1C402E]/90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#1C402E]/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {form.formState.isSubmitting || isPending ? (
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
            onClick={handleMoveToLogin}
            className="font-semibold text-[#1C402E] hover:text-[#1C402E]/80"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
