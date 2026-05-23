"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { QuestionCard } from "@/components/dsa/question-card";
import { GlassCard } from "@/components/ui/glass-card";
import { useDSAStats } from "@/hooks/use-dsa";
import { useProgressStore } from "@/lib/progress-store";
import { CheckCircle2, BookOpen, Calendar } from "lucide-react";

export default function RevisionPage() {
  const { dueRevisions } = useDSAStats();
  const markRevised = useProgressStore((s) => s.markRevised);

  return (
    <AppShell
      title="Revision Queue"
      subtitle={`${dueRevisions.length} questions due for review`}
    >
      <PageHeader
        title="Spaced Repetition Queue"
        description={`${dueRevisions.length} question${dueRevisions.length !== 1 ? "s" : ""} need revision based on your solve history`}
      />

      {dueRevisions.length === 0 ? (
        <GlassCard hover={false} className="py-16 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-300 text-lg">All clear!</h3>
          <p className="text-zinc-500 text-sm mt-2 max-w-sm mx-auto">
            No revisions due right now. Keep solving and your revision queue will populate automatically.
          </p>
          <div className="flex gap-2 justify-center mt-4">
            <Link href="/dsa/practice" className="btn-primary text-sm">
              Practice Questions →
            </Link>
            <Link href="/dsa/roadmap" className="btn-ghost text-sm">
              View Roadmap
            </Link>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-amber-400" />
            <p className="text-sm text-zinc-400">
              These questions were solved earlier and are due for spaced repetition review.
            </p>
          </div>

          {dueRevisions.map(({ question, progress }) => (
            <div key={question.id}>
              <QuestionCard question={question} />
              <div className="flex items-center gap-3 mt-2 ml-1">
                <button
                  type="button"
                  className="btn-primary text-xs py-1.5 px-4"
                  onClick={() => markRevised(question.id)}
                >
                  ✓ Mark Revised
                </button>
                {progress.nextRevisionAt && (
                  <span className="text-[10px] text-zinc-500">
                    Was due: {new Date(progress.nextRevisionAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-white/5">
            <Link href="/dsa/practice" className="btn-ghost text-sm flex items-center gap-1.5 w-fit">
              <BookOpen className="h-4 w-4" /> Go to Question Bank
            </Link>
          </div>
        </div>
      )}
    </AppShell>
  );
}
