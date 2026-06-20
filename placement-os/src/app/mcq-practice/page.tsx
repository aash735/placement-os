"use client";

import { useState, useMemo, useEffect } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { McqCard } from "@/components/mcq/mcq-card";
import { useProgressStore } from "@/lib/progress-store";
import { useMCQStats } from "@/hooks/mcq/use-mcq";
import mcqBank from "@/data/mcq-bank.json";
import type { MCQQuestion } from "@/types";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Brain,
  Award,
  Sparkles,
  Target,
  Trophy,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

const CANONICAL_TOPICS = [
  "All Topics",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Language Internals",
];

export default function MCQPracticePage() {
  const isMcqEnabled = process.env.NEXT_PUBLIC_ENABLE_MCQ === "true";

  const {
    mcqBookmarks: bookmarks = [],
    mcqAttempts: attempts = [],
    toggleMcqBookmark: toggleBookmark,
    addMcqAttempt: addAttempt,
    xp,
    level,
    streak,
  } = useProgressStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // Pagination / Current Question State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCurrentSubmitted, setIsCurrentSubmitted] = useState(false);

  // Filter questions dynamically
  const filteredQuestions = useMemo(() => {
    return (mcqBank as MCQQuestion[]).filter((q) => {
      // Search match
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        q.title.toLowerCase().includes(query) ||
        (q.question || "").toLowerCase().includes(query) ||
        (q.code || "").toLowerCase().includes(query);

      // Topic match
      const matchesTopic = selectedTopic === "All Topics" || q.topic === selectedTopic;

      // Difficulty match
      const matchesDiff = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;

      // Bookmarks match
      const matchesBookmark = !showOnlyBookmarks || bookmarks.includes(q.id);

      return matchesSearch && matchesTopic && matchesDiff && matchesBookmark;
    });
  }, [searchQuery, selectedTopic, selectedDifficulty, showOnlyBookmarks, bookmarks]);

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsCurrentSubmitted(false);
  }, [searchQuery, selectedTopic, selectedDifficulty, showOnlyBookmarks]);

  // Safely get current question
  const currentQuestion = filteredQuestions[currentIndex] || null;

  // Check if current question has previous attempt
  const currentAttempt = useMemo(() => {
    if (!currentQuestion) return undefined;
    const qAttempts = attempts.filter((a) => a.questionId === currentQuestion.id);
    if (qAttempts.length === 0) return undefined;
    // Return last attempt
    const lastAttempt = qAttempts[qAttempts.length - 1];
    return {
      selectedOption: lastAttempt.selectedOption,
      isCorrect: lastAttempt.isCorrect,
    };
  }, [currentQuestion, attempts]);

  // Set current submitted state based on attempt existence
  useEffect(() => {
    setIsCurrentSubmitted(!!currentAttempt);
  }, [currentAttempt]);

  // Statistics hook
  const stats = useMCQStats();

  // Redirect if feature flag is disabled
  useEffect(() => {
    if (!isMcqEnabled) {
      redirect("/dashboard");
    }
  }, [isMcqEnabled]);

  if (!isMcqEnabled) {
    return null;
  }

  const handleToggleBookmark = () => {
    if (currentQuestion) {
      toggleBookmark(currentQuestion.id);
    }
  };

  const handleSubmitAnswer = (selectedOption: string, isCorrect: boolean) => {
    if (currentQuestion) {
      addAttempt({
        questionId: currentQuestion.id,
        selectedOption,
        isCorrect,
        timeSpentSec: 30, // simulated speed
        attemptType: "practice",
      });
      setIsCurrentSubmitted(true);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsCurrentSubmitted(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsCurrentSubmitted(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTopic("All Topics");
    setSelectedDifficulty("All");
    setShowOnlyBookmarks(false);
    setCurrentIndex(0);
    setIsCurrentSubmitted(false);
  };

  return (
    <AppShell title="MCQ Practice" subtitle="Deep Theory, Complexity & Language Internals Tracker">
      <div className="space-y-6">
        {/* TOP STATS BAR */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Solved"
            value={`${stats.solvedCount}/${stats.totalQuestionsCount}`}
            sub={`${stats.totalAttempts} total attempts logged`}
            icon={Brain}
            accent="from-indigo-500 to-purple-600"
            delay={0}
          />
          <StatCard
            label="Practice Accuracy"
            value={`${stats.overallAccuracy}%`}
            sub={stats.totalAttempts > 0 ? "Targeting 80% accuracy" : "Submit answers to calculate"}
            icon={Target}
            accent="from-emerald-400 to-teal-500"
            delay={0.05}
          />
          <StatCard
            label="Main Level"
            value={level}
            sub={`${xp} total XP · 🔥 ${streak}d`}
            icon={Trophy}
            accent="from-amber-400 to-orange-500"
            delay={0.1}
          />
          <StatCard
            label="Bookmarks"
            value={stats.bookmarksCount}
            sub="Saved questions for review"
            icon={Award}
            accent="from-pink-500 to-rose-600"
            delay={0.15}
          />
        </div>

        {/* FILTERS CARD */}
        <GlassCard className="grid grid-cols-1 gap-4 md:grid-cols-4 items-center" delay={0.2}>
          {/* SEARCH BAR */}
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search concepts, questions or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="field-input w-full pl-10 pr-4"
            />
          </div>

          {/* TOPIC SELECTION */}
          <Select value={selectedTopic} onValueChange={setSelectedTopic}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
              {CANONICAL_TOPICS.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic === "All Topics" ? "All Syllabus Topics" : topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* DIFFICULTY SELECTION */}
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          {/* CHECKBOX & RESULTS COUNTER */}
          <div className="col-span-1 md:col-span-4 flex items-center justify-between pt-2 border-t border-[var(--border-normal)]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showOnlyBookmarks}
                onChange={(e) => setShowOnlyBookmarks(e.target.checked)}
                className="rounded border-[var(--border-normal)] text-indigo-500 focus:ring-indigo-500 h-4 w-4 bg-transparent cursor-pointer"
              />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Show Bookmarked Only</span>
            </label>

            {filteredQuestions.length > 0 && (
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Question {currentIndex + 1} of {filteredQuestions.length} matching
              </span>
            )}
          </div>
        </GlassCard>

        {/* WORKSPACE AREA */}
        {currentQuestion ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* LEFT AREA: INTERACTIVE CARD & WORKSPACE */}
            <div className="col-span-1 lg:col-span-8 space-y-4">
              <McqCard
                key={currentQuestion.id}
                question={currentQuestion}
                isBookmarked={bookmarks.includes(currentQuestion.id)}
                onToggleBookmark={handleToggleBookmark}
                onSubmit={handleSubmitAnswer}
                previousAttempt={currentAttempt}
              />

              {/* CARD FOOTER CONTROLS */}
              <div className="rounded-2xl border p-4 bg-[var(--bg-elevated)] border-[var(--border-normal)] flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIndex === 0}
                    onClick={handlePrev}
                    className="p-2.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-normal)] text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--border-normal)] transition-colors cursor-pointer"
                    title="Previous Question"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    disabled={currentIndex === filteredQuestions.length - 1}
                    onClick={handleNext}
                    className="p-2.5 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-normal)] text-[var(--text-primary)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--border-normal)] transition-colors cursor-pointer"
                    title="Next Question"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {isCurrentSubmitted && currentIndex < filteredQuestions.length - 1 && (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT AREA: STATS SIDEBAR */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              {/* TOPIC SYLLABUS PROGRESS */}
              <GlassCard className="space-y-4" delay={0.25}>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Syllabus Coverage</h3>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    Completion rate of the 200 premium questions.
                  </p>
                </div>

                <div className="space-y-3">
                  {Object.entries(stats.topicStats).map(([topic, stat]) => {
                    const pct = Math.round((stat.solved / stat.total) * 100);
                    return (
                      <div key={topic} className="flex flex-col">
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-[var(--text-secondary)] truncate max-w-[150px]">{topic}</span>
                          <span className="text-[var(--text-muted)] text-[10px] font-bold">
                            {stat.solved}/{stat.total} ({pct}%)
                          </span>
                        </div>
                        <div className="mt-1.5 w-full bg-[var(--bg-hover)] h-1.5 rounded-full overflow-hidden border border-[var(--border-normal)]">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* ACTION RECOMMENDATIONS */}
              <GlassCard className="space-y-3.5" delay={0.3}>
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Sparkles className="h-4.5 w-4.5 text-amber-400" />
                  AI Study Insights
                </h3>
                <div className="space-y-2.5">
                  {stats.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-normal)]"
                    >
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* ACCURACY RING CARD */}
              <GlassCard className="flex flex-col items-center justify-center py-6" delay={0.35}>
                <ProgressRing value={stats.overallAccuracy} size={110} />
                <p className="mt-3.5 text-xs font-bold text-white">Overall Accuracy Score</p>
                <p className="text-[10px] text-zinc-500 mt-1">Based on {stats.totalAttempts} total attempts</p>
              </GlassCard>

              {/* HELP & GAME RULES */}
              <GlassCard className="text-xs text-[var(--text-secondary)] leading-relaxed space-y-2.5" delay={0.4}>
                <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-indigo-400" />
                  Practice Mechanics
                </h4>
                <p>
                  Solving questions correctly awards XP to your Placement OS profile:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Easy Question: <span className="font-bold text-emerald-400">+5 XP</span></li>
                  <li>Medium Question: <span className="font-bold text-blue-400">+10 XP</span></li>
                  <li>Hard Question: <span className="font-bold text-rose-400">+20 XP</span></li>
                </ul>
                <p className="text-[10px] text-[var(--text-muted)] italic">
                  Note: XP is awarded once per question on the first correct solve. Attempts and accuracy logs feed your overall Dashboard metrics automatically.
                </p>
              </GlassCard>
            </div>
          </div>
        ) : (
          /* EMPTY STATE CARD */
          <GlassCard className="flex flex-col items-center justify-center text-center py-16 space-y-4" delay={0.25}>
            <HelpCircle className="h-14 w-14 text-[var(--text-muted)]" />
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">No matching questions</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-sm leading-relaxed">
                Relax your search filters or check your spelling to load the DSA MCQ database.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)] cursor-pointer"
            >
              Reset Filters
            </button>
          </GlassCard>
        )}
      </div>
    </AppShell>
  );
}
