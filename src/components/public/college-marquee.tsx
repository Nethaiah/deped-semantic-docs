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

export default function CollegeMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [centerIndex, setCenterIndex] = useState(-1);

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
    <div className="flex flex-col items-center mt-6 w-full max-w-2xl">
      <span className="text-sm font-semibold tracking-[0.2em] text-gray-500 uppercase mb-8 text-center w-full">
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
                  ? "text-gray-900 scale-110 opacity-100"
                  : "text-gray-500 scale-100 opacity-40"
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
