"use client";

import { useState } from "react";

type Props = {
  summary?: string;
  documentId: string;
};

export default function DocumentAnalysis({ summary, documentId }: Props) {
  const [question, setQuestion] = useState("");
  const hasSummary = summary && summary.trim().length > 0;

  const handleGenerateSummary = async () => {
    console.log("Generate summary for document:", documentId);
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    console.log("Ask question:", question, "for document:", documentId);
    setQuestion("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800">
        Document Analysis
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        {hasSummary 
          ? "Summary of the document content." 
          : "Generate summary or ask questions about the content."}
      </p>

      {hasSummary ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-slate-800 mb-2">Summary</h4>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      ) : (
        <div className="mb-4">
          <button 
            onClick={handleGenerateSummary}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-all duration-200"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Generate Summary
          </button>
        </div>
      )}

      <div className="mt-6 border-t pt-6">
        <h4 className="font-bold text-slate-800 mb-3">
          Ask a question about the document
        </h4>
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
            placeholder="e.g., When does the school year end?"
            className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button 
            onClick={handleAskQuestion}
            className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}