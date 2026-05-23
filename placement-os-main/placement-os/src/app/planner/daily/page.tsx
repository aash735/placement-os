"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";

const blocks = [
  { time: "7:30", task: "Wake + 5 min plan (Placement OS)", energy: "low" },
  { time: "9:00", task: "College / classes", energy: "normal" },
  { time: "17:00", task: "DSA 1 problem (35 min)", energy: "normal" },
  { time: "17:45", task: "Aptitude 15 questions", energy: "normal" },
  { time: "18:15", task: "Project 30 min (HireLens)", energy: "normal" },
  { time: "21:00", task: "Wind-down · no YouTube spiral", energy: "recovery" },
];

export default function DailyPlannerPage() {
  return (
    <AppShell title="Daily Planner" subtitle="~2.5h placement work · realistic">
      <PageHeader title="Today's Execution" description="Not 12 hours—sustainable blocks for 7th semester." />
      {blocks.map((b, i) => (
        <GlassCard key={b.time} className="mb-3 flex gap-4" delay={i * 0.03} hover={false}>
          <span className="font-mono text-cyan-400">{b.time}</span>
          <div>
            <p className="font-medium">{b.task}</p>
            <p className="text-xs capitalize text-zinc-500">{b.energy} energy</p>
          </div>
        </GlassCard>
      ))}
    </AppShell>
  );
}
