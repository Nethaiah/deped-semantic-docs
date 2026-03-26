"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

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
          </FieldGroup>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full cursor-pointer rounded-lg bg-theme px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-theme/90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-theme/30 disabled:opacity-60 disabled:cursor-not-allowed"
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
            className="font-semibold text-theme hover:text-theme/80"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
