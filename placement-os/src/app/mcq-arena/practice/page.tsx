"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import mcqQuestions from "@/data/mcq-questions.json";
import type { MCQQuestion } from "@/types";
import {
  Search,
  Filter,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Brain,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CANONICAL_TOPICS = [
  "All Topics", "Arrays", "Strings", "Linked Lists", "Stacks", "Queues", "Recursion",
  "Searching", "Sorting", "Hashing", "Trees", "BST", "Heaps", "Graphs",
  "Dynamic Programming", "Greedy", "Bit Manipulation", "Backtracking",
  "Sliding Window", "Two Pointers", "Binary Search", "Tries", "Segment Trees",
  "DSU", "Miscellaneous"
];

export default function MCQPracticePage() {
  const router = useRouter();
  const {
    mcqAttempts = [],
    mcqBookmarks = [],
    addMcqAttempt,
    toggleMcqBookmark,
  } = useProgressStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // Pagination / Current Question State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Filter questions dynamically
  const filteredQuestions = useMemo(() => {
    return (mcqQuestions as MCQQuestion[]).filter((q) => {
      // Search match
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        q.title.toLowerCase().includes(query) ||
        (q.scenario || "").toLowerCase().includes(query) ||
        (q.code || "").toLowerCase().includes(query);

      // Topic match
      const matchesTopic = selectedTopic === "All Topics" || q.topic === selectedTopic;

      // Difficulty match
      const matchesDiff = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;

      // Bookmarks match
      const matchesBookmark = !showOnlyBookmarks || mcqBookmarks.includes(q.id);

      return matchesSearch && matchesTopic && matchesDiff && matchesBookmark;
    });
  }, [searchQuery, selectedTopic, selectedDifficulty, showOnlyBookmarks, mcqBookmarks]);

  // Safely get current question
  const currentQuestion = filteredQuestions[currentIndex] || null;

  // Question specific history
  const questionAttempts = useMemo(() => {
    if (!currentQuestion) return [];
    return mcqAttempts.filter((a) => a.questionId === currentQuestion.id);
  }, [currentQuestion, mcqAttempts]);

  const questionStats = useMemo(() => {
    if (questionAttempts.length === 0) return { solved: false, attempts: 0, accuracy: 0 };
    const correct = questionAttempts.filter((a) => a.isCorrect).length;
    return {
      solved: correct > 0,
      attempts: questionAttempts.length,
      accuracy: Math.round((correct / questionAttempts.length) * 100),
    };
  }, [questionAttempts]);

  // Handle Option Select
  const handleSelectOption = (optionLetter: string) => {
    if (hasSubmitted) return;
    setSelectedOption(optionLetter);
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (!currentQuestion || !selectedOption || hasSubmitted) return;

    const isCorrect = selectedOption === currentQuestion.answer;
    
    // Add attempt to store (triggers achievements, XP rewards, database sync)
    addMcqAttempt({
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect,
      timeSpentSec: 30, // simulated practice speed
      attemptType: "practice",
    });

    setHasSubmitted(true);
  };

  // Move to Next/Prev Question
  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      // Reset choices
      setSelectedOption(null);
      setHasSubmitted(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      // Reset choices
      setSelectedOption(null);
      setHasSubmitted(false);
    }
  };

  const handleResetSearchFilters = () => {
    setSearchQuery("");
    setSelectedTopic("All Topics");
    setSelectedDifficulty("All");
    setShowOnlyBookmarks(false);
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasSubmitted(false);
  };

  return (
    <AppShell title="Topic Practice" subtitle="Solve conceptual multiple-choice questions with immediate explanations">
      <div className="space-y-6">
        {/* BACK NAVIGATION */}
        <button
          onClick={() => router.push("/mcq-arena")}
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        {/* FILTERS PANEL */}
        <GlassCard className="grid grid-cols-1 gap-4 md:grid-cols-4 items-center">
          {/* SEARCH */}
          <div className="relative col-span-1 md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by keyword, scenario, or code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
                setSelectedOption(null);
                setHasSubmitted(false);
              }}
              className="field-input w-full pl-10 pr-4"
            />
          </div>

          {/* TOPIC SELECT */}
          <Select
            value={selectedTopic}
            onValueChange={(val) => {
              setSelectedTopic(val);
              setCurrentIndex(0);
              setSelectedOption(null);
              setHasSubmitted(false);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Topic" />
            </SelectTrigger>
            <SelectContent>
              {CANONICAL_TOPICS.map((topic) => (
                <SelectItem key={topic} value={topic}>
                  {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* DIFFICULTY SELECT */}
          <Select
            value={selectedDifficulty}
            onValueChange={(val) => {
              setSelectedDifficulty(val);
              setCurrentIndex(0);
              setSelectedOption(null);
              setHasSubmitted(false);
            }}
          >
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

          {/* BOOKMARKS TOGGLE */}
          <div className="col-span-1 md:col-span-4 flex items-center justify-between pt-2 border-t border-[var(--border-normal)]">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showOnlyBookmarks}
                onChange={(e) => {
                  setShowOnlyBookmarks(e.target.checked);
                  setCurrentIndex(0);
                  setSelectedOption(null);
                  setHasSubmitted(false);
                }}
                className="rounded border-[var(--border-normal)] text-indigo-500 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Show Bookmarked Questions Only</span>
            </label>

            {filteredQuestions.length > 0 && (
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Showing {currentIndex + 1} of {filteredQuestions.length} matching questions
              </span>
            )}
          </div>
        </GlassCard>

        {/* WORKSPACE: QUESTION DISPLAY */}
        {currentQuestion ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* MAIN QUESTION INTERFACE */}
            <div className="col-span-1 lg:col-span-8 space-y-6">
              <GlassCard className="space-y-4">
                {/* QUESTION TOP BAR */}
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-normal)]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                      {currentQuestion.topic}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                        currentQuestion.difficulty === "Easy" && "bg-emerald-500/10 text-emerald-400",
                        currentQuestion.difficulty === "Medium" && "bg-blue-500/10 text-blue-400",
                        currentQuestion.difficulty === "Hard" && "bg-rose-500/10 text-rose-400"
                      )}
                    >
                      {currentQuestion.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* BOOKMARK BUTTON */}
                    <button
                      onClick={() => toggleMcqBookmark(currentQuestion.id)}
                      className="p-2 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-normal)] hover:bg-[var(--border-normal)] text-[var(--text-primary)] transition-all"
                    >
                      <Bookmark
                        className={cn(
                          "h-4 w-4 transition-all",
                          mcqBookmarks.includes(currentQuestion.id) ? "fill-amber-400 text-amber-400" : "text-[var(--text-muted)]"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* SCENARIO & STATEMENT */}
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">{currentQuestion.title}</h2>
                  {currentQuestion.scenario && (
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{currentQuestion.scenario}</p>
                  )}
                </div>

                {/* CODE SNIPPET (IF PRESENT) */}
                {currentQuestion.code && (
                  <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-[300px]">
                    <code>{currentQuestion.code}</code>
                  </pre>
                )}

                {/* OPTIONS LIST */}
                <div className="space-y-2.5 pt-2">
                  {currentQuestion.options.map((opt) => {
                    const optionLetter = opt.charAt(0).toUpperCase(); // e.g. "A"
                    const isSelected = selectedOption === optionLetter;
                    const isCorrectAnswer = optionLetter === currentQuestion.answer;
                    
                    return (
                      <button
                        key={opt}
                        disabled={hasSubmitted}
                        onClick={() => handleSelectOption(optionLetter)}
                        className={cn(
                          "w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-start gap-3",
                          "bg-[var(--bg-elevated)] border-[var(--border-normal)] hover:border-indigo-500/50 hover:bg-indigo-500/5",
                          isSelected && "border-indigo-500 bg-indigo-500/10",
                          hasSubmitted && isCorrectAnswer && "border-emerald-500 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500",
                          hasSubmitted && isSelected && !isCorrectAnswer && "border-rose-500 bg-rose-500/10 text-rose-400 hover:bg-rose-500/10 hover:border-rose-500",
                          hasSubmitted && !isSelected && "opacity-75 hover:bg-[var(--bg-elevated)] hover:border-[var(--border-normal)] cursor-not-allowed"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold",
                            isSelected ? "border-indigo-500 bg-indigo-500 text-white" : "border-[var(--border-normal)] bg-[var(--bg-hover)] text-[var(--text-muted)]",
                            hasSubmitted && isCorrectAnswer && "border-emerald-500 bg-emerald-500 text-white",
                            hasSubmitted && isSelected && !isCorrectAnswer && "border-rose-500 bg-rose-500 text-white"
                          )}
                        >
                          {optionLetter}
                        </span>
                        <span className="text-[var(--text-primary)] leading-normal">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* CONTROLS */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-normal)]">
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentIndex === 0}
                      onClick={handlePrev}
                      className="p-2 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-normal)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--border-normal)] transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      disabled={currentIndex === filteredQuestions.length - 1}
                      onClick={handleNext}
                      className="p-2 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-normal)] text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--border-normal)] transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>

                  {!hasSubmitted ? (
                    <button
                      disabled={!selectedOption}
                      onClick={handleSubmitAnswer}
                      className="px-5 py-2 text-sm font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={currentIndex === filteredQuestions.length - 1}
                      className="px-5 py-2 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Question
                    </button>
                  )}
                </div>
              </GlassCard>

              {/* DETAILED EXPLANATION PANEL */}
              {hasSubmitted && currentQuestion.explanation && (
                <GlassCard className="border-emerald-500/10 bg-emerald-500/5 space-y-3" delay={0.1}>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <HelpCircle className="h-4 w-4" /> Explanation
                  </div>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed italic">
                    {currentQuestion.explanation}
                  </p>
                </GlassCard>
              )}
            </div>

            {/* SIDE PANEL: PROGRESS METRICS */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              {/* ATTEMPT STATS */}
              <GlassCard className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <Award className="h-4 w-4 text-indigo-400" />
                  Your Question History
                </h3>
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between border-b border-[var(--border-normal)] pb-2.5">
                    <span className="text-[var(--text-secondary)] font-medium">Solve Status</span>
                    <span
                      className={cn(
                        "font-bold",
                        questionStats.solved ? "text-emerald-400" : "text-amber-400"
                      )}
                    >
                      {questionStats.solved ? "Solved" : "Unsolved"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border(--border-normal) pb-2.5">
                    <span className="text-[var(--text-secondary)] font-medium">Total Attempts</span>
                    <span className="text-[var(--text-primary)] font-bold">{questionStats.attempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)] font-medium">Your Accuracy</span>
                    <span className="text-[var(--text-primary)] font-bold">{questionStats.accuracy}%</span>
                  </div>
                </div>
              </GlassCard>

              {/* COMPANY RELEVANCE */}
              {currentQuestion.companyRelevance && currentQuestion.companyRelevance.length > 0 && (
                <GlassCard className="space-y-3">
                  <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-400" />
                    Company Relevance
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {currentQuestion.companyRelevance.map((comp) => (
                      <span
                        key={comp}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--bg-hover)] border border-[var(--border-normal)] text-[var(--text-secondary)]"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* HELP GUIDE */}
              <GlassCard className="text-xs text-[var(--text-secondary)] leading-relaxed space-y-2.5">
                <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                  <Brain className="h-4 w-4 text-indigo-400" />
                  Practice Smart
                </h4>
                <p>
                  MCQ Arena rewards correct answers with XP based on question difficulty:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Easy: +5 XP</li>
                  <li>Medium: +10 XP</li>
                  <li>Hard: +20 XP</li>
                </ul>
                <p className="text-[10px] text-[var(--text-muted)] italic">
                  Note: XP is awarded only for the first correct solve of a question to prevent grinding.
                </p>
              </GlassCard>
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <GlassCard className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <HelpCircle className="h-12 w-12 text-[var(--text-muted)]" />
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)]">No matching questions found</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-sm">
                Try widening your search terms or relaxing your topic and difficulty filters.
              </p>
            </div>
            <button
              onClick={handleResetSearchFilters}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
            >
              Reset Filters
            </button>
          </GlassCard>
        )}
      </div>
    </AppShell>
  );
}
