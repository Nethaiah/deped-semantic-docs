import React from "react";
import Image from "next/image";
import { Facebook, MapPin } from "lucide-react";
import FeatureShowcase from "@/components/public/feature-showcase";
import CollegeMarquee from "@/components/public/college-marquee";
import SmoothFooterLink from "@/components/public/smooth-footer-link";

export default function Home() {
  const sharedSurface =
    "bg-[linear-gradient(145deg,#071a12_0%,#0d2d20_52%,#123a29_100%)]";

  const heroContent = (
    <div className="relative flex flex-col items-center w-full px-2 sm:px-0">
      <div className="inline-flex items-center justify-center gap-2 rounded-full border border-[#b8dcc5] bg-[#dff3e6] px-4 py-1.5 text-xs font-bold text-[#1c402e] shadow-sm transition-all hover:bg-[#e8f7ed]">
        Laguna University Research Archives
      </div>

      <h1 className="relative mt-6 w-full max-w-4xl text-xl font-medium leading-snug tracking-tight text-gray-900 sm:text-2xl md:text-[1.7rem] lg:text-[2.15rem]">
        The intelligent platform to read,{" "}
        <span className="relative mx-1 inline-block rounded border border-green-200/50 bg-[#d1e7d8] px-1.5 text-[#123a29] shadow-sm">
          summarize,
        </span>{" "}
        <br className="hidden md:block" />
        organize, and discover research papers
      </h1>

      <div className="relative w-full max-w-full overflow-hidden">
        <CollegeMarquee />
      </div>
    </div>
  );

  return (
    <div id="top" className="min-h-screen bg-[#f5fbf7]">
      <section
        className="relative isolate overflow-hidden border-b border-[#d9e9df] bg-[linear-gradient(180deg,#f5fff7_0%,#eef9f1_48%,#f9fdf9_100%)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(189,245,170,0.28),transparent_52%)]" />
        <div className="auth-light-grid absolute inset-0 opacity-100" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_38%,rgba(255,255,255,0.2)_100%)]" />

        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-3 pt-28 text-center sm:px-8 sm:pb-5 sm:pt-24 lg:hidden">
          {heroContent}
        </div>

        <div className="relative overflow-hidden">
          <div className="flex w-full justify-center">
            <Image
              src="/LUBG11.png"
              alt="Laguna University Campus"
              width={2048}
              height={1373}
              sizes="100vw"
              className="relative z-[2] h-[18rem] w-full object-cover object-[center_16%] sm:h-[24rem] md:h-[30rem] lg:h-auto lg:max-w-[1920px] lg:object-contain lg:object-center"
              priority
            />
          </div>

          <div className="absolute inset-0 z-10 hidden items-start justify-center lg:flex">
            <div className="mx-auto flex w-full max-w-5xl origin-top flex-col items-center px-6 pb-8 pt-24 text-center lg:scale-[0.88] sm:px-8 xl:scale-[0.94] min-[1500px]:scale-100 min-[1500px]:pb-10 min-[1500px]:pt-28 xl:min-[1500px]:pt-36">
              {heroContent}
            </div>
          </div>
        </div>
      </section>

      <section
        id="hero-next"
        className="mt-8 border-y border-[#b8dcc5] bg-[#dff3e6] py-10 sm:mt-10 sm:py-12 md:mt-14 md:py-16"
      >
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8">
          <h2 className="mb-3 text-xl font-bold text-[#123a29] sm:mb-4 sm:text-2xl md:text-3xl">
            Numerous research papers. One platform.
          </h2>
          <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-[#1c402e] shadow-[0_0_20px_rgba(125,255,155,0.45)] sm:w-28" />
          <p className="text-base leading-relaxed text-[#1c402e]/82 sm:text-lg">
            Students, faculty, and researchers at Laguna University deal with
            numerous theses, capstones, and other research papers. Finding the right paper,
            understanding its key findings, and seeing related works should not
            take hours of searching.
          </p>
        </div>
      </section>

      <section
        id="about"
        className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-28"
      >
        <div className="mx-auto mb-12 max-w-4xl px-6 text-center sm:mb-16 sm:px-8 md:mb-20">
          <h2 className="mb-4 text-2xl font-bold leading-tight text-gray-900 sm:mb-6 sm:text-3xl md:text-4xl lg:text-[2.75rem]">
            Built by Researchers.
            <br />
            For Researchers.
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
            DocuLens was born from a simple frustration - spending hours digging
            through stacks of theses just to find one relevant study. We built
            the tool we wished we had.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-8 px-6 sm:gap-12 sm:px-8 md:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <div className="mb-4 flex items-center gap-3 sm:mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1c402e]">
                <span className="text-sm font-black text-white">LU</span>
              </div>
              <span className="text-sm font-medium italic text-gray-400">
                Laguna University
              </span>
            </div>
            <h3 className="text-xl font-bold leading-snug text-gray-900 sm:text-2xl md:text-3xl">
              For Every Student,{" "}
              <span className="font-medium text-gray-400">
                <br className="hidden sm:block" />
                Every Researcher at LU.
              </span>
            </h3>
          </div>

          <div className="space-y-5 text-sm leading-relaxed text-gray-600 sm:space-y-6 sm:text-[15px]">
            <p>
              As students and researchers at Laguna University, we know what
              it&apos;s like to spend entire weekends scrolling through
              unorganized folders of theses and capstones - desperately
              searching for the right study, the right data, and the right
              conclusion.
            </p>
            <p>
              But here&apos;s the thing: the knowledge already exists. Hundreds
              of brilliant research papers sit in university archives, waiting
              to be discovered. The problem was never the research - it was the
              access.
            </p>
            <p>
              That&apos;s exactly why we built DocuLens. An AI-powered platform
              that reads, summarizes, categorizes, and connects every research
              paper in the archive.{" "}
              <span className="font-semibold text-gray-900">
                So you spend less time searching and more time discovering.
              </span>
            </p>
          </div>
        </div>
      </section>

      <FeatureShowcase />

      <footer
        className={`relative overflow-hidden border-t border-[#0b2619] py-8 sm:py-12 ${sharedSurface}`}
      >
        <div className="auth-dot-grid absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,255,155,0.14),transparent_58%)]" />
        <div className="relative mx-auto max-w-6xl px-6 sm:px-8">
          <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-start">
            <div className="max-w-md text-left">
              <div className="flex items-center justify-start gap-3">
                <Image
                  src="/logo.png"
                  alt="DocuLens Logo"
                  width={42}
                  height={42}
                  className="h-10 w-10 object-contain"
                />
                <div>
                  <p className="text-lg font-semibold tracking-tight text-white">
                    Doculens
                  </p>
                  <p className="text-sm text-white/64">
                    AI-powered research intelligence
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/76">
                DocuLens helps Laguna University students, faculty, and
                researchers search, organize, and understand academic papers in
                one smarter workspace.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 text-left sm:grid-cols-2 sm:gap-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7dff9b]">
                  Quick Links
                </h3>
                <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/76">
                  <SmoothFooterLink
                    href="/"
                    className="text-left transition hover:text-white"
                  >
                    Home
                  </SmoothFooterLink>
                  <SmoothFooterLink
                    href="#about"
                    className="text-left transition hover:text-white"
                  >
                    About
                  </SmoothFooterLink>
                  <SmoothFooterLink
                    href="#features"
                    className="text-left transition hover:text-white"
                  >
                    Features
                  </SmoothFooterLink>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#7dff9b]">
                  Connect with us
                </h3>
                <div className="mt-4 flex flex-col gap-3 text-sm text-white/76">
                  <p className="flex items-start gap-2.5">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#7dff9b]"
                      aria-hidden="true"
                    />
                    <span>
                      Laguna Sports Complex, Brgy. Bubukal, Santa Cruz, Laguna
                    </span>
                  </p>
                  <a
                    href="https://www.facebook.com/LagunaUniversityOfficial/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-2.5 transition hover:text-white"
                  >
                    <Facebook
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#7dff9b]"
                      aria-hidden="true"
                    />
                    <span>Laguna University | Santa Cruz</span>
                  </a>
                  
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/12 pt-5 text-center md:text-center">
            <p className="text-sm text-white/78">
              © 2025 Doculens. AI-powered research paper intelligence for Laguna
              University.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
