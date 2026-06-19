"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProgressStore } from "@/lib/progress-store";
import { useDataStore } from "@/store/data-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  ChevronLeft,
  BookOpen,
  Briefcase,
  Clock,
  Sparkles,
  Award,
  AlertCircle
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export default function FocusPage() {
  const router = useRouter();
  const {
    focusSession,
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    resetFocusSession,
    tickFocusSession,
    completeFocusSession,
    questionProgress,
    projects,
    setQuestionStatus
  } = useProgressStore();

  const { questions, fetchData } = useDataStore();

  const [taskText, setTaskText] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [durationMin, setDurationMin] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");

  // Load questions data if not already loaded
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Synchronize timer on mount/focus transitions
  useEffect(() => {
    if (focusSession.isRunning) {
      tickFocusSession();
    }
  }, [focusSession.isRunning, tickFocusSession]);

  // Handle ticking timer using suspension-tolerant absolute timestamps
  useEffect(() => {
    if (!focusSession.isRunning) return;

    const interval = setInterval(() => {
      tickFocusSession();
    }, 1000);

    return () => clearInterval(interval);
  }, [focusSession.isRunning, tickFocusSession]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const activeTask = taskText.trim() || (selectedQuestionId ? `Solve DSA: ${questions.find(q => q.id === selectedQuestionId)?.title}` : "General Study Session");
    startFocusSession(activeTask, durationMin, selectedQuestionId);
  };

  const handleExit = () => {
    if (confirm("Exit focus mode? Unfinished time will be discarded.")) {
      resetFocusSession();
      router.push("/dashboard");
    }
  };

  const handleForceComplete = () => {
    if (confirm("Log current session as complete and save progress?")) {
      completeFocusSession();
    }
  };

  // Setup view
  if (!focusSession.startTime) {
    // Filter unsolved questions using search query
    const unsolvedQuestions = questions.filter(
      (q) =>
        !["solved", "mastered"].includes(questionProgress[q.id]?.status ?? "") &&
        (q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.topicId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Active project tasks
    const activeTasks = projects.filter((p) => p.status !== "done");

    return (
      <div className="mesh-bg fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl my-8">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-8 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <a
                href="/dashboard"
                className="rounded-lg p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </a>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-white">Focus Workspace</h1>
                <p className="text-sm text-zinc-400">Configure your session, lock distractions, and execute.</p>
              </div>
            </div>

            <form onSubmit={handleStart} className="space-y-6">
              {/* Task input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">What are you building or solving?</label>
                <input
                  type="text"
                  placeholder="e.g., Implementing Auth flow, Solved 2 Medium Matrix questions"
                  value={taskText}
                  onChange={(e) => {
                    setTaskText(e.target.value);
                    if (e.target.value) setSelectedQuestionId(null);
                  }}
                  className="field-input w-full px-4 py-3 text-sm"
                />
              </div>

              {/* Suggestions */}
              <div className="grid gap-4 md:grid-cols-2">
                {/* DSA questions */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between gap-1.5">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3 w-3" /> Link an unsolved DSA Question
                    </span>
                    <span className="text-[9px] text-zinc-400">Total: {unsolvedQuestions.length}</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search questions by title or topic..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="field-input w-full px-3 py-1.5 text-xs mb-1.5"
                    />
                  </div>
                  <div className="h-44 overflow-y-auto rounded-xl border border-zinc-850 bg-zinc-900/20 p-2 space-y-1">
                    {unsolvedQuestions.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setSelectedQuestionId(q.id);
                          setTaskText(`Solve DSA: ${q.title}`);
                        }}
                        className={`w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition-all flex items-center justify-between ${
                          selectedQuestionId === q.id
                            ? "bg-cyan-950/40 border border-cyan-500/30 text-cyan-300"
                            : "hover:bg-zinc-900 text-zinc-400 border border-transparent"
                        }`}
                      >
                        <span className="truncate pr-2">{q.title}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                          q.difficulty === "Easy"
                            ? "bg-emerald-950 text-emerald-400"
                            : q.difficulty === "Medium"
                            ? "bg-amber-950 text-amber-400"
                            : "bg-rose-950 text-rose-400"
                        }`}>
                          {q.difficulty}
                        </span>
                      </button>
                    ))}
                    {unsolvedQuestions.length === 0 && (
                      <p className="text-center text-zinc-500 py-12 text-xs">All DSA problems solved! 🏆</p>
                    )}
                  </div>
                </div>

                {/* Project items */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3" /> Select a Project Task
                  </label>
                  <div className="h-44 overflow-y-auto rounded-xl border border-zinc-850 bg-zinc-900/20 p-2 space-y-1">
                    {activeTasks.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setTaskText(`Project work: ${p.name}`);
                          setSelectedQuestionId(null);
                        }}
                        className="w-full text-left hover:bg-zinc-900 rounded-lg px-3 py-2 text-xs text-zinc-400 border border-transparent hover:text-white transition-all flex flex-col gap-1"
                      >
                        <span className="font-semibold text-zinc-300 truncate">{p.name}</span>
                        <span className="text-[10px] text-zinc-500 truncate">{p.description}</span>
                      </button>
                    ))}
                    {activeTasks.length === 0 && (
                      <p className="text-center text-zinc-500 py-12 text-xs">No active project tasks. Add some on the Kanban board!</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Timer options */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Select Focus Interval
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[15, 25, 35, 45, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDurationMin(m)}
                      className={`py-3.5 rounded-xl border text-sm font-semibold tracking-tight transition-all font-mono ${
                        durationMin === m
                          ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                          : "border-zinc-850 hover:bg-zinc-900 text-zinc-400"
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Launch button */}
              <button
                type="submit"
                className="btn-primary w-full py-4 text-sm font-bold tracking-wide uppercase flex items-center justify-center gap-2"
              >
                <Play className="h-4 w-4 fill-current" />
                Initialize Focus Protocol
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    );
  }

  // Active fullscreen immersive study view
  const minutes = Math.floor(focusSession.timeLeft / 60);
  const seconds = focusSession.timeLeft % 60;
  const progressPercent = ((focusSession.duration - focusSession.timeLeft) / focusSession.duration) * 100;
  const linkedQuestion = questions.find((q) => q.id === focusSession.questionId);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between p-8 bg-zinc-950 text-white">
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Focus Mode Active</span>
        </div>
        <button
          onClick={handleExit}
          className="rounded-lg border border-zinc-850 bg-zinc-900/30 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
        >
          Exit Protocol
        </button>
      </header>

      {/* Immersive Center Content */}
      <main className="flex flex-col items-center justify-center flex-1 max-w-2xl mx-auto w-full z-10 my-8">
        <AnimatePresence mode="wait">
          {/* Main Study Deck */}
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="w-full text-center space-y-8"
          >
            {/* Immersive Clock Container */}
            <div className="relative flex items-center justify-center h-64 w-64 mx-auto select-none shrink-0">
              {/* Circular Progress Ring */}
              <svg viewBox="0 0 256 256" className="absolute w-64 h-64 transform -rotate-90 shrink-0">
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  className="stroke-zinc-900"
                  strokeWidth="6"
                  fill="transparent"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="110"
                  className="stroke-cyan-500"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 110}
                  animate={{ strokeDashoffset: (2 * Math.PI * 110) * (1 - progressPercent / 100) }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </svg>

              {/* Digital Ticker */}
              <div className="text-center z-10 space-y-1">
                <p className="font-mono text-6xl font-extrabold tracking-tight text-white">
                  {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  {focusSession.isRunning ? "Studying" : "Paused"}
                </p>
              </div>
            </div>

            {/* Task Info */}
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tight text-white max-w-lg mx-auto leading-snug">
                {focusSession.task}
              </h2>
              <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
                Stay locked. Deep work blocks build long-term memory. Minimize tab jumping and focus on completion.
              </p>
            </div>

            {/* DSA Details Card if Linked */}
            {linkedQuestion && (
              <GlassCard className="text-left max-w-lg mx-auto border-cyan-900/30 bg-cyan-950/5 relative overflow-hidden" hover={false}>
                <div className="absolute top-0 right-0 p-3">
                  <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-900/50 text-cyan-300 font-mono font-bold border border-cyan-800/30 uppercase tracking-widest">
                    {linkedQuestion.platform}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      linkedQuestion.difficulty === "Easy"
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-900/30"
                        : linkedQuestion.difficulty === "Medium"
                        ? "bg-amber-950/60 text-amber-400 border border-amber-900/30"
                        : "bg-rose-950/60 text-rose-400 border border-rose-900/30"
                    }`}>
                      {linkedQuestion.difficulty}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-200">{linkedQuestion.title}</h3>
                  </div>
                  
                  {linkedQuestion.pattern && (
                    <p className="text-xs text-zinc-400">
                      Pattern: <strong className="text-zinc-300 font-semibold">{linkedQuestion.pattern}</strong>
                    </p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <a
                      href={linkedQuestion.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost flex items-center gap-1.5 py-1.5 text-xs text-cyan-400 hover:bg-cyan-950/20 border border-cyan-900/30 px-3 rounded-lg"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Solve on {linkedQuestion.platform}
                    </a>
                    
                    <button
                      onClick={() => {
                        setQuestionStatus(linkedQuestion.id, "solved", Math.round(focusSession.duration / 60));
                        completeFocusSession();
                      }}
                      className="btn-primary flex items-center gap-1.5 py-1.5 text-xs px-3 rounded-lg font-bold"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Mark Solved & Complete
                    </button>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* Quick Tips Box if General Study */}
            {!linkedQuestion && (
              <div className="flex items-center gap-2.5 bg-zinc-900/30 border border-zinc-900 px-4 py-3 rounded-xl max-w-md mx-auto text-xs text-zinc-400 text-left">
                <AlertCircle className="h-4 w-4 text-cyan-500 shrink-0" />
                <p>Avoid YouTube/social media. Set your phone to DND and execute the active task blocks.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Controls */}
      <footer className="flex flex-col items-center gap-4 z-10 shrink-0">
        <div className="flex items-center gap-3">
          {/* Restart */}
          <button
            onClick={resetFocusSession}
            className="rounded-full border border-zinc-850 bg-zinc-900/50 p-4 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all"
            title="Restart Session"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          {/* Play / Pause */}
          {focusSession.isRunning ? (
            <button
              onClick={pauseFocusSession}
              className="rounded-full bg-white p-5 text-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              title="Pause Timer"
            >
              <Pause className="h-6 w-6 fill-current" />
            </button>
          ) : (
            <button
              onClick={resumeFocusSession}
              className="rounded-full bg-cyan-500 p-5 text-white hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse"
              title="Resume Timer"
            >
              <Play className="h-6 w-6 fill-current" />
            </button>
          )}

          {/* Quick Log Complete */}
          <button
            onClick={handleForceComplete}
            className="rounded-full border border-zinc-850 bg-zinc-900/50 p-4 text-cyan-400 hover:text-cyan-300 hover:bg-zinc-900 transition-all"
            title="Complete & Log Minutes"
          >
            <CheckCircle className="h-5 w-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
