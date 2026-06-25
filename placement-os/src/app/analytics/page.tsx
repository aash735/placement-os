"use client";

import { Bar, BarChart, Cell, Pie, PieChart, Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressHeatmap } from "@/components/dsa/progress-heatmap";
import { useProgressStore } from "@/lib/progress-store";
import { useDSAStats } from "@/hooks/use-dsa";
import { useDataStore } from "@/store/data-store";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/dsa-engine";
import { format } from "date-fns";
import { CheckCircle, HelpCircle, RefreshCw, Trophy, BookOpen, Flame } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  "Not Started": "#71717a",
  "Attempted": "#fbbf24",
  "Solved": "#22d3ee",
  "Revised": "#a78bfa",
  "Mastered": "#34d399",
};

export default function AnalyticsPage() {
  const placementReadiness = useProgressStore((s) => s.placementReadiness);
  const confidenceScore = useProgressStore((s) => s.confidenceScore);
  const productivityScore = useProgressStore((s) => s.productivityScore);
  const focusScore = useProgressStore((s) => s.focusScore);
  const questionProgress = useProgressStore((s) => s.questionProgress);
  const streak = useProgressStore((s) => s.streak);
  const dailyLogs = useProgressStore((s) => s.dailyLogs ?? []);
  const { heatmap, weakTopics, solved, total, solvedPercent } = useDSAStats();
  const questions = useDataStore((s) => s.questions);

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
    </AppShell>
  );
}
