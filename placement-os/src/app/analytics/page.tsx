"use client";

import { useState } from "react";
import { Bar, BarChart, Cell, Pie, PieChart, Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressHeatmap } from "@/components/dsa/progress-heatmap";
import { useProgressStore } from "@/lib/progress-store";
import { useDSAStats } from "@/hooks/use-dsa";
import { useDataStore } from "@/store/data-store";
import { aptitudeQuestions } from "@/data/aptitude-questions";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/dsa-engine";
import { format } from "date-fns";
import { CheckCircle, HelpCircle, RefreshCw, Trophy, BookOpen, Flame, Clock, Activity, TrendingUp, Award, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "#71717a",
  "Attempted": "#fbbf24",
  "Solved": "#22d3ee",
  "Revised": "#a78bfa",
  "Mastered": "#34d399",
};

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<"dsa" | "aptitude">("dsa");
  
  const placementReadiness = useProgressStore((s) => s.placementReadiness);
  const confidenceScore = useProgressStore((s) => s.confidenceScore);
  const productivityScore = useProgressStore((s) => s.productivityScore);
  const focusScore = useProgressStore((s) => s.focusScore);
  const questionProgress = useProgressStore((s) => s.questionProgress);
  const streak = useProgressStore((s) => s.streak);
  const dailyLogs = useProgressStore((s) => s.dailyLogs ?? []);
  const { heatmap, weakTopics, solved, total, solvedPercent } = useDSAStats();
  const questions = useDataStore((s) => s.questions);
  const aptitudeAttempts = useProgressStore((s) => s.aptitudeAttempts ?? []);
  const aptitudePracticeAttempts = useProgressStore((s) => s.aptitudePracticeAttempts ?? []);
  const [aptitudeSubTab, setAptitudeSubTab] = useState<"practice" | "mock">("practice");

  // ==================== APTITUDE ANALYTICS CALCULATIONS ====================
  const uniqueTopics = Array.from(new Set(aptitudeQuestions.map((q) => q.topic))).sort();
  
  const TOPIC_NAMES: Record<string, string> = {
    "percentages": "Percentages & Profit-Loss",
    "ratios": "Ratio & Proportion",
    "time-work": "Time & Work",
    "speed": "Time, Speed & Distance",
    "series": "Number & Letter Series",
    "coding-decoding": "Coding-Decoding",
    "blood-relations": "Blood Relations",
    "syllogism": "Syllogism",
    "rc": "Reading Comprehension",
    "grammar": "Grammar & Sentence Correction",
    "vocab": "Vocabulary & Para Jumbles",
    "puzzles": "Seating & Arrangement",
    "di": "Charts & Tables",
    "number-system": "Number System",
    "hcf-lcm": "H.C.F. and L.C.M.",
    "simplification": "Simplification",
    "average": "Average",
    "ages": "Problems on Ages",
    "pipes-cisterns": "Pipes and Cisterns",
    "interest": "Simple & Compound Interest",
    "probability": "Probability",
    "permutation-combination": "Permutation & Combination",
    "clocks": "Clocks",
    "calendar": "Calendar",
    "general": "General Aptitude"
  };

  // 1. Topic Stats & Accuracy (Mock)
  const mockTopicStats = uniqueTopics.map((topicId) => {
    let totalQs = 0;
    let correctQs = 0;

    aptitudeAttempts.forEach((attempt) => {
      if (attempt.answers) {
        Object.entries(attempt.answers).forEach(([qId, ans]) => {
          const q = aptitudeQuestions.find((aq) => aq.id === qId);
          if (q && q.topic === topicId) {
            totalQs++;
            if (q.answer === ans) {
              correctQs++;
            }
          }
        });
      }
    });

    const accuracy = totalQs > 0 ? Math.round((correctQs / totalQs) * 100) : 0;
    const name = TOPIC_NAMES[topicId] || topicId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return {
      topicId,
      name,
      accuracy,
      attempts: totalQs,
      correct: correctQs
    };
  });

  // 2. Topic Stats & Accuracy (Practice)
  const practiceTopicStats = uniqueTopics.map((topicId) => {
    const attempts = aptitudePracticeAttempts.filter((a) => a.topicId === topicId);
    const totalQs = attempts.length;
    const correctQs = attempts.filter((a) => a.isCorrect).length;
    const accuracy = totalQs > 0 ? Math.round((correctQs / totalQs) * 100) : 0;
    const name = TOPIC_NAMES[topicId] || topicId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    return {
      topicId,
      name,
      accuracy,
      attempts: totalQs,
      correct: correctQs
    };
  });

  // 3. Company-Wise Readiness (Mock)
  const companyStats = ["TCS", "Infosys", "Deloitte", "Accenture", "Capgemini", "Wipro"].map((company) => {
    let totalQs = 0;
    let correctQs = 0;

    aptitudeAttempts.forEach((attempt) => {
      if (attempt.answers) {
        Object.entries(attempt.answers).forEach(([qId, ans]) => {
          const q = aptitudeQuestions.find((aq) => aq.id === qId);
          if (q && (
            (q.companyRelevance && q.companyRelevance.some((c) => c.toLowerCase() === company.toLowerCase())) ||
            (q.companyTags && q.companyTags.some((c) => c.toLowerCase() === company.toLowerCase()))
          )) {
            totalQs++;
            if (q.answer === ans) {
              correctQs++;
            }
          }
        });
      }
    });

    const accuracy = totalQs > 0 ? Math.round((correctQs / totalQs) * 100) : 0;
    return {
      company,
      accuracy,
      attempts: totalQs
    };
  });

  // 4. Weak Topics (<60% accuracy with at least 1 attempt)
  const weakMockTopics = mockTopicStats.filter((t) => t.attempts >= 1 && t.accuracy < 60);
  const weakPracticeTopics = practiceTopicStats.filter((t) => t.attempts >= 1 && t.accuracy < 60);

  // 5. Mock Solve Time & Accuracy Info
  const totalMockTimeSpent = aptitudeAttempts.reduce((acc, curr) => acc + (curr.timeSpentSec || 0), 0);
  const totalMockQuestionsAnswered = aptitudeAttempts.reduce((acc, curr) => acc + (curr.totalQuestions || 0), 0);
  const averageMockSolveTimeSec = totalMockQuestionsAnswered > 0 ? Math.round(totalMockTimeSpent / totalMockQuestionsAnswered) : 0;

  const totalCorrectAptMock = aptitudeAttempts.reduce((acc, curr) => acc + curr.correctAnswers, 0);
  const totalAnsweredAptMock = aptitudeAttempts.reduce((acc, curr) => acc + (curr.correctAnswers + curr.wrongAnswers), 0);
  const overallAptMockAccuracy = totalAnsweredAptMock > 0 ? Math.round((totalCorrectAptMock / totalAnsweredAptMock) * 100) : 0;

  const mockTopicsWithAttempts = mockTopicStats.filter((t) => t.attempts > 0).length;
  const mockCoveragePct = mockTopicStats.length > 0 ? Math.round((mockTopicsWithAttempts / mockTopicStats.length) * 100) : 0;
  const mockVolumeFactor = Math.min(100, Math.round((aptitudeAttempts.length / 10) * 100));

  const mockReadinessScore = aptitudeAttempts.length > 0
    ? Math.round((overallAptMockAccuracy * 0.5) + (mockVolumeFactor * 0.3) + (mockCoveragePct * 0.2))
    : 0;

  // 6. Practice Solve Time & Accuracy Info
  const totalPracticeTimeSpent = aptitudePracticeAttempts.reduce((acc, curr) => acc + (curr.timeSpentSec || 0), 0);
  const totalPracticeSolved = aptitudePracticeAttempts.filter(a => a.isCorrect).length;
  const averagePracticeSolveTimeSec = aptitudePracticeAttempts.length > 0 ? Math.round(totalPracticeTimeSpent / aptitudePracticeAttempts.length) : 0;
  const overallPracticeAccuracy = aptitudePracticeAttempts.length > 0 ? Math.round((totalPracticeSolved / aptitudePracticeAttempts.length) * 100) : 0;
  const practiceTopicsSolved = Array.from(new Set(aptitudePracticeAttempts.filter(a => a.isCorrect).map(a => a.topicId)));
  const practiceCoveragePct = uniqueTopics.length > 0 ? Math.round((practiceTopicsSolved.length / uniqueTopics.length) * 100) : 0;

  // 7. Activity Heatmaps (last 14 days)
  const recentMockDays = Array.from({ length: 14 }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - idx);
    const dateStr = date.toISOString().split("T")[0];
    const count = aptitudeAttempts.filter((attempt) => attempt.completedAt.startsWith(dateStr)).length;
    
    let dayLabel = "";
    try {
      dayLabel = format(date, "d MMM");
    } catch (e) {
      dayLabel = `${date.getDate()}/${date.getMonth() + 1}`;
    }
    return { dateStr, count, dayLabel };
  }).reverse();

  const recentPracticeDays = Array.from({ length: 14 }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() - idx);
    const dateStr = date.toISOString().split("T")[0];
    const count = aptitudePracticeAttempts.filter((attempt) => attempt.completedAt.startsWith(dateStr)).length;
    
    let dayLabel = "";
    try {
      dayLabel = format(date, "d MMM");
    } catch (e) {
      dayLabel = `${date.getDate()}/${date.getMonth() + 1}`;
    }
    return { dateStr, count, dayLabel };
  }).reverse();

  // Status breakdown calculations
  const statusData = STATUS_ORDER.map((status) => ({
    name: STATUS_LABELS[status],
    value: questions.filter((q) => (questionProgress[q.id]?.status ?? "not_started") === status).length,
  })).filter((d) => d.value > 0);

  const totalCount = questions.length;
  const statusCounts = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = questions.filter((q) => (questionProgress[q.id]?.status ?? "not_started") === status).length;
    return acc;
  }, {} as Record<string, number>);

  const statusPercentages = STATUS_ORDER.reduce((acc, status) => {
    acc[status] = totalCount > 0 ? ((statusCounts[status] / totalCount) * 100).toFixed(1) : "0.0";
    return acc;
  }, {} as Record<string, string>);

  const areaData = [
    { area: "DSA Solved", score: total ? Math.round((solved / total) * 100) : 0 },
    { area: "Consistency", score: productivityScore },
    { area: "Focus", score: focusScore },
    { area: "Placement", score: placementReadiness },
  ];

  // Strongest Topic calculation based on completion percent in heatmap
  const strongestTopicName = heatmap && heatmap.length > 0 && Math.max(...heatmap.map(h => h.value)) > 0
    ? [...heatmap].sort((a, b) => b.value - a.value)[0]?.name
    : "None yet";

  // Weakest Topic calculation from weakTopics list
  const weakestTopicName = weakTopics && weakTopics.length > 0 ? weakTopics[0]?.name : "None yet";

  // Weekly Progress Trend data
  const weekData = dailyLogs.slice(-7).map((l) => ({
    day: format(new Date(l.date), "EEE"),
    xp: l.xpEarned,
    solved: l.questionsSolved,
  }));

  // Define details for status cards
  const statusCards = [
    {
      status: "solved" as const,
      label: "Solved",
      count: statusCounts["solved"] || 0,
      percent: statusPercentages["solved"] || "0.0",
      color: "text-cyan-400 light:text-cyan-600 border-cyan-500/20 light:border-cyan-200 bg-cyan-500/5 light:bg-cyan-100/50",
      dotColor: "bg-cyan-400 light:bg-cyan-600",
      icon: CheckCircle,
    },
    {
      status: "attempted" as const,
      label: "Attempted",
      count: statusCounts["attempted"] || 0,
      percent: statusPercentages["attempted"] || "0.0",
      color: "text-amber-400 light:text-amber-600 border-amber-500/20 light:border-amber-200 bg-amber-500/5 light:bg-amber-100/50",
      dotColor: "bg-amber-400 light:bg-amber-600",
      icon: HelpCircle,
    },
    {
      status: "revised" as const,
      label: "Revised",
      count: statusCounts["revised"] || 0,
      percent: statusPercentages["revised"] || "0.0",
      color: "text-violet-400 light:text-violet-600 border-violet-500/20 light:border-violet-200 bg-violet-500/5 light:bg-violet-100/50",
      dotColor: "bg-violet-400 light:bg-violet-600",
      icon: RefreshCw,
    },
    {
      status: "mastered" as const,
      label: "Mastered",
      count: statusCounts["mastered"] || 0,
      percent: statusPercentages["mastered"] || "0.0",
      color: "text-emerald-400 light:text-emerald-600 border-emerald-500/20 light:border-emerald-200 bg-emerald-500/5 light:bg-emerald-100/50",
      dotColor: "bg-emerald-400 light:bg-emerald-600",
      icon: Trophy,
    },
    {
      status: "not_started" as const,
      label: "Not Started",
      count: statusCounts["not_started"] || 0,
      percent: statusPercentages["not_started"] || "0.0",
      color: "text-zinc-400 light:text-zinc-650 border-zinc-500/20 light:border-zinc-200 bg-zinc-500/5 light:bg-zinc-100/50",
      dotColor: "bg-zinc-450 light:bg-zinc-500",
      icon: BookOpen,
    },
  ];

  return (
    <AppShell title="Analytics" subtitle="Track your performance trends across all modules">
      
      {/* ── EXECUTIVE SUMMARY SECTION ── */}
      <GlassCard className="p-6 mb-6 border-white/10" hover={false}>
        <h3 className="text-xs font-bold text-white mb-4 uppercase tracking-wider text-zinc-400">
          Executive Progress Summary
        </h3>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          {/* Card 1: Total Solved */}
          <div className="flex flex-col justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Total Solved</span>
            <span className="text-xl font-bold text-white mt-1">
              {solved} <span className="text-xs text-zinc-500 font-normal">/ {total}</span>
            </span>
          </div>
          {/* Card 2: Completion % */}
          <div className="flex flex-col justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Completion %</span>
            <span className="text-xl font-bold text-cyan-400 mt-1">{solvedPercent}%</span>
          </div>
          {/* Card 3: Readiness Score */}
          <div className="flex flex-col justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Readiness</span>
            <span className="text-xl font-bold text-violet-400 mt-1">{placementReadiness}%</span>
          </div>
          {/* Card 4: Streak */}
          <div className="flex flex-col justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase flex items-center gap-0.5">Streak</span>
            <span className="text-xl font-bold text-orange-400 mt-1">🔥 {streak}d</span>
          </div>
          {/* Card 5: Strongest Topic */}
          <div className="flex flex-col justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Strongest</span>
            <span className="text-xs font-bold text-emerald-400 mt-2 truncate" title={strongestTopicName}>
              {strongestTopicName}
            </span>
          </div>
          {/* Card 6: Weakest Topic */}
          <div className="flex flex-col justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase">Weakest</span>
            <span className="text-xs font-bold text-rose-400 mt-2 truncate" title={weakestTopicName}>
              {weakestTopicName}
            </span>
          </div>
          {/* Card 7: Weekly Trend Sparkline */}
          <div className="flex flex-col justify-between p-3 rounded-xl bg-white/5 border border-white/5 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase mb-1">XP Trend</span>
            <div className="h-[28px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekData.length ? weekData : [{ day: "—", xp: 0, solved: 0 }]}>
                  <Area type="monotone" dataKey="xp" stroke="#22d3ee" fill="rgba(34,211,238,0.15)" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── SEGMENT SWITCHER TABS ── */}
      <div className="flex space-x-1 p-1 bg-white/5 border border-white/5 rounded-xl mb-6 max-w-md">
        <button
          onClick={() => setActiveTab("dsa")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "dsa"
              ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          DSA Sheet Performance
        </button>
        <button
          onClick={() => setActiveTab("aptitude")}
          className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${
            activeTab === "aptitude"
              ? "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Aptitude Performance
        </button>
      </div>

      {activeTab === "dsa" ? (
        <>
          <PageHeader title="Performance Analytics" description={`${questions.length} questions in your study bank`} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <GlassCard hover={false}><p className="text-xs text-zinc-500">Readiness</p><p className="text-2xl font-bold">{placementReadiness}%</p></GlassCard>
            <GlassCard hover={false}><p className="text-xs text-zinc-500">Solved</p><p className="text-2xl font-bold">{solved}/{total}</p></GlassCard>
            <GlassCard hover={false}><p className="text-xs text-zinc-500">Weak topics</p><p className="text-2xl font-bold text-rose-400">{weakTopics.length}</p></GlassCard>
            <GlassCard hover={false}><p className="text-xs text-zinc-500">Confidence</p><p className="text-2xl font-bold">{confidenceScore}%</p></GlassCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <GlassCard hover={false}>
              <h3 className="mb-4 font-semibold">Skills Overview</h3>
              <div className="h-64 min-h-[16rem]">
                <ResponsiveContainer width="100%" height="100%" minHeight={256}>
                  <BarChart data={areaData}>
                    <XAxis dataKey="area" stroke="#71717a" fontSize={10} />
                    <YAxis domain={[0, 100]} stroke="#71717a" />
                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-normal)",
                        borderRadius: "12px",
                        color: "var(--text-primary)"
                      }}
                      labelStyle={{ color: "var(--text-secondary)" }}
                      itemStyle={{ color: "var(--text-primary)" }}
                    />
                    <Bar dataKey="score" fill="#22d3ee" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            {/* Doughnut Status Breakdown */}
            <GlassCard hover={false} className="flex flex-col justify-between">
              <h3 className="mb-4 font-semibold">Problem Status Breakdown</h3>
              <div className="h-64 min-h-[16rem]">
                <ResponsiveContainer width="100%" height="100%" minHeight={256}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={3}
                      label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(1) : "0.0"}%`}
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={STATUS_COLORS[entry.name] || "#71717a"} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any, name: any) => {
                        const total = questions.length;
                        const pct = total > 0 ? ((Number(value) / total) * 100).toFixed(1) : "0.0";
                        return [`${value} questions (${pct}%)`, name];
                      }}
                      contentStyle={{
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-normal)",
                        borderRadius: "12px",
                        color: "var(--text-primary)",
                      }}
                      labelStyle={{ color: "var(--text-secondary)" }}
                      itemStyle={{ color: "var(--text-primary)" }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          {/* ── 5 STATUS STAT CARDS ── */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-5 mt-6">
            {statusCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.status}
                  className={`flex flex-col justify-between p-4 rounded-2xl border transition-all ${card.color}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-300">{card.label}</span>
                    <div className={`h-2 w-2 rounded-full ${card.dotColor}`} />
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-2xl font-black text-white">{card.count}</span>
                    <span className="text-[10px] text-zinc-500 font-medium">{card.percent}%</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-zinc-400">
                    <Icon className="h-3.5 w-3.5 opacity-60" />
                    <span>DSA Target</span>
                  </div>
                </div>
              );
            })}
          </div>

          <GlassCard className="mt-6" hover={false}>
            <h3 className="mb-4 font-semibold">Topic Progress Heatmap</h3>
            <ProgressHeatmap data={heatmap} />
          </GlassCard>
        </>
      ) : (
        <>
          <PageHeader title="Aptitude & Reasoning Analytics" description={`${aptitudeQuestions.length} aptitude questions in question bank`} />

          {/* SUB-TABS SELECTOR FOR APTITUDE */}
          <div className="flex space-x-1 p-1 bg-white/5 border border-white/5 rounded-xl mb-6 max-w-xs">
            <button
              onClick={() => setAptitudeSubTab("practice")}
              className={`flex-1 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                aptitudeSubTab === "practice"
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Practice Rooms
            </button>
            <button
              onClick={() => setAptitudeSubTab("mock")}
              className={`flex-1 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                aptitudeSubTab === "mock"
                  ? "bg-violet-500/10 border border-violet-500/30 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Mock Assessments
            </button>
          </div>

          {aptitudeSubTab === "practice" ? (
            <>
              {/* PRACTICE STATS CARDS */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <GlassCard className="p-5 flex items-center space-x-4" hover={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Questions Solved</p>
                    <h3 className="text-2xl font-bold text-white font-mono">{totalPracticeSolved}</h3>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex items-center space-x-4" hover={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Practice Accuracy</p>
                    <h3 className="text-2xl font-bold text-white font-mono">{overallPracticeAccuracy}%</h3>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex items-center space-x-4" hover={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Syllabus Coverage</p>
                    <h3 className="text-2xl font-bold text-white font-mono">{practiceCoveragePct}%</h3>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex items-center space-x-4" hover={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Avg Solve Time / Q</p>
                    <h3 className="text-2xl font-bold text-white font-mono">
                      {averagePracticeSolveTimeSec > 0 ? `${averagePracticeSolveTimeSec}s` : "N/A"}
                    </h3>
                  </div>
                </GlassCard>
              </div>

              {/* PRACTICE CHARTS */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Topic Accuracy */}
                <GlassCard hover={false} className="p-6">
                  <h3 className="mb-4 font-bold text-white flex items-center">
                    <Activity className="h-4.5 w-4.5 mr-2 text-cyan-400" />
                    Practice Room Accuracy by Topic
                  </h3>
                  {practiceTopicStats.filter(t => t.attempts > 0).length === 0 ? (
                    <div className="py-12 text-center text-zinc-500">No practice room data logged. Start practicing in any topic!</div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                      {practiceTopicStats.filter(t => t.attempts > 0).map((topic) => (
                        <div key={topic.topicId} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-zinc-300">{topic.name}</span>
                            <span className="text-zinc-400 font-medium font-mono">
                              {topic.accuracy}% ({topic.attempts} Qs)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                topic.accuracy >= 70 ? "bg-gradient-to-r from-emerald-500 to-teal-400" :
                                topic.accuracy >= 50 ? "bg-gradient-to-r from-amber-500 to-orange-400" :
                                "bg-gradient-to-r from-rose-500 to-red-400"
                              }`}
                              style={{ width: `${topic.accuracy}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>

                {/* Weak Topics Alert */}
                <GlassCard hover={false} className="p-6">
                  <h3 className="mb-4 font-bold text-white flex items-center">
                    <TrendingUp className="h-4.5 w-4.5 mr-2 text-violet-400" />
                    Practice Concept Mastery
                  </h3>
                  {weakPracticeTopics.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-rose-400 flex items-center">
                        <HelpCircle className="h-4 w-4 mr-1.5" />
                        Weak Practice Concepts Detected
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Accuracy is below 60% in these practice rooms. We recommend spending extra time reviewing explanations for:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {weakPracticeTopics.map((t) => (
                          <span 
                            key={t.topicId} 
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/15"
                          >
                            {t.name} ({t.accuracy}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center text-zinc-500">
                      No weak practice topics detected. Great job maintaining high accuracy!
                    </div>
                  )}
                </GlassCard>
              </div>

              {/* Practice Heatmap */}
              <GlassCard className="mt-6 p-6" hover={false}>
                <h3 className="mb-4 font-bold text-white flex items-center">
                  <RefreshCw className="h-4.5 w-4.5 mr-2 text-cyan-400" />
                  Practice Room Activity (Last 14 Days)
                </h3>
                <div className="grid grid-cols-7 gap-2 sm:grid-cols-14">
                  {recentPracticeDays.map((day) => (
                    <div 
                      key={day.dateStr} 
                      className="flex flex-col items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-center"
                    >
                      <span className="text-[9px] text-zinc-500 font-semibold uppercase">{day.dayLabel}</span>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold mt-2 font-mono ${
                        day.count === 0 ? "bg-zinc-800 text-zinc-600" :
                        day.count === 1 ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/20" :
                        "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                      }`}>
                        {day.count}
                      </div>
                      <span className="text-[8px] text-zinc-600 mt-1 block">attempts</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          ) : (
            <>
              {/* MOCK STATS CARDS */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <GlassCard className="p-5 flex items-center space-x-4" hover={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Readiness Score</p>
                    <h3 className="text-2xl font-bold text-white font-mono">{mockReadinessScore}%</h3>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex items-center space-x-4" hover={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Mocks Completed</p>
                    <h3 className="text-2xl font-bold text-white font-mono">{aptitudeAttempts.length}</h3>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex items-center space-x-4" hover={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-sans">Mock Accuracy</p>
                    <h3 className="text-2xl font-bold text-white font-mono">{overallAptMockAccuracy}%</h3>
                  </div>
                </GlassCard>

                <GlassCard className="p-5 flex items-center space-x-4" hover={false}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400">Avg Solve Time / Q</p>
                    <h3 className="text-2xl font-bold text-white font-mono">
                      {averageMockSolveTimeSec > 0 ? `${averageMockSolveTimeSec}s` : "N/A"}
                    </h3>
                  </div>
                </GlassCard>
              </div>

              {/* MOCK CHARTS */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Topic Accuracy */}
                <GlassCard hover={false} className="p-6">
                  <h3 className="mb-4 font-bold text-white flex items-center">
                    <Activity className="h-4.5 w-4.5 mr-2 text-cyan-400" />
                    Mock Assessment Accuracy by Topic
                  </h3>
                  {mockTopicStats.filter(t => t.attempts > 0).length === 0 ? (
                    <div className="py-12 text-center text-zinc-500">No mock exam data logged yet. Take a mock exam from the Hub!</div>
                  ) : (
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                      {mockTopicStats.filter(t => t.attempts > 0).map((topic) => (
                        <div key={topic.topicId} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-zinc-300">{topic.name}</span>
                            <span className="text-zinc-400 font-medium font-mono">
                              {topic.accuracy}% ({topic.attempts} Qs)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                topic.accuracy >= 70 ? "bg-gradient-to-r from-emerald-500 to-teal-400" :
                                topic.accuracy >= 50 ? "bg-gradient-to-r from-amber-500 to-orange-400" :
                                "bg-gradient-to-r from-rose-500 to-red-400"
                              }`}
                              style={{ width: `${topic.accuracy}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </GlassCard>

                {/* Company readiness */}
                <GlassCard hover={false} className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="mb-4 font-bold text-white flex items-center">
                      <TrendingUp className="h-4.5 w-4.5 mr-2 text-violet-400" />
                      Corporate Readiness Scores
                    </h3>
                    <div className="space-y-4">
                      {companyStats.map((c) => (
                        <div key={c.company} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <div>
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{c.company}</span>
                            <span className="text-[10px] text-zinc-400 block mt-0.5">{c.attempts} questions attempted</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-black ${
                              c.attempts === 0 ? "text-zinc-500" :
                              c.accuracy >= 75 ? "text-emerald-400" :
                              c.accuracy >= 55 ? "text-amber-400" : "text-rose-400"
                            }`}>
                              {c.attempts > 0 ? `${c.accuracy}%` : "0% (No Qs)"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Weak Topics Alert */}
              {weakMockTopics.length > 0 && (
                <GlassCard className="mt-6 border-rose-500/20 bg-rose-500/5 p-5" hover={false}>
                  <h3 className="font-bold text-rose-400 flex items-center mb-2">
                    <HelpCircle className="h-4.5 w-4.5 mr-2" />
                    Weak Mock Exam Topics Detected
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                    The system has detected that your accuracy is below 60% in these mock assessment topics. We recommend practicing these topics in the Practice Rooms to improve:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {weakMockTopics.map((t) => (
                      <span 
                        key={t.topicId} 
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/10 flex items-center gap-1.5"
                      >
                        {t.name} ({t.accuracy}%)
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Mock Activity Heatmap */}
              <GlassCard className="mt-6 p-6" hover={false}>
                <h3 className="mb-4 font-bold text-white flex items-center">
                  <RefreshCw className="h-4.5 w-4.5 mr-2 text-violet-400" />
                  Mock Exam Activity History (Last 14 Days)
                </h3>
                <div className="grid grid-cols-7 gap-2 sm:grid-cols-14">
                  {recentMockDays.map((day) => (
                    <div 
                      key={day.dateStr} 
                      className="flex flex-col items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-center"
                    >
                      <span className="text-[9px] text-zinc-500 font-semibold uppercase">{day.dayLabel}</span>
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold mt-2 font-mono ${
                        day.count === 0 ? "bg-zinc-800 text-zinc-600" :
                        day.count === 1 ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/20" :
                        "bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                      }`}>
                        {day.count}
                      </div>
                      <span className="text-[8px] text-zinc-600 mt-1 block">exams</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}
        </>
      )}
    </AppShell>
  );
}
