import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquareText } from "lucide-react";
import { getInteractionStats } from "@/server/theses/get-interaction-stats";

type Props = {
  thesisId: string;
};

/**
 * Async server component that displays Q&A engagement stats
 * for a thesis — unique users and total questions asked.
 */
export default async function ThesisEngagement({ thesisId }: Props) {
  const stats = await getInteractionStats(thesisId);

  return (
    <Card className="rounded-xl border-gray-200 p-0 gap-0">
      <CardContent className="p-4 sm:p-5">
        <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Q&A Engagement
        </h4>

        {stats.totalQuestions === 0 ? (
          <p className="text-sm text-slate-400 italic">
            No interactions yet. Be the first to ask a question!
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {/* Unique Users */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1.5">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-700">
                {stats.uniqueUsers}
              </p>
              <p className="text-xs text-blue-500 font-medium mt-0.5">
                {stats.uniqueUsers === 1 ? "User" : "Users"}
              </p>
            </div>

            {/* Total Questions */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center mb-1.5">
                <MessageSquareText className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-700">
                {stats.totalQuestions}
              </p>
              <p className="text-xs text-emerald-500 font-medium mt-0.5">
                {stats.totalQuestions === 1 ? "Question" : "Questions"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
