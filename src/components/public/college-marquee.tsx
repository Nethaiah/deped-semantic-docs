"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const colleges = [
  { name: "CAS", logo: "/CASLOGO1.png", font: "font-serif font-bold" },
  { name: "COED", logo: "/COEDLOGO1.png", font: "font-sans font-medium tracking-tight" },
  { name: "CCS", logo: "/CCSLOGO1.png", font: "font-black tracking-tighter" },
  { name: "CBAA", logo: "/CBAALOGO1.png", font: "font-mono font-bold tracking-tight" },
  { name: "COENG", logo: "/COELOGO1.png", font: "font-semibold uppercase tracking-widest" },
];

// Double the list — one visible set + one buffer for seamless wrap
const items = [...colleges, ...colleges];

type CollegeMarqueeProps = {
  theme?: "light" | "dark";
};

export default function CollegeMarquee({
  theme = "light",
}: CollegeMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(-1);
  const isDark = theme === "dark";

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 0.4;
    let offset = 0;
    let raf: number;

    const step = () => {
      offset += speed;

      // Reset after scrolling through the first set
      const singleSetWidth = track.scrollWidth / 2;
      if (offset >= singleSetWidth) {
        offset -= singleSetWidth;
      }

      track.style.transform = `translateX(-${offset}px)`;

      // Determine which child is closest to the horizontal center
      const container = track.parentElement;
      if (container) {
        const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;
        let closest = -1;
        let closestDist = Infinity;

        const children = track.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          const childRect = child.getBoundingClientRect();
          const childCenter = childRect.left + childRect.width / 2;
          const dist = Math.abs(childCenter - containerCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        }
        setCenterIndex(closest);
      }

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center">
      <span
        className={`mb-6 w-full text-center text-[0.92rem] font-semibold tracking-[0.2em] uppercase sm:mb-8 sm:text-[1.05rem] ${
          isDark ? "text-[#c8e7d2]/72" : "text-gray-500"
        }`}
      >
        COLLEGE DEPARTMENTS
      </span>
      <div
        className="relative w-full overflow-x-hidden overflow-y-visible py-4 sm:py-6"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="flex items-center gap-8 whitespace-nowrap will-change-transform sm:gap-10 md:gap-12"
          style={{ width: "max-content" }}
        >
          {items.map((college, idx) => (
            <div
              key={idx}
              className={`flex w-24 shrink-0 select-none flex-col items-center gap-2.5 transition-all duration-500 ease-out sm:w-28 sm:gap-3 md:w-32 md:gap-4 ${
                centerIndex === idx
                  ? isDark
                    ? "scale-105 opacity-100 drop-shadow-[0_0_18px_rgba(125,255,155,0.2)]"
                    : "scale-105 opacity-100"
                  : isDark
                    ? "scale-100 opacity-45"
                    : "scale-100 opacity-45"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20 md:h-24 md:w-24">
                <Image
                  src={college.logo}
                  alt={`${college.name} logo`}
                  width={96}
                  height={96}
                  className={`h-16 w-16 object-contain sm:h-20 sm:w-20 md:h-24 md:w-24 ${
                    centerIndex === idx
                      ? isDark
                        ? "drop-shadow-[0_8px_18px_rgba(125,255,155,0.18)]"
                        : "drop-shadow-[0_10px_18px_rgba(18,58,41,0.12)]"
                      : ""
                  }`}
                  sizes="(max-width: 639px) 64px, (max-width: 767px) 80px, 96px"
                />
              </div>
              <div
                className={`text-[0.82rem] sm:text-[0.9rem] md:text-[0.98rem] ${college.font} ${
                  centerIndex === idx
                    ? isDark
                      ? "text-[#f3fff6]"
                      : "text-[#183628]"
                    : isDark
                      ? "text-[#a6cfb5]"
                      : "text-gray-500"
                }`}
              >
                {college.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
