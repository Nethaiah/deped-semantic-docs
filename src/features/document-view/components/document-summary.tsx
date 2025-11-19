"use client";

import { useState } from "react";
import { RAGApiService } from "@/lib/api/rag-api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, AlertCircle, MessageSquare } from "lucide-react";

type Props = {
  summary?: string;
  documentId: string;
};

export default function DocumentAnalysis({ summary, documentId }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ question: string; answer: string }>
  >([]);

  const hasSummary = summary && summary.trim().length > 0;

  const handleGenerateSummary = async () => {
    console.log("Generate summary for document:", documentId);
    // This could be connected to a backend endpoint in the future
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      setError("Please enter a question");
      return;
    }

    setIsLoading(true);
    setError(null);

    const currentQuestion = question;
    setQuestion(""); // Clear input immediately

    try {
      const result = await RAGApiService.documentQA({
        doc_id: documentId,
        question: currentQuestion,
      });

      setAnswer(result.answer);

      // Add to conversation history
      setConversationHistory((prev) => [
        ...prev,
        { question: currentQuestion, answer: result.answer },
      ]);
    } catch (err) {
      console.error("Document Q&A error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get answer. Please ensure the backend is running."
      );
      setQuestion(currentQuestion); // Restore question on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <h3 className="text-2xl font-bold text-slate-800">Document Analysis</h3>
      <p className="text-sm text-slate-500 mb-4">
        {hasSummary
          ? "Summary of the document content."
          : "Ask questions to understand the document better."}
      </p>

      {/* Document Summary */}
      {hasSummary && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-slate-800 mb-2">Summary</h4>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
        </div>
      )}

      {/* Q&A Section */}
      <div className={hasSummary ? "mt-6 border-t pt-6" : ""}>
        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Ask Questions About This Document
        </h4>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="mb-4 space-y-4 max-h-96 overflow-y-auto">
            {conversationHistory.map((item, idx) => (
              <div key={idx} className="space-y-2">
                {/* User Question */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Q: {item.question}
                  </p>
                </div>
                {/* AI Answer */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-semibold text-xs">
                        AI
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      Answer:
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none text-slate-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {item.answer}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Current Answer (Latest) */}
        {answer && conversationHistory.length === 0 && (
          <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-semibold text-xs">AI</span>
              </div>
              <span className="text-sm font-semibold text-slate-700">
                Answer:
              </span>
            </div>
            <div className="prose prose-sm max-w-none text-slate-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {answer}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-4 bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-sm text-slate-600">
              Getting answer from AI...
            </span>
          </div>
        )}

        {/* Question Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleAskQuestion();
              }
            }}
            disabled={isLoading}
            placeholder="e.g., What are the key requirements? When does this take effect?"
            className="flex-1 bg-slate-50 border border-slate-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed text-sm"
          />
          <button
            onClick={handleAskQuestion}
            disabled={isLoading || !question.trim()}
            className="bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Asking...
              </>
            ) : (
              "Ask"
            )}
          </button>
        </div>

        {/* Helper Text */}
        {conversationHistory.length === 0 && !answer && !isLoading && (
          <p className="mt-3 text-xs text-slate-500">
            Ask specific questions about this document to get AI-powered answers
            based on its content.
          </p>
        )}
      </div>
    </div>
  );
}
