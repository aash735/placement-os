"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { QuestionCard } from "@/components/dsa/question-card";
import { useDSAStats } from "@/hooks/use-dsa";
import { useDataStore } from "@/store/data-store";
import { useProgressStore } from "@/lib/progress-store";
import { tierLabels } from "@/lib/dsa-engine";
import {
  Unlock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Flame,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Layers,
} from "lucide-react";

const TIERS = ["must", "important", "optional"] as const;

export default function DSARoadmapPage() {
  const { topics } = useDSAStats();
  const questions = useDataStore((s) => s.questions);
  const questionProgress = useProgressStore((s) => s.questionProgress);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [expandedPatterns, setExpandedPatterns] = useState<Set<string>>(new Set());

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePattern = (key: string) => {
    setExpandedPatterns((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Group questions by topic and then by pattern
  const topicQuestionsMap = useMemo(() => {
    const map = new Map<string, typeof questions>();
    questions.forEach((q) => {
      if (!map.has(q.topicId)) map.set(q.topicId, []);
      map.get(q.topicId)!.push(q);
    });
    return map;
  }, [questions]);

  const totalQuestions = questions.length;
  const totalSolved = questions.filter((q) =>
    ["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
  ).length;

  return (
    <AppShell
      title="DSA Roadmap"
      subtitle={`${totalSolved}/${totalQuestions} solved across all topics`}
    >
      {/* Header Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <GlassCard hover={false} className="text-center py-3">
          <p className="text-2xl font-extrabold text-cyan-400">{totalQuestions}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Total Questions</p>
        </GlassCard>
        <GlassCard hover={false} className="text-center py-3">
          <p className="text-2xl font-extrabold text-emerald-400">{totalSolved}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Solved</p>
        </GlassCard>
        <GlassCard hover={false} className="text-center py-3">
          <p className="text-2xl font-extrabold text-violet-400">{topics.length}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Topics</p>
        </GlassCard>
        <GlassCard hover={false} className="text-center py-3">
          <p className="text-2xl font-extrabold text-amber-400">
            {totalQuestions > 0 ? Math.round((totalSolved / totalQuestions) * 100) : 0}%
          </p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Progress</p>
        </GlassCard>
      </div>

      {/* Quick Links */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/dsa/practice" className="btn-primary text-xs gap-1 flex items-center">
          <Layers className="h-3.5 w-3.5" /> All Questions ({totalQuestions})
        </Link>
        <Link href="/revision" className="btn-ghost text-xs gap-1 flex items-center">
          <BookOpen className="h-3.5 w-3.5" /> Revision Queue
        </Link>
      </div>

      {/* Tiered Roadmap with REAL question cards */}
      {TIERS.map((tier) => {
        const list = topics.filter((t) => t.tier === tier);
        if (!list.length) return null;

        return (
          <section key={tier} className="mb-10">
            <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <div className="h-2 w-2 rounded-full bg-cyan-400" />
              <h2 className="text-lg font-bold tracking-tight text-white capitalize">
                {tierLabels[tier]}
              </h2>
              <span className="text-xs text-zinc-500 font-medium">
                ({list.length} topics ·{" "}
                {list.reduce((acc, t) => acc + (topicQuestionsMap.get(t.id)?.length ?? 0), 0)}{" "}
                questions)
              </span>
            </div>

            <div className="space-y-4">
              {list.map((t: any, i) => {
                const topicQs = topicQuestionsMap.get(t.id) ?? [];
                const isExpanded = expandedTopics.has(t.id);
                const solvedCount = topicQs.filter((q) =>
                  ["solved", "revised", "mastered"].includes(
                    questionProgress[q.id]?.status ?? ""
                  )
                ).length;

                // Group questions by pattern
                const patternMap = new Map<string, typeof topicQs>();
                topicQs.forEach((q) => {
                  const key = q.pattern || "General";
                  if (!patternMap.has(key)) patternMap.set(key, []);
                  patternMap.get(key)!.push(q);
                });
                const patterns = Array.from(patternMap.entries()).sort(
                  (a, b) => b[1].length - a[1].length
                );

                const masteryColors = {
                  beginner: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
                  learning: "text-amber-300 bg-amber-500/10 border-amber-500/20",
                  proficient: "text-violet-300 bg-violet-500/10 border-violet-500/20",
                  mastered: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
                };
                const masteryClass =
                  masteryColors[t.mastery as keyof typeof masteryColors] || masteryColors.beginner;

                const freqColors = {
                  "very-high": "text-rose-400",
                  high: "text-orange-400",
                  medium: "text-cyan-400",
                  low: "text-zinc-500",
                };
                const freqClass =
                  freqColors[t.interviewFrequency as keyof typeof freqColors] || freqColors.medium;

                const recommendedTopic = topics.find((topic) => topic.completion < 80);
                const isRecommended = recommendedTopic?.id === t.id;

                return (
                  <div key={t.id}>
                    {/* Topic Header Row — click to expand */}
                    <GlassCard
                      hover={true}
                      delay={i * 0.02}
                      className={`relative overflow-hidden transition-all duration-300 border-white/5 cursor-pointer ${
                        isExpanded
                          ? "border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                          : "hover:border-cyan-500/20"
                      }`}
                    >
                      <div
                        className="flex items-start justify-between gap-4"
                        onClick={() => toggleTopic(t.id)}
                      >
                        {/* Left: Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Unlock className="h-3.5 w-3.5 text-cyan-400/50 shrink-0" />
                            <h3 className="font-bold text-white text-base">{t.name}</h3>
                            {isRecommended && (
                              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-bold text-cyan-400 uppercase tracking-wider">
                                Recommended Next
                              </span>
                            )}
                            <span
                              className={`px-2 py-0.5 rounded border text-[9px] font-bold capitalize ${masteryClass}`}
                            >
                              {t.mastery}
                            </span>
                            <span
                              className={`text-[9px] font-bold flex items-center gap-0.5 ${freqClass}`}
                            >
                              <Flame className="h-2.5 w-2.5 shrink-0" />
                              {t.interviewFrequency}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden max-w-xs">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
                              style={{ width: `${t.completion}%` }}
                            />
                          </div>

                          {/* Counts */}
                          <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-400">
                            <span>
                              <span className="font-bold text-white">{solvedCount}</span>
                              /{topicQs.length} solved
                            </span>
                            <span className="text-emerald-400">
                              {topicQs.filter((q) => q.difficulty === "Easy").length}E
                            </span>
                            <span className="text-amber-400">
                              {topicQs.filter((q) => q.difficulty === "Medium").length}M
                            </span>
                            <span className="text-rose-400">
                              {topicQs.filter((q) => q.difficulty === "Hard").length}H
                            </span>
                            {t.revisionDueCount > 0 && (
                              <span className="text-amber-400 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {t.revisionDueCount} revision due
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: Completion % + toggle */}
                        <div className="text-right shrink-0 flex items-center gap-3">
                          <div>
                            <span className="text-xl font-extrabold text-white">
                              {t.completion}%
                            </span>
                            <span className="block text-[8px] uppercase tracking-wider text-zinc-500">
                              done
                            </span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-white/5">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-cyan-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-zinc-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action links row */}
                      {!isExpanded && (
                        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                          <div className="flex gap-2">
                            <Link
                              href={`/dsa/topic/${t.id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 font-semibold"
                            >
                              Topic View <ArrowRight className="h-3 w-3" />
                            </Link>
                          </div>
                          <span className="text-[9px] text-zinc-600">
                            Click to expand {topicQs.length} questions
                          </span>
                        </div>
                      )}
                    </GlassCard>

                    {/* EXPANDED: Real Question Cards grouped by Pattern */}
                    {isExpanded && (
                      <div className="mt-2 ml-4 space-y-4 border-l-2 border-cyan-500/20 pl-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-400">
                            {topicQs.length} questions across {patterns.length} patterns
                          </span>
                          <Link
                            href={`/dsa/topic/${t.id}`}
                            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            Full topic view <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>

                        {patterns.map(([pattern, pqs]) => {
                          const patternKey = `${t.id}:${pattern}`;
                          const isPExpanded = expandedPatterns.has(patternKey);
                          const pSolved = pqs.filter((q) =>
                            ["solved", "revised", "mastered"].includes(
                              questionProgress[q.id]?.status ?? ""
                            )
                          ).length;

                          return (
                            <div key={pattern}>
                              {/* Pattern sub-header */}
                              <button
                                type="button"
                                onClick={() => togglePattern(patternKey)}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/3 border border-white/5 hover:bg-white/5 transition-colors text-left"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                                  <span className="text-xs font-semibold text-zinc-200">
                                    {pattern}
                                  </span>
                                  <span className="text-[10px] text-zinc-500">
                                    {pSolved}/{pqs.length}
                                    {pqs.filter((q) => q.difficulty === "Easy").length > 0 && (
                                      <span className="ml-1 text-emerald-500">
                                        {pqs.filter((q) => q.difficulty === "Easy").length}E
                                      </span>
                                    )}
                                    {pqs.filter((q) => q.difficulty === "Medium").length > 0 && (
                                      <span className="ml-1 text-amber-500">
                                        {pqs.filter((q) => q.difficulty === "Medium").length}M
                                      </span>
                                    )}
                                    {pqs.filter((q) => q.difficulty === "Hard").length > 0 && (
                                      <span className="ml-1 text-rose-500">
                                        {pqs.filter((q) => q.difficulty === "Hard").length}H
                                      </span>
                                    )}
                                  </span>
                                </div>
                                {isPExpanded ? (
                                  <ChevronUp className="h-3.5 w-3.5 text-zinc-500" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5 text-zinc-500" />
                                )}
                              </button>

                              {/* REAL question cards */}
                              {isPExpanded && (
                                <div className="mt-2 space-y-2">
                                  {pqs
                                    .sort((a, b) => {
                                      const order = { Easy: 0, Medium: 1, Hard: 2 };
                                      return (
                                        (order[a.difficulty] ?? 1) - (order[b.difficulty] ?? 1)
                                      );
                                    })
                                    .map((q) => (
                                      <QuestionCard key={q.id} question={q} compact />
                                    ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {topics.length === 0 && (
        <GlassCard hover={false} className="py-20 text-center">
          <BookOpen className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="font-bold text-zinc-400 text-lg">No questions loaded yet</h3>
          <p className="text-zinc-500 text-sm mt-2 max-w-sm mx-auto">
            Your question bank is empty. Visit the Admin panel to sync your study data.
          </p>
          <Link href="/admin" className="btn-primary text-sm mt-4 inline-block">
            Go to Admin Panel →
          </Link>
        </GlassCard>
      )}
    </AppShell>
  );
}
