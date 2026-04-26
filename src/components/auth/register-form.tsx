"use client";

import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "@/lib/zodSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Spinner } from "@/components/ui/spinner";
import { register } from "@/server/auth/register";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Hash,
  Lock,
  Mail,
  User,
} from "lucide-react";
import TermsDialog from "@/components/auth/terms-dialog";
import PrivacyDialog from "@/components/auth/privacy-dialog";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";

type DialogState = "idle" | "verify" | "redirecting";

const authInputClass =
  "h-10 rounded-xl border border-[#1C402E]/18 bg-white/18 shadow-[0_12px_24px_-24px_rgba(15,23,42,0.3)] backdrop-blur-md transition focus-within:border-[#1C402E]/28 focus-within:bg-transparent has-[[data-slot=input-group-control]:focus-visible]:border-[#1C402E]/28 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px] has-[[data-slot=input-group-control]:focus-visible]:ring-[#1C402E]/8";

const authInputControlClass =
  "h-10 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:[-webkit-text-fill-color:#173726] [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset] [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_transparent] [&:-webkit-autofill]:[caret-color:#173726] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill:hover]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset] [&:-webkit-autofill:focus]:[-webkit-box-shadow:0_0_0px_1000px_transparent_inset]";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("idle");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      studentId: "",
      fullName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  useEffect(() => {
    if (dialogState !== "verify") return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setDialogState("redirecting");
        setTimeout(() => {
          startTransition(() => {
            router.replace("/dashboard");
            router.refresh();
          });
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
      studentId: values.studentId,
      name: values.fullName,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      toast.error(result.error, { duration: 5000, position: "bottom-right" });
      return;
    }

    setRegisteredEmail(values.email);
    form.reset({
      studentId: "",
      fullName: "",
      email: "",
      password: "",
      terms: false,
    });
    setDialogState("verify");
  }

  function handleMoveToLogin() {
    form.reset({
      studentId: "",
      fullName: "",
      email: "",
      password: "",
      terms: false,
    });
    setShowPassword(false);
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-1.5 text-sm leading-5 text-gray-600">
            Your research journey starts here.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
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
                <InputGroup className={authInputClass}>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>
                      <Hash className="h-4 w-4 text-[#1C402E]/55" />
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
                <p className="mt-1 text-[11px] text-gray-500">
                  Format: 000-0000 (e.g. 221-2382)
                </p>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="name"
                  className="text-sm font-semibold text-gray-700"
                >
                  Full name
                </FieldLabel>
                <InputGroup className={authInputClass}>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>
                      <User className="h-4 w-4 text-[#1C402E]/55" />
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
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                <FieldLabel
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700"
                >
                  Email address
                </FieldLabel>
                <InputGroup className={authInputClass}>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>
                      <Mail className="h-4 w-4 text-[#1C402E]/55" />
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

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                <FieldLabel
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </FieldLabel>
                <InputGroup className={authInputClass}>
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
                <p className="mt-1 text-[11px] text-gray-500">
                  Must be at least 8 characters
                </p>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div>
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              {...form.register("terms")}
              aria-invalid={!!form.formState.errors.terms || undefined}
              className={`mt-0.5 h-4 w-4 cursor-pointer rounded border ${
                form.formState.errors.terms
                  ? "border-red-500"
                  : "border-gray-400/80"
              } bg-white/20 text-[#1C402E] focus:ring-[#1C402E]`}
            />
            <label
              htmlFor="terms"
              className="ml-3 text-sm leading-5 text-gray-600"
            >
              I agree to the <TermsDialog>Terms of Service</TermsDialog> and{" "}
              <PrivacyDialog>Privacy Policy</PrivacyDialog>
            </label>
          </div>
          {form.formState.errors.terms && (
            <p className="mt-1.5 text-sm text-red-600">
              {form.formState.errors.terms.message as string}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#163726] px-4 text-sm font-semibold text-white shadow-[0_18px_32px_-18px_rgba(22,55,38,0.8)] transition hover:bg-[#1C402E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {form.formState.isSubmitting ? (
            <>
              <Spinner className="size-4" />
              Creating...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            onClick={handleMoveToLogin}
            className="font-semibold text-[#1C402E] transition hover:text-[#087830]"
          >
            Log in here
          </Link>
        </div>
      </form>

      <Dialog
        open={dialogState !== "idle"}
        onOpenChange={(open) => {
          if (!open && dialogState === "verify") {
            setDialogState("idle");
          }
        }}
      >
        <DialogContent showCloseButton={dialogState === "verify"} className="sm:max-w-md">
          {dialogState === "verify" && (
            <>
              <DialogHeader className="items-center text-center">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-[#1C402E] animate-bounce">
                  <Mail className="h-8 w-8" />
                </div>
                <DialogTitle className="text-xl">Check your email</DialogTitle>
                <DialogDescription className="text-[13px] leading-relaxed text-gray-500">
                  We&apos;ve sent a verification link to{" "}
                  <span className="font-semibold text-gray-700">
                    {registeredEmail}
                  </span>
                  . Please open it to verify your account.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
                <p className="font-medium">Keep this tab open!</p>
                <p className="mt-0.5 text-xs text-amber-600">
                  You&apos;ll be automatically redirected once verified.
                </p>
              </div>
              <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm text-blue-800">
                <div className="mb-1 flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4" />
                  <p className="font-medium">Admin Approval Required</p>
                </div>
                <p className="text-xs text-blue-600">
                  After verifying your email, an admin will review and approve
                  your account before you can log in.
                </p>
              </div>
            </>
          )}

          {dialogState === "redirecting" && (
            <>
              <DialogHeader className="items-center text-center">
                <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-[#087830]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <DialogTitle className="text-xl">Email Verified!</DialogTitle>
                <DialogDescription className="text-[13px] leading-relaxed text-gray-500">
                  Your account has been verified successfully.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center gap-2 py-2 text-sm font-medium text-[#1C402E]">
                <Spinner className="size-4" />
                Redirecting to dashboard...
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
