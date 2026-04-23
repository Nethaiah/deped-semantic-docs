"use client";

import React, { useEffect, useRef, useState } from "react";

const colleges = [
  { name: "CAS", font: "font-serif font-bold" },
  { name: "COED", font: "font-sans font-medium tracking-tight" },
  { name: "CCS", font: "font-black tracking-tighter" },
  { name: "CBAA", font: "font-mono font-bold tracking-tight" },
  { name: "COENG", font: "font-semibold uppercase tracking-widest" },
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
    <div className="flex flex-col items-center mt-6 w-full max-w-2xl mx-auto">
      <span
        className={`mb-8 w-full text-center text-sm font-semibold tracking-[0.2em] uppercase ${
          isDark ? "text-[#c8e7d2]/72" : "text-gray-500"
        }`}
      >
        COLLEGE DEPARTMENTS
      </span>
      <div
        className="w-full overflow-hidden relative"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="flex items-center gap-12 whitespace-nowrap will-change-transform"
          style={{ width: "max-content" }}
        >
          {items.map((college, idx) => (
            <div
              key={idx}
              className={`text-2xl ${college.font} transition-all duration-500 ease-out select-none shrink-0 ${
                centerIndex === idx
                  ? isDark
                    ? "scale-110 text-[#f3fff6] opacity-100 drop-shadow-[0_0_14px_rgba(125,255,155,0.18)]"
                    : "scale-110 text-gray-900 opacity-100"
                  : isDark
                    ? "scale-100 text-[#a6cfb5] opacity-45"
                    : "scale-100 text-gray-500 opacity-40"
              }`}
            >
              {college.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
