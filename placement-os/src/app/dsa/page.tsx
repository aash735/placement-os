"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { TopicCard } from "@/components/dsa/topic-card";
import { ProgressHeatmap } from "@/components/dsa/progress-heatmap";
import { GlassCard } from "@/components/ui/glass-card";
import { useDSAStats } from "@/hooks/use-dsa";
import { Zap, Target, BookOpen, FlaskConical } from "lucide-react";

export default function DSATrackerPage() {
  const { solved, total, solvedPercent, dueRevisions, weakTopics, heatmap, topics } = useDSAStats();

  return (
    <AppShell title="DSA Platform" subtitle={`${solved}/${total} solved · ${solvedPercent}% complete`}>
      <PageHeader
        title="DSA Question Bank"
        description={`${solved} solved · ${total} total · ${topics.length} topics · ${dueRevisions.length} revisions due`}
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/dsa/daily" className="btn-primary text-sm gap-1"><Zap className="h-4 w-4" /> Daily</Link>
            <Link href="/dsa/mock" className="btn-ghost text-sm">Mock Tests</Link>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard hover={false}><p className="text-xs text-zinc-500">Solved</p><p className="text-2xl font-bold">{solved}</p></GlassCard>
        <GlassCard hover={false}><p className="text-xs text-zinc-500">Due revisions</p><p className="text-2xl font-bold text-amber-400">{dueRevisions.length}</p></GlassCard>
        <GlassCard hover={false}><p className="text-xs text-zinc-500">Weak areas</p><p className="text-2xl font-bold text-rose-400">{weakTopics.length}</p></GlassCard>
        <GlassCard hover={false}><p className="text-xs text-zinc-500">Topics</p><p className="text-2xl font-bold">{topics.length}</p></GlassCard>
      </div>

      <GlassCard className="mb-6" hover={false}>
        <h3 className="mb-4 font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-cyan-400" /> Topic heatmap</h3>
        <ProgressHeatmap data={heatmap} />
      </GlassCard>

      {weakTopics.length > 0 && (
        <GlassCard className="mb-6 border-rose-500/20" hover={false}>
          <h3 className="font-semibold text-rose-300">Weak area alerts</h3>
          <ul className="mt-2 space-y-1">
            {weakTopics.map((w) => (
              <li key={w.topicId} className="text-sm text-zinc-400">
                <Link href={`/dsa/topic/${w.topicId}`} className="text-rose-300 hover:underline">{w.name}</Link> — {w.reason} (score {w.score})
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      <div className="mb-4 flex gap-2">
        <Link href="/dsa/roadmap" className="btn-ghost text-sm gap-1"><BookOpen className="h-4 w-4" /> Roadmap</Link>
        <Link href="/dsa/practice" className="btn-ghost text-sm gap-1"><FlaskConical className="h-4 w-4" /> All questions</Link>
        <Link href="/revision" className="btn-ghost text-sm">Revision queue ({dueRevisions.length})</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {topics.map((t, i) => (
          <TopicCard
            key={t.id}
            id={t.id}
            name={t.name}
            completion={t.completion}
            mastery={t.mastery}
            levelUnlocked={t.levelUnlocked}
            questionCount={t.questionCount}
            importanceScore={t.importanceScore}
            unlocked={t.unlocked}
            revisionCount={t.revisionCount}
            delay={i * 0.02}
          />
        ))}
      </div>
    </AppShell>
  );
}
