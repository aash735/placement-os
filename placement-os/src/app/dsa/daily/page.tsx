"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { QuestionCard } from "@/components/dsa/question-card";
import { GlassCard } from "@/components/ui/glass-card";
import { useDSAStats } from "@/hooks/use-dsa";
import { useProgressStore } from "@/lib/progress-store";
import { format } from "date-fns";
import { Zap, Trophy, ArrowRight, Calendar } from "lucide-react";

export default function DailyChallengePage() {
  const { dailyChallenge, dueRevisions, weakTopics } = useDSAStats();
  const completedToday = useProgressStore((s) => s.completedToday);
  const completeQuest = useProgressStore((s) => s.completeQuest);
  const questId = `daily-${format(new Date(), "yyyy-MM-dd")}`;
  const done = completedToday.includes(questId);

  return (
    <AppShell
      title="Daily Challenge"
      subtitle={format(new Date(), "EEEE, MMMM d, yyyy")}
    >
      <PageHeader
        title="Daily Challenge"
        description={format(new Date(), "EEEE, MMMM d")}
      />

      {/* Quest complete toggle */}
      <GlassCard className="mb-6" hover={false}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-semibold text-zinc-300">Today&apos;s Quest</span>
          </div>
          {!done ? (
            <button
              type="button"
              className="btn-primary text-xs gap-1.5"
              onClick={() => completeQuest(questId)}
            >
              <Trophy className="h-3.5 w-3.5" /> Mark Daily Complete
            </button>
          ) : (
            <p className="text-emerald-400 text-sm font-semibold flex items-center gap-1.5">
              ✓ Daily logged — great work!
            </p>
          )}
        </div>
      </GlassCard>
 
      {/* Today's question */}
      {dailyChallenge ? (
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
              Today&apos;s Question
            </h2>
          </div>
          <QuestionCard question={dailyChallenge} />
        </div>
      ) : (
        <GlassCard hover={false} className="mb-8 py-12 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">Loading challenge from your sheets…</p>
        </GlassCard>
      )}

      {/* Due Revisions */}
      {dueRevisions.length > 0 && (
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
              Revision Due ({dueRevisions.length})
            </h2>
            <Link href="/revision" className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
              All revisions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {dueRevisions.slice(0, 3).map(({ question }) => (
              <QuestionCard key={question.id} question={question} compact />
            ))}
            {dueRevisions.length > 3 && (
              <Link href="/revision" className="block text-center text-xs text-amber-400 hover:text-amber-300 py-2">
                +{dueRevisions.length - 3} more revisions due →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Weak Topic Recommendations */}
      {weakTopics.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-rose-300 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400 inline-block" />
            Focus Areas
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {weakTopics.slice(0, 4).map((w) => (
              <Link key={w.topicId} href={`/dsa/topic/${w.topicId}`}>
                <GlassCard hover className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{w.name}</h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{w.reason}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-rose-400 font-bold text-sm">{w.score}</span>
                      <span className="block text-[9px] text-zinc-600">weakness</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-cyan-400 flex items-center gap-1">
                    Practice now <ArrowRight className="h-3 w-3" />
                  </p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <Link href="/dsa/practice" className="btn-primary text-sm">
          All Questions →
        </Link>
        <Link href="/dsa/roadmap" className="btn-ghost text-sm">
          Full Roadmap →
        </Link>
      </div>
    </AppShell>
  );
}
