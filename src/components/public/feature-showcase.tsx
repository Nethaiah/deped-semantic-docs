"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const steps = [
  {
    step: "01",
    title: "Browse available theses",
    lead: "Users can immediately",
    highlight: "look for available theses",
    tail: "that have already been uploaded into the system and organized for exploration.",
    note: "This gives students and researchers a cleaner starting point than digging through scattered folders or isolated files.",
  },
  {
    step: "02",
    title: "Search by keyword or topic",
    lead: "Instead of opening documents one by one, users can",
    highlight: "search a thesis using keywords",
    tail: "to surface relevant papers faster and narrow their focus quickly.",
    note: "This supports both directed searching and early-stage topic exploration when users only know a concept, theme, or field.",
  },
  {
    step: "03",
    title: "See documents grouped by category",
    lead: "Users can also explore research through",
    highlight: "organized categories",
    tail: "so related theses feel easier to scan, compare, and revisit.",
    note: "Categorized browsing helps when users want to discover papers within a field instead of relying on a single keyword search.",
  },
  {
    step: "04",
    title: "Read the thesis details and summary",
    lead: "After selecting a paper, users can view the thesis details and quickly understand it through",
    highlight: "the summarized version",
    tail: "before committing to a deeper read of the full document.",
    note: "This helps users judge relevance earlier and saves time when comparing several papers on the same subject.",
  },
  {
    step: "05",
    title: "Ask questions about the selected topic",
    lead: "Once the user opens a thesis, the system lets them",
    highlight: "ask questions about the selected topic",
    tail: "to get clearer guidance while staying inside the same research workspace.",
    note: "This makes the experience more interactive, especially when users want quick clarification on concepts, methods, or findings.",
  },
];

export default function FeatureShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = Array.from(
      section.querySelectorAll<HTMLElement>("[data-feature-step]")
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number(entry.target.getAttribute("data-feature-step"));
          setVisibleSteps((current) =>
            current.includes(index) ? current : [...current, index]
          );
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -12% 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const updateActiveStep = () => {
      const focusLine = window.innerHeight * 0.36;
      let nextActiveIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((element, index) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const anchor = rect.top + Math.min(rect.height * 0.32, 220);
        const distance = Math.abs(anchor - focusLine);

        if (distance < closestDistance) {
          closestDistance = distance;
          nextActiveIndex = index;
        }
      });

      setActiveIndex((current) =>
        current === nextActiveIndex ? current : nextActiveIndex
      );
    };

    const handleViewportChange = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(updateActiveStep);
    };

    updateActiveStep();

    window.addEventListener("scroll", handleViewportChange, { passive: true });
    window.addEventListener("resize", handleViewportChange);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative overflow-hidden border-y border-[#d9e7df] bg-[linear-gradient(180deg,#f7fbf8_0%,#f3f8f5_100%)] py-16 sm:py-20 md:py-24"
    >
      <div className="absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,rgba(28,64,46,0.09),transparent_62%)]" />
      <div className="absolute left-[-8rem] top-28 h-64 w-64 rounded-full bg-[#d5efe0] blur-3xl" />
      <div className="absolute bottom-12 right-[-6rem] h-56 w-56 rounded-full bg-[#e5f5eb] blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#1c402e]/70">
            Features
          </p>
          <h2 className="mt-5 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl md:text-4xl">
            How users explore research with DocuLens
          </h2>
        </div>

        <div className="mt-14 space-y-12 md:mt-20 md:space-y-20">
          {steps.map((item, index) => {
            const isVisible = visibleSteps.includes(index);
            const isActive = activeIndex === index;

            return (
              <article
                key={item.step}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                data-feature-step={index}
                className="relative grid gap-5 md:grid-cols-[clamp(5.5rem,12vw,10rem)_minmax(0,44rem)] md:justify-center md:gap-12"
              >
                <div className="hidden md:block">
                  <div className="sticky top-28 flex items-start justify-center">
                    <span
                      className={`select-none text-[clamp(4.75rem,10vw,8.75rem)] font-black leading-[0.82] tracking-[-0.09em] text-[#1c402e] transition-all duration-500 ${
                        isActive
                          ? "scale-110 opacity-100"
                          : "scale-[0.88] opacity-30"
                      }`}
                    >
                      {item.step}
                    </span>
                  </div>
                </div>

                <div
                  className={`relative transition-all duration-700 ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <div className="absolute left-0 top-0 hidden h-full w-px bg-[linear-gradient(180deg,rgba(28,64,46,0.24),rgba(28,64,46,0.04),transparent)] md:block" />

                  <div className="mx-auto flex max-w-[44rem] flex-col items-start text-left md:pl-8">
                    <div className="flex items-start justify-center gap-4 md:hidden">
                      <span
                        className={`text-5xl font-black leading-none tracking-[-0.09em] text-[#1c402e] transition-all duration-500 ${
                          isActive ? "scale-100 opacity-100" : "scale-90 opacity-35"
                        }`}
                      >
                        {item.step}
                      </span>
                    </div>

                    <h3
                      className={`mt-3 max-w-3xl text-xl font-semibold tracking-tight text-gray-900 transition-colors duration-500 sm:text-2xl md:mt-0 md:text-[2.15rem] ${
                        isActive ? "text-[#102e20]" : ""
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-[15px]">
                      {item.lead}{" "}
                      <span className="font-semibold text-[#1c402e]">
                        {item.highlight}
                      </span>{" "}
                      {item.tail}
                    </p>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-[#1c402e]/62">
                      {item.note}
                    </p>

                    <div
                      className={`mt-6 w-full max-w-[38rem] overflow-hidden rounded-[1.7rem] border border-[#bfdccd] bg-white transition-all duration-500 ${
                        isActive
                          ? "border-[#92c7a8]"
                          : ""
                      }`}
                    >
                      <div className="relative mx-auto w-full max-w-[38rem]">
                        <Image
                          src="/dashboard.png"
                          alt={`Feature step ${item.step} preview`}
                          width={1360}
                          height={768}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
