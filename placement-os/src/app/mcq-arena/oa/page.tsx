"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import mcqQuestions from "@/data/mcq-questions.json";
import type { MCQQuestion, MCQSession } from "@/types";
import {
  Clock,
  Play,
  CheckCircle,
  XCircle,
  HelpCircle,
  Trophy,
  Award,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Building2,
  Sparkles,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyOaConfig {
  id: string;
  name: string;
  durationMin: number;
  questionCount: number;
  topicsFocus: string[];
  accent: string;
  borderColor: string;
  desc: string;
}

const COMPANY_OAS: CompanyOaConfig[] = [
  {
    id: "amazon-oa",
    name: "Amazon Style OA",
    durationMin: 40,
    questionCount: 20,
    topicsFocus: ["Trees", "Dynamic Programming", "Graphs", "Binary Search"],
    accent: "from-orange-500 to-amber-600 bg-orange-500/5",
    borderColor: "border-orange-500/20",
    desc: "A high-intensity simulation focusing on advanced data structures, shortest paths, and dynamic state optimization.",
  },
  {
    id: "microsoft-oa",
    name: "Microsoft Style OA",
    durationMin: 30,
    questionCount: 15,
    topicsFocus: ["Bit Manipulation", "Tries", "DSU", "Segment Trees"],
    accent: "from-blue-500 to-indigo-600 bg-blue-500/5",
    borderColor: "border-blue-500/20",
    desc: "Assessments emphasizing binary representations, prefix trees, disjoint set unions, and range queries.",
  },
  {
    id: "adobe-oa",
    name: "Adobe Style OA",
    durationMin: 45,
    questionCount: 25,
    topicsFocus: ["Strings", "Recursion", "Sorting", "Stacks", "Queues"],
    accent: "from-red-500 to-rose-600 bg-red-500/5",
    borderColor: "border-red-500/20",
    desc: "Focuses on text parsing, sorting constraints, linear containers, and recursive search strategies.",
  },
  {
    id: "product-oa",
    name: "Product Company OA",
    durationMin: 35,
    questionCount: 20,
    topicsFocus: ["Arrays", "Hashing", "Heaps", "Greedy", "Sliding Window", "Two Pointers"],
    accent: "from-emerald-500 to-teal-600 bg-emerald-500/5",
    borderColor: "border-emerald-500/20",
    desc: "A balanced simulation covering window operations, lookup speed optimization, and greedy scheduling patterns.",
  },
  {
    id: "placement-booster-oa",
    name: "Placement Booster OA",
    durationMin: 50,
    questionCount: 30,
    topicsFocus: [
      "Arrays", "Strings", "Linked Lists", "Stacks", "Queues", "Trees", 
      "Graphs", "Dynamic Programming", "Greedy", "Binary Search"
    ],
    accent: "from-purple-500 to-violet-600 bg-purple-500/5",
    borderColor: "border-purple-500/20",
    desc: "Comprehensive assessment containing a balanced distribution across all core syllabus topics.",
  }
];

export default function MCQOAPage() {
  const router = useRouter();
  const { completeMcqSession } = useProgressStore();

  // OA Phases: 'setup' | 'active' | 'results'
  const [phase, setPhase] = useState<'setup' | 'active' | 'results'>('setup');
  const [selectedOa, setSelectedOa] = useState<CompanyOaConfig | null>(null);

  // Active Test State
  const [oaQuestions, setOaQuestions] = useState<MCQQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> selectedOption letter
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const [initialTime, setInitialTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Results State
  const [sessionResults, setSessionResults] = useState<MCQSession | null>(null);
  const [viewQuestionIndex, setViewQuestionIndex] = useState<number>(0);

  // Smart Shuffling (Phase 7)
  const smartShuffle = (questions: MCQQuestion[]): MCQQuestion[] => {
    // Group by topic
    const topicGroups: Record<string, MCQQuestion[]> = {};
    questions.forEach((q) => {
      if (!topicGroups[q.topic]) topicGroups[q.topic] = [];
      topicGroups[q.topic].push(q);
    });

    // Shuffle each group in-place
    Object.keys(topicGroups).forEach((topic) => {
      topicGroups[topic].sort(() => 0.5 - Math.random());
    });

    const result: MCQQuestion[] = [];
    // Filter active topics
    const activeTopics = Object.keys(topicGroups).filter((t) => topicGroups[t].length > 0);

    // Round-robin selection from topic lists to prevent identical topic runs
    while (activeTopics.length > 0) {
      for (let i = 0; i < activeTopics.length; i++) {
        const topic = activeTopics[i];
        const q = topicGroups[topic].pop();
        if (q) {
          result.push(q);
        }
        if (topicGroups[topic].length === 0) {
          activeTopics.splice(i, 1);
          i--; // adjust index after removal
        }
      }
    }
    return result;
  };

  // Timer effect
  useEffect(() => {
    if (phase === "active" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, timeLeft]);

  // Start Assessment
  const handleStartOa = (oa: CompanyOaConfig) => {
    setSelectedOa(oa);

    // Filter questions focused on company topics
    let matchingQuestions = (mcqQuestions as MCQQuestion[]).filter((q) =>
      oa.topicsFocus.includes(q.topic)
    );

    // If pool is too small, pull from general pool to reach target count
    if (matchingQuestions.length < oa.questionCount) {
      const extraQuestions = (mcqQuestions as MCQQuestion[]).filter(
        (q) => !oa.topicsFocus.includes(q.topic)
      );
      matchingQuestions = [...matchingQuestions, ...extraQuestions];
    }

    // Apply Smart Shuffling to prevent clustering (Phase 7)
    const shuffled = smartShuffle(matchingQuestions);
    const selected = shuffled.slice(0, oa.questionCount);

    const totalTimeSec = oa.durationMin * 60;

    setOaQuestions(selected);
    setCurrentQIndex(0);
    setAnswers({});
    setTimeLeft(totalTimeSec);
    setInitialTime(totalTimeSec);
    setPhase("active");
  };

  // Option Select
  const handleSelectOption = (questionId: string, optionLetter: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionLetter,
    }));
  };

  // Auto submit when timer runs out
  const handleAutoSubmit = () => {
    submitOa(true);
  };

  // Manual Submit
  const handleManualSubmit = () => {
    const unansweredCount = oaQuestions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      if (
        !confirm(
          `You have ${unansweredCount} unanswered questions. Are you sure you want to finish the assessment?`
        )
      ) {
        return;
      }
    }
    submitOa(false);
  };

  const submitOa = (wasTimeout = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = initialTime - timeLeft;
    let correctCount = 0;

    oaQuestions.forEach((q) => {
      const ans = answers[q.id];
      if (ans === q.answer) {
        correctCount += 1;
      }
    });

    const session: MCQSession = {
      id: `session-${Date.now()}`,
      type: "oa",
      title: selectedOa?.name || "Company OA",
      companyName: selectedOa?.name.replace(" Style OA", "") || undefined,
      questionIds: oaQuestions.map((q) => q.id),
      answers,
      correctCount,
      totalQuestions: oaQuestions.length,
      timeSpentSec: timeSpent,
      completedAt: new Date().toISOString(),
    };

    // Save session in store and award XP (+150 XP bonus for company OA completion)
    completeMcqSession(session);

    setSessionResults(session);
    setPhase("results");
    setViewQuestionIndex(0);

    if (wasTimeout) {
      alert("Assessment time has expired! Your answers have been submitted.");
    }
  };

  // Reset Setup Screen
  const handleReset = () => {
    setPhase("setup");
    setSelectedOa(null);
    setOaQuestions([]);
    setCurrentQIndex(0);
    setAnswers({});
    setSessionResults(null);
  };

  const handleNext = () => {
    if (currentQIndex < oaQuestions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex((prev) => prev - 1);
    }
  };

  // Format Time (MM:SS)
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <AppShell title="Company OA Simulator" subtitle="Assess your preparedness using strict company-specific screening tests">
      <div className="space-y-6">
        {/* BACK NAVIGATION */}
        {phase === "setup" && (
          <button
            onClick={() => router.push("/mcq-arena")}
            className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Dashboard
          </button>
        )}

        {/* ================================================== */}
        {/* PHASE 1: OA SELECTION SCREEN */}
        {phase === "setup" && (
          <div className="space-y-6">
            <div className="text-center max-w-lg mx-auto space-y-2">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Select Assessment Challenge</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Choose a company profile to evaluate your technical screening readiness. Tests replicate historical recruitment patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {COMPANY_OAS.map((oa) => (
                <GlassCard
                  key={oa.id}
                  className={cn("flex flex-col justify-between border", oa.borderColor, oa.accent)}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[var(--text-primary)]">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/10 text-[var(--text-primary)]">
                        {oa.questionCount} Qs · {oa.durationMin} Min
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">{oa.name}</h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{oa.desc}</p>
                    </div>

                    {/* FOCUS TOPICS */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Core Focus:</span>
                      <div className="flex flex-wrap gap-1">
                        {oa.topicsFocus.slice(0, 4).map((topic) => (
                          <span
                            key={topic}
                            className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--text-secondary)]"
                          >
                            {topic}
                          </span>
                        ))}
                        {oa.topicsFocus.length > 4 && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[var(--text-muted)]">
                            +{oa.topicsFocus.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartOa(oa)}
                    className="mt-6 w-full py-2.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-150 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    Start Test <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* PHASE 2: ACTIVE TEST INTERFACE */}
        {phase === "active" && selectedOa && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* ACTIVE TEST CORE */}
            <div className="col-span-1 lg:col-span-8 space-y-6">
              {/* BRANDING HEADER */}
              <GlassCard className="flex items-center justify-between border-indigo-500/20 bg-indigo-500/5">
                <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                  <Building2 className="h-5 w-5 text-indigo-400 animate-pulse" />
                  <span>{selectedOa.name} Simulation</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold",
                    timeLeft < 180
                      ? "border-rose-500/20 bg-rose-500/10 text-rose-400 animate-pulse"
                      : "border-indigo-500/20 bg-indigo-500/10 text-indigo-400"
                  )}
                >
                  <Clock className="h-4 w-4" />
                  {formatTime(timeLeft)}
                </div>
              </GlassCard>

              {/* CURRENT QUESTION DISPLAY */}
              {(() => {
                const q = oaQuestions[currentQIndex];
                return (
                  <GlassCard className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-normal)]">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--bg-hover)] border border-[var(--border-normal)] text-[var(--text-secondary)]">
                        Question {currentQIndex + 1} of {oaQuestions.length}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                          q.difficulty === "Easy" && "bg-emerald-500/10 text-emerald-400",
                          q.difficulty === "Medium" && "bg-blue-500/10 text-blue-400",
                          q.difficulty === "Hard" && "bg-rose-500/10 text-rose-400"
                        )}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-md font-bold text-[var(--text-primary)]">{q.title}</h3>
                      {q.scenario && (
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{q.scenario}</p>
                      )}
                    </div>

                    {q.code && (
                      <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-[300px]">
                        <code>{q.code}</code>
                      </pre>
                    )}

                    <div className="space-y-2.5 pt-2">
                      {q.options.map((opt) => {
                        const optionLetter = opt.charAt(0).toUpperCase();
                        const isSelected = answers[q.id] === optionLetter;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleSelectOption(q.id, optionLetter)}
                            className={cn(
                              "w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-all flex items-start gap-3",
                              "bg-[var(--bg-elevated)] border-[var(--border-normal)] hover:border-indigo-500/50 hover:bg-indigo-500/5",
                              isSelected && "border-indigo-500 bg-indigo-500/10"
                            )}
                          >
                            <span
                              className={cn(
                               "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[11px] font-bold",
                               isSelected ? "border-indigo-500 bg-indigo-500 text-white" : "border-[var(--border-normal)] bg-[var(--bg-hover)] text-[var(--text-muted)]"
                              )}
                            >
                              {optionLetter}
                            </span>
                            <span className="text-[var(--text-primary)] leading-normal">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-normal)]">
                      <button
                        disabled={currentQIndex === 0}
                        onClick={handlePrev}
                        className="px-4 py-2 rounded-xl border border-[var(--border-normal)] bg-[var(--bg-hover)] hover:bg-[var(--border-normal)] text-[var(--text-primary)] text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </button>

                      {currentQIndex < oaQuestions.length - 1 ? (
                        <button
                          onClick={handleNext}
                          className="px-4 py-2 rounded-xl border border-[var(--border-normal)] bg-[var(--bg-hover)] hover:bg-[var(--border-normal)] text-[var(--text-primary)] text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          Next <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleManualSubmit}
                          className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
                        >
                          Finish Assessment
                        </button>
                      )}
                    </div>
                  </GlassCard>
                );
              })()}
            </div>

            {/* NAV PANEL */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              <GlassCard className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Navigator</h3>
                <div className="grid grid-cols-4 gap-2">
                  {oaQuestions.map((q, idx) => {
                    const answered = !!answers[q.id];
                    const active = idx === currentQIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQIndex(idx)}
                        className={cn(
                          "h-10 w-full rounded-xl border text-xs font-bold flex items-center justify-center transition-all",
                          active && "border-indigo-500 bg-indigo-500/10 text-indigo-400 ring-2 ring-indigo-500/20",
                          !active && answered && "border-indigo-500/30 bg-indigo-500/5 text-indigo-300",
                          !active && !answered && "border-[var(--border-normal)] bg-[var(--bg-hover)] text-[var(--text-muted)] hover:border-indigo-500/30"
                        )}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </GlassCard>

              {/* STRICT WARNING */}
              <GlassCard className="text-xs text-[var(--text-secondary)] border-rose-500/20 bg-rose-500/5 space-y-2">
                <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" /> Proctor Rules
                </h4>
                <p>
                  - Do not refresh the page. Refreshing will submit current answers.
                </p>
                <p>
                  - You must complete the assessment in the allocated time.
                </p>
                <p>
                  - Correct answers award XP based on difficulty. Completing this simulation awards a <strong>+150 XP bonus</strong>!
                </p>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* PHASE 3: RESULTS SCREEN */}
        {phase === "results" && sessionResults && (
          <div className="space-y-6">
            <GlassCard className="max-w-2xl mx-auto text-center space-y-5 border-indigo-500/20 bg-indigo-500/5">
              <Trophy className="h-14 w-14 text-amber-400 mx-auto" />
              <div>
                <h2 className="text-2xl font-black text-[var(--text-primary)]">Assessment Completed!</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5">
                  Your results have been sync'd to Supabase and merged with your interview readiness dashboard.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
                <div className="p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-normal)]">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Cleared</p>
                  <p className="text-xl font-bold text-[var(--text-primary)] mt-1">
                    {sessionResults.correctCount} / {sessionResults.totalQuestions}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-normal)]">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Accuracy</p>
                  <p className="text-xl font-bold text-[var(--text-primary)] mt-1">
                    {Math.round((sessionResults.correctCount / sessionResults.totalQuestions) * 100)}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-normal)]">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Duration</p>
                  <p className="text-xl font-bold text-[var(--text-primary)] mt-1">
                    {formatTime(sessionResults.timeSpentSec)}
                  </p>
                </div>
              </div>

              {Math.round((sessionResults.correctCount / sessionResults.totalQuestions) * 100) >= 80 ? (
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Passed! Your scoring makes you highly competitive for actual company OAs!
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Accuracy is below 80%. Review incorrect questions below to refine key DSA concepts.
                </div>
              )}

              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all animate-bounce"
                >
                  Start Another OA
                </button>
                <button
                  onClick={() => router.push("/mcq-arena")}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[var(--bg-hover)] hover:bg-[var(--border-normal)] text-[var(--text-primary)] transition-all border border-[var(--border-normal)]"
                >
                  Return to Dashboard
                </button>
              </div>
            </GlassCard>

            {/* DETAIL REVIEW PANELS */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 max-w-5xl mx-auto">
              {/* review selector list */}
              <div className="col-span-1 lg:col-span-4 space-y-4">
                <GlassCard className="space-y-4">
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">Question Review</h3>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {oaQuestions.map((q, idx) => {
                      const userAns = sessionResults.answers[q.id];
                      const correct = userAns === q.answer;
                      return (
                        <button
                          key={q.id}
                          onClick={() => setViewQuestionIndex(idx)}
                          className={cn(
                            "w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between",
                            idx === viewQuestionIndex
                              ? "border-indigo-500 bg-indigo-500/10"
                              : "border-[var(--border-normal)] bg-[var(--bg-hover)]"
                          )}
                        >
                          <span className="truncate max-w-[150px]">
                            {idx + 1}. {q.title}
                          </span>
                          {correct ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>

              {/* active review display */}
              {(() => {
                const q = oaQuestions[viewQuestionIndex];
                if (!q) return null;
                const userAns = sessionResults.answers[q.id] || "None";
                const isCorrect = userAns === q.answer;
                return (
                  <div className="col-span-1 lg:col-span-8 space-y-4">
                    <GlassCard className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-normal)]">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-[var(--bg-hover)] border border-[var(--border-normal)] text-[var(--text-secondary)]">
                          Question {viewQuestionIndex + 1} Review
                        </span>
                        <div className="flex gap-2">
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                              isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                            )}
                          >
                            {isCorrect ? "Correct" : "Incorrect"}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-zinc-500/10 text-zinc-400">
                            {q.difficulty}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-bold text-[var(--text-primary)]">{q.title}</h4>
                        {q.scenario && (
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{q.scenario}</p>
                        )}
                      </div>

                      {q.code && (
                        <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-[10px] overflow-x-auto leading-relaxed max-h-[220px]">
                          <code>{q.code}</code>
                        </pre>
                      )}

                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const letter = opt.charAt(0).toUpperCase();
                          const isCorrectOpt = letter === q.answer;
                          const isSelectedOpt = letter === userAns;
                          return (
                            <div
                              key={opt}
                              className={cn(
                                "p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5",
                                "bg-[var(--bg-elevated)] border-[var(--border-normal)]",
                                isCorrectOpt && "border-emerald-500 bg-emerald-500/5 text-emerald-400",
                                isSelectedOpt && !isCorrectOpt && "border-rose-500 bg-rose-500/5 text-rose-400"
                              )}
                            >
                              <span
                                className={cn(
                                  "flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-bold border",
                                  isCorrectOpt && "border-emerald-500 bg-emerald-500 text-white",
                                  isSelectedOpt && !isCorrectOpt && "border-rose-500 bg-rose-500 text-white",
                                  !isCorrectOpt && !isSelectedOpt && "border-[var(--border-normal)] text-[var(--text-muted)]"
                                )}
                              >
                                {letter}
                              </span>
                              <span className="text-[var(--text-primary)] leading-normal">{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </GlassCard>

                    <GlassCard className="border-emerald-500/10 bg-emerald-500/5 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                        <HelpCircle className="h-4 w-4" /> Explanation
                      </div>
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed italic">
                        {q.explanation}
                      </p>
                    </GlassCard>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
