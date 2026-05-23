"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Play, Pause, RotateCcw, X, Brain, Zap,
  CheckCircle2, Clock, BookOpen, ChevronRight, Eye, EyeOff
} from "lucide-react";
import { useProgressStore } from "@/lib/progress-store";
import { GlassCard } from "@/components/ui/glass-card";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FocusQuestion {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  hint?: string;
}

// ─── Static question bank for Focus Mode ─────────────────────────────────────
// Decoupled from DSA sheet — these are curated focus-mode prompts

const FOCUS_QUESTIONS: FocusQuestion[] = [
  { id: "f1",  title: "Two Sum",                 difficulty: "Easy",   topic: "Arrays",       hint: "Use a hash map for O(n) time." },
  { id: "f2",  title: "Best Time to Buy/Sell",   difficulty: "Easy",   topic: "Arrays",       hint: "Track min price seen so far." },
  { id: "f3",  title: "Contains Duplicate",      difficulty: "Easy",   topic: "Arrays",       hint: "Set lookup is O(1)." },
  { id: "f4",  title: "Maximum Subarray",        difficulty: "Medium", topic: "Arrays",       hint: "Kadane's algorithm." },
  { id: "f5",  title: "3Sum",                    difficulty: "Medium", topic: "Arrays",       hint: "Sort + two pointers." },
  { id: "f6",  title: "Product of Array Except", difficulty: "Medium", topic: "Arrays",       hint: "Prefix + suffix pass." },
  { id: "f7",  title: "Valid Parentheses",       difficulty: "Easy",   topic: "Stack",        hint: "Stack: push open, pop on close." },
  { id: "f8",  title: "Min Stack",               difficulty: "Medium", topic: "Stack",        hint: "Two stacks or tuple stack." },
  { id: "f9",  title: "Daily Temperatures",      difficulty: "Medium", topic: "Stack",        hint: "Monotonic decreasing stack." },
  { id: "f10", title: "Longest Substring No Repeat", difficulty: "Medium", topic: "Sliding Window", hint: "Sliding window + set." },
  { id: "f11", title: "Minimum Window Substring",    difficulty: "Hard",   topic: "Sliding Window", hint: "Two-pointer + freq map." },
  { id: "f12", title: "Binary Search",           difficulty: "Easy",   topic: "Binary Search", hint: "lo=0, hi=n-1, mid=(lo+hi)/2." },
  { id: "f13", title: "Search in Rotated Array", difficulty: "Medium", topic: "Binary Search", hint: "Determine which half is sorted." },
  { id: "f14", title: "Merge Two Sorted Lists",  difficulty: "Easy",   topic: "Linked List",  hint: "Dummy head pointer." },
  { id: "f15", title: "Reverse Linked List",     difficulty: "Easy",   topic: "Linked List",  hint: "prev/curr/next pointers." },
  { id: "f16", title: "LCA of BST",              difficulty: "Medium", topic: "Trees",        hint: "Recurse based on value ranges." },
  { id: "f17", title: "Level Order Traversal",   difficulty: "Medium", topic: "Trees",        hint: "BFS with queue." },
  { id: "f18", title: "Number of Islands",       difficulty: "Medium", topic: "Graphs",       hint: "DFS/BFS flood-fill." },
  { id: "f19", title: "Course Schedule",         difficulty: "Medium", topic: "Graphs",       hint: "Topological sort / cycle detect." },
  { id: "f20", title: "Climbing Stairs",         difficulty: "Easy",   topic: "DP",           hint: "dp[i] = dp[i-1] + dp[i-2]." },
  { id: "f21", title: "Coin Change",             difficulty: "Medium", topic: "DP",           hint: "dp[amount] = min coins." },
  { id: "f22", title: "Longest Common Subsequence", difficulty: "Medium", topic: "DP",        hint: "2D DP table." },
  { id: "f23", title: "House Robber",            difficulty: "Medium", topic: "DP",           hint: "dp[i] = max(dp[i-2]+nums[i], dp[i-1])." },
  { id: "f24", title: "Word Break",              difficulty: "Medium", topic: "DP",           hint: "dp[i] = any dp[j] && word[j..i] in dict." },
  { id: "f25", title: "Trapping Rain Water",     difficulty: "Hard",   topic: "Two Pointers", hint: "Left-max and right-max arrays." },
];

const TOPICS = ["All", "Arrays", "Stack", "Sliding Window", "Binary Search", "Linked List", "Trees", "Graphs", "DP", "Two Pointers"];

const DURATIONS = [
  { label: "25 min", seconds: 25 * 60 },
  { label: "45 min", seconds: 45 * 60 },
  { label: "60 min", seconds: 60 * 60 },
  { label: "90 min", seconds: 90 * 60 },
];

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard:   "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

const SESSION_KEY = "placement-os-focus-session";

// ─── Shuffle helper ──────────────────────────────────────────────────────────

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FocusPage() {
  const recordFocusMinutes = useProgressStore((s) => s.recordFocusMinutes);

  // ── Session state ────────────────────────────────────────────────────────
  const [started, setStarted] = useState(false);
  const [topicFilter, setTopicFilter] = useState("All");
  const [durationIdx, setDurationIdx] = useState(0);
  const [focusText, setFocusText] = useState("");

  // ── Timer state ──────────────────────────────────────────────────────────
  const [seconds, setSeconds] = useState(DURATIONS[0].seconds);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  // ── Questions ────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<FocusQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [showHint, setShowHint] = useState(false);

  // ── Refs for stable timer (prevent stale closures & interval leaks) ─────
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef  = useRef(seconds);
  const runningRef  = useRef(running);
  secondsRef.current = seconds;
  runningRef.current = running;

  // ── Cleanup on unmount ───────────────────────────────────────────────────
  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  useEffect(() => () => clearTimer(), [clearTimer]);

  // ── Tab visibility — pause on hidden, resume on visible ─────────────────
  useEffect(() => {
    if (!started) return;
    const handleVisibility = () => {
      if (document.hidden && runningRef.current) {
        clearTimer();
        setRunning(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [started, clearTimer]);

  // ── Restore session from localStorage ───────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        // Only restore if session is less than 2 hours old
        if (s.savedAt && Date.now() - s.savedAt < 2 * 60 * 60 * 1000) {
          setSeconds(s.seconds ?? DURATIONS[0].seconds);
          setTopicFilter(s.topicFilter ?? "All");
          setFocusText(s.focusText ?? "");
          setCurrentIdx(s.currentIdx ?? 0);
          setSolved(new Set(s.solved ?? []));
          setStarted(s.started ?? false);
          if (s.questions?.length) setQuestions(s.questions);
        } else {
          localStorage.removeItem(SESSION_KEY);
        }
      }
    } catch { /* ignore parse errors */ }
  }, []);

  // ── Persist session to localStorage ─────────────────────────────────────
  useEffect(() => {
    if (!started) return;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        seconds, topicFilter, focusText, currentIdx,
        solved: [...solved], started, questions,
        savedAt: Date.now(),
      }));
    } catch { /* ignore quota errors */ }
  }, [seconds, topicFilter, focusText, currentIdx, solved, started, questions]);

  // ── Start session ────────────────────────────────────────────────────────
  const startSession = () => {
    const pool = topicFilter === "All"
      ? FOCUS_QUESTIONS
      : FOCUS_QUESTIONS.filter((q) => q.topic === topicFilter);
    const selected = shuffled(pool).slice(0, 10);
    setQuestions(selected);
    setCurrentIdx(0);
    setSolved(new Set());
    setShowHint(false);
    setSeconds(DURATIONS[durationIdx].seconds);
    setRunning(true);
    setFinished(false);
    setStarted(true);

    // Start interval
    clearTimer();
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearTimer();
          setRunning(false);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Toggle pause/resume ──────────────────────────────────────────────────
  const toggleRunning = () => {
    if (running) {
      clearTimer();
      setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            clearTimer();
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  // ── Exit session ─────────────────────────────────────────────────────────
  const exitSession = () => {
    clearTimer();
    const elapsed = DURATIONS[durationIdx].seconds - seconds;
    if (elapsed >= 60) recordFocusMinutes(Math.floor(elapsed / 60));
    localStorage.removeItem(SESSION_KEY);
    setStarted(false);
    setRunning(false);
    setFinished(false);
    setSeconds(DURATIONS[durationIdx].seconds);
  };

  // ── Mark current question solved ─────────────────────────────────────────
  const markSolved = () => {
    const q = questions[currentIdx];
    if (!q) return;
    setSolved((prev) => new Set([...prev, q.id]));
    setShowHint(false);
    if (currentIdx < questions.length - 1) setCurrentIdx((i) => i + 1);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Pre-session setup screen
  // ─────────────────────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="mesh-bg fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-lg space-y-5">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
              <Brain className="h-8 w-8 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Focus Mode</h1>
            <p className="text-sm text-zinc-500 mt-1">One session. Zero distractions. Pure execution.</p>
          </div>

          {/* Focus task */}
          <GlassCard className="p-5" hover={false}>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
              What&apos;s your focus objective?
            </label>
            <input
              type="text"
              value={focusText}
              onChange={(e) => setFocusText(e.target.value)}
              placeholder="e.g. Solve 3 graph problems · Finish DP revision"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              id="focus-objective-input"
            />
          </GlassCard>

          {/* Topic filter */}
          <GlassCard className="p-5" hover={false}>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Topic Focus</p>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopicFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    topicFilter === t
                      ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-400"
                      : "bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300 hover:border-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Duration picker */}
          <GlassCard className="p-5" hover={false}>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Session Duration</p>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS.map((d, i) => (
                <button
                  key={d.label}
                  onClick={() => { setDurationIdx(i); setSeconds(d.seconds); }}
                  className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    durationIdx === i
                      ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                      : "bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </GlassCard>

          <button
            onClick={startSession}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-base shadow-lg hover:opacity-90 transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            id="start-focus-btn"
          >
            Enter Focus Mode →
          </button>

          <div className="text-center">
            <Link href="/dashboard" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render: Active session screen
  // ─────────────────────────────────────────────────────────────────────────

  const totalSec  = DURATIONS[durationIdx].seconds;
  const progress  = ((totalSec - seconds) / totalSec) * 100;
  const mm        = Math.floor(seconds / 60);
  const ss        = seconds % 60;
  const currentQ  = questions[currentIdx];
  const solvedCount = solved.size;

  return (
    <div className="mesh-bg fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Top bar — fixed height, never stretches */}
      <div
        className="flex-none flex items-center justify-between px-5 py-3 border-b border-white/5"
        style={{ background: "rgba(9,9,11,0.85)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Zap className="h-4 w-4 text-cyan-400 shrink-0 animate-pulse" />
          <span className="text-sm font-semibold text-white truncate max-w-xs">
            {focusText || "Focus Session"}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-zinc-500 hidden sm:block">
            {solvedCount}/{questions.length} solved
          </span>
          <button
            onClick={exitSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/15 transition-all"
            id="exit-focus-btn"
          >
            <X className="h-3 w-3" /> Exit
          </button>
        </div>
      </div>

      {/* Main content — scrollable if needed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* ── TIMER CARD — fixed dimensions, never stretches ── */}
          <div
            className="rounded-2xl border border-white/8 p-5"
            style={{ background: "rgba(17,24,39,0.8)", backdropFilter: "blur(16px)" }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Circle timer */}
              <div className="relative shrink-0 w-32 h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke={finished ? "#fb7185" : running ? "#22d3ee" : "#71717a"}
                    strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                    style={{ transition: "stroke-dashoffset 0.8s linear, stroke 0.3s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-3xl font-bold text-white tabular-nums">
                    {mm}:{ss.toString().padStart(2, "0")}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">
                    {finished ? "Done!" : running ? "Active" : "Paused"}
                  </span>
                </div>
              </div>

              {/* Timer controls + progress */}
              <div className="flex-1 w-full min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={toggleRunning}
                    disabled={finished}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all disabled:opacity-50 ${
                      running
                        ? "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                        : "bg-cyan-500/15 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/25"
                    }`}
                    id="focus-toggle-btn"
                  >
                    {running
                      ? <><Pause className="h-3.5 w-3.5" /> Pause</>
                      : <><Play className="h-3.5 w-3.5 ml-0.5" /> Resume</>
                    }
                  </button>
                  <button
                    onClick={exitSession}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-zinc-500 border border-white/10 hover:text-white hover:border-white/20 transition-all"
                  >
                    <RotateCcw className="h-3 w-3" /> End
                  </button>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-600">
                    <span>Session progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Micro stats */}
                <div className="flex gap-4 mt-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" /> {solvedCount} solved
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-cyan-400" />
                    {Math.floor((totalSec - seconds) / 60)}m elapsed
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3 text-violet-400" /> {topicFilter}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── QUESTION CARD — never affects timer layout ── */}
          {finished ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white mb-1">Session Complete!</h2>
              <p className="text-sm text-zinc-400 mb-2">
                You solved <span className="text-emerald-400 font-bold">{solvedCount}</span> of{" "}
                <span className="text-white font-bold">{questions.length}</span> questions.
              </p>
              <p className="text-xs text-zinc-600 mb-5">Focus time logged to your analytics.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={startSession}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-bold hover:bg-cyan-500/30 transition-all"
                >
                  New Session
                </button>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-sm font-semibold hover:bg-white/10 transition-all"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          ) : currentQ ? (
            <div className="rounded-2xl border border-white/8 p-5" style={{ background: "rgba(17,24,39,0.8)" }}>
              {/* Question header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                      Q{currentIdx + 1}/{questions.length}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${DIFFICULTY_COLOR[currentQ.difficulty]}`}>
                      {currentQ.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium text-zinc-500 bg-white/5 border border-white/10">
                      {currentQ.topic}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white leading-snug">{currentQ.title}</h2>
                </div>
                {solved.has(currentQ.id) && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                )}
              </div>

              {/* Approach prompts */}
              <div className="space-y-2 mb-4">
                {[
                  { label: "Brute Force", prompt: "What's the simplest O(n²) or O(n³) approach? Walk through it mentally." },
                  { label: "Optimize",   prompt: "Can you reduce time/space? What data structure helps here?" },
                  { label: "Code It",    prompt: "Write the optimal solution with correct edge case handling." },
                ].map((step) => (
                  <div key={step.label} className="flex gap-2 p-2.5 rounded-lg bg-white/3 border border-white/5 text-xs">
                    <span className="font-bold text-cyan-400 shrink-0">{step.label}:</span>
                    <span className="text-zinc-400">{step.prompt}</span>
                  </div>
                ))}
              </div>

              {/* Hint toggle */}
              {currentQ.hint && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowHint((h) => !h)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showHint ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    {showHint ? "Hide hint" : "Show hint"}
                  </button>
                  {showHint && (
                    <div className="mt-2 p-2.5 rounded-lg bg-amber-500/8 border border-amber-500/20 text-xs text-amber-300">
                      💡 {currentQ.hint}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={markSolved}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-bold hover:bg-emerald-500/25 transition-all"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Mark Solved
                </button>
                {currentIdx < questions.length - 1 && (
                  <button
                    onClick={() => { setCurrentIdx((i) => i + 1); setShowHint(false); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-sm font-semibold hover:text-white hover:border-white/20 transition-all"
                  >
                    Skip <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
                {currentIdx > 0 && (
                  <button
                    onClick={() => { setCurrentIdx((i) => i - 1); setShowHint(false); }}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 text-sm hover:text-zinc-300 transition-all"
                  >
                    ← Prev
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
              <p className="text-zinc-500 text-sm">No questions in this topic. Try selecting &quot;All&quot;.</p>
            </div>
          )}

          {/* Question progress dots */}
          {questions.length > 0 && (
            <div className="flex justify-center gap-1.5 flex-wrap py-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => { setCurrentIdx(i); setShowHint(false); }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    solved.has(q.id)
                      ? "bg-emerald-400"
                      : i === currentIdx
                      ? "bg-cyan-400 scale-125"
                      : "bg-white/15 hover:bg-white/30"
                  }`}
                  aria-label={`Question ${i + 1}: ${q.title}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
