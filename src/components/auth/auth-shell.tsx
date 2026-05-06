import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

type AuthShellVariant = "login" | "register";

const rightParticles = [
  {
    top: "18%",
    left: "74%",
    size: 14,
    color: "rgba(220,252,231,0.85)",
    blur: "1px",
    duration: "18s",
    delay: "-10s",
  },
  {
    top: "52%",
    left: "82%",
    size: 11,
    color: "rgba(187,247,208,0.68)",
    blur: "1px",
    duration: "16s",
    delay: "-7s",
  },
  {
    top: "79%",
    left: "22%",
    size: 15,
    color: "rgba(255,255,255,0.76)",
    blur: "1px",
    duration: "19s",
    delay: "-12s",
  },
];

const shellContent: Record<
  AuthShellVariant,
  {
    badge: string;
    title: string;
    description: string;
    highlight: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  }
> = {
  login: {
    badge: "Secure access",
    title: "",
    description:
      "",
    highlight: "",
    steps: [
      {
        title: "Sign in to your account",
        description: "Use your current User ID and password to continue.",
      },
      {
        title: "Resume your search",
        description: "Dive into documents, saved queries, reading, and discovery.",
      },
      {
        title: "Explore with context",
        description: "See summaries, related work, and organized archives faster.",
      },
    ],
  },
  register: {
    badge: "Create your account",
    title: "",
    description:
      "",
    highlight: "",
    steps: [
      {
        title: "Create your account",
        description: "Register with your User ID, full name, and campus email.",
      },
      {
        title: "Verify your email",
        description: "Confirm your address to secure and activate your identity.",
      },
      {
        title: "Wait for approval",
        description: "An administrator reviews access before your first login.",
      },
    ],
  },
};

export default function AuthShell({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: AuthShellVariant;
}) {
  const content = shellContent[variant];
  const showRightDecor = variant !== "login";

  return (
    <section className="relative">
      <div className="absolute inset-x-8 top-4 h-16 rounded-full bg-[#087830]/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/50 shadow-[0_30px_100px_-50px_rgba(28,64,46,0.45)] backdrop-blur-xl">
        <div className="grid min-h-[min(700px,calc(100vh-6rem))] lg:grid-cols-[1.04fr_0.96fr]">
          <div className="relative isolate overflow-hidden bg-[linear-gradient(160deg,#0f2d1d_0%,#155437_48%,#20865a_100%)] px-5 py-5 text-white sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            <div className="auth-dot-grid absolute inset-0 opacity-40" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Image
                src="/LULOGO1.png"
                alt=""
                width={560}
                height={560}
                className="h-[18rem] w-[18rem] object-contain opacity-[0.08] sm:h-[22rem] sm:w-[22rem] lg:h-[30rem] lg:w-[30rem]"
                aria-hidden="true"
                priority
              />
            </div>

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
                  >
                    <Image
                      src="/Logo.png"
                      alt="Doculens Logo"
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain brightness-0 invert"
                      priority
                    />
                    <div>
                      <p className="text-lg font-semibold tracking-tight text-white">
                        Doculens
                      </p>
                      <p className="text-xs text-white/70">
                        AI-powered research intelligence
                      </p>
                    </div>
                  </Link>
                </div>
                
              </div>

              <div className="mt-6 max-w-md">
                <h1 className="mt-2.5 text-2xl font-semibold leading-tight text-white sm:text-[2rem]">
                  {content.title}
                </h1>
                <p className="mt-3 max-w-sm text-sm leading-5 text-white/78">
                  {content.description}
                </p>
              </div>

              <div className="mt-6 hidden gap-2.5 md:grid md:grid-cols-3 lg:mt-auto">
                {content.steps.map((step, index) => (
                  <div
                    key={step.title}
                    className={`rounded-[1.15rem] border px-3.5 py-3.5 backdrop-blur-xl ${
                      index === 0
                        ? "border-white/55 bg-white text-[#173726] shadow-[0_20px_45px_-28px_rgba(0,0,0,0.65)]"
                        : "border-white/14 bg-white/10 text-white/90"
                    }`}
                  >
                    <div
                      className={`mb-5 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                        index === 0
                          ? "bg-[#173726] text-white"
                          : "bg-white/14 text-white/80"
                      }`}
                    >
                      0{index + 1}
                    </div>
                    <p className="text-sm font-semibold leading-5">{step.title}</p>
                    <p
                      className={`mt-1.5 text-[11px] leading-[1.125rem] ${
                        index === 0 ? "text-[#173726]/70" : "text-white/68"
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative isolate overflow-hidden bg-transparent px-4 pb-5 pt-1 sm:px-5 sm:pb-5 md:px-5 md:py-5 lg:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.88),rgba(248,250,248,0.7)_40%,rgba(240,244,240,0.9)_100%)] lg:px-6 lg:py-6">
            <div className="absolute inset-x-3 bottom-3 top-3 hidden rounded-[1.6rem] border border-white/35 bg-white/12 backdrop-blur-[3px] lg:block" />
            <div className="auth-light-grid absolute inset-0 hidden opacity-70 lg:block" />
            {showRightDecor && (
              <>
                <div className="absolute -right-10 top-8 hidden h-48 w-48 rounded-full bg-white/90 blur-3xl lg:block" />
                <div className="absolute left-4 top-12 hidden h-40 w-40 rounded-full bg-[#1c402e]/12 blur-3xl lg:block" />
                <div className="absolute bottom-8 left-1/3 hidden h-44 w-44 rounded-full bg-[#087830]/16 blur-3xl lg:block" />
                <div className="absolute inset-x-8 top-10 hidden h-44 rounded-[2rem] bg-black/8 blur-3xl lg:block" />
                <div className="auth-shimmer absolute -left-16 top-0 hidden h-full w-56 opacity-70 lg:block" />
                <div
                  className="absolute right-[12%] top-[14%] hidden h-36 w-36 rounded-full border border-white/65 lg:block"
                  style={{ animation: "auth-drift 24s ease-in-out infinite" }}
                />
                <div
                  className="absolute left-[10%] bottom-[11%] hidden h-20 w-20 rounded-full border border-[#1C402E]/10 lg:block"
                  style={{ animation: "auth-drift 16s ease-in-out -6s infinite" }}
                />
                {rightParticles.map((particle, index) => (
                  <span
                    key={`${particle.top}-${particle.left}-${index}`}
                    className="pointer-events-none absolute hidden rounded-full lg:block"
                    style={{
                      top: particle.top,
                      left: particle.left,
                      width: `${particle.size}px`,
                      height: `${particle.size}px`,
                      background: particle.color,
                      filter: `blur(${particle.blur})`,
                      boxShadow: "0 0 26px rgba(187,247,208,0.45)",
                      animation: `auth-float ${particle.duration} ease-in-out ${particle.delay} infinite`,
                    }}
                  />
                ))}
              </>
            )}

            <div className="relative flex h-full items-start justify-center md:items-center">
              <div className="w-full mt-4 max-w-md lg:max-w-lg">
                
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
