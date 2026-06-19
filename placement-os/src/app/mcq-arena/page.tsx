"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import { useProgressStore } from "@/lib/progress-store";
import { useDataStore } from "@/store/data-store";
import mcqQuestions from "@/data/mcq-questions.json";
import type { MCQQuestion } from "@/types";
import {
  Brain,
  Award,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  Target,
  Trophy,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function MCQDashboard() {
  const router = useRouter();
  const {
    mcqAttempts = [],
    mcqBookmarks = [],
    mcqSessions = [],
    xp,
    level,
    interviewHistory = [],
    questionProgress = {},
  } = useProgressStore();

  const { questions, fetchData } = useDataStore();

  useEffect(() => {
    if (questions.length === 0) {
      fetchData();
    }
  }, [questions, fetchData]);

  // Compute overall stats
  const totalAttempts = mcqAttempts.length;
  const correctAttempts = mcqAttempts.filter((a) => a.isCorrect).length;
  const incorrectAttempts = totalAttempts - correctAttempts;
  const overallAccuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  
  // Calculate MCQ-specific XP
  const mcqXp = mcqAttempts.reduce((acc, a) => {
    if (!a.isCorrect) return acc;
    // We lookup difficulty
    const q = (mcqQuestions as MCQQuestion[]).find((item) => item.id === a.questionId);
    if (!q) return acc;
    if (q.difficulty === "Easy") return acc + 5;
    if (q.difficulty === "Medium") return acc + 10;
    if (q.difficulty === "Hard") return acc + 20;
    return acc;
  }, 0) + (mcqSessions || []).reduce((acc, s) => acc + (s.type === "oa" ? 150 : 50), 0);

  // Topic-wise accuracy & count
  const topicStats: Record<string, { total: number; correct: number }> = {};
  const difficultyStats: Record<string, { total: number; correct: number }> = {
    Easy: { total: 0, correct: 0 },
    Medium: { total: 0, correct: 0 },
    Hard: { total: 0, correct: 0 },
  };

  mcqAttempts.forEach((attempt) => {
    const q = (mcqQuestions as MCQQuestion[]).find((item) => item.id === attempt.questionId);
    if (q) {
      // Topic
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total += 1;
      if (attempt.isCorrect) {
        topicStats[q.topic].correct += 1;
      }

      // Difficulty
      difficultyStats[q.difficulty].total += 1;
      if (attempt.isCorrect) {
        difficultyStats[q.difficulty].correct += 1;
      }
    }
  });

  const topicChartData = Object.entries(topicStats)
    .map(([name, stat]) => ({
      name,
      attempts: stat.total,
      accuracy: Math.round((stat.correct / stat.total) * 100),
    }))
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 8); // Top 8 topics practiced

  const diffChartData = Object.entries(difficultyStats).map(([name, stat]) => ({
    name,
    value: stat.total,
    accuracy: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
  }));

  // Coverage Analysis
  const docxCoverage: Record<string, number> = {};
  (mcqQuestions as MCQQuestion[]).forEach((q) => {
    docxCoverage[q.topic] = (docxCoverage[q.topic] || 0) + 1;
  });

  // Actionable Recommendation Engine (Phase 13)
  const recommendations: string[] = [];
  const weakTopics: { topic: string; accuracy: number; count: number }[] = [];

  Object.entries(topicStats).forEach(([topic, stats]) => {
    const acc = Math.round((stats.correct / stats.total) * 100);
    if (acc < 60 || stats.total < 5) {
      weakTopics.push({ topic, accuracy: acc, count: stats.total });
    }
  });

  // Sort weak topics: prioritizing those attempted but with low accuracy
  weakTopics.sort((a, b) => {
    if (a.count > 0 && b.count === 0) return -1;
    if (b.count > 0 && a.count === 0) return 1;
    return a.accuracy - b.accuracy;
  });

  // Generate actionable tips
  if (weakTopics.length > 0) {
    const topWeak = weakTopics[0];
    if (topWeak.count > 0) {
      recommendations.push(
        `Your accuracy in ${topWeak.topic} is only ${topWeak.accuracy}% after ${topWeak.count} attempts. Focus on practicing ${topWeak.topic} concepts.`
      );
    } else {
      recommendations.push(
        `You haven't practiced ${topWeak.topic} MCQs yet. Go to Practice Mode and attempt 10 questions.`
      );
    }
  }

  // Check Graph accuracy specifically
  const graphStat = topicStats["Graphs"];
  if (graphStat) {
    const graphAcc = Math.round((graphStat.correct / graphStat.total) * 100);
    if (graphAcc < 60) {
      recommendations.push(
        `Your Graph accuracy is low (${graphAcc}%). Complete a Graph-focused Timed Quiz or Graph OA.`
      );
    }
  } else {
    recommendations.push("Attempt a Graph-focused OA simulation to evaluate your graph theory skills.");
  }

  // Check DP
  const dpStat = topicStats["Dynamic Programming"];
  if (dpStat) {
    const dpAcc = Math.round((dpStat.correct / dpStat.total) * 100);
    if (dpAcc < 65) {
      recommendations.push(`Complete 15 Dynamic Programming MCQs to improve your DP readiness.`);
    }
  }

  // Default recommendations
  if (recommendations.length < 3) {
    recommendations.push("Attempt a Microsoft Style OA to challenge your bitwise operation and heap skills.");
    recommendations.push("Practice 15 Advanced Trees & BST MCQs to boost your hierarchical knowledge.");
  }

  return (
    <AppShell title="MCQ Arena" subtitle="Theory, Complexity & OA Practice Ecosystem">
      <div className="space-y-6">
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Attempts"
            value={totalAttempts}
            sub={`${correctAttempts} Correct · ${incorrectAttempts} Incorrect`}
            icon={Brain}
            accent="from-indigo-500 to-purple-600"
            delay={0}
          />
          <StatCard
            label="Overall Accuracy"
            value={`${overallAccuracy}%`}
            sub={totalAttempts > 0 ? "Targeting 80% for OA clears" : "Practice to build accuracy"}
            icon={Target}
            accent="from-emerald-400 to-teal-500"
            delay={0.05}
          />
          <StatCard
            label="XP Generated"
            value={`+${mcqXp} XP`}
            sub={`Level ${level} Active`}
            icon={Trophy}
            accent="from-amber-400 to-orange-500"
            delay={0.1}
          />
          <StatCard
            label="Bookmarks Saved"
            value={mcqBookmarks.length}
            sub="Saved questions for revision"
            icon={Award}
            accent="from-pink-500 to-rose-600"
            delay={0.15}
          />
        </div>

        {/* MODES SECTOR */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <GlassCard
            hover
            onClick={() => router.push("/mcq-arena/practice")}
            className="flex flex-col justify-between border-indigo-500/20 bg-indigo-500/5"
            delay={0.2}
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-between rounded-xl bg-indigo-500/10 p-3 text-indigo-400">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[var(--text-primary)]">Topic Practice</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Review specific topics like Trees, DP, or Graphs. Access bookmarks and detailed explanations instantly.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-indigo-400">
              Start Practice <ChevronRight className="h-4 w-4" />
            </div>
          </GlassCard>

          <GlassCard
            hover
            onClick={() => router.push("/mcq-arena/quiz")}
            className="flex flex-col justify-between border-violet-500/20 bg-violet-500/5"
            delay={0.25}
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-between rounded-xl bg-violet-500/10 p-3 text-violet-400">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[var(--text-primary)]">Timed Quiz Mode</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Generate custom timed quizzes with 10, 20, 30, or 50 questions. Auto-submits on time limit.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-violet-400">
              Launch Quiz <ChevronRight className="h-4 w-4" />
            </div>
          </GlassCard>

          <GlassCard
            hover
            onClick={() => router.push("/mcq-arena/oa")}
            className="flex flex-col justify-between border-amber-500/20 bg-amber-500/5"
            delay={0.3}
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-between rounded-xl bg-amber-500/10 p-3 text-amber-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[var(--text-primary)]">Company OA Simulator</h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Experience realistic placement assessments. Simulate Amazon, Microsoft, and Adobe style screening rounds.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-1.5 text-sm font-semibold text-amber-400">
              Run Assessment <ChevronRight className="h-4 w-4" />
            </div>
          </GlassCard>
        </div>

        {/* MIDDLE SECTION: READINESS & COVERAGE */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* READINESS ENGINE (Phase 13) */}
          <GlassCard className="col-span-1 lg:col-span-5 flex flex-col justify-between" delay={0.35}>
            <div>
              <h3 className="text-md font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Interview Readiness Recommendations
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Actionable study plans computed from your mock and MCQ history.
              </p>
              <div className="mt-5 space-y-3.5">
                {recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-normal)]">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[var(--border-normal)] flex items-center justify-between">
              <div className="text-xs text-[var(--text-secondary)]">
                Streak: <span className="font-semibold text-[var(--text-primary)]">{useProgressStore.getState().streak} days</span>
              </div>
              <button
                onClick={() => router.push("/mcq-arena/practice")}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--bg-hover)] hover:bg-[var(--border-normal)] text-[var(--text-primary)] transition-colors border border-[var(--border-normal)]"
              >
                Resolve Weak Areas
              </button>
            </div>
          </GlassCard>

          {/* COVERAGE LIST */}
          <GlassCard className="col-span-1 lg:col-span-7" delay={0.4}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-md font-bold text-[var(--text-primary)]">Syllabus Coverage</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Question count per concept in our preparation database.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                {mcqQuestions.length} Total MCQs
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 overflow-y-auto max-h-[260px] pr-2">
              {Object.entries(docxCoverage)
                .sort((a, b) => b[1] - a[1])
                .map(([topic, count], i) => {
                  const attempted = topicStats[topic]?.total || 0;
                  const pct = Math.round((attempted / count) * 100);
                  return (
                    <div key={topic} className="flex flex-col">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-[var(--text-primary)] truncate max-w-[130px]">{topic}</span>
                        <span className="text-[var(--text-muted)] text-[10px]">{attempted}/{count} ({pct}%)</span>
                      </div>
                      <div className="mt-1 w-full bg-[var(--bg-hover)] h-1.5 rounded-full overflow-hidden border border-[var(--border-normal)]">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </GlassCard>
        </div>

        {/* ANALYTICS SECTION */}
        {totalAttempts > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* TOPICS ACCURACY BAR CHART */}
            <GlassCard delay={0.45}>
              <h3 className="text-md font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
                Topic Accuracy & Practice Volume
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topicChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-normal)" />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-normal)",
                        borderRadius: "12px",
                      }}
                      labelStyle={{ color: "var(--text-primary)", fontWeight: "bold" }}
                    />
                    <Bar dataKey="accuracy" name="Accuracy %" fill="url(#colorAcc)" radius={[6, 6, 0, 0]}>
                      {topicChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* DIFFICULTY PIE CHART */}
            <GlassCard delay={0.5}>
              <h3 className="text-md font-bold text-[var(--text-primary)] mb-4">Difficulty Distribution & Accuracy</h3>
              <div className="flex flex-col sm:flex-row items-center justify-around h-72">
                <div className="h-56 w-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={diffChartData.filter((d) => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {diffChartData
                          .filter((d) => d.value > 0)
                          .map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.name === "Easy" ? "#10B981" : entry.name === "Medium" ? "#3B82F6" : "#EF4444"} />
                          ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--bg-elevated)",
                          borderColor: "var(--border-normal)",
                          borderRadius: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3.5">
                  {diffChartData.map((d) => (
                    <div key={d.name} className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{
                          backgroundColor: d.name === "Easy" ? "#10B981" : d.name === "Medium" ? "#3B82F6" : "#EF4444",
                        }}
                      />
                      <div>
                        <div className="text-xs font-semibold text-[var(--text-primary)]">
                          {d.name}: <span className="font-bold">{d.value}</span> attempts
                        </div>
                        <div className="text-[10px] text-[var(--text-secondary)]">Accuracy: {d.accuracy}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </AppShell>
  );
}
