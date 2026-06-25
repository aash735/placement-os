"use client";

import { use } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusSelector } from "@/components/dsa/status-selector";
import { useDataStore } from "@/store/data-store";
import { useProgressStore } from "@/lib/progress-store";
import type { QuestionStatus } from "@/types";

export default function QuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const getQuestionById = useDataStore((s) => s.getQuestionById);
  const topics = useDataStore((s) => s.topics);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);
  const bookmarks = useProgressStore((s) => s.bookmarks ?? []);
  const question = getQuestionById(id);
  const progress = useProgressStore((s) => s.questionProgress[id]);
  const setStatus = useProgressStore((s) => s.setQuestionStatus);
  const setNotes = useProgressStore((s) => s.setQuestionNotes);
  const status = progress?.status ?? "not_started";
  const topic = topics.find((t) => t.id === question?.topicId);
  const isBookmarked = bookmarks.includes(id);

  const loading = useDataStore((s) => s.loading);
  const lastFetched = useDataStore((s) => s.lastFetched);

  if (!question) {
    if (loading || !lastFetched) {
      return (
        <AppShell title="Loading Question...">
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          </div>
        </AppShell>
      );
    }
    return (
      <AppShell title="Question not found">
        <Link href="/dsa/practice" className="text-cyan-400 light:text-cyan-600 font-semibold hover:underline">← Practice</Link>
      </AppShell>
    );
  }

  return (
    <AppShell title={question.title} subtitle={`${topic?.name} · Level ${question.level}`}>
      <Link href={`/dsa/topic/${question.topicId}`} className="mb-4 inline-block text-sm text-cyan-400 light:text-cyan-600 font-semibold hover:underline">← {topic?.name}</Link>

      <GlassCard hover={false}>
        <div className="flex justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{question.difficulty}</span>
            <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300">{question.pattern}</span>
            {question.xpReward && <span className="text-xs text-amber-400">+{question.xpReward} XP</span>}
          </div>
          <button type="button" onClick={() => toggleBookmark(id)} className="text-zinc-400 hover:text-cyan-400">
            <Bookmark className={isBookmarked ? "fill-cyan-400 text-cyan-400" : ""} />
          </button>
        </div>

        <h1 className="mt-4 text-2xl font-bold">{question.title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{question.estimatedMinutes} min · {question.interviewFrequency} frequency</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={question.url} target="_blank" rel="noopener noreferrer" className="btn-primary">Solve on {question.platform}</a>
          {question.explanationUrl && <a href={question.explanationUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">Explanation</a>}
          {question.videoUrl && <a href={question.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">Video</a>}
          {question.neetCodeRef && (
            <a
              href={question.neetCodeRef.startsWith("http") ? question.neetCodeRef : `https://neetcode.io/problems/${question.neetCodeRef}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              NeetCode
            </a>
          )}
          {question.striverRef && (
            <a
              href={question.striverRef.startsWith("http") ? question.striverRef : `https://takeuforward.org/plus/dsa/${question.striverRef}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Striver
            </a>
          )}
        </div>

        <div className="mt-8">
          <StatusSelector value={status} onChange={(s: QuestionStatus) => setStatus(question.id, s, question.estimatedMinutes)} />
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          <h3 className="text-sm font-semibold text-zinc-300">My Notes</h3>
          <textarea
            value={progress?.notes ?? ""}
            onChange={(e) => setNotes(question.id, e.target.value)}
            placeholder="Write hints, approach details, weak concepts, code snippets, or complexity analysis here..."
            className="field-input mt-2 w-full h-32 p-3 placeholder-zinc-500"
          />
        </div>

        {question.tags && question.tags.length > 0 && (
          <p className="mt-4 text-xs text-zinc-500">Tags: {question.tags.join(", ")}</p>
        )}
      </GlassCard>
    </AppShell>
  );
}
