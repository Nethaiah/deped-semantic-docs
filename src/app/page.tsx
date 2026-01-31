import React from "react";
import {
  FileText,
  Search,
  ArrowRight,
  BookOpen,
  Sparkles,
  GitGraph,
  Library,
  GraduationCap,
  Layers,
  Link,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Asymmetric Layout */}
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 py-10 lg:py-20">
            <div className="group flex items-center gap-2 text-sm text-[#087830]/70">
              <span className="h-1.5 w-3 rounded-full bg-[#087830]" />
              <span>Laguna University Research Archives</span>
            </div>

            <h1 className="text-5xl font-bold leading-tight text-[#333] mb-6">
              AI-assisted research intelligence
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8 w-[75%]">
              Doculens uses advanced AI to automatically read, summarize, and
              organize <span className="text-[#087830]">Laguna University</span>{" "}
              research papers, theses, and capstone projects so you can find and
              understand them faster.
            </p>
            <div className="flex justify-center lg:justify-start gap-2 lg:gap-4">
              <button className="group flex items-center gap-2 rounded-full bg-[#087830] px-4 lg:px-7 py-2 lg:py-3.5 text-sm lg:text-base font-semibold text-white hover:bg-[#065a24] transition">
                Get started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-2 rounded-full border-2 border-gray-300 px-4 lg:px-7 py-2 lg:py-3.5 text-base font-semibold text-gray-700 hover:border-gray-400 transition">
                Watch demo
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-emerald-100 via-green-50 to-teal-50 opacity-75 blur-2xl"></div>
              <div className="relative space-y-4">
                <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#087830]" />
                    <span className="text-sm font-semibold text-gray-900">
                      Thesis 2024-025
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Solid Waste Management Practices and Awareness Among Laguna
                    University Students...
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      Environmental Science
                    </span>
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                      Undergraduate
                    </span>
                  </div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#087830]/20 to-transparent rounded-bl-full"></div>
                </div>
                <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      Capstone 2025-012
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Development of a Mobile-Based Attendance System for Laguna
                    University Faculty...
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-full bg-teal-100 px-2.5 py-1 text-xs font-medium text-teal-700">
                      Computer Science
                    </span>
                  </div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#087830]/20 to-transparent rounded-bl-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="border-y border-gray-200 bg-gray-100 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hundreds of research papers. One system.
          </h2>
          <div className="mx-auto w-30 h-1 bg-[#087830] rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 leading-relaxed">
            Students, faculty, and researchers at Laguna University deal with
            hundreds of theses, capstones, and studies. Finding the right paper,
            understanding its key findings, and seeing related works shouldn't
            take hours of searching.
          </p>
        </div>
      </section>

      {/* Features - Magazine Style Layout */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Everything you need, nothing you don't
          </h2>
          <p className="text-lg text-gray-600">
            Intelligent features that actually save you time
          </p>
        </div>

        <div className="space-y-24">
          {/* Feature 1 - Large */}
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                <BookOpen className="h-4 w-4" />
                Instant Summaries
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Read 50 pages in 30 seconds
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Our AI quickly reads any research paper or thesis and creates a
                clear, concise summary. No more scanning long documents to find
                the main findings, methodology, or conclusions.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#087830]">✓</span>
                  <span>Captures objectives, results, and recommendations</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#087830]">✓</span>
                  <span>Highlights key dates, variables, and sample size</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#087830]">✓</span>
                  <span>Notes related studies and references</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-green-50 p-8">
              <div className="space-y-4">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold text-gray-500 mb-2">
                    ORIGINAL PAPER
                  </div>
                  <div className="h-24 rounded bg-gray-100"></div>
                  <div className="mt-2 text-xs text-gray-400">
                    4,200 words • 45 pages
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-[#087830]" />
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border-2 border-emerald-200">
                  <div className="text-xs font-semibold text-[#087830] mb-2">
                    AI SUMMARY
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Study surveyed 300 students on waste management awareness.
                    Results show moderate knowledge but low practice. Recommends
                    university-wide campaign and recycling facilities.
                  </p>
                  <div className="mt-2 text-xs text-gray-400">
                    68 words • 25 sec read
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Split */}
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1 rounded-2xl border border-gray-200 bg-gradient-to-br from-teal-50 to-emerald-50 p-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <Search className="h-5 w-5 text-[#087830]" />
                  <span className="text-sm font-medium text-gray-700">
                    student attendance mobile system
                  </span>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border-l-4 border-[#087830]">
                  <div className="text-xs font-semibold text-[#087830] mb-1">
                    HIGHLY RELEVANT
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    Capstone 2025-012: Mobile Attendance System
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border-l-4 border-emerald-400">
                  <div className="text-xs font-semibold text-emerald-600 mb-1">
                    RELATED
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    Thesis 2023-089: RFID-Based Attendance Monitoring
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border-l-4 border-teal-300">
                  <div className="text-xs font-semibold text-teal-500 mb-1">
                    RELATED
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    Feasibility Study 2024-045: Biometric Systems
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-teal-100 px-3 py-1.5 text-sm font-semibold text-teal-700">
                <Search className="h-4 w-4" />
                Smart Search
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Find papers by meaning, not just keywords
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Ask questions in plain language — the AI understands what you
                mean and finds the most relevant theses, capstones, and studies,
                ranked by how closely they match.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#087830]">✓</span>
                  <span>Understands context and research topics</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#087830]">✓</span>
                  <span>Shows related studies and follow-up works</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#087830]">✓</span>
                  <span>Works with natural questions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Platform Features Cards */}
          <section className="py-24 overflow-hidden relative">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-100/40 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="mx-auto max-w-7xl px-6 relative z-10">
              <div className="mb-20 text-center lg:text-left">
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Platform Features
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Powerful tools designed to streamline your research workflow.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Card 1: Smart Categories */}
                <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#087830]/30 hover:shadow-xl hover:shadow-[#087830]/5 transition-all duration-500 overflow-hidden">
                  <div className="h-48 mb-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative w-32 h-32 transform group-hover:scale-110 transition-transform duration-500">
                      <div className="absolute top-12 left-0 w-32 h-24 bg-gray-100 border border-gray-200 rounded-lg transform -skew-x-12 translate-x-4"></div>
                      <div className="absolute top-6 left-2 w-32 h-24 bg-gray-50 border border-gray-200 rounded-lg transform -skew-x-12 translate-x-2 backdrop-blur-sm"></div>
                      <div className="absolute top-0 left-4 w-32 h-24 bg-gradient-to-br from-[#087830] to-emerald-800 rounded-lg transform -skew-x-12 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-900/10">
                        <Layers className="text-white/90 w-8 h-8 transform skew-x-12" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Smart Categories
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Automatically sorts papers into Education, Business,
                    Engineering, Environmental, or custom topics.
                  </p>
                </div>

                {/* Card 2: Link Detection */}
                <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#087830]/30 hover:shadow-xl hover:shadow-[#087830]/5 transition-all duration-500 overflow-hidden">
                  <div className="h-48 mb-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative w-32 h-32 transform rotate-12 scale-90 group-hover:scale-100 transition-transform duration-500">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 to-[#087830] -translate-y-1/2 transform -rotate-45"></div>
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center transform rotate-12">
                        <div className="w-8 h-2 bg-gray-200 rounded"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-[#087830] shadow-lg shadow-emerald-500/20 rounded-xl flex items-center justify-center transform -rotate-12 z-10">
                        <Link className="text-white w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Link Detection
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Finds related studies, follow-up research, and papers that
                    cite or build on each other.
                  </p>
                </div>

                {/* Card 3: Instant Processing */}
                <div className="group relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#087830]/30 hover:shadow-xl hover:shadow-[#087830]/5 transition-all duration-500 overflow-hidden">
                  <div className="h-48 mb-8 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative w-full h-24 flex items-center justify-center">
                      <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent top-2"></div>
                      <div className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-200 to-transparent bottom-2"></div>
                      <div className="flex gap-3 transform -skew-x-12 group-hover:translate-x-6 transition-transform duration-700 ease-out">
                        <div className="w-1.5 h-12 bg-[#087830]/10 rounded-full mt-2"></div>
                        <div className="w-1.5 h-12 bg-[#087830]/30 rounded-full mt-2"></div>
                        <div className="w-24 h-16 bg-gradient-to-br from-[#087830] to-emerald-700 rounded-lg shadow-lg flex items-center justify-center">
                          <Zap className="text-white w-6 h-6 fill-current" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Instant Processing
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get summaries and organized results from new theses and
                    capstones in seconds, not days.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-[#087830]/10 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
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
