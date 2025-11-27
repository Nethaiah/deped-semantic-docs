import Link from "next/link";
import {
  FileText,
  Search,
  Sparkles,
  ArrowRight,
  BookOpen,
  Layers,
  Network,
} from "lucide-react";
import Header from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/dashboard");
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Asymmetric Layout */}
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 py-20">
            <div className="inline-flex items-center rounded-full text-sm text-blue-500">
              AI-Powered Document Intelligence
            </div>
            <h1 className="text-[2.5em] font-bold leading-tight text-[#333] mb-6">
              Stop drowning in paperwork.
              <span className="text-[#278fb6]"> Start understanding it.</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Doculens uses Transformer-based Models to automatically read,
              summarize, and organize your official orders and memoranda so you
              can find what matters in seconds, not hours.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="group flex items-center gap-2 rounded-full bg-[#278fb6] px-7 py-3.5 text-base font-semibold text-white hover:bg-[#278fb6]/80 transition"
              >
                Get started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#demo"
                className="flex items-center gap-2 rounded-full border-2 border-gray-300 px-7 py-3.5 text-base font-semibold text-gray-700 hover:border-gray-400 transition"
              >
                Watch demo
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-indigo-100 via-purple-50 to-pink-50 opacity-75 blur-2xl"></div>
              <div className="relative space-y-4">
                <div className=" relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      Memo #2024-156
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Implementation of new attendance monitoring system across
                    all departments effective March 1, 2025...
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                      HR Policy
                    </span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      High Priority
                    </span>
                  </div>
                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#278fb6]/20 to-transparent rounded-bl-full"></div>
                </div>
                <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      Order #2024-089
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Budget allocation guidelines for fiscal year 2025-2026 with
                    revised procurement procedures...
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
                      Finance
                    </span>
                  </div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#278fb6]/20 to-transparent rounded-bl-full"></div>
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
            Hundreds of documents. One system.
          </h2>
          <div className="mx-auto w-30 h-1 bg-[#278fb6] rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 leading-relaxed">
            Government agencies and institutions deal with hundreds of official
            orders annually. Finding the right memo, understanding what it says,
            and tracking related directives shouldn't be a full-time job.
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
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700">
                <BookOpen className="h-4 w-4" />
                Instant Summaries
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Read 50 pages in 30 seconds
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Our Transformer model extracts the core message from any
                official document and generates a clean, readable summary. No
                more skimming through dense legal language trying to find what
                matters.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#278fb6]">✓</span>
                  <span>Captures key directives and action items</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#278fb6]">✓</span>
                  <span>Preserves important dates and deadlines</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#278fb6]">✓</span>
                  <span>References related policies automatically</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
              <div className="space-y-4">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <div className="text-xs font-semibold text-gray-500 mb-2">
                    ORIGINAL DOCUMENT
                  </div>
                  <div className="h-24 rounded bg-gray-100"></div>
                  <div className="mt-2 text-xs text-gray-400">
                    2,847 words • 8 pages
                  </div>
                </div>
                <div className="flex justify-center">
                  <ArrowRight className="h-6 w-6 text-[#278fb6]" />
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border-2 border-indigo-200">
                  <div className="text-xs font-semibold text-[#278fb6] mb-2">
                    AI SUMMARY
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    All departments must implement new security protocols by
                    March 15. Training sessions scheduled for dept. heads Feb
                    28-29.
                  </p>
                  <div className="mt-2 text-xs text-gray-400">
                    89 words • 30 sec read
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Split */}
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="order-2 lg:order-1 rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <Search className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    budget guidelines procurement
                  </span>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border-l-4 border-purple-600">
                  <div className="text-xs font-semibold text-purple-600 mb-1">
                    HIGHLY RELEVANT
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    Order #2024-089: Budget Allocation Guidelines
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border-l-4 border-purple-300">
                  <div className="text-xs font-semibold text-purple-400 mb-1">
                    RELATED
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    Memo #2023-234: Procurement Procedures Update
                  </div>
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm border-l-4 border-purple-200">
                  <div className="text-xs font-semibold text-purple-300 mb-1">
                    RELATED
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    Order #2023-156: Financial Reporting Standards
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-purple-100 px-3 py-1.5 text-sm font-semibold text-purple-700">
                <Search className="h-4 w-4" />
                Smart Search
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Find documents by meaning, not keywords
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Transformer-based semantic search understands what you're
                actually looking for. Ask in plain language and get relevant
                documents ranked by how related they are to your query.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#278fb6]">✓</span>
                  <span>Understands context and relationships</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#278fb6]">✓</span>
                  <span>Surfaces related orders and amendments</span>
                </li>
                <li className="flex gap-3 text-gray-700">
                  <span className="text-[#278fb6]">✓</span>
                  <span>Works with natural language queries</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 3 - Cards */}
          <div>
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                <Layers className="h-4 w-4" />
                Auto-Organization
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Never manually tag a document again
              </h3>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                The system automatically categorizes every document, maintains
                relationships, and keeps everything organized without any manual
                work.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1 */}
              <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/40 to-transparent rounded-bl-full"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Smart Categories
                  </h4>
                  <p className="text-sm text-gray-600">
                    Automatically assigns documents to HR, Finance, Operations,
                    or custom categories
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#278fb6] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>

              {/* Card 2 */}
              <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-200/40 to-transparent rounded-bl-full"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Link Detection
                  </h4>
                  <p className="text-sm text-gray-600">
                    Identifies amendments, supersessions, and related directives
                    across your database
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>

              {/* Card 3 */}
              <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:shadow-lg transition-all duration-300">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200/40 to-transparent rounded-bl-full"></div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-amber-100 text-amber-600">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Instant Processing
                  </h4>
                  <p className="text-sm text-gray-600">
                    Get organized results from the latest memos in seconds, not
                    days
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof
      <section className="border-y border-gray-200 bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Built for the real world
            </h2>
            <p className="text-gray-600">
              Designed specifically for Philippine government agencies and
              institutions
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-4 text-4xl font-bold text-indigo-600">
                DepEd Offices
              </div>
              <p className="text-gray-700 leading-relaxed">
                Process division orders, school memoranda, and regional
                directives. Perfect for superintendents, principals, and
                administrative staff managing multiple schools.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-4 text-4xl font-bold text-purple-600">
                Universities
              </div>
              <p className="text-gray-700 leading-relaxed">
                Organize institutional policies, academic orders, and
                administrative circulars. Built for registrars, deans, and
                university administrators handling complex documentation.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-[#278fb6]/10 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#333]">Doculens</span>
            </div>
            <p className="text-sm text-[#333]">
              © 2025 Doculens. GNN-powered document intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
