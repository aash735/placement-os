"use client";

import { useMemo, useState, useEffect } from "react";
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  RotateCcw, 
  Zap, 
  Flame, 
  Building2, 
  Award, 
  Bookmark, 
  Calendar,
  AlertCircle
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { QuestionCard } from "@/components/dsa/question-card";
import { GlassCard } from "@/components/ui/glass-card";
import { filterQuestions } from "@/lib/sheets/filters";
import { useDataStore } from "@/store/data-store";
import { useProgressStore } from "@/lib/progress-store";
import { useDSAStats } from "@/hooks/use-dsa";
import type { QuestionStatus } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PracticePage() {
  const questions = useDataStore((s) => s.questions);
  const topics = useDataStore((s) => s.topics);
  const bookmarks = useProgressStore((s) => s.bookmarks) || [];
  const questionProgress = useProgressStore((s) => s.questionProgress);
  const { dueRevisions } = useDSAStats();

  const [topic, setTopic] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [statusFilter, setStatusFilter] = useState<QuestionStatus | "all">("all");
  const [company, setCompany] = useState("all");
  const [pattern, setPattern] = useState("all");
  const [frequency, setFrequency] = useState("all");
  const [source, setSource] = useState("all");
  const [search, setSearch] = useState("");
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [revisionOnly, setRevisionOnly] = useState(false);
  const [sort, setSort] = useState<"title" | "difficulty" | "time">("title");

  const revisionDueIds = useMemo(() => new Set(dueRevisions.map((r) => r.question.id)), [dueRevisions]);
  
  const statusMap = useMemo(
    () => Object.fromEntries(Object.entries(questionProgress).map(([id, p]) => [id, p.status])),
    [questionProgress]
  );

  // Dynamic Companies extraction from sheet questions
  const dynamicCompanies = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      q.companies.forEach((c) => {
        if (c.trim()) set.add(c.trim());
      });
    });
    return Array.from(set).sort();
  }, [questions]);

  // Dynamic Patterns extraction from sheet questions
  const dynamicPatterns = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.pattern?.trim()) set.add(q.pattern.trim());
    });
    return Array.from(set).sort();
  }, [questions]);

  // Dynamic Sources extraction from sheet questions
  const dynamicSources = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.sources) {
        q.sources.forEach((s) => {
          if (s.trim()) set.add(s.trim());
        });
      } else {
        set.add("DSA Sheet");
      }
    });
    return Array.from(set).sort();
  }, [questions]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (topic !== "all") count++;
    if (difficulty !== "all") count++;
    if (statusFilter !== "all") count++;
    if (company !== "all") count++;
    if (pattern !== "all") count++;
    if (frequency !== "all") count++;
    if (source !== "all") count++;
    if (search.trim() !== "") count++;
    if (bookmarksOnly) count++;
    if (revisionOnly) count++;
    return count;
  }, [topic, difficulty, statusFilter, company, pattern, frequency, source, search, bookmarksOnly, revisionOnly]);

  // Reset all filters function
  const handleResetFilters = () => {
    setTopic("all");
    setDifficulty("all");
    setStatusFilter("all");
    setCompany("all");
    setPattern("all");
    setFrequency("all");
    setSource("all");
    setSearch("");
    setBookmarksOnly(false);
    setRevisionOnly(false);
    setSort("title");
  };

  // Quick Action: FAANG Classics (Find top-tier companies in dataset, else default to Microsoft/Amazon)
  const applyFAANGClassics = () => {
    handleResetFilters();
    // Search for a company like Amazon or Microsoft in dynamicCompanies
    const targetComp = dynamicCompanies.find(c => 
      ["amazon", "microsoft", "google", "meta", "netflix", "apple"].includes(c.toLowerCase())
    ) || dynamicCompanies[0] || "all";
    setCompany(targetComp);
  };

  // Quick Action: High Priority Solves (Critical revisions or Very High frequency unsolved)
  const applyHighPriority = () => {
    handleResetFilters();
    setFrequency("very-high");
    setStatusFilter("not_started");
  };

  // Quick Action: Quick Solves (Easy, Unsolved problems)
  const applyQuickSolves = () => {
    handleResetFilters();
    setDifficulty("Easy");
    setStatusFilter("not_started");
  };

  const filtered = useMemo(() => {
    let list = filterQuestions(questions, {
      topic,
      difficulty,
      company,
      pattern,
      frequency,
      search,
      status: statusFilter,
      statusMap,
      revisionDueIds: revisionOnly ? revisionDueIds : undefined,
      bookmarked: bookmarksOnly ? new Set(bookmarks) : undefined,
      source,
    });

    list = [...list].sort((a, b) => {
      if (sort === "time") return a.estimatedMinutes - b.estimatedMinutes;
      if (sort === "difficulty") return a.difficulty.localeCompare(b.difficulty);
      return a.title.localeCompare(b.title);
    });

    return list;
  }, [questions, topic, difficulty, company, pattern, frequency, search, statusFilter, statusMap, revisionOnly, revisionDueIds, bookmarksOnly, bookmarks, sort, source]);

  return (
    <AppShell title="DSA Bank" subtitle={`${filtered.length} matching questions found`}>
      <PageHeader 
        title="Question Bank" 
        description="Comprehensive dashboard of all questions parsed dynamically from your sheets folder." 
      />

      {/* Filter and Control Dashboard */}
      <GlassCard className="mb-6 p-4 space-y-4" hover={false}>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problem title, subtopic patterns, companies or tags..."
              className="field-input w-full pl-10 pr-10"
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

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">
              Showing {filtered.length} of {questions.length}
            </span>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="btn-ghost flex items-center gap-1 text-xs py-2 px-3 text-rose-400 border border-rose-500/20 hover:bg-rose-500/10"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>

        {/* Multi-Select Selectors */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {/* Topic Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Topic</label>
            <Select value={topic} onValueChange={(val) => setTopic(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sheet Source Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Sheet Source</label>
            <Select value={source} onValueChange={(val) => setSource(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {dynamicSources.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Difficulty</label>
            <Select value={difficulty} onValueChange={(val) => setDifficulty(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Status</label>
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="attempted">Attempted</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="revised">Revised</SelectItem>
                <SelectItem value="mastered">Mastered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Company Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Target Company</label>
            <Select value={company} onValueChange={(val) => setCompany(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {dynamicCompanies.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subtopic / Pattern Select */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Pattern Focus</label>
            <Select value={pattern} onValueChange={(val) => setPattern(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Patterns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patterns</SelectItem>
                {dynamicPatterns.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interview Frequency */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Frequency</label>
            <Select value={frequency} onValueChange={(val) => setFrequency(val)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Frequencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frequencies</SelectItem>
                <SelectItem value="very-high">Very High</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sorting */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Sort By</label>
            <Select value={sort} onValueChange={(val) => setSort(val as any)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Problem Title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Problem Title</SelectItem>
                <SelectItem value="difficulty">Difficulty Rating</SelectItem>
                <SelectItem value="time">Solve Time Estimate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Checkbox Toggles & Quick Actions */}
        <div className="border-t border-white/5 pt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={bookmarksOnly} 
                onChange={(e) => setBookmarksOnly(e.target.checked)} 
                className="rounded border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-transparent h-4 w-4"
              />
              <span className="flex items-center gap-1"><Bookmark className="h-3.5 w-3.5 text-cyan-400" /> Bookmarks only</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={revisionOnly} 
                onChange={(e) => setRevisionOnly(e.target.checked)} 
                className="rounded border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-transparent h-4 w-4"
              />
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5 text-violet-400" /> Due revision only</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mr-1">Quick Select:</span>
            <button 
              type="button" 
              onClick={applyHighPriority}
              className="btn-ghost flex items-center gap-1 text-[10px] py-1.5 px-2.5 rounded-lg border border-white/5 hover:bg-white/5 text-amber-400"
            >
              <Flame className="h-3 w-3" /> High Priority
            </button>
            <button 
              type="button" 
              onClick={applyFAANGClassics}
              className="btn-ghost flex items-center gap-1 text-[10px] py-1.5 px-2.5 rounded-lg border border-white/5 hover:bg-white/5 text-cyan-400"
            >
              <Building2 className="h-3 w-3" /> FAANG Classics
            </button>
            <button 
              type="button" 
              onClick={applyQuickSolves}
              className="btn-ghost flex items-center gap-1 text-[10px] py-1.5 px-2.5 rounded-lg border border-white/5 hover:bg-white/5 text-emerald-400"
            >
              <Zap className="h-3 w-3" /> Quick Solves
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Questions list */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((q) => (
            <QuestionCard key={q.id} question={q} showTopic />
          ))
        ) : (
          <GlassCard hover={false} className="py-16 text-center space-y-3">
            <AlertCircle className="h-8 w-8 text-zinc-600 mx-auto" />
            <h3 className="font-bold text-zinc-400 text-lg">No questions match your current filters</h3>
            <p className="text-zinc-500 text-xs max-w-sm mx-auto">
              Try adjusting your checkboxes or dropdowns, or search query to find more matching problems.
            </p>
            <button 
              type="button" 
              onClick={handleResetFilters} 
              className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5 mt-2"
            >
              Clear All Filters
            </button>
          </GlassCard>
        )}
      </div>
    </AppShell>
  );
}
