"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { aptitudeQuestions, AptitudeQuestion } from "@/data/aptitude-questions";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  HelpCircle,
  Clock,
  Award,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Zap
} from "lucide-react";
import Link from "next/link";
import { MathRenderer } from "@/components/ui/math-renderer";

interface LeaderboardEntry {
  name: string;
  avatar: string;
  score: number;
  timeSpentStr: string;
  isUser: boolean;
}

const formatDuration = (secs: number) => {
  const mins = Math.floor(secs / 60);
  const s = secs % 60;
  return `${mins}m ${s}s`;
};

export default function ReviewPage() {
  const router = useRouter();
  const rawParams = useParams();
  
  // Unwrap params
  const params = rawParams ? (typeof (rawParams as any).then === 'function' ? use(rawParams as any) : rawParams) as any : {} as any;
  const attemptId = (params?.attemptId as string) || "";

  const { aptitudeAttempts = [] } = useProgressStore();
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // Find the target attempt
  useEffect(() => {
    const foundAttempt = aptitudeAttempts.find((a) => a.id === attemptId);
    if (foundAttempt) {
      setAttempt(foundAttempt);
      
      // Load questions that were in this attempt
      const attemptQuestionIds = Object.keys(foundAttempt.answers);
      const attemptQs = aptitudeQuestions.filter((q) => attemptQuestionIds.includes(q.id));
      setQuestions(attemptQs);

      // Generate simulated leaderboard
      const userEntry: LeaderboardEntry = {
        name: "You (Candidate)",
        avatar: "👤",
        score: foundAttempt.score,
        timeSpentStr: formatDuration(foundAttempt.timeSpentSec),
        isUser: true,
      };

      const mockCompetitors: LeaderboardEntry[] = [
        { name: "Aditya Sharma", avatar: "👨‍💻", score: 90, timeSpentStr: "11m 45s", isUser: false },
        { name: "Priya Patel", avatar: "👩‍💻", score: 80, timeSpentStr: "13m 20s", isUser: false },
        { name: "Rohit Verma", avatar: "👨‍💻", score: 70, timeSpentStr: "16m 10s", isUser: false },
        { name: "Sneha Reddy", avatar: "👩‍💻", score: 60, timeSpentStr: "14m 50s", isUser: false },
        { name: "Vikram Singh", avatar: "👨‍💻", score: 50, timeSpentStr: "18m 05s", isUser: false },
      ];

      // Sort combined list: by score descending, then by time ascending
      const combined = [...mockCompetitors, userEntry].sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.timeSpentStr.localeCompare(b.timeSpentStr);
      });

      setLeaderboard(combined);
    }
  }, [attemptId, aptitudeAttempts]);

  if (!attempt) {
    return (
      <AppShell title="Loading Attempt..." subtitle="Fetching scorecard">
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="text-zinc-400">Attempt log not found or loading...</p>
            <Link href="/aptitude">
              <button className="btn-primary mt-4 py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 mx-auto text-sm">
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Hub</span>
              </button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  // Section stats
  const categoriesInTest = Array.from(new Set(questions.map((q) => q.category)));
  const categorySummary = categoriesInTest.map((cat) => {
    const catQs = questions.filter((q) => q.category === cat);
    const catAnswers = catQs.filter((q) => attempt.answers[q.id] === q.answer).length;
    const catAccuracy = Math.round((catAnswers / catQs.length) * 100);
    return {
      category: cat,
      accuracy: catAccuracy,
      total: catQs.length,
      correct: catAnswers,
    };
  });

  // Weak area alerts
  const weakCategories = categorySummary.filter((c) => c.accuracy < 60);

  // Filtered questions based on tab
  const filteredQuestions = questions.filter((q) => {
    if (activeTab === "all") return true;
    if (activeTab === "correct") return attempt.answers[q.id] === q.answer;
    if (activeTab === "incorrect") return attempt.answers[q.id] && attempt.answers[q.id] !== q.answer;
    if (activeTab === "skipped") return !attempt.answers[q.id];
    return true;
  });

  return (
    <AppShell title="Mock Scorecard" subtitle="Analytical performance breakdown">
      {/* HEADER ACTIONS */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/aptitude">
          <button className="flex items-center space-x-1.5 text-sm text-zinc-400 hover:text-white transition-all bg-white/5 border border-white/5 py-2 px-3 rounded-lg">
            <ArrowLeft className="h-4 w-4" />
            <span>Aptitude Dashboard</span>
          </button>
        </Link>

        <span className="text-xs text-zinc-500 font-mono">
          Completed: {new Date(attempt.completedAt).toLocaleString()}
        </span>
      </div>

      {/* CORE STATS BANNER */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="p-5 flex flex-col justify-between" hover={false}>
          <p className="text-xs text-zinc-400">Score Achieved</p>
          <div className="mt-2 flex items-baseline justify-between">
            <h2 className={`text-4xl font-extrabold ${
              attempt.score >= 70 ? "text-emerald-400" :
              attempt.score >= 50 ? "text-amber-400" : "text-rose-400"
            }`}>
              {attempt.score}%
            </h2>
            <span className="text-xs text-zinc-500 font-medium">
              {attempt.correctAnswers}/{attempt.totalQuestions} Correct
            </span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between" hover={false}>
          <p className="text-xs text-zinc-400">Accuracy Rate</p>
          <div className="mt-2 flex items-baseline justify-between">
            <h2 className="text-4xl font-extrabold text-cyan-400">
              {attempt.totalQuestions - attempt.skippedAnswers > 0
                ? Math.round((attempt.correctAnswers / (attempt.totalQuestions - attempt.skippedAnswers)) * 100)
                : 0}%
            </h2>
            <span className="text-xs text-zinc-500 font-medium">
              {attempt.skippedAnswers} skipped
            </span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between" hover={false}>
          <p className="text-xs text-zinc-400">Time Consumed</p>
          <div className="mt-2 flex items-baseline justify-between">
            <h2 className="text-4xl font-extrabold text-violet-400">
              {formatDuration(attempt.timeSpentSec)}
            </h2>
            <span className="text-xs text-zinc-500 font-medium">
              Avg {Math.round(attempt.timeSpentSec / attempt.totalQuestions)}s / Q
            </span>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between" hover={false}>
          <p className="text-xs text-zinc-400">XP Earned</p>
          <div className="mt-2 flex items-baseline justify-between">
            <h2 className="text-4xl font-extrabold text-amber-400 flex items-center">
              +{attempt.correctAnswers * 15 + 100}
              <Sparkles className="h-5 w-5 ml-1 fill-amber-400 text-amber-500" />
            </h2>
            <span className="text-xs text-zinc-500 font-medium">
              +15 per correct + 100 completion
            </span>
          </div>
        </GlassCard>
      </div>

      {/* WEAK AREA ALERTS */}
      {weakCategories.length > 0 && (
        <GlassCard className="mb-8 p-5 border-rose-500/20 bg-rose-500/5" hover={false}>
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-1.5 mb-2">
            <AlertTriangle className="h-4.5 w-4.5 animate-pulse" />
            Weak Areas Detected (Accuracy &lt; 60%)
          </h3>
          <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
            Based on your test response, your score is lagging in the following sections. We recommend targeting these topics before scheduling your next placement mock.
          </p>
          <div className="flex flex-wrap gap-3">
            {weakCategories.map((c) => (
              <span 
                key={c.category} 
                className="px-3 py-1.5 rounded-lg bg-zinc-950/60 border border-white/5 text-xs text-zinc-300 flex items-center space-x-2"
              >
                <span className="capitalize font-semibold text-white">{c.category}</span>
                <span className="text-rose-400 font-bold">{c.accuracy}% Accuracy</span>
              </span>
            ))}
          </div>
        </GlassCard>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* DETAILED QUESTION REVIEW */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center">
              <BookOpen className="h-4.5 w-4.5 mr-2 text-cyan-400" />
              Question & Solutions Ledger
            </h2>
            
            {/* Filter Pills */}
            <div className="flex space-x-1.5 bg-black/40 border border-white/5 rounded-xl p-1 text-xs">
              {[
                { id: "all", label: "All" },
                { id: "correct", label: "Correct" },
                { id: "incorrect", label: "Wrong" },
                { id: "skipped", label: "Skipped" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-cyan-500 text-black font-semibold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q, idx) => {
              const selected = attempt.answers[q.id];
              const isCorrect = selected === q.answer;
              const isSkipped = !selected;

              return (
                <GlassCard key={q.id} className="p-5 border-white/5 relative overflow-hidden" hover={false}>
                  {/* Status Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isSkipped ? "bg-zinc-500" : isCorrect ? "bg-emerald-500" : "bg-rose-500"
                  }`} />

                  {/* Header */}
                  <div className="flex justify-between items-center text-xs text-zinc-400 border-b border-white/5 pb-2 mb-3">
                    <span className="font-semibold text-zinc-300">
                      Question {idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-white/5 text-cyan-400 border border-white/5">
                      {q.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Question */}
                  <p className="text-sm font-medium text-white mb-4 whitespace-pre-line leading-relaxed">
                    <MathRenderer text={q.question} />
                  </p>

                  {/* Answers status */}
                  <div className="grid gap-3 sm:grid-cols-2 mb-4 bg-black/30 p-3.5 rounded-xl border border-white/5">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                        Your Answer
                      </span>
                      <div className="mt-1 flex items-center space-x-1.5">
                        {isSkipped ? (
                          <>
                            <HelpCircle className="h-4 w-4 text-zinc-500" />
                            <span className="text-xs text-zinc-400 font-medium italic">Skipped</span>
                          </>
                        ) : isCorrect ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs text-emerald-400 font-bold">{selected}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-rose-500" />
                            <span className="text-xs text-rose-400 font-bold">{selected}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                        Correct Answer
                      </span>
                      <div className="mt-1 flex items-center space-x-1.5">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs text-emerald-400 font-bold">{q.answer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mathematical Derivation / Explanation */}
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <h4 className="text-xs font-bold text-white mb-1.5 flex items-center">
                      <BookOpen className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                      Mathematical Derivation & Solution
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed bg-black/20 p-3 rounded-lg whitespace-pre-line">
                      <MathRenderer text={q.explanation} />
                    </p>
                  </div>

                  {/* Mentor Shortcuts */}
                  {q.shortcuts && q.shortcuts.length > 0 && (
                    <div className="mt-3 flex items-start space-x-2 bg-violet-500/5 border border-violet-500/10 p-3 rounded-lg">
                      <Zap className="h-4 w-4 text-violet-400 shrink-0 mt-0.5 fill-violet-400/20" />
                      <div>
                        <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider">
                          Mentor Shortcut Trick
                        </span>
                        <ul className="list-disc pl-4 text-[11px] text-zinc-400 space-y-1 mt-1">
                          {q.shortcuts.map((s, sIdx) => (
                            <li key={sIdx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* SIDE BAR: LEADERBOARD & SUMMARY */}
        <div className="space-y-8">
          {/* SIMULATED LEADERBOARD */}
          <GlassCard className="p-6" hover={false}>
            <h2 className="text-lg font-bold text-white mb-2 flex items-center">
              <Award className="h-4.5 w-4.5 mr-2 text-amber-400" />
              Competitor Scoreboard
            </h2>
            <p className="text-[10px] text-zinc-400 mb-4">
              Simulated rankings for this exam pool across candidates from top colleges.
            </p>

            <div className="space-y-3">
              {leaderboard.map((user, idx) => {
                const rank = idx + 1;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      user.isUser
                        ? "bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                        : "bg-white/5 border-white/5"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-extrabold h-5 w-5 rounded flex items-center justify-center ${
                        rank === 1 ? "bg-amber-400 text-black" :
                        rank === 2 ? "bg-zinc-300 text-black" :
                        rank === 3 ? "bg-amber-700 text-white" : "text-zinc-500"
                      }`}>
                        #{rank}
                      </span>
                      <span className="text-base">{user.avatar}</span>
                      <div>
                        <h4 className={`text-xs font-semibold ${user.isUser ? "text-cyan-300 font-bold" : "text-white"}`}>
                          {user.name}
                        </h4>
                        <p className="text-[9px] text-zinc-400">Time: {user.timeSpentStr}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${user.isUser ? "text-cyan-300" : "text-zinc-300"}`}>
                      {user.score}%
                    </span>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* NEXT ROADMAP STEPS */}
          <GlassCard className="p-6" hover={false}>
            <h2 className="text-lg font-bold text-white mb-3">Roadmap Recommendations</h2>
            <div className="space-y-4 text-xs text-zinc-400">
              <p>
                To further optimize your aptitude roadmap:
              </p>
              <ul className="list-disc pl-4 space-y-2 leading-relaxed">
                <li>
                  Practice 10 quantitative problems daily to increase speed below 60 seconds.
                </li>
                <li>
                  Double down on logical puzzles—they are popular screening components for product start-ups.
                </li>
                <li>
                  Check the <span className="text-cyan-400 font-bold">AI Mentor</span> console if you want customized shortcut tips for specific weak categories.
                </li>
              </ul>
              <Link href="/aptitude">
                <button className="w-full mt-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/5 font-semibold transition-all">
                  Back to Aptitude Hub
                </button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
