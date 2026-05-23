"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Brain, Code2, Users, Briefcase, Play, RefreshCw, Clock,
  ChevronRight, ChevronLeft, CheckCircle2, Timer, Zap,
  Star, AlertCircle, Lightbulb, X
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "dsa" | "project" | "hr" | "frontend";

interface DSAQuestion {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  brute: string;
  optimal: string;
  timeComplexity: string;
  spaceComplexity: string;
  hint: string;
}

interface PromptItem {
  category: string;
  question: string;
  tip: string;
}

// ─── Data: DSA Questions ─────────────────────────────────────────────────────

const DSA_BANK: DSAQuestion[] = [
  { id: "d1", title: "Two Sum", difficulty: "Easy", topic: "Arrays",
    brute: "Nested loops, check every pair → O(n²) time, O(1) space.",
    optimal: "Hash map: store seen values → O(n) time, O(n) space.",
    timeComplexity: "O(n)", spaceComplexity: "O(n)",
    hint: "What if you stored complements in a map?" },
  { id: "d2", title: "Longest Substring Without Repeating", difficulty: "Medium", topic: "Sliding Window",
    brute: "Check all substrings with a set → O(n³) time.",
    optimal: "Sliding window with char index map → O(n) time, O(k) space.",
    timeComplexity: "O(n)", spaceComplexity: "O(k)",
    hint: "Shrink window when duplicate found." },
  { id: "d3", title: "Merge Intervals", difficulty: "Medium", topic: "Arrays",
    brute: "Sort, then iterate merging overlapping → O(n log n).",
    optimal: "Sort by start, merge greedily → O(n log n) time, O(n) space.",
    timeComplexity: "O(n log n)", spaceComplexity: "O(n)",
    hint: "Intervals overlap if start[i+1] <= end[i]." },
  { id: "d4", title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Trees",
    brute: "DFS all levels with level tracking → O(n) but complex.",
    optimal: "BFS with queue, process level-by-level → O(n) time, O(w) space (w = max width).",
    timeComplexity: "O(n)", spaceComplexity: "O(w)",
    hint: "Queue length at start of each loop = level size." },
  { id: "d5", title: "Course Schedule (Cycle Detection)", difficulty: "Medium", topic: "Graphs",
    brute: "DFS from every node tracking visited → O(V+E).",
    optimal: "Topological sort with Kahn's algorithm or DFS + color states → O(V+E).",
    timeComplexity: "O(V+E)", spaceComplexity: "O(V+E)",
    hint: "3 states: unvisited, in-progress, done." },
  { id: "d6", title: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming",
    brute: "Recursion with all combinations → exponential time.",
    optimal: "DP bottom-up: dp[i] = min coins for amount i → O(n×m).",
    timeComplexity: "O(n×m)", spaceComplexity: "O(n)",
    hint: "dp[amount] = min(dp[amount - coin] + 1) for each coin." },
  { id: "d7", title: "Trapping Rain Water", difficulty: "Hard", topic: "Two Pointers",
    brute: "For each element, find max left/right → O(n²).",
    optimal: "Two-pointer shrink inward → O(n) time, O(1) space.",
    timeComplexity: "O(n)", spaceComplexity: "O(1)",
    hint: "Water at i = min(maxL, maxR) - height[i]." },
  { id: "d8", title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search",
    brute: "Merge arrays and find median → O(m+n).",
    optimal: "Binary search on partition → O(log(min(m,n))).",
    timeComplexity: "O(log(min(m,n)))", spaceComplexity: "O(1)",
    hint: "Partition such that left halves contain smaller elements." },
  { id: "d9", title: "Word Ladder", difficulty: "Hard", topic: "BFS",
    brute: "DFS exploring all paths → exponential.",
    optimal: "BFS with pattern-to-word adjacency list → O(m²×n).",
    timeComplexity: "O(m²×n)", spaceComplexity: "O(m²×n)",
    hint: "Use intermediate states like *ot, h*t, ho*." },
  { id: "d10", title: "LRU Cache", difficulty: "Medium", topic: "Design",
    brute: "Array-based tracking with O(n) operations.",
    optimal: "HashMap + Doubly Linked List → O(1) get and put.",
    timeComplexity: "O(1)", spaceComplexity: "O(capacity)",
    hint: "Map key to node; DLL tracks access order." },
];

// ─── Data: Project Deep Dive ──────────────────────────────────────────────────

const PROJECT_PROMPTS: PromptItem[] = [
  { category: "Architecture", question: "Walk me through the system design of your main project. What are the core components and how do they communicate?", tip: "Draw it mentally: client → API → DB. Mention state management, caching, real-time if applicable." },
  { category: "Scalability", question: "How would you scale your project to handle 10x or 100x current traffic?", tip: "Think: CDN, caching layers, horizontal scaling, DB read replicas, message queues." },
  { category: "Tradeoffs", question: "What key technical tradeoffs did you make in this project and why?", tip: "e.g. REST vs GraphQL, SSR vs CSR, SQL vs NoSQL — show deliberate reasoning." },
  { category: "Deployment", question: "How is your project deployed? Describe your CI/CD pipeline and hosting.", tip: "Mention: Vercel/Railway/AWS, GitHub Actions, Docker, env secrets, rollback strategy." },
  { category: "Optimization", question: "What performance optimizations have you implemented or would you implement?", tip: "Code splitting, lazy loading, image optimization, memoization, DB indexing." },
  { category: "Security", question: "What security measures does your project have? What vulnerabilities were you careful about?", tip: "Auth, input sanitization, CSRF, rate limiting, HTTPS, env variables." },
  { category: "Future", question: "What would you build next if you had 2 more weeks on this project?", tip: "Shows product thinking. Mention feature gaps, scaling needs, or DX improvements." },
  { category: "Testing", question: "How do you test your project? What's your strategy for catching regressions?", tip: "Unit, integration, E2E. Jest, Playwright, Vitest. Coverage thresholds." },
];

// ─── Data: HR STAR Questions ──────────────────────────────────────────────────

const HR_PROMPTS: PromptItem[] = [
  { category: "Leadership", question: "Tell me about a time you led a team through a difficult challenge without formal authority.", tip: "STAR: Situation → Task → Action (your initiative) → Result. Quantify impact." },
  { category: "Conflict", question: "Describe a conflict you had with a teammate and how you resolved it.", tip: "Show empathy + communication. End with what you learned and how trust was rebuilt." },
  { category: "Failure", question: "Tell me about your biggest professional or project failure and what you learned.", tip: "Be specific. Own the failure. The learning is the hero of this story." },
  { category: "Ownership", question: "Give an example of when you went above and beyond the expected scope of your role.", tip: "Shows initiative. Tie it to user/business impact, not just effort." },
  { category: "Ambiguity", question: "Describe a situation where you had to make an important decision with incomplete information.", tip: "Show structured thinking: data gathered, assumptions documented, risk assessed." },
  { category: "Teamwork", question: "Tell me about a time you helped a struggling teammate without being asked.", tip: "Shows collaboration and awareness. End with how it strengthened the team." },
  { category: "Pressure", question: "How do you handle a situation where you have multiple urgent deadlines at the same time?", tip: "Prioritize by impact. Communicate early. Show that you don't panic." },
  { category: "Growth", question: "What's the most important thing you've learned in the past 6 months?", tip: "Tie it to a specific project, book, or mentor. Show hunger to keep learning." },
];

// ─── Data: Frontend Round ─────────────────────────────────────────────────────

const FRONTEND_PROMPTS: PromptItem[] = [
  { category: "React State", question: "Explain the difference between useState and useReducer. When would you use each?", tip: "useState = simple values; useReducer = complex state transitions or multiple related values." },
  { category: "Performance", question: "How would you optimize a React component that re-renders too frequently?", tip: "React.memo, useMemo, useCallback, code-split with lazy+Suspense, avoid object literals in props." },
  { category: "Architecture", question: "Design a reusable, accessible Modal component in React. What props would it take?", tip: "isOpen, onClose, children, trapFocus, disableBodyScroll, Portal via createPortal." },
  { category: "Hooks", question: "What are the rules of hooks and why do they exist?", tip: "Only call in functions/top-level, not conditionally. React relies on call order to track state." },
  { category: "CSS Animation", question: "Build a smooth skeleton loading screen for a card component using CSS.", tip: "Use @keyframes with background-position shimmer on a gradient. No JS needed." },
  { category: "System Design", question: "How would you architect a large-scale React application with 50+ pages?", tip: "Feature-based folder structure, route-based code splitting, global state (Zustand/Redux), design system." },
  { category: "Web APIs", question: "Explain how you would implement infinite scroll without a library.", tip: "IntersectionObserver on a sentinel div at list bottom. Fetch next page when visible." },
  { category: "TypeScript", question: "When is `unknown` preferable to `any` in TypeScript?", tip: "unknown forces you to narrow type before use; any bypasses type safety entirely." },
];

// ─── Utility ─────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: "dsa" as Tab,      label: "DSA Round",       icon: Code2,     color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/25"    },
  { id: "project" as Tab,  label: "Project Dive",    icon: Briefcase, color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/25"   },
  { id: "hr" as Tab,       label: "HR Mock",         icon: Users,     color: "text-violet-400",  bg: "bg-violet-500/10",  border: "border-violet-500/25"  },
  { id: "frontend" as Tab, label: "Frontend Round",  icon: Brain,     color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
];

const DIFF_COLOR: Record<string, string> = {
  Easy:   "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard:   "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

// ─── DSA Timer ────────────────────────────────────────────────────────────────

function DSATimer({ totalSec, onEnd }: { totalSec: number; onEnd: () => void }) {
  const [sec, setSec] = useState(totalSec);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const toggle = () => {
    if (running) {
      clearTimer();
      setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSec((p) => {
          if (p <= 1) { clearTimer(); setRunning(false); onEnd(); return 0; }
          return p - 1;
        });
      }, 1000);
    }
  };

  const reset = () => { clearTimer(); setRunning(false); setSec(totalSec); };

  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const pct = ((totalSec - sec) / totalSec) * 100;
  const urgent = sec < 300; // last 5 min

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
      urgent ? "border-rose-500/30 bg-rose-500/5" : "border-white/10 bg-white/5"
    }`}>
      <Timer className={`h-4 w-4 shrink-0 ${urgent ? "text-rose-400 animate-pulse" : "text-zinc-500"}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={`font-mono text-lg font-bold tabular-nums ${urgent ? "text-rose-400" : "text-white"}`}>
            {m}:{s.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] text-zinc-600">{Math.round(pct)}% elapsed</span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${urgent ? "bg-rose-400" : "bg-gradient-to-r from-cyan-400 to-violet-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="flex gap-1.5 shrink-0">
        <button onClick={toggle} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
          running ? "text-amber-400 border-amber-500/30 bg-amber-500/10" : "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
        }`}>
          {running ? "Pause" : "Start"}
        </button>
        <button onClick={reset} className="px-2.5 py-1.5 rounded-lg text-xs text-zinc-500 border border-white/10 bg-white/5 hover:text-white transition-all">
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ─── DSA Tab ─────────────────────────────────────────────────────────────────

function DSATab() {
  const [questions, setQuestions] = useState<DSAQuestion[]>(() => {
    const easy   = shuffle(DSA_BANK.filter((q) => q.difficulty === "Easy")).slice(0, 1);
    const medium = shuffle(DSA_BANK.filter((q) => q.difficulty === "Medium")).slice(0, 2);
    const hard   = shuffle(DSA_BANK.filter((q) => q.difficulty === "Hard")).slice(0, 1);
    return shuffle([...easy, ...medium, ...hard]);
  });
  const [idx, setIdx] = useState(0);
  const [showApproach, setShowApproach] = useState(false);
  const [solved, setSolved] = useState<Set<string>>(new Set());
  const [sessionDone, setSessionDone] = useState(false);

  const generateNew = () => {
    const easy   = shuffle(DSA_BANK.filter((q) => q.difficulty === "Easy")).slice(0, 1);
    const medium = shuffle(DSA_BANK.filter((q) => q.difficulty === "Medium")).slice(0, 2);
    const hard   = shuffle(DSA_BANK.filter((q) => q.difficulty === "Hard")).slice(0, 1);
    setQuestions(shuffle([...easy, ...medium, ...hard]));
    setIdx(0);
    setShowApproach(false);
    setSolved(new Set());
    setSessionDone(false);
  };

  const q = questions[idx];
  if (!q) return null;

  return (
    <div className="space-y-4">
      {/* Session info + controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <GlassCard className="flex-1 p-4" hover={false}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">45-min Mock Session</span>
            <button
              onClick={generateNew}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-cyan-400 border border-cyan-500/25 bg-cyan-500/8 hover:bg-cyan-500/15 transition-all"
            >
              <RefreshCw className="h-3 w-3" /> New Mock
            </button>
          </div>
          <DSATimer totalSec={45 * 60} onEnd={() => setSessionDone(true)} />
        </GlassCard>

        <GlassCard className="p-4 flex flex-col justify-between min-w-[130px]" hover={false}>
          <p className="text-xs text-zinc-500">Questions</p>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => { setIdx(i); setShowApproach(false); }}
                className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${
                  solved.has(q.id)
                    ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                    : i === idx
                    ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
                    : "bg-white/5 border-white/10 text-zinc-500"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-600 mt-2">{solved.size}/{questions.length} solved</p>
        </GlassCard>
      </div>

      {sessionDone && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-sm text-emerald-300 font-semibold">Session complete! You solved {solved.size}/{questions.length} questions.</p>
        </div>
      )}

      {/* Current question */}
      <GlassCard className="p-5" hover={false}>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] text-zinc-600 font-bold uppercase">Q{idx + 1}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${DIFF_COLOR[q.difficulty]}`}>{q.difficulty}</span>
              <span className="text-[10px] text-zinc-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">{q.topic}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{q.title}</h2>
          </div>
          {solved.has(q.id) && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
        </div>

        {/* Think-aloud prompts */}
        <div className="space-y-2 mb-4">
          {[
            { step: "1. State the problem", prompt: "Restate it in your own words. Clarify inputs, outputs, edge cases." },
            { step: "2. Brute force",       prompt: q.brute },
            { step: "3. Optimize",          prompt: "How can you improve time/space? What pattern or data structure helps?" },
            { step: "4. Code it",           prompt: "Write the optimal solution. Verify on examples. Mention the approach." },
          ].map(({ step, prompt }) => (
            <div key={step} className="p-3 rounded-lg bg-white/3 border border-white/5 text-xs">
              <span className="font-bold text-cyan-400">{step}: </span>
              <span className="text-zinc-400">{prompt}</span>
            </div>
          ))}
        </div>

        {/* Approach reveal */}
        {showApproach ? (
          <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-violet-300 uppercase tracking-wider">Optimal Approach</p>
              <button onClick={() => setShowApproach(false)} className="text-zinc-600 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="text-sm text-zinc-300">{q.optimal}</p>
            <div className="flex gap-3 text-[10px]">
              <span className="text-emerald-400 font-bold">Time: {q.timeComplexity}</span>
              <span className="text-cyan-400 font-bold">Space: {q.spaceComplexity}</span>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/8 border border-amber-500/15">
              <Lightbulb className="h-3 w-3 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-300">{q.hint}</p>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowApproach(true)}
            className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
          >
            <Lightbulb className="h-3.5 w-3.5" /> Reveal approach
          </button>
        )}

        {/* Navigation */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={() => { setSolved((p) => new Set([...p, q.id])); setShowApproach(false); if (idx < questions.length - 1) setIdx((i) => i + 1); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-bold hover:bg-emerald-500/25 transition-all"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Mark Solved
          </button>
          {idx > 0 && (
            <button onClick={() => { setIdx((i) => i - 1); setShowApproach(false); }} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 text-sm hover:text-white transition-all">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {idx < questions.length - 1 && (
            <button onClick={() => { setIdx((i) => i + 1); setShowApproach(false); }} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-sm hover:text-white transition-all">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Generic Q&A Tab ─────────────────────────────────────────────────────────

function QATab({ prompts, accentColor, accentBg, accentBorder }: {
  prompts: PromptItem[];
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}) {
  const [questions, setQuestions] = useState<PromptItem[]>(() => shuffle(prompts).slice(0, 6));
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState<Set<number>>(new Set());

  const regenerate = () => {
    setQuestions(shuffle(prompts).slice(0, 6));
    setIdx(0);
    setAnswered(new Set());
  };

  const q = questions[idx];
  if (!q) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${
                answered.has(i)
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                  : i === idx
                  ? `${accentBg} ${accentBorder} ${accentColor}`
                  : "bg-white/5 border-white/10 text-zinc-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={regenerate}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${accentColor} ${accentBorder} ${accentBg} border hover:opacity-80 transition-all`}
        >
          <RefreshCw className="h-3 w-3" /> New Set
        </button>
      </div>

      <GlassCard className="p-5" hover={false}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${accentColor} ${accentBg} ${accentBorder}`}>
            {q.category}
          </span>
          <span className="text-[10px] text-zinc-600">Question {idx + 1} of {questions.length}</span>
        </div>

        <h2 className="text-base font-bold text-white mb-4 leading-snug">{q.question}</h2>

        <div className="p-3 rounded-xl border border-amber-500/15 bg-amber-500/5 flex items-start gap-2 mb-5">
          <Star className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200">{q.tip}</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setAnswered((p) => new Set([...p, idx])); if (idx < questions.length - 1) setIdx((i) => i + 1); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-bold hover:bg-emerald-500/25 transition-all"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Answered
          </button>
          {idx > 0 && (
            <button onClick={() => setIdx((i) => i - 1)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {idx < questions.length - 1 && (
            <button onClick={() => setIdx((i) => i + 1)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MockInterviewPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dsa");

  return (
    <AppShell title="Mock Interview" subtitle="Think aloud · Simulate real rounds">
      {/* Header callout */}
      <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/5 p-4 mb-5 flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white">How to use this</p>
          <p className="text-xs text-zinc-400 mt-0.5">
            Pick a round, start the timer, and talk through your answer aloud.
            Aim for Week 4+ of your DSA roadmap. Schedule 1 full mock per week.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                active
                  ? `${tab.bg} ${tab.border} ${tab.color}`
                  : "bg-white/3 border-white/8 text-zinc-500 hover:text-zinc-300 hover:border-white/15"
              }`}
              id={`mock-tab-${tab.id}`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "dsa" && <DSATab />}
      {activeTab === "project" && (
        <QATab
          prompts={PROJECT_PROMPTS}
          accentColor="text-amber-400"
          accentBg="bg-amber-500/10"
          accentBorder="border-amber-500/25"
        />
      )}
      {activeTab === "hr" && (
        <QATab
          prompts={HR_PROMPTS}
          accentColor="text-violet-400"
          accentBg="bg-violet-500/10"
          accentBorder="border-violet-500/25"
        />
      )}
      {activeTab === "frontend" && (
        <QATab
          prompts={FRONTEND_PROMPTS}
          accentColor="text-emerald-400"
          accentBg="bg-emerald-500/10"
          accentBorder="border-emerald-500/25"
        />
      )}
    </AppShell>
  );
}
