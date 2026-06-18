"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { QuestionCard } from "@/components/dsa/question-card";
import { useProgressStore } from "@/lib/progress-store";
import { useDSAStats } from "@/hooks/use-dsa";
import { useDataStore } from "@/store/data-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Code,
  Sparkles,
  FileText,
  Users,
  Server,
  Zap,
  Heart,
  Send,
  Loader2,
  AlertCircle,
  ArrowRight,
  Target,
  TrendingUp,
  BookOpen,
  Flame,
} from "lucide-react";
import Link from "next/link";

interface Message {
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
}

const MENTORS = [
  {
    id: "sudo",
    name: "Sudo",
    role: "DSA Coach & Complexity Analyst",
    icon: Code,
    color: "from-cyan-500 to-blue-600",
    glow: "rgba(6,182,212,0.3)",
    greeting:
      "Hey! I'm Sudo. I analyze your weak topics and recommend real questions from your sheet. What DSA topic do you want to conquer today?",
    prompts: [
      "Recommend questions for my weak topics.",
      "Explain the sliding window pattern.",
      "Give me a revision plan.",
    ],
  },
  {
    id: "quant",
    name: "Quant",
    role: "Aptitude & Shortcut Trainer",
    icon: Sparkles,
    color: "from-violet-500 to-fuchsia-600",
    glow: "rgba(139,92,246,0.3)",
    greeting:
      "Hello, I'm Quant. I teach shortcut tricks for speed-based aptitude screenings. Need a math hack or formula breakdown?",
    prompts: [
      "Show me a shortcut for Time and Work LCM.",
      "What is the successive percentage change formula?",
      "Give me tips for solving Logical Series.",
    ],
  },
  {
    id: "resume",
    name: "Resume",
    role: "ATS & Technical Resume Writer",
    icon: FileText,
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.3)",
    greeting:
      "Welcome. I am Resume. I help you format technical projects and skills using Google's X-Y-Z formula. Drop a bullet point, and we'll refine it.",
    prompts: [
      "Explain Google's X-Y-Z resume formula.",
      "Optimize this bullet point: 'I built an online chat app'",
      "How should I list technical skills?",
    ],
  },
  {
    id: "social",
    name: "Social",
    role: "LinkedIn & Referral Lead",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    glow: "rgba(59,130,246,0.3)",
    greeting:
      "Hey! Social here. Placements are 50% networking. I write referral cold outreach messages and personal branding strategy. Who are we reaching out to?",
    prompts: [
      "Give me a cold message template for a tech recruiter.",
      "How do I ask an alumnus for a referral?",
      "Tips for optimizing my GitHub profile.",
    ],
  },
  {
    id: "system",
    name: "System",
    role: "System Design Architect",
    icon: Server,
    color: "from-indigo-500 to-purple-600",
    glow: "rgba(99,102,241,0.3)",
    greeting:
      "Hello. I'm System. I design high-scale systems. Let's discuss load balancers, caching, and SQL vs NoSQL. What architecture are we scaling?",
    prompts: [
      "Explain horizontal vs vertical scaling.",
      "When should I use SQL vs NoSQL?",
      "Draw high-level caching flow.",
    ],
  },
  {
    id: "focus",
    name: "Focus",
    role: "ADHD Productivity Partner",
    icon: Zap,
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.3)",
    greeting:
      "Hey! Focus here. Feeling stuck or lazy? Let's crush starting friction. Give me 5 minutes and we will complete one tiny task. What's the block?",
    prompts: [
      "Give me a 5-minute hack to start studying.",
      "I'm overwhelmed by the DSA roadmap, help!",
      "Suggest a micro-habit for daily coding.",
    ],
  },
  {
    id: "zen",
    name: "Zen",
    role: "Placement Anxiety Therapist",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    glow: "rgba(244,63,94,0.3)",
    greeting:
      "Breathe in, breathe out. I'm Zen. Placements are stressful, and imposter syndrome is real. I'm here to listen and help you recover without guilt.",
    prompts: [
      "I feel anxious about an upcoming coding test.",
      "How do I handle rejection from a dream company?",
      "Give me a 72-hour burnout recovery plan.",
    ],
  },
];

// ─── Real question recommendations panel ───────────────────────────────────
function RecommendationsPanel() {
  const questions = useDataStore((s) => s.questions);
  const { dueRevisions, weakTopics, dailyChallenge } = useDSAStats();
  const questionProgress = useProgressStore((s) => s.questionProgress);

  const [activeTab, setActiveTab] = useState<"weak" | "revision" | "daily" | "company">("weak");

  // Weak topic questions (unsolved from weak topics)
  const weakQuestions = useMemo(() => {
    if (!weakTopics.length) return [];
    const weakIds = new Set(weakTopics.map((w) => w.topicId));
    return questions
      .filter(
        (q) =>
          (weakIds.has(q.topicId) || q.additionalTopicIds?.some((tId) => weakIds.has(tId))) &&
          !["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
      )
      .sort((a, b) => {
        const o = { Easy: 0, Medium: 1, Hard: 2 };
        return (o[a.difficulty] ?? 1) - (o[b.difficulty] ?? 1);
      })
      .slice(0, 10);
  }, [questions, weakTopics, questionProgress]);

  // Company-specific: pick top companies from solved questions
  const companyQuestions = (() => {
    const companyCounts: Record<string, number> = {};
    questions.forEach((q) => {
      if (["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")) {
        q.companies.forEach((c) => {
          companyCounts[c] = (companyCounts[c] || 0) + 1;
        });
      }
    });
    const topCompany = Object.entries(companyCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    if (!topCompany) {
      // Just pick high-frequency unsolved
      return questions
        .filter(
          (q) =>
            q.interviewFrequency === "very-high" &&
            !["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
        )
        .slice(0, 8);
    }
    return questions
      .filter(
        (q) =>
          q.companies.includes(topCompany) &&
          !["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
      )
      .slice(0, 8);
  })();

  const tabs = [
    { id: "weak" as const, label: "Weak Topics", icon: Target, count: weakQuestions.length },
    { id: "revision" as const, label: "Due Revision", icon: BookOpen, count: dueRevisions.length },
    { id: "daily" as const, label: "Daily Pick", icon: Flame, count: dailyChallenge ? 1 : 0 },
    { id: "company" as const, label: "Company Prep", icon: TrendingUp, count: companyQuestions.length },
  ];

  return (
    <GlassCard hover={false} className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-4 w-4 text-cyan-400" />
        <h3 className="font-bold text-sm text-white">Smart Recommendations</h3>
        <span className="text-[10px] text-zinc-500 ml-auto">personalized</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all border ${
                activeTab === tab.id
                  ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                  : "border-white/5 bg-white/3 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon className="h-3 w-3" />
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-0.5 rounded-full bg-white/10 px-1 text-[9px]">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px] pr-1">
        {activeTab === "weak" && (
          <>
            {weakTopics.length > 0 && (
              <div className="mb-3 space-y-1">
                {weakTopics.map((w) => (
                  <Link
                    key={w.topicId}
                    href={`/dsa/topic/${w.topicId}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/20 transition-colors"
                  >
                    <span className="text-xs font-semibold text-rose-300">{w.name}</span>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                      {w.reason} <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            )}
            {weakQuestions.length > 0 ? (
              weakQuestions.map((q) => (
                <QuestionCard key={q.id} question={q} compact />
              ))
            ) : (
              <p className="text-xs text-zinc-500 text-center py-8">
                No weak areas detected — great work! Keep solving. 🎉
              </p>
            )}
          </>
        )}

        {activeTab === "revision" && (
          dueRevisions.length > 0 ? (
            dueRevisions.slice(0, 10).map(({ question }) => (
              <QuestionCard key={question.id} question={question} compact />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-zinc-500">No revisions due right now. 🎉</p>
              <Link href="/revision" className="text-xs text-cyan-400 mt-2 block">
                View revision schedule →
              </Link>
            </div>
          )
        )}

        {activeTab === "daily" && (
          dailyChallenge ? (
            <QuestionCard question={dailyChallenge} />
          ) : (
            <p className="text-xs text-zinc-500 text-center py-8">Loading daily challenge…</p>
          )
        )}

        {activeTab === "company" && (
          companyQuestions.length > 0 ? (
            companyQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} compact />
            ))
          ) : (
            <p className="text-xs text-zinc-500 text-center py-8">
              Solve questions to see personalized company-specific preparation recommendations.
            </p>
          )
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-white/5">
        <Link href="/dsa/practice" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          Browse all questions <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </GlassCard>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function AIMentorPage() {
  const { llmApiKey } = useProgressStore();
  const { dueRevisions, weakTopics } = useDSAStats();

  const [activeMentor, setActiveMentor] = useState(MENTORS[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const initial: Record<string, Message[]> = {};
    MENTORS.forEach((m) => {
      initial[m.id] = [
        {
          sender: "mentor",
          text: m.greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ];
    });
    return initial;
  });

  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Rate-limiting check to prevent double submissions
  const lastRequestTimeRef = useRef<number>(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeMentor]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Rate-limiting double-click block
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    if (now - lastRequestTimeRef.current < 2000) {
      console.warn("[Rate Limit] Blocking rapid mentor submission.");
      return;
    }
    lastRequestTimeRef.current = now;

    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const currentHistory = messages[activeMentor.id] || [];
    setMessages({ ...messages, [activeMentor.id]: [...currentHistory, userMsg] });
    setInputVal("");
    setIsLoading(true);

    try {
      const weakList = weakTopics.map((w) => w.name).join(", ");
      const context = {
        weakTopics: weakList,
        revisionsDue: dueRevisions.length,
        userLevel: useProgressStore.getState().level,
        xp: useProgressStore.getState().xp,
      };

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          persona: activeMentor.id,
          apiKey: llmApiKey,
          context,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const mentorMsg: Message = {
          sender: "mentor",
          text: data.response || "I'm having trouble connecting right now. Try again!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => ({
          ...prev,
          [activeMentor.id]: [...(prev[activeMentor.id] || []), mentorMsg],
        }));
      } else {
        throw new Error("API failed");
      }
    } catch {
      const errorMsg: Message = {
        sender: "mentor",
        text: "🚨 Connection issue. Check your network or add a Gemini API key in Settings.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => ({
        ...prev,
        [activeMentor.id]: [...(prev[activeMentor.id] || []), errorMsg],
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const activeHistory = messages[activeMentor.id] || [];
  const ActiveIcon = activeMentor.icon;

  return (
    <AppShell title="AI Mentor Console" subtitle="Specialized coaching + real question recommendations">
      {/* API KEY WARNING */}
      {!llmApiKey && (
        <GlassCard className="mb-4 p-4 border-amber-500/20 bg-amber-500/5" hover={false}>
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-300">Offline Mode — Heuristic Responses</h4>
              <p className="text-xs text-zinc-400 mt-1">
                For real AI responses, add your Gemini API Key in{" "}
                <Link href="/settings" className="text-cyan-400 font-bold hover:underline">
                  Settings
                </Link>
                . The recommendations panel on the right uses real sheet data and works offline.
              </p>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: Chat (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Mentor selector */}
          <div className="flex gap-2 flex-wrap">
            {MENTORS.map((mentor) => {
              const Icon = mentor.icon;
              const isSelected = activeMentor.id === mentor.id;
              return (
                <button
                  key={mentor.id}
                  onClick={() => setActiveMentor(mentor)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? `bg-gradient-to-r ${mentor.color} border-transparent text-white shadow-lg`
                      : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {mentor.name}
                </button>
              );
            })}
          </div>

          {/* Chat window */}
          <div className="flex flex-col rounded-2xl border border-white/5 bg-zinc-950/40 backdrop-blur-md overflow-hidden min-h-[500px]">
            {/* Active mentor header */}
            <div className="flex items-center space-x-3 p-4 border-b border-white/5 bg-black/40">
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-r ${activeMentor.color} text-white shadow-md`}
              >
                <ActiveIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {activeMentor.name}
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </h3>
                <p className="text-[10px] text-zinc-400 font-medium">{activeMentor.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[50vh] min-h-[300px]">
              <AnimatePresence initial={false}>
                {activeHistory.map((msg, index) => {
                  const isUser = msg.sender === "user";
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl border text-xs leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? "bg-cyan-500/15 border-cyan-500/30 text-white rounded-tr-none"
                            : "bg-white/5 border-white/5 text-zinc-300 rounded-tl-none"
                        }`}
                      >
                        {msg.text}
                        <span className="block text-[8px] text-zinc-500 mt-2 text-right">
                          {msg.timestamp}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="flex items-center space-x-2 bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none text-zinc-400 text-xs">
                      <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                      <span>{activeMentor.name} is thinking…</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-black/40">
              {/* Quick prompts */}
              <div className="flex flex-wrap gap-2 mb-3">
                {activeMentor.prompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/5 text-[10px] text-zinc-400 hover:border-transparent transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputVal);
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder={`Ask ${activeMentor.name} a question…`}
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isLoading}
                  className="p-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <Send className="h-4 w-4 fill-current" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT: Real Question Recommendations panel (1/3 width) */}
        <div className="lg:col-span-1">
          <RecommendationsPanel />
        </div>
      </div>
    </AppShell>
  );
}
