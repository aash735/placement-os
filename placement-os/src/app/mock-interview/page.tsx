"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { mockQuestionsData, MockQuestion } from "@/data/mock-interview-questions";
import {
  Code2,
  UserCheck,
  Globe,
  Database,
  Play,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  X,
  AlertCircle,
  Award
} from "lucide-react";
import { format } from "date-fns";

export default function MockInterviewPage() {
  const {
    interviewSession,
    interviewHistory,
    startInterviewSession,
    tickInterviewSession,
    updateInterviewAnswer,
    submitInterviewSession,
    discardInterviewSession
  } = useProgressStore();

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showHistoryDetailId, setShowHistoryDetailId] = useState<string | null>(null);
  const [dsaTab, setDsaTab] = useState<"description" | "brute" | "optimal" | "complexity">("description");

  // Self assessment variables
  const [explanationScore, setExplanationScore] = useState(70);
  const [complexityScore, setComplexityScore] = useState(70);
  const [edgeCaseChecked, setEdgeCaseChecked] = useState(false);

  const isRunning = interviewSession?.isRunning;

  // Synchronize timer on mount/focus transitions
  useEffect(() => {
    if (isRunning) {
      tickInterviewSession();
    }
  }, [isRunning, tickInterviewSession]);

  // Ticking interview timer hook - uses suspension-tolerant absolute timestamps
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tickInterviewSession();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tickInterviewSession]);

  const handleStartSession = (category: "dsa" | "hr" | "frontend" | "project") => {
    const categoryQuestions = mockQuestionsData.filter((q) => q.category === category);
    const questionCount = category === "project" ? 1 : 2;

    // Build list of seen question IDs
    const seenQuestionIds = new Set<string>();
    interviewHistory.forEach((h) => {
      if (h.questions) {
        h.questions.forEach((q: any) => {
          seenQuestionIds.add(q.id);
        });
      }
    });

    // Prioritize unseen questions
    const unseenQuestions = categoryQuestions.filter((q) => !seenQuestionIds.has(q.id));
    const pool = unseenQuestions.length >= questionCount ? unseenQuestions : categoryQuestions;

    // Shuffle and pick
    const selected = [...pool]
      .sort(() => 0.5 - Math.random())
      .slice(0, questionCount);

    startInterviewSession(category, selected);
    setActiveQuestionIndex(0);
    setDsaTab("description");
  };

  const handleOpenSubmit = () => {
    setShowSubmitModal(true);
  };

  const handleFinalSubmit = () => {
    // Calculate composite score
    let baseScore = Math.round((explanationScore + complexityScore) / 2);
    if (edgeCaseChecked) baseScore = Math.min(100, baseScore + 10); // 10% bonus for edge cases

    // Generate feedback text
    let feedback = "";
    if (baseScore >= 85) {
      feedback = "Excellent! You explained optimal approaches clearly and structures show production preparedness.";
    } else if (baseScore >= 65) {
      feedback = "Solid attempt. Focus on refining time-complexity explanations and dry-running code edge cases.";
    } else {
      feedback = "Need practice. Re-read dsa patterns, structured STAR answers, and build cleaner modular outlines.";
    }

    submitInterviewSession(baseScore, feedback);
    setShowSubmitModal(false);
  };

  // 1. ACTIVE INTERVIEW SIMULATION MODE
  if (interviewSession) {
    const minutes = Math.floor(interviewSession.timeLeft / 60);
    const seconds = interviewSession.timeLeft % 60;
    const currentQuestion: MockQuestion = interviewSession.questions[activeQuestionIndex];

    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-white">
        {/* Navigation Bar */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-900 px-6 bg-zinc-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
              Live Mock Simulation · {interviewSession.type.toUpperCase()} Round
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-xl">
              <Clock className="h-4 w-4 text-cyan-400" />
              <span>{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}</span>
            </div>
            <button
              onClick={() => {
                if (confirm("Discard this mock session and generate a new mock with different questions?")) {
                  discardInterviewSession();
                  handleStartSession(interviewSession.type);
                }
              }}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 bg-cyan-950/20 px-3 py-1.5 rounded-lg transition-all"
            >
              Generate New Mock
            </button>
            <button
              onClick={() => {
                if (confirm("Discard this mock session? Elapse data will be lost.")) {
                  discardInterviewSession();
                }
              }}
              className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-900/60"
            >
              Cancel
            </button>
          </div>
        </header>

        {/* Workspace Panels */}
        <div className="flex-1 flex overflow-hidden">
          {/* Question Nav Sidebar */}
          <aside className="w-80 border-r border-zinc-900 bg-zinc-950/30 p-4 space-y-4 overflow-y-auto shrink-0 flex flex-col">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-2">Questions Deck</div>
            <div className="space-y-2 flex-1">
              {interviewSession.questions.map((q: any, idx: number) => {
                const answerLength = (interviewSession.answers[q.id] || "").length;
                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIndex(idx)}
                    className={`w-full text-left rounded-xl p-4 border transition-all flex flex-col gap-1.5 ${
                      activeQuestionIndex === idx
                        ? "bg-cyan-950/20 border-cyan-500/40 text-cyan-300"
                        : "border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/40 text-zinc-400"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Question {idx + 1}</span>
                    <span className="font-semibold text-xs truncate w-full">{q.title}</span>
                    <span className="text-[9px] font-mono text-zinc-500 mt-1">
                      {answerLength > 0 ? `Outline: ${answerLength} chars` : "Not outlined yet"}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleOpenSubmit}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs"
            >
              Finish Mock Round
            </button>
          </aside>

          {/* Core Outline and Details Pane */}
          <main className="flex-1 flex flex-col overflow-hidden bg-zinc-950/20">
            {currentQuestion ? (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Question prompts */}
                <div className="flex-1 p-6 space-y-6 overflow-y-auto border-r border-zinc-900 flex flex-col">
                  {currentQuestion.category === "dsa" && (
                    <div className="flex border-b border-zinc-800 gap-4 mb-4 shrink-0">
                      {[
                        { id: "description", label: "Description" },
                        { id: "brute", label: "Brute Force" },
                        { id: "optimal", label: "Optimal Approach" },
                        { id: "complexity", label: "Complexity" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setDsaTab(tab.id as any)}
                          className={`pb-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                            dsaTab === tab.id
                              ? "border-cyan-500 text-cyan-400"
                              : "border-transparent text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {dsaTab === "description" || currentQuestion.category !== "dsa" ? (
                    <div className="space-y-6 flex-1">
                      <div className="space-y-2">
                        <span className="inline-flex rounded-full border border-cyan-500/20 bg-cyan-950/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                          Problem Context
                        </span>
                        <h1 className="text-xl font-bold tracking-tight text-white">{currentQuestion.title}</h1>
                      </div>

                      <p className="text-sm text-zinc-300 leading-relaxed font-mono bg-zinc-900/30 p-4 border border-zinc-900 rounded-xl whitespace-pre-wrap">
                        {currentQuestion.questionText}
                      </p>

                      {/* Collapsible/Revealed Tips */}
                      <div className="space-y-2 border border-zinc-900 bg-zinc-950/40 rounded-xl p-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4 text-cyan-400" /> Interviewer Tips / Clues
                        </h3>
                        <ul className="list-disc pl-5 text-xs text-zinc-400 space-y-1.5 pt-1.5">
                          {currentQuestion.tips.map((t, idx) => (
                            <li key={idx}>{t}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Rubric evaluation guidelines */}
                      <div className="space-y-2 border border-zinc-900 bg-zinc-950/40 rounded-xl p-4">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-amber-500" /> Evaluation Rubric
                        </h3>
                        <ul className="list-decimal pl-5 text-xs text-zinc-400 space-y-1.5 pt-1.5">
                          {currentQuestion.rubric.map((r, idx) => (
                            <li key={idx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : dsaTab === "brute" ? (
                    <div className="space-y-4 flex-1">
                      <div className="space-y-2">
                        <span className="inline-flex rounded-full border border-rose-500/20 bg-rose-950/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                          Brute Force Approach
                        </span>
                        <h1 className="text-xl font-bold tracking-tight text-white">{currentQuestion.title}</h1>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed font-mono bg-zinc-900/30 p-5 border border-zinc-900 rounded-xl whitespace-pre-wrap">
                        {currentQuestion.bruteForce || "No brute force approach outlined."}
                      </p>
                    </div>
                  ) : dsaTab === "optimal" ? (
                    <div className="space-y-4 flex-1">
                      <div className="space-y-2">
                        <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-950/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          Optimal Approach
                        </span>
                        <h1 className="text-xl font-bold tracking-tight text-white">{currentQuestion.title}</h1>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed font-mono bg-zinc-900/30 p-5 border border-zinc-900 rounded-xl whitespace-pre-wrap">
                        {currentQuestion.optimal || "No optimal approach outlined."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 flex-1">
                      <div className="space-y-2">
                        <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-950/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          Complexity Analysis
                        </span>
                        <h1 className="text-xl font-bold tracking-tight text-white">{currentQuestion.title}</h1>
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed font-mono bg-zinc-900/30 p-5 border border-zinc-900 rounded-xl whitespace-pre-wrap">
                        {currentQuestion.complexity || "No complexity analysis outlined."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Outline writeboard */}
                <div className="flex-1 flex flex-col p-6 space-y-4">
                  <div className="space-y-1 shrink-0">
                    <h3 className="text-sm font-bold text-white">Think-Aloud Outline Board</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Type your code logic, STAR context outlines, architecture trade-offs, or dry-runs below.
                    </p>
                  </div>

                  <textarea
                    placeholder="Provide your detailed answer structure here...&#10;- Brute force complexity&#10;- Optimized logic explanation&#10;- Pseudo-code outline / key syntax"
                    value={interviewSession.answers[currentQuestion.id] || ""}
                    onChange={(e) => updateInterviewAnswer(currentQuestion.id, e.target.value)}
                    className="flex-1 w-full rounded-xl border border-zinc-800 bg-zinc-900/20 p-4 text-sm font-mono text-white placeholder-zinc-600 focus:border-cyan-500 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-zinc-500">Select a question to start.</div>
            )}
          </main>
        </div>

        {/* Self Assessment Overlay */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => setShowSubmitModal(false)} />
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-850 bg-zinc-950 p-6 shadow-2xl space-y-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" /> Round Self-Evaluation
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Explain optimal solution logic?</span>
                    <span className="font-mono font-bold text-cyan-400">{explanationScore}/100</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={explanationScore}
                    onChange={(e) => setExplanationScore(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>Dry-run complexity correctness?</span>
                    <span className="font-mono font-bold text-cyan-400">{complexityScore}/100</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={complexityScore}
                    onChange={(e) => setComplexityScore(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                <label className="flex items-start gap-2.5 p-3 rounded-lg border border-zinc-900 bg-zinc-900/20 text-xs text-zinc-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={edgeCaseChecked}
                    onChange={(e) => setEdgeCaseChecked(e.target.checked)}
                    className="mt-0.5 rounded border-zinc-800 bg-zinc-900 text-cyan-500 focus:ring-0 focus:ring-offset-0"
                  />
                  <span>I addressed all critical edge cases (e.g. empty lists, bounds, invalid inputs). (+10% Bonus)</span>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 btn-ghost border border-zinc-800 hover:bg-zinc-900 py-3 text-zinc-400 font-semibold"
                >
                  Go Back
                </button>
                <button
                  onClick={handleFinalSubmit}
                  className="flex-1 btn-primary py-3 font-bold"
                >
                  Log Attempt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. DASHBOARD VIEW (Setup and past attempts history)
  return (
    <AppShell title="Mock Interview Room" subtitle="Build execution pressure">
      <PageHeader
        title="Mock Interview Practice Room"
        description="Simulate real-time pressure rounds. We generate randomized questions across four dimensions to dry-run think-aloud outline responses."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <GlassCard className="flex flex-col justify-between p-6" hover={true}>
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-950/40 border border-cyan-850 flex items-center justify-center text-cyan-400">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white">DSA Mock Round</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              2 algorithmic problems (Medium/Hard) · 45 mins. Explain brute force, dry run optimal logic and trace complexity constraints.
            </p>
          </div>
          <button
            onClick={() => handleStartSession("dsa")}
            className="btn-primary w-full mt-6 py-2 flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            Start DSA simulation <ArrowRight className="h-3 w-3" />
          </button>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between p-6" hover={true}>
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-950/40 border border-amber-900/30 flex items-center justify-center text-amber-400">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white">Project Deep Dive</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              1 Architectural question · 45 mins. Walk through component stack, describe specific bottleneck bugs and trade-offs.
            </p>
          </div>
          <button
            onClick={() => handleStartSession("project")}
            className="btn-primary w-full mt-6 py-2 flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            Start Project simulation <ArrowRight className="h-3 w-3" />
          </button>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between p-6" hover={true}>
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-purple-950/40 border border-purple-900/30 flex items-center justify-center text-purple-400">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white">Frontend Web Round</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              2 engineering queries · 45 mins. Implement react states optimizations, debounces search components, or CSS responsive layout.
            </p>
          </div>
          <button
            onClick={() => handleStartSession("frontend")}
            className="btn-primary w-full mt-6 py-2 flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            Start Frontend simulation <ArrowRight className="h-3 w-3" />
          </button>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between p-6" hover={true}>
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center text-emerald-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-white">Behavioral / HR Round</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              2 situational questions · 45 mins. Structure STAR-format replies covering conflicts, leadership, goals, and failure lessons.
            </p>
          </div>
          <button
            onClick={() => handleStartSession("hr")}
            className="btn-primary w-full mt-6 py-2 flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            Start HR simulation <ArrowRight className="h-3 w-3" />
          </button>
        </GlassCard>
      </div>

      {/* Historical Attempts */}
      <div className="mt-10 space-y-4">
        <h3 className="text-lg font-bold tracking-tight text-white">Attempt History</h3>
        <div className="space-y-3">
          {interviewHistory.map((h) => {
            const isDetailOpen = showHistoryDetailId === h.id;
            return (
              <GlassCard key={h.id} className="p-4" hover={false}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-[10px] font-mono font-bold text-zinc-400">
                      {h.type.toUpperCase()}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">Mock Evaluation Round</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        Completed at: {format(new Date(h.completedAt), "MMMM d, yyyy · h:mm a")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right shrink-0">
                      <span className="text-xs text-zinc-500 block uppercase tracking-wider text-[9px] font-bold">Round Score</span>
                      <span className={`text-base font-extrabold font-mono ${
                        h.score >= 80 ? "text-emerald-400" : h.score >= 60 ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {h.score}/100
                      </span>
                    </div>

                    <button
                      onClick={() => setShowHistoryDetailId(isDetailOpen ? null : h.id)}
                      className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-850 text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      {isDetailOpen ? "Hide Review" : "View Review"}
                      <ChevronRight className={`h-4 w-4 transition-transform ${isDetailOpen ? "rotate-90" : ""}`} />
                    </button>
                  </div>
                </div>

                {isDetailOpen && (
                  <div className="mt-4 border-t border-zinc-900/50 pt-4 space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">Interviewer Feedback</span>
                      <p className="text-xs text-cyan-400 leading-relaxed font-semibold bg-cyan-950/10 p-3 rounded-lg border border-cyan-900/30">
                        {h.feedback || "Well outlined round details."}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">Round Questions & Outlines</span>
                      <div className="space-y-3">
                        {h.questions.map((q: any, idx: number) => (
                          <div key={q.id} className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-3 space-y-2">
                            <h5 className="text-xs font-bold text-zinc-300">
                              Question {idx + 1}: {q.title}
                            </h5>
                            <p className="text-[11px] text-zinc-500 leading-relaxed">{q.questionText}</p>
                            <div className="bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-850 font-mono text-xs text-zinc-400">
                              <span className="text-[9px] uppercase font-bold text-zinc-600 block mb-1">Your response outline</span>
                              {h.answers[q.id] || "No response outlined."}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}

          {interviewHistory.length === 0 && (
            <p className="text-center text-zinc-600 text-xs italic py-10 border border-dashed border-zinc-900 rounded-2xl">
              No mock interviews completed yet. Take your first round now!
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
