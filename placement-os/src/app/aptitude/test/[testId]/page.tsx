"use client";

import { useState, useEffect, useRef, use, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { useDataStore } from "@/store/data-store";
import { getTcsSlugFromResourceId } from "@/lib/tcs-utils";
import { aptitudeQuestions, AptitudeQuestion } from "@/data/aptitude-questions";
import { validateQuestion } from "@/lib/aptitude-validator";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import {
  Clock,
  Play,
  Pause,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Calculator,
  CheckCircle,
  XCircle,
  HelpCircle,
  Flag,
  RotateCcw,
  Sparkles,
} from "lucide-react";

function TestPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawParams = useParams();
  
  // Unwrap params using React.use if it is a promise, or fallback to direct access
  const params = rawParams ? (typeof (rawParams as any).then === 'function' ? use(rawParams as any) : rawParams) as any : {} as any;
  const testId = (params?.testId as string) || "custom";

  const { completeAptitudeAttempt, shortcutsEnabled } = useProgressStore();
  const resources = useDataStore((s) => s.resources || []);
  
  const matchingResource = testId.startsWith("tcs-")
    ? resources.find((r) => getTcsSlugFromResourceId(r.id) === testId)
    : null;
    
  const testTitle = matchingResource 
    ? matchingResource.title 
    : testId === "preset-tcs" 
      ? "TCS NQT Assessment"
      : testId === "preset-infosys" 
        ? "Infosys Cognitive Test" 
        : testId === "preset-deloitte" 
          ? "Deloitte Assessment" 
          : "Standard Aptitude Challenge";

  // Parse config from URL query
  const reqQuestions = Number(searchParams.get("questions") || "15");
  const reqTime = Number(searchParams.get("time") || "20");
  const reqCategories = searchParams.get("categories")?.split(",") || ["quant", "logical"];
  const useNegMarking = searchParams.get("negMarking") === "true";

  // Test state
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // qId -> selected option
  const [marked, setMarked] = useState<Record<string, boolean>>({}); // qId -> boolean
  const [visited, setVisited] = useState<Record<string, boolean>>({}); // qId -> boolean
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(reqTime * 60);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Floating Calculator State
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [calcInput, setCalcInput] = useState<string>("");
  const [calcResult, setCalcResult] = useState<string>("");

  // Format time (MM:SS)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSelectOption = (qId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setVisited((prev) => ({ ...prev, [questions[nextIdx].id]: true }));
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setVisited((prev) => ({ ...prev, [questions[prevIdx].id]: true }));
    }
  };

  const toggleMarkForReview = (qId: string) => {
    setMarked((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const handleClearResponse = (qId: string) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  // Calculator logic
  const handleCalcClick = (val: string) => {
    if (val === "C") {
      setCalcInput("");
      setCalcResult("");
    } else if (val === "=") {
      try {
        // Safe evaluation of simple math expressions
        const sanitized = calcInput.replace(/[^0-9+\-*/().]/g, "");
        // eslint-disable-next-line no-new-func
        const res = new Function(`return ${sanitized}`)();
        setCalcResult(res.toString());
      } catch (err) {
        setCalcResult("Error");
      }
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  const submitExam = () => {
    setIsSubmitted(true);
    setShowSubmitModal(false);

    // Calculate score
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach((q) => {
      const ans = answers[q.id];
      if (!ans) {
        skipped++;
      } else if (ans === q.answer) {
        correct++;
      } else {
        wrong++;
      }
    });

    // Score: positive/negative marking
    // Standard positive: +2.0, negative: -0.5
    // Simple positive: +1.0, negative: 0.0
    const correctVal = useNegMarking ? 2 : 1;
    const wrongVal = useNegMarking ? -0.5 : 0;
    
    const rawScore = (correct * correctVal) + (wrong * wrongVal);
    const maxScore = questions.length * correctVal;
    
    // Percentage score
    const pctScore = Math.max(0, Math.round((rawScore / maxScore) * 100));

    // Save attempt to progress store
    const attemptId = `attempt-${Date.now()}`;
    completeAptitudeAttempt({
      id: attemptId,
      testType: testId.startsWith("preset-") ? "mock" : "practice",
      category: testId.startsWith("preset-") ? undefined : reqCategories.join(","),
      score: pctScore,
      totalQuestions: questions.length,
      correctAnswers: correct,
      wrongAnswers: wrong,
      skippedAnswers: skipped,
      timeSpentSec: (reqTime * 60) - timeLeft,
      completedAt: new Date().toISOString(),
      answers,
    });

    if (testId.startsWith("tcs-")) {
      const matchingRes = resources.find((r) => getTcsSlugFromResourceId(r.id) === testId);
      if (matchingRes) {
        useProgressStore.getState().setResourceProgress(matchingRes.id, "completed");
      }
    }

    // Redirect to review page
    router.replace(`/aptitude/review/${attemptId}`);
  };

  // Submission
  const handleAutoSubmit = () => {
    submitExam();
  };

  // Initialize questions
  useEffect(() => {
    if (testId && testId.startsWith("tcs-")) {
      const selected = aptitudeQuestions.filter((q) => q.id.startsWith(`${testId}-q`) && validateQuestion(q).valid);
      const sorted = [...selected].sort((a, b) => {
        const aNum = parseInt(a.id.split("-q")[1] || "0", 10);
        const bNum = parseInt(b.id.split("-q")[1] || "0", 10);
        return aNum - bNum;
      });
      setQuestions(sorted);
      if (sorted.length > 0) {
        setVisited({ [sorted[0].id]: true });
      }
      return;
    }

    const reqCategories = searchParams.get("categories")?.split(",") || ["quant", "logical"];

    // Filter questions by categories and ensure they are valid
    let pool = aptitudeQuestions.filter((q) => reqCategories.includes(q.category) && validateQuestion(q).valid);
    
    // Support filtering by topic if provided
    const reqTopics = searchParams.get("topics")?.split(",") || [];
    if (reqTopics.length > 0 && reqTopics[0] !== "") {
      pool = pool.filter((q) => reqTopics.includes(q.topic));
    }

    // Support filtering by difficulty if provided
    const diffParam = searchParams.get("difficulty");
    if (diffParam) {
      let diffNum = 2; // Default to medium if parse fails
      if (diffParam === "1" || diffParam.toLowerCase() === "beginner" || diffParam.toLowerCase() === "easy") {
        diffNum = 1;
      } else if (diffParam === "2" || diffParam.toLowerCase() === "intermediate" || diffParam.toLowerCase() === "medium") {
        diffNum = 2;
      } else if (diffParam === "3" || diffParam.toLowerCase() === "advanced" || diffParam.toLowerCase() === "hard") {
        diffNum = 3;
      }
      pool = pool.filter((q) => q.difficulty === diffNum);
    }

    // Support filtering by company if provided
    const compParam = searchParams.get("company");
    if (compParam) {
      pool = pool.filter((q) => 
        (q.companyRelevance && q.companyRelevance.some((c) => c.toLowerCase() === compParam.toLowerCase())) ||
        (q.companyTags && q.companyTags.some((c) => c.toLowerCase() === compParam.toLowerCase()))
      );
    }
    
    // Simple deterministic shuffle based on testId or date
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, reqQuestions);
    
    setQuestions(selected);
    if (selected.length > 0) {
      setVisited({ [selected[0].id]: true });
    }
  }, [testId, reqQuestions, searchParams]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      // Auto-submit when time is up
      handleAutoSubmit();
      return;
    }

    if (isPaused || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, isSubmitted]);

  // Keyboard Shortcuts Hook
  useEffect(() => {
    if (!shortcutsEnabled || isPaused || isSubmitted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is typing in calculator input, do not trigger shortcuts
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        const currentQ = questions[currentIdx];
        if (currentQ) {
          const currentAns = answers[currentQ.id];
          const currentAnsIdx = currentQ.options.indexOf(currentAns);
          let nextAns: string | undefined;
          if (currentAnsIdx === -1) {
            nextAns = currentQ.options[0];
          } else if (currentAnsIdx === currentQ.options.length - 1) {
            nextAns = undefined;
          } else {
            nextAns = currentQ.options[currentAnsIdx + 1];
          }

          if (nextAns === undefined) {
            handleClearResponse(currentQ.id);
          } else {
            handleSelectOption(currentQ.id, nextAns);
          }
        }
      } else if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        setShowSubmitModal(true);
      } else if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setShowCalculator((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcutsEnabled, isPaused, isSubmitted, currentIdx, questions, answers]);

  if (questions.length === 0) {
    return (
      <AppShell title="Loading Test..." subtitle="Preparing question paper">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mx-auto" />
            <p className="mt-4 text-zinc-400">Loading dynamic question bank...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <AppShell title="Examination Hall" subtitle="Aptitude Prep Environment">
      {/* HEADER WITH COUNTDOWN */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-bold rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {testId.startsWith("preset-") ? "MOCK TEST" : testId.startsWith("tcs-") ? "TCS PRACTICE" : "PRACTICE"}
            </span>
            {testTitle}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {testId.startsWith("tcs-")
              ? `TCS Practice Set · ${questions.length} Questions`
              : `Sectional Mode: ${reqCategories.map(c => c.toUpperCase()).join(" + ")} · Negative Marking: ${useNegMarking ? "Enabled (+2.0 / -0.5)" : "Disabled (+1.0 / 0.0)"}`
            }
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Pause/Resume */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-sm transition-all ${
              isPaused 
                ? "bg-emerald-500/15 border-emerald-500 text-emerald-400 hover:bg-emerald-500/20" 
                : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10"
            }`}
          >
            {isPaused ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4" />}
            <span>{isPaused ? "Resume" : "Pause Exam"}</span>
          </button>

          {/* TIMER CARD */}
          <div className={`px-4 py-2.5 rounded-xl border flex items-center space-x-2 text-sm font-semibold transition-all ${
            timeLeft < 120 
              ? "bg-rose-500/15 border-rose-500 text-rose-400 animate-pulse" 
              : "bg-black/40 border-white/10 text-cyan-400"
          }`}>
            <Clock className="h-4.5 w-4.5" />
            <span className="font-mono text-base">{formatTime(timeLeft)}</span>
          </div>

          {/* Calculator Trigger */}
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`p-2.5 rounded-xl border text-sm transition-all ${
              showCalculator 
                ? "bg-cyan-500/15 border-cyan-500 text-cyan-400" 
                : "bg-black/40 border-white/10 text-zinc-400 hover:text-white"
            }`}
            title="Calculator"
          >
            <Calculator className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* PAUSE SCREEN OVERLAY */}
      <AnimatePresence>
        {isPaused && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md"
          >
            <GlassCard className="max-w-md p-8 text-center border-white/10" hover={false}>
              <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4 animate-bounce" />
              <h2 className="text-xl font-bold text-white mb-2">Test Paused</h2>
              <p className="text-sm text-zinc-400 mb-6">
                To maintain test integrity, questions are hidden while the test is paused. The stopwatch is currently frozen.
              </p>
              <button 
                onClick={() => setIsPaused(false)}
                className="w-full btn-primary py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Resume Examination</span>
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* MAIN QUESTION WORKSPACE */}
        <div className="lg:col-span-3 space-y-4">
          <GlassCard className="p-6 relative min-h-[400px] flex flex-col justify-between" hover={false}>
            <div>
              {/* Question metadata */}
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <span className="text-xs font-semibold text-zinc-400">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/5 text-cyan-400 border border-white/5">
                  {currentQuestion.category.toUpperCase()}
                </span>
              </div>

              {/* Question statement */}
              <div className="mb-6">
                <h3 className="text-base md:text-lg text-white font-medium whitespace-pre-line leading-relaxed">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Visual Assets Reconstruction Rendering */}
              {currentQuestion.tableData && (
                <div className="mb-8 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-4">
                  <table className="min-w-full divide-y divide-white/10 text-sm text-zinc-300">
                    <thead>
                      <tr className="divide-x divide-white/10">
                        {currentQuestion.tableData.headers.map((header, i) => (
                          <th key={i} className="px-4 py-2 text-left font-bold text-white bg-white/5">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {currentQuestion.tableData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="divide-x divide-white/10 hover:bg-white/5 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="px-4 py-2 font-mono text-xs">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {currentQuestion.chartData && currentQuestion.chartType && (
                <div className="mb-8 p-4 rounded-xl border border-white/10 bg-white/5 h-72 min-h-[18rem]">
                  <ResponsiveContainer width="100%" height="100%">
                    {currentQuestion.chartType === "pie" ? (
                      <PieChart>
                        <Pie
                          data={currentQuestion.chartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          paddingAngle={3}
                          label={({ name, value }) => `${name}: ${value}%`}
                        >
                          {currentQuestion.chartData.map((entry, i) => (
                            <Cell key={i} fill={["#22d3ee", "#818cf8", "#34d399", "#f472b6", "#fbbf24", "#a78bfa"][i % 6]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "rgba(16, 16, 24, 0.9)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                        />
                      </PieChart>
                    ) : currentQuestion.chartType === "bar" ? (
                      <BarChart data={currentQuestion.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} />
                        <YAxis stroke="#a1a1aa" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(16, 16, 24, 0.9)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                        />
                        <Bar dataKey="value" fill="#22d3ee" radius={[4, 4, 0, 0]}>
                          {currentQuestion.chartData.map((entry, i) => (
                            <Cell key={i} fill={["#22d3ee", "#818cf8", "#34d399", "#f472b6", "#fbbf24", "#a78bfa"][i % 6]} />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <LineChart data={currentQuestion.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} />
                        <YAxis stroke="#a1a1aa" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            background: "rgba(16, 16, 24, 0.9)",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            color: "#fff",
                          }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={2} activeDot={{ r: 6 }} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index); // A, B, C, D
                  const isSelected = answers[currentQuestion.id] === option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectOption(currentQuestion.id, option)}
                      className={`w-full flex items-center p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "bg-cyan-500/10 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                          : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <span className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold mr-3 transition-all ${
                        isSelected ? "bg-cyan-400 text-black" : "bg-white/10 text-zinc-400"
                      }`}>
                        {letter}
                      </span>
                      <span className="text-sm font-medium">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ACTION CONTROLS */}
            <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleMarkForReview(currentQuestion.id)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    marked[currentQuestion.id]
                      ? "bg-violet-500/20 border-violet-500 text-violet-300"
                      : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  <Flag className="h-4 w-4" />
                  <span>{marked[currentQuestion.id] ? "Marked" : "Mark Review"}</span>
                </button>
                
                {answers[currentQuestion.id] && (
                  <button
                    onClick={() => handleClearResponse(currentQuestion.id)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-all"
                  >
                    Clear Response
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 disabled:opacity-30 disabled:pointer-events-none transition-all text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold flex items-center gap-1 text-sm transition-all"
                  >
                    <span>Save & Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold flex items-center gap-1 text-sm shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <span>Finish & Submit</span>
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* STATUS GRID & UTILITIES */}
        <div className="space-y-4">
          <GlassCard className="p-5" hover={false}>
            <h3 className="text-sm font-bold text-white mb-3">Question Navigator</h3>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 mb-4 border-b border-white/5 pb-3">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded bg-cyan-400 mr-1.5" />
                <span>Answered</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded bg-violet-500 mr-1.5" />
                <span>Marked</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded bg-zinc-700 mr-1.5" />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded border border-white/10 mr-1.5" />
                <span>Unvisited</span>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIdx;
                const isAns = !!answers[q.id];
                const isMarked = !!marked[q.id];
                const isVisit = !!visited[q.id];

                let bgClass = "border-white/10 text-zinc-400 hover:bg-white/5";
                if (isMarked) {
                  bgClass = "bg-violet-500/30 border-violet-500 text-violet-300";
                } else if (isAns) {
                  bgClass = "bg-cyan-500/20 border-cyan-400 text-cyan-300";
                } else if (isVisit) {
                  bgClass = "bg-zinc-800 border-zinc-600 text-zinc-300";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIdx(idx);
                      setVisited((prev) => ({ ...prev, [q.id]: true }));
                    }}
                    className={`h-9 w-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center ${bgClass} ${
                      isCurrent ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-zinc-950 scale-105" : ""
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Submit shortcut */}
            <div className="border-t border-white/5 pt-4 mt-5">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 text-xs font-semibold transition-all"
              >
                Submit Entire Examination
              </button>
            </div>
          </GlassCard>

          {/* CALCULATOR FLOATING MODULE */}
          {showCalculator && (
            <GlassCard className="p-4 border-cyan-500/20 relative" hover={false}>
              <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center">
                  <Calculator className="h-3.5 w-3.5 mr-1" /> Built-in Workspace
                </span>
                <button
                  onClick={() => setShowCalculator(false)}
                  className="text-[10px] text-zinc-400 hover:text-white"
                >
                  Hide
                </button>
              </div>

              {/* Calc Display */}
              <div className="bg-black/60 rounded-lg p-2.5 mb-3 text-right border border-white/5">
                <div className="text-xs text-zinc-500 h-4 font-mono truncate">{calcInput || "0"}</div>
                <div className="text-base text-cyan-300 font-bold font-mono h-6 truncate">{calcResult || "0"}</div>
              </div>

              {/* Calc Grid */}
              <div className="grid grid-cols-4 gap-1.5 font-mono">
                {["(", ")", "C", "/", "7", "8", "9", "*", "4", "5", "6", "-", "1", "2", "3", "+", "0", ".", "="].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => handleCalcClick(btn)}
                    className={`py-2 rounded text-xs font-bold text-center transition-all ${
                      btn === "=" 
                        ? "col-span-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white" 
                        : btn === "C"
                        ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        : "bg-white/5 text-zinc-300 hover:bg-white/10"
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* CONFIRMATION SUBMIT DIALOG */}
      <AnimatePresence>
        {showSubmitModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm"
          >
            <GlassCard className="max-w-md p-6 border-white/10" hover={false}>
              <h2 className="text-lg font-bold text-white mb-2">Submit Examination?</h2>
              <p className="text-sm text-zinc-400 mb-4">
                Are you sure you want to finish the exam? You have answered{" "}
                <span className="text-cyan-400 font-bold">{Object.keys(answers).length}</span> out of{" "}
                <span className="text-white font-bold">{questions.length}</span> questions.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-semibold transition-all"
                >
                  Keep Solving
                </button>
                <button
                  onClick={submitExam}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
                >
                  Yes, Submit Now
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}

export default function TestPage() {
  return (
    <Suspense fallback={
      <AppShell title="Loading Test..." subtitle="Preparing preparation environment">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mx-auto" />
            <p className="mt-4 text-zinc-400">Loading exam room...</p>
          </div>
        </div>
      </AppShell>
    }>
      <TestPageContent />
    </Suspense>
  );
}
