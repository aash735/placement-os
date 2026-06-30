"use client";

import { useState, useEffect, use } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { aptitudeQuestions } from "@/data/aptitude-questions";
import { validateQuestion } from "@/lib/aptitude-validator";
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Flag,
  HelpCircle,
  Eye,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Lightbulb,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { MathRenderer } from "@/components/ui/math-renderer";
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

const TOPIC_NAMES: Record<string, string> = {
  "number-system": "Number System",
  "percentages": "Percentages & Profit-Loss",
  "profit-loss": "Profit and Loss",
  "ratios": "Ratio & Proportion",
  "time-work": "Time & Work",
  "speed": "Time, Speed & Distance",
  "probability": "Probability",
  "permutation-combination": "Permutation & Combination",
  "average": "Average",
  "simple-interest": "Simple Interest",
  "compound-interest": "Compound Interest",
  "hcf-lcm": "H.C.F. and L.C.M.",
  "simplification": "Simplification",
  "ages": "Problems on Ages",
  "pipes-cisterns": "Pipes and Cisterns",
  "direction-sense": "Direction Sense",
  "blood-relations": "Blood Relations",
  "coding-decoding": "Coding-Decoding",
  "syllogism": "Syllogism",
  "seating-arrangement": "Seating Arrangement",
  "statement-conclusion": "Statement Conclusion",
  "series": "Number & Letter Series",
  "analogy": "Analogy",
  "clocks": "Clocks",
  "calendar": "Calendar",
  "synonyms": "Synonyms",
  "antonyms": "Antonyms",
  "sentence-improvement": "Sentence Improvement",
  "rc": "Reading Comprehension",
  "error-detection": "Error Detection",
  "vocab": "Vocabulary & Para Jumbles",
  "tables": "Tables",
  "pie-charts": "Pie Charts",
  "bar-graphs": "Bar Graphs",
  "line-graphs": "Line Graphs",
  "caselets": "Caselets",
  "general": "General Aptitude"
};

export default function PracticeRoomPage() {
  const router = useRouter();
  const rawParams = useParams();
  const params = rawParams ? (typeof (rawParams as any).then === 'function' ? use(rawParams as any) : rawParams) as any : {} as any;
  const topicId = (params?.topicId as string) || "";

  const { 
    aptitudeBookmarks = [], 
    aptitudeRevision = [],
    aptitudePracticeAttempts = [],
    toggleAptitudeBookmark,
    toggleAptitudeRevision,
    logAptitudePracticeAttempt
  } = useProgressStore();

  // Filter questions for this topic and ensure they pass the strict validation
  const questions = aptitudeQuestions.filter((q) => q.topic === topicId && validateQuestion(q).valid);
  const topicName = TOPIC_NAMES[topicId] || topicId.replace(/-/g, " ");

  // Room states
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isExplanationRevealed, setIsExplanationRevealed] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // Initialize start time for the first question
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIdx]);

  if (questions.length === 0) {
    return (
      <AppShell title="Practice Room" subtitle="No questions found">
        <div className="max-w-md mx-auto mt-12 text-center">
          <GlassCard className="p-8 border-white/5" hover={false}>
            <HelpCircle className="h-12 w-12 mx-auto text-zinc-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Questions Found</h3>
            <p className="text-sm text-zinc-400 mb-6">
              We don't have any practice questions loaded for "{topicName}" yet. Please try another topic.
            </p>
            <Link href="/aptitude">
              <button className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-colors flex items-center justify-center mx-auto space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Hub</span>
              </button>
            </Link>
          </GlassCard>
        </div>
      </AppShell>
    );
  }

  const currentQuestion = questions[currentIdx];
  const isBookmarked = aptitudeBookmarks.includes(currentQuestion.id);
  const isMarkedForRevision = aptitudeRevision.includes(currentQuestion.id);

  const handleSelectOption = (option: string) => {
    if (isAnswerChecked) return;
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    if (!selectedOption || isAnswerChecked) return;

    const isCorrect = selectedOption === currentQuestion.answer;
    const timeSpentSec = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));

    logAptitudePracticeAttempt({
      id: `prac-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      topicId,
      questionId: currentQuestion.id,
      isCorrect,
      timeSpentSec,
      completedAt: new Date().toISOString(),
      userAnswer: selectedOption,
    });

    setIsAnswerChecked(true);
    setIsExplanationRevealed(true);
  };

  const handleRevealAnswer = () => {
    if (isAnswerChecked) return;

    const timeSpentSec = Math.max(1, Math.round((Date.now() - questionStartTime) / 1000));
    logAptitudePracticeAttempt({
      id: `prac-reveal-${Date.now()}`,
      topicId,
      questionId: currentQuestion.id,
      isCorrect: false,
      timeSpentSec,
      completedAt: new Date().toISOString(),
      userAnswer: "",
    });

    setIsAnswerChecked(true);
    setIsExplanationRevealed(true);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsExplanationRevealed(false);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setIsExplanationRevealed(false);
    }
  };

  const jumpToQuestion = (idx: number) => {
    setCurrentIdx(idx);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setIsExplanationRevealed(false);
  };

  const diffLabels = ["Easy", "Medium", "Hard"];
  const diffColorClasses = [
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "bg-rose-500/10 text-rose-400 border-rose-500/20",
  ];

  return (
    <AppShell title={`Practice: ${topicName}`} subtitle="Untimed practice room">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <Link href="/aptitude">
            <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{topicName} Practice Room</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Untimed learning mode · Instant feedback</p>
          </div>
        </div>

        {/* PROGRESS METRIC */}
        <div className="flex items-center space-x-3 bg-white/5 border border-white/5 rounded-xl px-4 py-2 self-start md:self-auto">
          <span className="text-xs text-zinc-400">Solved in Topic:</span>
          <span className="text-sm font-bold text-cyan-400 font-mono">
            {new Set(aptitudePracticeAttempts.filter(a => a.topicId === topicId && a.isCorrect).map(a => a.questionId)).size} / {questions.length}
          </span>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-xs text-zinc-400">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}% Complete</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-violet-600 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* MAIN QUESTION WORKSPACE */}
        <div className="lg:col-span-3 space-y-6">
          <GlassCard className="p-6 relative overflow-hidden" hover={false}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded border uppercase tracking-wider ${diffColorClasses[currentQuestion.difficulty - 1]}`}>
                {diffLabels[currentQuestion.difficulty - 1]}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAptitudeBookmark(currentQuestion.id)}
                  className={`p-2 rounded-lg border transition-all ${
                    isBookmarked
                      ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                      : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                  title="Bookmark question"
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={() => toggleAptitudeRevision(currentQuestion.id)}
                  className={`p-2 rounded-lg border transition-all ${
                    isMarkedForRevision
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                      : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                  title="Mark for revision"
                >
                  <Flag className={`h-4 w-4 ${isMarkedForRevision ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-zinc-100 text-base leading-relaxed mb-8 whitespace-pre-line font-medium">
              <MathRenderer text={currentQuestion.question} />
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
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isSelected = selectedOption === option;
                
                let optionStyle = "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white";
                
                if (isAnswerChecked) {
                  const isCorrectAnswer = option === currentQuestion.answer;
                  if (isCorrectAnswer) {
                    optionStyle = "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                  } else if (isSelected) {
                    optionStyle = "bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
                  } else {
                    optionStyle = "bg-white/5 border-white/5 text-zinc-500 opacity-60";
                  }
                } else if (isSelected) {
                  optionStyle = "bg-cyan-500/15 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]";
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleSelectOption(option)}
                    disabled={isAnswerChecked}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all ${optionStyle}`}
                  >
                    <span className="flex items-center space-x-3 pr-4">
                      <span className={`h-6 w-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isAnswerChecked && option === currentQuestion.answer ? "bg-emerald-400 text-black" :
                        isAnswerChecked && isSelected ? "bg-rose-400 text-black" :
                        isSelected ? "bg-cyan-400 text-black" : "bg-white/5 text-zinc-400"
                      }`}>
                        {letter}
                      </span>
                      <span className="text-sm font-medium">{option}</span>
                    </span>
                    {isAnswerChecked && option === currentQuestion.answer && (
                      <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerChecked && isSelected && option !== currentQuestion.answer && (
                      <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/5">
              {!isAnswerChecked ? (
                <>
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!selectedOption}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      selectedOption
                        ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                        : "bg-white/5 text-zinc-500 border border-transparent cursor-not-allowed"
                    }`}
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={handleRevealAnswer}
                    className="px-6 py-3 rounded-xl font-semibold bg-white/5 border border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white transition-all flex items-center space-x-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Reveal Answer</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  {selectedOption === currentQuestion.answer ? (
                    <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
                      <CheckCircle className="h-5 w-5" />
                      <span>Correct! Well done.</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-rose-400 font-semibold text-sm">
                      <XCircle className="h-5 w-5" />
                      <span>Incorrect response.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="ml-auto flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className={`px-4 py-2.5 rounded-xl border font-semibold flex items-center space-x-1.5 transition-all ${
                    currentIdx === 0
                      ? "border-transparent text-zinc-600 cursor-not-allowed opacity-40"
                      : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Prev</span>
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIdx === questions.length - 1}
                  className={`px-4 py-2.5 rounded-xl border font-semibold flex items-center space-x-1.5 transition-all ${
                    currentIdx === questions.length - 1
                      ? "border-transparent text-zinc-600 cursor-not-allowed opacity-40"
                      : "bg-white/5 border-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Diagnostic Source IDs Debug Panel */}
            <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[10px] text-zinc-500 font-mono">
              <div className="flex flex-wrap gap-x-4">
                <span>Question ID: {currentQuestion.id}</span>
                <span>Options ID: {currentQuestion.optionsSourceId || currentQuestion.id}</span>
                <span>Answer ID: {currentQuestion.answerSourceId || currentQuestion.id}</span>
                <span>Explanation ID: {currentQuestion.explanationSourceId || currentQuestion.id}</span>
              </div>
              {((currentQuestion.optionsSourceId && currentQuestion.optionsSourceId !== currentQuestion.id) ||
                (currentQuestion.answerSourceId && currentQuestion.answerSourceId !== currentQuestion.id) ||
                (currentQuestion.explanationSourceId && currentQuestion.explanationSourceId !== currentQuestion.id)) && (
                <span className="text-rose-400 font-semibold animate-pulse">⚠️ Mismatched Component Source Detected!</span>
              )}
            </div>
          </GlassCard>

          {/* EXPLANATION & SHORTCUTS */}
          {isExplanationRevealed && (() => {
            const P0_MSG = 'Detailed explanation will be available in a future update.';
            const isP0 = !currentQuestion.explanation || currentQuestion.explanation.trim() === P0_MSG;
            return (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
                {isP0 ? (
                  <GlassCard className="p-6 border-amber-500/15 relative overflow-hidden" hover={false}>
                    <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-base font-bold text-white flex items-center mb-3">
                      <Lightbulb className="h-5 w-5 mr-2 text-amber-400" />
                      Explanation
                    </h3>
                    <p className="text-sm text-amber-300/80 leading-relaxed">
                      Detailed explanation will be available in a future update.
                    </p>
                    <p className="text-xs text-zinc-500 mt-2">
                      The correct answer is highlighted above.
                    </p>
                  </GlassCard>
                ) : (
                  <GlassCard className="p-6 border-emerald-500/10 relative overflow-hidden" hover={false}>
                    <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-base font-bold text-white flex items-center mb-4">
                      <Lightbulb className="h-5 w-5 mr-2 text-emerald-400" />
                      Step-by-Step Explanation
                    </h3>
                    <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line font-mono text-[13px]">
                      <MathRenderer text={currentQuestion.explanation} />
                    </p>
                  </GlassCard>
                )}

                {currentQuestion.shortcuts && currentQuestion.shortcuts.length > 0 && (
                  <GlassCard className="p-6 border-violet-500/10 relative overflow-hidden" hover={false}>
                    <div className="absolute top-0 right-0 h-32 w-32 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-base font-bold text-white flex items-center mb-4">
                      <Sparkles className="h-5 w-5 mr-2 text-violet-400" />
                      Antigravity Shortcuts &amp; Formulas
                    </h3>
                    <ul className="space-y-2.5">
                      {currentQuestion.shortcuts.map((shortcut, i) => (
                        <li key={i} className="flex items-start text-sm text-zinc-300 leading-relaxed">
                          <span className="h-5 w-5 rounded-md bg-violet-500/15 border border-violet-500/20 text-violet-400 flex items-center justify-center text-[10px] font-bold shrink-0 mr-3 mt-0.5 font-mono">
                            {i + 1}
                          </span>
                          <span>{shortcut}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                )}
              </div>
            );
          })()}

        </div>

        {/* SIDE BAR QUESTION MAP */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-5" hover={false}>
            <h3 className="text-sm font-bold text-white mb-4">Topic Progress Map</h3>
            
            <div className="flex flex-wrap gap-3 mb-6 pb-4 border-b border-white/5 text-[10px] text-zinc-400">
              <div className="flex items-center space-x-1.5">
                <div className="h-2 w-2 rounded bg-emerald-500" />
                <span>Solved</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="h-2 w-2 rounded bg-rose-500" />
                <span>Incorrect</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="h-2 w-2 bg-white/10 rounded" />
                <span>Unattempted</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2.5 max-h-[400px] overflow-y-auto pr-1">
              {questions.map((q, idx) => {
                const qAttempts = aptitudePracticeAttempts.filter((a) => a.questionId === q.id);
                const isCorrect = qAttempts.some((a) => a.isCorrect);
                const hasFailed = qAttempts.length > 0 && !isCorrect;
                
                let buttonStyle = "bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10";
                
                if (idx === currentIdx) {
                  buttonStyle = "bg-cyan-500 text-black border-cyan-400 font-bold ring-2 ring-cyan-500/30";
                } else if (isCorrect) {
                  buttonStyle = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30";
                } else if (hasFailed) {
                  buttonStyle = "bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(idx)}
                    className={`h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all font-mono ${buttonStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
