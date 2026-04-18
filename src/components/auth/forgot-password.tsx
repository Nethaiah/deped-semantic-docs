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
import { useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { resetPasswordForEmail } from "@/server/auth/forgot-password";
import { Mail } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";

const authInputClass =
  "h-10 rounded-xl border border-[#1C402E]/18 bg-transparent shadow-[0_12px_24px_-24px_rgba(15,23,42,0.22)] transition focus-within:border-[#1C402E]/28 focus-within:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:border-[#1C402E]/28 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-[#1C402E]/8";

const authInputControlClass =
  "h-10 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:#173726] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset] [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_transparent] [&:-webkit-autofill]:[caret-color:#173726] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset] [&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset]";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
      startTransition(() => {
        router.push("/login");
      });
    }
  }

  function handleMoveToLogin() {
    form.reset({
      email: "",
    });
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
                  <InputGroup className={authInputClass}>
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
                      className={authInputControlClass}
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
            disabled={form.formState.isSubmitting || isPending}
            className="w-full cursor-pointer rounded-lg bg-[#1C402E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1C402E]/90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-[#1C402E]/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {form.formState.isSubmitting || isPending ? (
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
