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
import { register } from "@/server/auth/register";
import { User, Mail, Lock, Eye, EyeOff, X } from "lucide-react";

export default function RegisterForm() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
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
              © 2025 Doculens. All rights reserved.
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
                        <Eye className="h-5 w-5 cursor-pointer" />
                      ) : (
                        <EyeOff className="h-5 w-5 cursor-pointer" />
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
                      className={`cursor-pointer h-4 w-4 mt-0.5 rounded border ${
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
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-[#278fb6] hover:text-[#278fb6]/80 font-medium underline"
                      >
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-[#278fb6] hover:text-[#278fb6]/80 font-medium underline"
                      >
                        Privacy Policy
                      </button>
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
          © 2025 Doculens. All rights reserved.
        </p>
      </div>

      {/* Terms of Service Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                Terms of Service
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4 text-gray-700">
                <p className="text-sm text-gray-500">
                  Last updated: December 01, 2025
                </p>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    1. Acceptance of Terms
                  </h4>
                  <p>
                    By accessing and using Doculens ("the Service"), you agree
                    to be bound by these Terms of Service. If you do not agree
                    to these terms, please do not use our Service. We reserve
                    the right to update these terms at any time, and continued
                    use of the Service constitutes acceptance of any changes.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    2. Description of Service
                  </h4>
                  <p>
                    Doculens provides document processing, extraction, and
                    management services. We reserve the right to modify,
                    suspend, or discontinue any aspect of the Service at any
                    time without prior notice. We are not liable for any
                    modification, suspension, or discontinuation of the Service.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    3. User Accounts and Security
                  </h4>
                  <p>
                    You are responsible for maintaining the confidentiality of
                    your account credentials and for all activities that occur
                    under your account. You must immediately notify us of any
                    unauthorized use of your account. We are not liable for any
                    loss or damage arising from your failure to protect your
                    account information.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    4. User Conduct and Prohibited Activities
                  </h4>
                  <p>
                    You agree not to: (a) use the Service for any illegal
                    purpose or in violation of any laws; (b) attempt to gain
                    unauthorized access to our systems; (c) interfere with or
                    disrupt the Service; (d) upload malicious code or viruses;
                    (e) infringe upon intellectual property rights; or (f)
                    harass, abuse, or harm others through the Service.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    5. Intellectual Property Rights
                  </h4>
                  <p>
                    All content, features, and functionality of the Service are
                    owned by Doculens and are protected by international
                    copyright, trademark, and other intellectual property laws.
                    You retain ownership of documents you upload, but grant us a
                    license to process and store them to provide the Service.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    6. Disclaimer of Warranties
                  </h4>
                  <p>
                    The Service is provided "as is" and "as available" without
                    warranties of any kind, either express or implied, including
                    but not limited to warranties of merchantability, fitness
                    for a particular purpose, or non-infringement. We do not
                    guarantee that the Service will be uninterrupted, secure, or
                    error-free.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    7. Limitation of Liability
                  </h4>
                  <p>
                    To the maximum extent permitted by law, Doculens shall not
                    be liable for any indirect, incidental, special,
                    consequential, or punitive damages, including but not
                    limited to loss of profits, data, or other intangible losses
                    resulting from your use or inability to use the Service.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">8. Termination</h4>
                  <p>
                    We reserve the right to terminate or suspend your account
                    and access to the Service immediately, without prior notice,
                    for any reason, including breach of these Terms. Upon
                    termination, your right to use the Service will immediately
                    cease.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    9. Governing Law
                  </h4>
                  <p>
                    These Terms shall be governed by and construed in accordance
                    with applicable laws, without regard to conflict of law
                    provisions. Any disputes arising from these Terms or the
                    Service shall be resolved in the appropriate courts.
                  </p>
                </section>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full rounded-lg bg-[#278fb6] px-4 py-3 text-base font-semibold text-white shadow-lg hover:bg-[#278fb6]/90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                Privacy Policy
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4 text-gray-700">
                <p className="text-sm text-gray-500">
                  Last updated: December 01, 2025
                </p>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    1. Information We Collect
                  </h4>
                  <p>
                    We collect several types of information: (a) Personal
                    Information you provide directly, such as name, email
                    address, and account credentials; (b) Document Content you
                    upload to the Service; (c) Usage Data including IP address,
                    browser type, device information, and how you interact with
                    our Service; and (d) Cookies and similar tracking
                    technologies to enhance your experience.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    2. How We Use Your Information
                  </h4>
                  <p>
                    We use collected information to: (a) provide, maintain, and
                    improve our services; (b) process and analyze your
                    documents; (c) communicate with you about updates, security
                    alerts, and support; (d) detect, prevent, and address
                    technical issues and fraudulent activity; (e) comply with
                    legal obligations; and (f) personalize your experience with
                    our Service.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    3. Information Sharing and Disclosure
                  </h4>
                  <p>
                    We do not sell your personal information. We may share
                    information with: (a) Service providers who assist in
                    operating our Service; (b) Law enforcement when required by
                    law or to protect our rights; (c) Business partners with
                    your consent; and (d) In connection with a merger, sale, or
                    acquisition of our company. All third parties are obligated
                    to protect your information and use it only for specified
                    purposes.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    4. Data Security and Storage
                  </h4>
                  <p>
                    We implement industry-standard security measures including
                    encryption, secure servers, and access controls to protect
                    your personal information. However, no method of
                    transmission over the internet is 100% secure. Your data is
                    stored on secure servers and retained only as long as
                    necessary to provide our services and comply with legal
                    requirements.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    5. Your Rights and Choices
                  </h4>
                  <p>
                    You have the right to: (a) access and receive a copy of your
                    personal information; (b) correct or update inaccurate
                    information; (c) request deletion of your information,
                    subject to legal requirements; (d) object to or restrict
                    certain processing of your data; (e) data portability to
                    transfer your information; and (f) withdraw consent at any
                    time. Contact us to exercise these rights.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    6. Cookies and Tracking Technologies
                  </h4>
                  <p>
                    We use cookies, web beacons, and similar technologies to
                    collect usage data and enhance functionality. You can
                    control cookie preferences through your browser settings,
                    though disabling cookies may limit certain features of our
                    Service. We use both session cookies (temporary) and
                    persistent cookies (stored on your device).
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    7. Third-Party Links and Services
                  </h4>
                  <p>
                    Our Service may contain links to third-party websites or
                    integrate with third-party services. We are not responsible
                    for the privacy practices of these external sites. We
                    encourage you to review the privacy policies of any
                    third-party services you access through our platform.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    8. Children's Privacy
                  </h4>
                  <p>
                    Our Service is not intended for children under 13 years of
                    age. We do not knowingly collect personal information from
                    children. If we become aware that a child has provided us
                    with personal information, we will take steps to delete such
                    information promptly.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    9. Changes to Privacy Policy
                  </h4>
                  <p>
                    We may update this Privacy Policy periodically to reflect
                    changes in our practices or legal requirements. We will
                    notify you of any material changes by posting the new policy
                    on this page and updating the "Last Updated" date. Your
                    continued use of the Service constitutes acceptance of the
                    updated policy.
                  </p>
                </section>

                <section>
                  <h4 className="font-semibold text-lg mb-2">
                    10. Contact Information
                  </h4>
                  <p>
                    If you have questions, concerns, or requests regarding this
                    Privacy Policy or our data practices, please contact us at:
                    privacy@doculens.com. We will respond to your inquiry within
                    a reasonable timeframe.
                  </p>
                </section>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full rounded-lg bg-[#278fb6] px-4 py-3 text-base font-semibold text-white shadow-lg hover:bg-[#278fb6]/90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
