"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { RAGApiService } from "@/lib/api/rag-api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Loader2, AlertCircle, MessageSquare, FileText, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/theme-context";
import { logThesisInteraction } from "@/server/theses/log-interaction";

type Props = {
  abstract?: string;
  summary?: string;
  thesisId: string;
};

export default function ThesisAbstract({ abstract, summary, thesisId }: Props) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ question: string; answer: string }>
  >([]);
  const { theme } = useTheme();

  const hasAbstract = abstract && abstract.trim().length > 0;
  const hasSummary = summary && summary.trim().length > 0;
  const hasContent = hasAbstract || hasSummary;

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
        thesis_id: thesisId,
        question: currentQuestion,
      });

      setAnswer(result.answer);

      // Add to conversation history
      setConversationHistory((prev) => [
        ...prev,
        { question: currentQuestion, answer: result.answer },
      ]);

      // Log the interaction (fire-and-forget — don't block UI)
      logThesisInteraction(thesisId, currentQuestion).catch((err) =>
        console.error("Failed to log interaction:", err)
      );
    } catch (err) {
      console.error("Thesis Q&A error:", err);
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
    <Card className="rounded-xl border-gray-200 p-0 gap-0">
      <CardContent className="p-4 sm:p-5">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">Thesis Overview</h3>
        <p className="text-sm text-slate-500 mb-2 sm:mb-4">
          {hasContent
            ? "Abstract and summary of the research."
            : "Ask questions to learn more about this thesis."}
        </p>

      {/* Tabs for Abstract and AI Summary */}
      {hasContent && (
        <Tabs defaultValue={hasAbstract ? "abstract" : "summary"} className="mb-4">
          <TabsList className="w-full">
            {hasAbstract && (
              <TabsTrigger value="abstract" className="flex-1 gap-2">
                <FileText className="h-4 w-4" />
                Abstract
              </TabsTrigger>
            )}
            {hasSummary && (
              <TabsTrigger value="summary" className="flex-1 gap-2">
                <Sparkles className="h-4 w-4" />
                AI Summary
              </TabsTrigger>
            )}
          </TabsList>

          {/* Abstract Tab Content */}
          {hasAbstract && (
            <TabsContent value="abstract" className="mt-4">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-5">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap text-justify hyphens-auto">
                  {abstract}
                </p>
              </div>
            </TabsContent>
          )}

          {/* AI Summary Tab Content */}
          {hasSummary && (
            <TabsContent value="summary" className="mt-4">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-5">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap text-justify hyphens-auto">
                  {summary}
                </p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      )}

      {/* Q&A Section */}
      <div className={hasAbstract || hasSummary ? "mt-6 border-t pt-6" : ""}>
        <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Ask Questions About This Thesis
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
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-700 font-semibold text-xs">
                        AI
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-700">
                      Answer:
                    </span>
                  </div>
                  <div className="prose prose-sm max-w-none text-slate-700 prose-p:text-justify prose-p:leading-relaxed prose-li:text-justify">
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
          <div className="mb-4 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-700 font-semibold text-xs">AI</span>
              </div>
              <span className="text-sm font-semibold text-slate-700">
                Answer:
              </span>
            </div>
            <div className="prose prose-sm max-w-none text-slate-700 prose-p:text-justify prose-p:leading-relaxed prose-li:text-justify">
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
        <div className="flex flex-col sm:flex-row gap-2">
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
            placeholder="e.g., What methodology was used?"
            className="flex-1 w-full bg-slate-50 border border-slate-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 disabled:bg-slate-100 disabled:cursor-not-allowed text-sm transition-colors"
            style={{ 
              '--tw-ring-color': theme.primary,
              borderColor: question ? theme.primary : undefined 
            } as React.CSSProperties}
          />
          <button
            onClick={handleAskQuestion}
            disabled={isLoading || !question.trim()}
            className={`w-full sm:w-auto justify-center ${theme.primaryBgClass} text-white font-semibold py-2 px-6 rounded-lg ${theme.primaryHoverBgClass} transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2`}
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
            Ask specific questions about this thesis to get AI-powered answers
            based on its content.
          </p>
        )}
      </div>
      </CardContent>
    </Card>
  );
}
