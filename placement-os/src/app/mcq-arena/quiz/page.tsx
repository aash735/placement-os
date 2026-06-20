"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import mcqQuestions from "@/data/mcq-questions.json";
import type { MCQQuestion, MCQSession } from "@/types";
import {
  Clock,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  HelpCircle,
  Trophy,
  Award,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MCQQuizPage() {
  const router = useRouter();
  const { completeMcqSession } = useProgressStore();

  // Quiz Phases: 'setup' | 'active' | 'results'
  const [phase, setPhase] = useState<'setup' | 'active' | 'results'>('setup');

  // Setup Configurations
  const [quizSize, setQuizSize] = useState<number>(10);
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  // Active Quiz State
  const [quizQuestions, setQuizQuestions] = useState<MCQQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> selectedOption letter
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const [initialTime, setInitialTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Results State
  const [sessionResults, setSessionResults] = useState<MCQSession | null>(null);
  const [viewQuestionIndex, setViewQuestionIndex] = useState<number>(0);

  // Unique topics list
  const topicsList = useMemo(() => {
    const topics = new Set<string>();
    (mcqQuestions as MCQQuestion[]).forEach((q) => {
      topics.add(q.topic);
    });
    return ["All Topics", ...Array.from(topics)];
  }, []);

  const submitQuiz = (wasTimeout = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = initialTime - timeLeft;
    let correctCount = 0;

    quizQuestions.forEach((q) => {
      const ans = answers[q.id];
      if (ans === q.answer) {
        correctCount += 1;
      }
    });

    const session: MCQSession = {
      id: `session-${Date.now()}`,
      type: "quiz",
      title: `Timed Quiz (${quizQuestions.length} Qs)`,
      questionIds: quizQuestions.map((q) => q.id),
      answers,
      correctCount,
      totalQuestions: quizQuestions.length,
      timeSpentSec: timeSpent,
      completedAt: new Date().toISOString(),
    };

    // Save attempt and award XP inside the store
    completeMcqSession(session);

    setSessionResults(session);
    setPhase("results");
    setViewQuestionIndex(0);

    if (wasTimeout) {
      alert("Time limit reached! Your quiz has been automatically submitted.");
    }
  };

  const handleAutoSubmit = () => {
    submitQuiz(true);
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

  // Start Quiz
  const handleStartQuiz = () => {
    // Filter questions based on setup selection
    const pool = (mcqQuestions as MCQQuestion[]).filter((q) => {
      const matchesTopic = selectedTopic === "All Topics" || q.topic === selectedTopic;
      const matchesDiff = selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
      return matchesTopic && matchesDiff;
    });

    if (pool.length === 0) {
      alert("No questions match your current filters. Please choose different filters.");
      return;
    }

    // Shuffle and pick size
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(quizSize, shuffled.length));

    // Time: 90 seconds per question
    const totalTimeSec = selected.length * 90;

    setQuizQuestions(selected);
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


  // Manual Submit
  const handleManualSubmit = () => {
    const unansweredCount = quizQuestions.length - Object.keys(answers).length;
    if (unansweredCount > 0) {
      if (
        !confirm(
          `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`
        )
      ) {
        return;
      }
    }
    submitQuiz(false);
  };



  // Retake / Setup Reset
  const handleReset = () => {
    setPhase("setup");
    setQuizQuestions([]);
    setCurrentQIndex(0);
    setAnswers({});
    setSessionResults(null);
  };

  const handleNext = () => {
    if (currentQIndex < quizQuestions.length - 1) {
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
    <AppShell title="Timed Quiz Mode" subtitle="Practice under time constraints to prepare for screening tests">
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
        {/* PHASE 1: SETUP SCREEN */}
        {phase === "setup" && (
          <div className="max-w-xl mx-auto space-y-6">
            <GlassCard className="space-y-6">
              <div className="text-center space-y-1.5 pb-4 border-b border-[var(--border-normal)]">
                <Clock className="h-10 w-10 text-indigo-400 mx-auto" />
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Configure Timed Quiz</h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Pick your focus area, difficulty, and size to generate a custom assessment.
                </p>
              </div>

              {/* QUIZ SIZE */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-secondary)]">Number of Questions</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[10, 20, 30, 50].map((size) => (
                    <button
                      key={size}
                      onClick={() => setQuizSize(size)}
                      className={cn(
                        "py-2.5 rounded-xl border text-sm font-semibold transition-all",
                        quizSize === size
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold"
                          : "border-[var(--border-normal)] bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:border-indigo-500/50"
                      )}
                    >
                      {size} Qs
                    </button>
                  ))}
                </div>
              </div>

              {/* TOPIC SELECTION */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-secondary)]">Syllabus Topic</label>
                <Select
                  value={selectedTopic}
                  onValueChange={(val) => setSelectedTopic(val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Syllabus Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    {topicsList.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* DIFFICULTY MIX */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--text-secondary)]">Target Difficulty</label>
                <div className="grid grid-cols-4 gap-2.5">
                  {["All", "Easy", "Medium", "Hard"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={cn(
                        "py-2 text-xs font-semibold rounded-xl border transition-all",
                        selectedDifficulty === diff
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold"
                          : "border-[var(--border-normal)] bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:border-indigo-500/50"
                      )}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* LAUNCH BUTTON */}
              <button
                onClick={handleStartQuiz}
                className="w-full py-3 font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(99,102,241,0.25)]"
              >
                <Play className="h-4 w-4 fill-white" /> Start Timed Quiz
              </button>
            </GlassCard>

            {/* INFO NOTES */}
            <GlassCard className="text-xs text-[var(--text-secondary)] space-y-2">
              <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-indigo-400" /> Quiz Rules & Parameters
              </h4>
              <p>
                - You are allocated <strong>90 seconds</strong> per question.
              </p>
              <p>
                - Closing the page or exiting mid-test does not pause the timer.
              </p>
              <p>
                - Completing a quiz awards a <strong>+50 XP bonus</strong>, in addition to standard question XP.
              </p>
            </GlassCard>
          </div>
        )}

        {/* ================================================== */}
        {/* PHASE 2: ACTIVE QUIZ SCREEN */}
        {phase === "active" && quizQuestions.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* MAIN TEST INTERFACE */}
            <div className="col-span-1 lg:col-span-8 space-y-6">
              {/* HEADER WITH TIMER */}
              <GlassCard className="flex items-center justify-between border-indigo-500/20 bg-indigo-500/5">
                <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  <span>{selectedTopic === "All Topics" ? "Mixed Quiz" : selectedTopic}</span>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold",
                    timeLeft < 60
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
                const q = quizQuestions[currentQIndex];
                return (
                  <GlassCard className="space-y-4">
                    {/* BANNERS */}
                    <div className="flex items-center justify-between pb-3 border-b border-[var(--border-normal)]">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--bg-hover)] border border-[var(--border-normal)] text-[var(--text-secondary)]">
                        Question {currentQIndex + 1} of {quizQuestions.length}
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

                    {/* STATEMENT */}
                    <div className="space-y-3">
                      <h3 className="text-md font-bold text-[var(--text-primary)]">{q.title}</h3>
                      {q.scenario && (
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{q.scenario}</p>
                      )}
                    </div>

                    {/* CODE */}
                    {q.code && (
                      <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-xs overflow-x-auto leading-relaxed max-h-[300px]">
                        <code>{q.code}</code>
                      </pre>
                    )}

                    {/* OPTIONS */}
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

                    {/* ACTIVE NAV CONTROLS */}
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-normal)]">
                      <button
                        disabled={currentQIndex === 0}
                        onClick={handlePrev}
                        className="px-4 py-2 rounded-xl border border-[var(--border-normal)] bg-[var(--bg-hover)] hover:bg-[var(--border-normal)] text-[var(--text-primary)] text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                      >
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </button>

                      {currentQIndex < quizQuestions.length - 1 ? (
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
                          Submit Test
                        </button>
                      )}
                    </div>
                  </GlassCard>
                );
              })()}
            </div>

            {/* NAV GRID SIDEBAR */}
            <div className="col-span-1 lg:col-span-4 space-y-6">
              <GlassCard className="space-y-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Question Navigator</h3>
                <div className="grid grid-cols-5 gap-2">
                  {quizQuestions.map((q, idx) => {
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

              {/* PROGRESS STATUS */}
              <GlassCard className="text-xs text-[var(--text-secondary)] space-y-3">
                <h4 className="font-bold text-[var(--text-primary)]">Test Stats</h4>
                <div className="flex justify-between">
                  <span>Answered:</span>
                  <span className="font-bold text-[var(--text-primary)]">
                    {Object.keys(answers).length} / {quizQuestions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pace Requirement:</span>
                  <span className="font-bold text-[var(--text-primary)]">90s per Q</span>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* ================================================== */}
        {/* PHASE 3: RESULTS SCREEN */}
        {phase === "results" && sessionResults && (
          <div className="space-y-6">
            {/* SCORE CARD */}
            <GlassCard className="max-w-2xl mx-auto text-center space-y-5 border-emerald-500/20 bg-emerald-500/5">
              <Trophy className="h-14 w-14 text-amber-400 mx-auto" />
              <div>
                <h2 className="text-2xl font-black text-[var(--text-primary)]">Quiz Completed!</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1.5">
                  Excellent effort. Your score has been logged to your progress tracking analytics.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-2">
                <div className="p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-normal)]">
                  <p className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Score</p>
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

              {/* CELEBRATORY STATUS */}
              {Math.round((sessionResults.correctCount / sessionResults.totalQuestions) * 100) >= 80 ? (
                <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Congratulations! You cleared the 80% accuracy threshold for OA qualification!
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-xs font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Accuracy is below 80%. Review explanations below and practice weak areas to improve.
                </div>
              )}

              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
                >
                  Take Another Quiz
                </button>
                <button
                  onClick={() => router.push("/mcq-arena")}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-[var(--bg-hover)] hover:bg-[var(--border-normal)] text-[var(--text-primary)] transition-all border border-[var(--border-normal)]"
                >
                  Return to Dashboard
                </button>
              </div>
            </GlassCard>

            {/* EXPANDED REVIEW SCREEN */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 max-w-5xl mx-auto">
              {/* SIDEBAR: QUESTION REVIEW SELECTOR */}
              <div className="col-span-1 lg:col-span-4 space-y-4">
                <GlassCard className="space-y-4">
                  <h3 className="text-xs font-bold text-[var(--text-primary)]">Review Answers</h3>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                    {quizQuestions.map((q, idx) => {
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

              {/* REVIEW VIEW WRAPPER */}
              {(() => {
                const q = quizQuestions[viewQuestionIndex];
                if (!q) return null;
                const userAns = sessionResults.answers[q.id] || "None";
                const isCorrect = userAns === q.answer;
                return (
                  <div className="col-span-1 lg:col-span-8 space-y-4">
                    <GlassCard className="space-y-4">
                      {/* HEAD */}
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

                      {/* CONTENT */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-[var(--text-primary)]">{q.title}</h4>
                        {q.scenario && (
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{q.scenario}</p>
                        )}
                      </div>

                      {/* CODE */}
                      {q.code && (
                        <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-[10px] overflow-x-auto leading-relaxed max-h-[220px]">
                          <code>{q.code}</code>
                        </pre>
                      )}

                      {/* OPTIONS */}
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

                    {/* EXPLANATION */}
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
