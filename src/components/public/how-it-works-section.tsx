"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    step: "01",
    image: "/dashboard.png",
    title: "Browse available theses",
    lead: "Users can immediately",
    highlight: "look for available theses",
    tail: "that have already been uploaded into the system and organized for exploration.",
    note: "This gives students and researchers a cleaner starting point than digging through scattered folders or isolated files.",
  },
  {
    step: "02",
    image: "/AiSearch.png",
    title: "Search by topic, not just keywords",
    lead: "Instead of opening documents one by one, users can",
    highlight: "search a thesis using keywords",
    tail: "to surface relevant papers faster and narrow their focus quickly.",
    note: "This supports both directed searching and early-stage topic exploration when users only know a concept, theme, or field.",
  },
  {
    step: "03",
    image: "/Category.png",
    title: "See documents grouped by category",
    lead: "Users can also explore research through",
    highlight: "organized categories",
    tail: "so related theses feel easier to scan, compare, and revisit.",
    note: "Categorized browsing helps when users want to discover papers within a field instead of relying on a single keyword search.",
  },
  {
    step: "04",
    image: "/ResearchDetail.png",
    title: "Read the thesis details and summary",
    lead: "After selecting a paper, users can view the thesis details and quickly understand it through",
    highlight: "the summarized version",
    tail: "before committing to a deeper read of the full document.",
    note: "This helps users judge relevance earlier and saves time when comparing several papers on the same subject.",
  },
  {
    step: "05",
    image: "/AskResearch.png",
    title: "Ask questions about the selected topic",
    lead: "Once the user opens a thesis, the system lets them",
    highlight: "ask questions about the selected topic",
    tail: "to get clearer guidance while staying inside the same research workspace.",
    note: "This makes the experience more interactive, especially when users want quick clarification on concepts, methods, or findings.",
  },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = Array.from(
      section.querySelectorAll<HTMLElement>("[data-how-step]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number(entry.target.getAttribute("data-how-step"));
          setVisibleSteps((current) =>
            current.includes(index) ? current : [...current, index]
          );
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden border-b border-[#d9e7df] bg-[linear-gradient(180deg,#f7fbf8_0%,#f3f8f5_100%)] py-16 sm:py-20 md:py-24"
    >
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(28,64,46,0.09),transparent_62%)]" />
      <div className="absolute left-[-8rem] top-28 h-64 w-64 rounded-full bg-[#d5efe0] blur-3xl" />
      <div className="absolute bottom-12 right-[-6rem] h-56 w-56 rounded-full bg-[#e5f5eb] blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1c402e]/70">
            How It Works
          </p>
          <h2 className="mt-5 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl">
            From raw PDF to searchable research intelligence
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
            DocuLens turns thesis documents into an organized research system:
            upload files, let AI extract structure and meaning, then search,
            read, and ask questions in one workflow.
          </p>
        </div>

        <div className="relative mt-14 md:mt-16">
          <div className="absolute bottom-0 right-6 top-5 hidden w-px bg-gradient-to-b from-[#1c402e]/10 via-[#1c402e]/25 to-transparent md:block" />

          <div className="space-y-10 md:space-y-14">
            {steps.map((item, index) => {
              const isVisible = visibleSteps.includes(index);

              return (
                <div
                  key={item.step}
                  data-how-step={index}
                  className="relative grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8"
                >
                  <div
                    className={`relative transition-all duration-700 ${
                      isVisible
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-8 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 120}ms` }}
                  >
                    <div className="absolute -left-2 top-2 hidden h-[calc(100%-1rem)] w-1 rounded-full bg-gradient-to-b from-[#1c402e]/30 via-[#1c402e]/10 to-transparent md:block" />
                    <div className="pl-0 md:pl-7">
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1c402e]/45">
                        Step {item.step}
                      </p>
                      <h3 className="mt-3 text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                        {item.title}
                      </h3>
                      <div className="mt-5 max-w-[34rem] overflow-hidden rounded-[1.55rem] border border-dashed border-[#bfdccd] bg-[linear-gradient(145deg,rgba(244,250,246,0.9),rgba(230,243,235,0.92))] shadow-[0_18px_38px_-30px_rgba(28,64,46,0.35)]">
                        <div className="relative mx-auto w-full max-w-[34rem]">
                          <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 px-4 py-3">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ff8a7a]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#ffd66b]" />
                            <span className="h-2.5 w-2.5 rounded-full bg-[#7dff9b]" />
                          </div>
                          <Image
                            src={item.image}
                            alt={`${item.title} preview`}
                            width={1360}
                            height={768}
                            className="h-auto w-full object-cover"
                          />
                        </div>
                      </div>
                      <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-[15px]">
                        {item.lead}{" "}
                        <span className="font-semibold text-[#1c402e]">
                          {item.highlight}
                        </span>{" "}
                        {item.tail}
                      </p>
                      <p className="mt-4 max-w-xl text-sm leading-6 text-[#1c402e]/62">
                        {item.note}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`relative flex items-center justify-end transition-all duration-700 ${
                      isVisible
                        ? "translate-x-0 opacity-100"
                        : "translate-x-8 opacity-0"
                    }`}
                    style={{ transitionDelay: `${index * 120 + 100}ms` }}
                  >
                    <div className="absolute right-2 top-1/2 hidden h-24 w-24 -translate-y-1/2 rounded-full bg-[#dff3e6] blur-2xl md:block" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#1c402e]/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.8),rgba(232,244,237,0.9))] text-lg font-semibold tracking-[0.08em] text-[#1c402e] shadow-[0_25px_45px_-32px_rgba(28,64,46,0.65)] sm:h-20 sm:w-20 sm:text-xl md:h-24 md:w-24 md:text-2xl">
                      {item.step}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
