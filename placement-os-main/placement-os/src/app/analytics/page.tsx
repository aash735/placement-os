"use client";

import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { ProgressHeatmap } from "@/components/dsa/progress-heatmap";
import { useProgressStore } from "@/lib/progress-store";
import { useDSAStats } from "@/hooks/use-dsa";
import { useDataStore } from "@/store/data-store";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/dsa-engine";

const COLORS = ["#71717a", "#fbbf24", "#22d3ee", "#a78bfa", "#34d399"];

export default function AnalyticsPage() {
  const { placementReadiness, confidenceScore, productivityScore, focusScore, questionProgress } = useProgressStore();
  const { heatmap, weakTopics, solved, total } = useDSAStats();
  const questions = useDataStore((s) => s.questions);

  const statusData = STATUS_ORDER.map((status) => ({
    name: STATUS_LABELS[status],
    value: questions.filter((q) => (questionProgress[q.id]?.status ?? "not_started") === status).length,
  })).filter((d) => d.value > 0);

  const areaData = [
    { area: "DSA Solved", score: total ? Math.round((solved / total) * 100) : 0 },
    { area: "Consistency", score: productivityScore },
    { area: "Focus", score: focusScore },
    { area: "Placement", score: placementReadiness },
  ];

  return (
    <AppShell title="Analytics" subtitle="Track your performance trends across all modules">
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
              <BarChart data={areaData}><XAxis dataKey="area" stroke="#71717a" fontSize={10} /><YAxis domain={[0, 100]} stroke="#71717a" /><Tooltip /><Bar dataKey="score" fill="#22d3ee" radius={[6, 6, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard hover={false}>
          <h3 className="mb-4 font-semibold">Problem Status Breakdown</h3>
          <div className="h-64 min-h-[16rem]">
            <ResponsiveContainer width="100%" height="100%" minHeight={256}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
      <GlassCard className="mt-6" hover={false}>
        <h3 className="mb-4 font-semibold">Topic Progress Heatmap</h3>
        <ProgressHeatmap data={heatmap} />
      </GlassCard>
    </AppShell>
  );
}
