"use client";

import React, { useState } from "react";
import { Layers, Link as LinkIcon, FileText, Search, ArrowRight } from "lucide-react";

export default function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      title: "Smart Categories",
      icon: Layers,
      description: "Automatically index and categorize massive archives into Business, IT, Education, and custom domains securely without needing tagging.",
      diagram: (
        <>
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] w-full sm:w-[170px] shrink-0 sm:transform sm:-translate-y-6 sm:mr-3">
            <h4 className="font-bold text-gray-900 mb-4 text-[15px]">Raw Dump</h4>
            <div className="space-y-3">
              <div className="text-xs font-medium text-gray-600 pb-2 border-b border-gray-100 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-300"></div> PDF 1042.pdf</div>
              <div className="text-xs font-medium text-gray-600 pb-2 border-b border-gray-100 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Thesis_Final.pdf</div>
              <div className="text-xs font-medium text-gray-600 pb-1 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-300"></div> Unnamed.pdf</div>
            </div>
          </div>
          <div className="hidden sm:flex text-[#C4BDB1] shrink-0 items-center justify-center w-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] w-full sm:w-[240px] shrink-0 sm:ml-3">
            <h4 className="font-bold text-gray-900 mb-4 text-[15px]">Smart Archives</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-gray-800 pb-2 border-b border-gray-100">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Computer Science</span>
                <span className="text-gray-400">142</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-gray-800 pb-2 border-b border-gray-100">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500"></div> Business Admin</span>
                <span className="text-gray-400">89</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-gray-800 pb-1">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Engineering</span>
                <span className="text-gray-400">54</span>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 1,
      title: "Link Detection",
      icon: LinkIcon,
      description: "Graph traversal reveals related works automatically. Instantly jump to cited prerequisites or connected domain theses.",
      diagram: (
        <>
          <div className="bg-white rounded-2xl flex flex-col p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] w-full sm:w-[220px] shrink-0">
            <h4 className="font-bold text-gray-900 mb-2 text-[15px]">Thesis 2024</h4>
            <span className="text-xs text-gray-500 mb-4 font-medium">Biometric Systems</span>
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg flex items-center justify-between">
              <span className="text-xs font-medium text-gray-800">References</span>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">14 Found</span>
            </div>
          </div>
          <div className="hidden sm:flex text-[#C4BDB1] shrink-0 items-center justify-center w-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
          <div className="bg-white rounded-2xl flex flex-col p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] w-full sm:w-[220px] shrink-0">
            <h4 className="font-bold text-gray-900 mb-2 text-[15px]">Foundational Works</h4>
            <div className="space-y-2 mt-2">
              <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-lg">
                <div className="text-[11px] font-bold text-gray-800 line-clamp-1">RFID Student Tracking</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Author: J. Doe (2021)</div>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-lg">
                <div className="text-[11px] font-bold text-gray-800 line-clamp-1">Machine Vision Basics</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Author: K. Smith (2019)</div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 2,
      title: "Auto-generated summaries",
      icon: FileText,
      description: "Instantly condense 50-page theses into concise summaries. Our AI captures key objectives and conclusions safely online.",
      diagram: (
        <>
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] w-full sm:w-[170px] shrink-0 sm:transform sm:-translate-y-6 sm:mr-3">
            <h4 className="font-bold text-gray-900 mb-4 text-[15px]">Original Paper</h4>
            <div className="space-y-3">
              <div className="text-xs font-medium text-gray-600 pb-2 border-b border-gray-100">Length: 45 pages</div>
              <div className="text-xs font-medium text-gray-600 pb-2 border-b border-gray-100">Words: 4,200</div>
              <div className="text-xs font-medium text-gray-600 pb-1">Type: Thesis</div>
            </div>
          </div>
          <div className="hidden sm:flex text-[#C4BDB1] shrink-0 items-center justify-center w-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] w-full sm:w-[240px] shrink-0 sm:ml-3">
            <h4 className="font-bold text-gray-900 mb-4 text-[15px]">AI Summary</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-medium text-gray-800 pb-2 border-b border-gray-100">
                <span>Core Objectives</span>
                <div className="w-[18px] h-[18px] rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px]">✓</div>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-gray-800 pb-2 border-b border-gray-100">
                <span>Methodology</span>
                <div className="w-[18px] h-[18px] rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px]">✓</div>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-gray-800 pb-1">
                <span>Conclusions</span>
                <div className="w-[18px] h-[18px] rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px]">✓</div>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: 3,
      title: "Semantic Smart Search",
      icon: Search,
      description: "Stop relying on rigid keywords. Input pure queries in plain English and retrieve meaning-matched abstracts.",
      diagram: (
        <>
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] w-full sm:w-[200px] shrink-0 sm:mr-2">
            <h4 className="font-bold text-gray-900 mb-4 text-[15px]">Plain English</h4>
            <div className="bg-gray-50 border border-gray-200 text-xs text-gray-600 rounded-lg p-3 font-medium italic">
              "Find papers about tracking students using RFID cards"
            </div>
          </div>
          <div className="hidden sm:flex text-[#C4BDB1] shrink-0 items-center justify-center w-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] w-full sm:w-[220px] shrink-0 sm:ml-2">
            <h4 className="font-bold text-[#087830] mb-4 text-[15px]">Matched Matches</h4>
            <div className="space-y-2">
              <div className="border-l-4 border-[#087830] pl-3 py-1">
                <div className="text-[11px] font-bold text-gray-900">Mobile Attendance System</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Capstone 2025</div>
              </div>
              <div className="border-l-4 border-green-300 pl-3 py-1">
                <div className="text-[11px] font-bold text-gray-900">Biometric Interfacing</div>
                <div className="text-[10px] text-gray-500 mt-0.5">Thesis 2024</div>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 md:py-28 mb-6 sm:mb-10 border-t border-gray-100">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-bold text-green-800 uppercase tracking-widest mb-4 sm:mb-6">
            DocuLens Features
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-medium tracking-tight text-gray-900 mb-3 sm:mb-4 leading-tight md:leading-none">
            Read, summarize, and<br className="hidden md:block" /> organize in seconds
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 font-medium tracking-tight mt-4 sm:mt-6">
            High-converting research discovery, no reading required.
          </p>
        </div>
        <div className="mt-0 md:mt-20">
          <button className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors shadow-sm">
            Explore features
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 sm:gap-12 lg:gap-24 items-stretch">
        {/* Left: Diagram Mockup Area */}
        <div className="bg-[#f2f7f4] rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 md:p-12 min-h-[300px] sm:min-h-[400px] md:min-h-[450px] flex items-center justify-center relative overflow-hidden transition-all duration-500">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-2 w-full max-w-lg items-center justify-center relative z-10 transition-all duration-300">
            {features[activeFeature].diagram}
          </div>
        </div>

        {/* Right: Feature List */}
        <div className="flex flex-col gap-1 justify-center py-2 relative">
          {features.map((feature, idx) => {
            const isActive = activeFeature === idx;
            const IconComponent = feature.icon;

            return (
              <div 
                key={feature.id} 
                onClick={() => setActiveFeature(idx)}
                className={`flex flex-col gap-2 px-6 py-5 cursor-pointer transition-all duration-300 ${
                  isActive 
                  ? "bg-[#f2f7f4] rounded-[1.25rem] text-gray-900 my-2" 
                  : "text-gray-800 hover:bg-gray-50 rounded-[1.25rem]"
                }`}
              >
                <div className="flex items-center gap-4">
                  <IconComponent 
                    className={`w-[22px] h-[22px] shrink-0 ${isActive ? "opacity-100 text-[#087830]" : "opacity-80"}`} 
                    strokeWidth={isActive ? 2 : 1.5} 
                  />
                  <span className={`text-[17px] tracking-tight ${isActive ? "font-semibold" : "font-medium"}`}>
                    {feature.title}
                  </span>
                </div>
                {isActive && (
                  <p className="text-[14px] font-medium text-gray-600 leading-relaxed pl-10 pr-2 mt-1 animate-in slide-in-from-top-1 fade-in duration-300">
                    {feature.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
