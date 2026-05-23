"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { QuestionCard } from "@/components/dsa/question-card";
import { GlassCard } from "@/components/ui/glass-card";
import { getQuestionsByTopic } from "@/lib/dsa-engine";
import { getLevelCompletionPercent } from "@/lib/dsa-engine";
import { useDSAStats } from "@/hooks/use-dsa";
import { useDataStore } from "@/store/data-store";
import { useProgressStore } from "@/lib/progress-store";
import type { TopicLevel } from "@/types";
import { Search, X, Layers, BarChart3, ChevronDown, ChevronUp, Filter } from "lucide-react";

const LEVEL_LABELS: Record<TopicLevel, { label: string; desc: string; color: string }> = {
  1: { label: "Level 1 — Foundations", desc: "Easy, core concepts", color: "border-emerald-500/30 text-emerald-300" },
  2: { label: "Level 2 — Patterns", desc: "Medium, technique practice", color: "border-cyan-500/30 text-cyan-300" },
  3: { label: "Level 3 — Interview Focus", desc: "Hard, company-style", color: "border-violet-500/30 text-violet-300" },
  4: { label: "Level 4 — Mock Mastery", desc: "Timed interview challenges", color: "border-amber-500/30 text-amber-300" },
};

export default function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const topics = useDataStore((s) => s.topics);
  const questions = useDataStore((s) => s.questions);
  const meta = topics.find((t) => t.id === id);
  const { topics: enriched } = useDSAStats();
  const topic = enriched.find((t) => t.id === id);
  const questionProgress = useProgressStore((s) => s.questionProgress);

  const [search, setSearch] = useState("");
  const [diffFilter, setDiffFilter] = useState<"all" | "Easy" | "Medium" | "Hard">("all");
  const [patternFilter, setPatternFilter] = useState("all");
  const [collapsedLevels, setCollapsedLevels] = useState<Set<TopicLevel>>(new Set());
  const [groupByPattern, setGroupByPattern] = useState(false);

  const loading = useDataStore((s) => s.loading);
  const lastFetched = useDataStore((s) => s.lastFetched);

  const allTopicQuestions = useMemo(
    () => getQuestionsByTopic(questions, id),
    [questions, id]
  );

  const patterns = useMemo(() => {
    const set = new Set<string>();
    allTopicQuestions.forEach((q) => q.pattern && set.add(q.pattern));
    return Array.from(set).sort();
  }, [allTopicQuestions]);

  const filteredQuestions = useMemo(() => {
    return allTopicQuestions.filter((q) => {
      if (diffFilter !== "all" && q.difficulty !== diffFilter) return false;
      if (patternFilter !== "all" && q.pattern !== patternFilter) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        return (
          q.title.toLowerCase().includes(s) ||
          q.pattern?.toLowerCase().includes(s) ||
          q.companies.some((c) => c.toLowerCase().includes(s))
        );
      }
      return true;
    });
  }, [allTopicQuestions, diffFilter, patternFilter, search]);

  const byLevel = useMemo(() => {
    const map = new Map<TopicLevel, typeof filteredQuestions>();
    ([1, 2, 3, 4] as TopicLevel[]).forEach((level) => {
      map.set(
        level,
        filteredQuestions.filter((q) => q.level === level)
      );
    });
    return map;
  }, [filteredQuestions]);

  const byPattern = useMemo(() => {
    const map = new Map<string, typeof filteredQuestions>();
    filteredQuestions.forEach((q) => {
      const key = q.pattern || "General";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(q);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [filteredQuestions]);

  const toggleLevel = (level: TopicLevel) => {
    setCollapsedLevels((prev) => {
      const next = new Set(prev);
      next.has(level) ? next.delete(level) : next.add(level);
      return next;
    });
  };

  if (!meta) {
    if (loading || !lastFetched) {
      return (
        <AppShell title="Loading Topic...">
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          </div>
        </AppShell>
      );
    }
    return (
      <AppShell title="Topic not found">
        <p className="text-zinc-400 mb-4">This topic could not be found in your sheet data.</p>
        <Link href="/dsa" className="text-cyan-400">
          ← Back to DSA
        </Link>
      </AppShell>
    );
  }

  const levelUnlocked = topic?.levelUnlocked ?? 1;
  const totalSolved = allTopicQuestions.filter((q) =>
    ["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
  ).length;

  return (
    <AppShell
      title={meta.name}
      subtitle={`${totalSolved}/${allTopicQuestions.length} solved · ${meta.estimatedHours}h estimated`}
    >
      {/* Breadcrumb */}
      <div className="mb-4 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/dsa" className="hover:text-cyan-400 transition-colors">DSA Tracker</Link>
        <span>/</span>
        <Link href="/dsa/roadmap" className="hover:text-cyan-400 transition-colors">Roadmap</Link>
        <span>/</span>
        <span className="text-zinc-300">{meta.name}</span>
      </div>

      {/* Stats Row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <GlassCard hover={false} className="text-center py-3">
          <p className="text-xl font-extrabold text-white">{allTopicQuestions.length}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Questions</p>
        </GlassCard>
        <GlassCard hover={false} className="text-center py-3">
          <p className="text-xl font-extrabold text-emerald-400">{totalSolved}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Solved</p>
        </GlassCard>
        <GlassCard hover={false} className="text-center py-3">
          <p className="text-xl font-extrabold text-emerald-300">
            {allTopicQuestions.filter((q) => q.difficulty === "Easy").length}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Easy</p>
        </GlassCard>
        <GlassCard hover={false} className="text-center py-3">
          <p className="text-xl font-extrabold text-amber-300">
            {allTopicQuestions.filter((q) => q.difficulty === "Medium").length}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Medium</p>
        </GlassCard>
        <GlassCard hover={false} className="text-center py-3">
          <p className="text-xl font-extrabold text-rose-300">
            {allTopicQuestions.filter((q) => q.difficulty === "Hard").length}
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Hard</p>
        </GlassCard>
      </div>

      {/* Progress bar */}
      <GlassCard className="mb-6" hover={false}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-zinc-300">
            Overall Progress — {topic?.completion ?? 0}% · {topic?.mastery ?? "beginner"}
          </span>
          <div className="flex gap-2">
            <Link
              href={`/dsa/practice?topic=${id}`}
              className="text-xs text-cyan-400 hover:text-cyan-300"
            >
              <BarChart3 className="h-3.5 w-3.5 inline mr-1" />
              Filter in Practice
            </Link>
          </div>
        </div>
        <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700"
            style={{ width: `${topic?.completion ?? 0}%` }}
          />
        </div>
        {patterns.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {patterns.slice(0, 8).map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/10 text-violet-300 border border-violet-500/20"
              >
                {p}
              </span>
            ))}
            {patterns.length > 8 && (
              <span className="text-[10px] text-zinc-500">+{patterns.length - 8} more</span>
            )}
          </div>
        )}
      </GlassCard>

      {/* Filters */}
      <GlassCard className="mb-6" hover={false}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions, patterns, companies..."
              className="field-input w-full pl-9 pr-8"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Difficulty */}
          <select
            value={diffFilter}
            onChange={(e) => setDiffFilter(e.target.value as any)}
            className="field-input"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Pattern */}
          {patterns.length > 0 && (
            <select
              value={patternFilter}
              onChange={(e) => setPatternFilter(e.target.value)}
              className="field-input"
            >
              <option value="all">All Patterns</option>
              {patterns.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          )}

          {/* Group toggle */}
          <button
            type="button"
            onClick={() => setGroupByPattern((v) => !v)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs transition-colors ${
              groupByPattern
                ? "border-violet-500/40 bg-violet-500/10 text-violet-500"
                : "border-[var(--border-normal)] bg-[var(--bg-overlay)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            By Pattern
          </button>
        </div>

        <p className="mt-2 text-[10px]" style={{ color: "var(--text-faint)" }}>
          Showing {filteredQuestions.length} of {allTopicQuestions.length} questions
        </p>
      </GlassCard>

      {/* QUESTION LIST */}
      {groupByPattern ? (
        // GROUP BY PATTERN
        <div className="space-y-6">
          {byPattern.map(([pattern, pqs]) => {
            const pSolved = pqs.filter((q) =>
              ["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
            ).length;
            return (
              <section key={pattern}>
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <h2 className="text-sm font-bold text-violet-300">{pattern}</h2>
                  <span className="text-xs text-zinc-500">
                    {pSolved}/{pqs.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {pqs
                    .sort((a, b) => {
                      const o = { Easy: 0, Medium: 1, Hard: 2 };
                      return (o[a.difficulty] ?? 1) - (o[b.difficulty] ?? 1);
                    })
                    .map((q) => (
                      <QuestionCard key={q.id} question={q} compact />
                    ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        // GROUP BY LEVEL
        <div className="space-y-6">
          {([1, 2, 3, 4] as TopicLevel[]).map((level) => {
            const locked = false;
            const isSuggested = level === levelUnlocked;
            const isAboveUnlocked = level > levelUnlocked;
            const qs = byLevel.get(level) ?? [];
            const pct = getLevelCompletionPercent(id, level, questionProgress, questions);
            const isCollapsed = collapsedLevels.has(level);
            const lvlInfo = LEVEL_LABELS[level];
            const solvedInLevel = qs.filter((q) =>
              ["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
            ).length;

            return (
              <section key={level} className="space-y-3">
                {/* Level header */}
                <button
                  type="button"
                  onClick={() => toggleLevel(level)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${lvlInfo.color} bg-[var(--bg-overlay)] hover:bg-[color-mix(in_srgb,var(--bg-overlay)_200%,transparent)] cursor-pointer`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="h-4 w-4 shrink-0" />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold">{lvlInfo.label}</h2>
                        {isSuggested && (
                          <span className="text-[8px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Suggested
                          </span>
                        )}
                      </div>
                      <p className="text-[10px]" style={{ color: "var(--text-faint)" }}>{lvlInfo.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-bold">{pct}%</span>
                      <span className="block text-[9px]" style={{ color: "var(--text-faint)" }}>
                        {solvedInLevel}/{qs.length}
                      </span>
                    </div>
                    {isCollapsed ? (
                      <ChevronDown className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Guidance Banner */}
                {!isCollapsed && isAboveUnlocked && (
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-[10px] text-amber-300 flex items-center gap-2">
                    <span>💡</span>
                    <span><strong>Progression Tip:</strong> We recommend completing the previous level first to build a solid foundation, but feel free to practice these questions now!</span>
                  </div>
                )}

                {/* Questions */}
                {!isCollapsed && (
                  qs.length > 0 ? (
                    <div className="space-y-2">
                      {qs
                        .sort((a, b) => {
                          const o = { Easy: 0, Medium: 1, Hard: 2 };
                          return (o[a.difficulty] ?? 1) - (o[b.difficulty] ?? 1);
                        })
                        .map((q) => (
                          <QuestionCard key={q.id} question={q} compact />
                        ))}
                    </div>
                  ) : (
                    <GlassCard hover={false} className="py-6 text-center">
                       <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                        No questions match your filters for this level.
                      </p>
                    </GlassCard>
                  )
                )}

                {isCollapsed && qs.length > 0 && (
                  <p className="text-xs pl-4" style={{ color: "var(--text-faint)" }}>
                    {qs.length} questions hidden — click header to expand
                  </p>
                )}
              </section>
            );
          })}
        </div>
      )}

      {filteredQuestions.length === 0 && (
        <GlassCard hover={false} className="py-12 text-center">
          <p className="" style={{ color: "var(--text-secondary)" }}>No questions match your filters.</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setDiffFilter("all");
              setPatternFilter("all");
            }}
            className="btn-primary text-xs mt-3"
          >
            Clear Filters
          </button>
        </GlassCard>
      )}
    </AppShell>
  );
}
