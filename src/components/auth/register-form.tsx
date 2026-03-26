"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { register } from "@/server/auth/register";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import TermsDialog from "@/components/auth/terms-dialog";
import PrivacyDialog from "@/components/auth/privacy-dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

type DialogState = "idle" | "verify" | "redirecting";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("idle");
  const [registeredEmail, setRegisteredEmail] = useState("");

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  // Listen for cross-tab email verification
  useEffect(() => {
    if (dialogState !== "verify") return;

    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setDialogState("redirecting");
        // Small delay so the user sees the "Redirecting" state
        setTimeout(() => {
          router.replace("/dashboard");
          router.refresh();
        }, 1500);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dialogState, router]);

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
    setRegisteredEmail(values.email);
    form.reset({ fullName: "", email: "", password: "", terms: false });
    setDialogState("verify");
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
          <FieldGroup>
            {/* Full Name */}
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name" className="font-semibold text-gray-700">
                    Full name
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <User className="h-4 w-4 text-gray-400" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      id="name"
                      type="text"
                      placeholder="John Doe"
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

            {/* Email */}
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

            {/* Password */}
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
                  <p className="mt-1 text-xs text-gray-400">
                    Must be at least 8 characters
                  </p>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

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
                } text-theme focus:ring-theme`}
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
            className="w-full cursor-pointer rounded-lg bg-theme px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-theme/90 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-theme/30 disabled:opacity-60 disabled:cursor-not-allowed"
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
            className="font-semibold text-theme hover:text-theme/80"
          >
            Log in here
          </Link>
        </p>
      </div>

      {/* Verification / Redirecting Dialog */}
      <Dialog open={dialogState !== "idle"} onOpenChange={(open) => {
        // Only allow closing the dialog in "verify" state (not while redirecting)
        if (!open && dialogState === "verify") {
          setDialogState("idle");
        }
      }}>
        <DialogContent showCloseButton={dialogState === "verify"} className="sm:max-w-md">
          {dialogState === "verify" && (
            <>
              <DialogHeader className="items-center text-center">
                {/* Animated mail icon */}
                <div className="mx-auto w-16 h-16 bg-blue-50 text-[#278fb6] rounded-full flex items-center justify-center mb-2 animate-bounce">
                  <Mail className="w-8 h-8" />
                </div>
                <DialogTitle className="text-xl">Check your email</DialogTitle>
                <DialogDescription className="text-gray-500 text-[13px] leading-relaxed">
                  We&apos;ve sent a verification link to{" "}
                  <span className="font-semibold text-gray-700">{registeredEmail}</span>.
                  Please open it to verify your account.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg text-center">
                <p className="font-medium">Keep this tab open!</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  You&apos;ll be automatically redirected once verified.
                </p>
              </div>
            </>
          )}

          {dialogState === "redirecting" && (
            <>
              <DialogHeader className="items-center text-center">
                <div className="mx-auto w-16 h-16 bg-green-50 text-[#087830] rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <DialogTitle className="text-xl">Email Verified!</DialogTitle>
                <DialogDescription className="text-gray-500 text-[13px] leading-relaxed">
                  Your account has been verified successfully.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center gap-2 text-[#278fb6] font-medium text-sm py-2">
                <Spinner className="size-4" />
                Redirecting to dashboard...
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
