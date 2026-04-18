import React from "react";
import Image from "next/image";
import FeatureShowcase from "@/components/public/feature-showcase";
import CollegeMarquee from "@/components/public/college-marquee";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Split Layout */}
      {/* Hero Section - Image as background, text overlaid in upper area */}
<section className="w-full relative overflow-hidden bg-white">
  
  {/* Native Image Layer — mathematically commands the 100% natural, uncropped height of the hero block */}
  <div className="w-full flex justify-center">
    <Image 
      src="/LUBG9.png" 
      alt="Laguna University Campus" 
      width={1920}
      height={1080}
      className="w-full h-auto max-w-[1920px]"
      priority
    />
  </div>

  {/* Text overlay — pinned to the top, responsive padding */}
  <div className="absolute top-0 left-0 right-0 flex flex-col items-center text-center px-4 sm:px-6 z-10 w-full max-w-5xl mx-auto pt-20 sm:pt-28 lg:pt-36 pb-6 sm:pb-10">
    
    {/* Top Pill */}
    <div className="inline-flex items-center justify-center gap-2 rounded-full bg-white/60 backdrop-blur px-4 py-1.5 text-xs font-bold text-[#1c402e] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.08)] border border-gray-100 mb-8 hover:bg-white hover:shadow-md transition-all cursor-pointer">
      Laguna University Research Archives
    </div>

    {/* Headline */}
    <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium tracking-tight text-gray-900 leading-snug mb-4 sm:mb-6 w-full max-w-3xl">      
      The intelligent platform to read, {" "}
      <span className="relative inline-block px-1.5 bg-[#d1e7d8] rounded text-gray-900 shadow-sm border border-green-200/50 mx-1">
        summarize,
      </span>{" "}
      <br className="hidden md:block" />
      organize, and discover research papers
    </h1>

    {/* Departments Row — Animated Marquee */}
    <CollegeMarquee />

  </div>
</section>

      {/* Problem Statement */}
      <section className="border-y border-gray-200 bg-gray-100 py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Hundreds of research papers. One system.
          </h2>
          <div className="mx-auto w-20 sm:w-30 h-1 bg-[#087830] rounded-full mb-6"></div>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Students, faculty, and researchers at Laguna University deal with
            hundreds of theses, capstones, and studies. Finding the right paper,
            understanding its key findings, and seeing related works shouldn't
            take hours of searching.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 md:py-28 bg-white relative overflow-hidden">

        {/* Centered Header */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center mb-12 sm:mb-16 md:mb-20">
          <span className="text-base sm:text-lg italic text-gray-400 font-medium mb-3 sm:mb-4 block">About</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
            Built by Researchers.<br />
            For Researchers.
          </h2>
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            DocuLens was born from a simple frustration — spending hours digging through 
            stacks of theses just to find one relevant study. We built the tool we wished we had.
          </p>
        </div>

        

        {/* Open Letter — Two Column Split */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 sm:gap-12 lg:gap-20 items-start">
          {/* Left — Bold Statement */}
          <div>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-9 h-9 bg-[#1c402e] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">LU</span>
              </div>
              <span className="text-sm italic text-gray-400 font-medium">Laguna University</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-2">
              For Every Student,{" "}
              <span className="text-gray-400 font-medium">
                Every Faculty Member,<br className="hidden sm:block" />
                Every Researcher at LU.
              </span>
            </h3>
          </div>

          {/* Right — Narrative Paragraphs */}
          <div className="space-y-5 sm:space-y-6 text-sm sm:text-[15px] text-gray-600 leading-relaxed">
            <p>
              As students and researchers at Laguna University, we know what it&apos;s like 
              to spend entire weekends scrolling through unorganized folders of theses and 
              capstones — desperately searching for the right study, the right data, the 
              right conclusion.
            </p>
            <p>
              But here&apos;s the thing: the knowledge already exists. Hundreds of brilliant 
              research papers sit in university archives, waiting to be discovered. The 
              problem was never the research — it was the access.
            </p>
            <p>
              That&apos;s exactly why we built DocuLens. An AI-powered platform that reads, 
              summarizes, categorizes, and connects every research paper in the archive.{" "}
              <span className="text-gray-900 font-semibold">
                So you spend less time searching and more time discovering.
              </span>
            </p>
          </div>
        </div>

      </section>

      <FeatureShowcase />

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-[#087830]/10 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:gap-4 md:flex-row text-center md:text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#333]">Doculens</span>
            </div>
            <p className="text-sm text-[#333]">
              © 2025 Doculens. AI-powered research paper intelligence for Laguna
              University.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
