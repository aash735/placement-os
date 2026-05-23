"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { usePlacementStore } from "@/lib/store";

const tasks = [
  "Re-read 1 solved easy problem (10 min)",
  "5 aptitude questions only",
  "Update 1 resume bullet",
  "Watch 1 visual DSA pattern (15 min max)",
  "Organize notes—no new learning",
];

export default function LowEnergyPage() {
  const { setEnergyMode } = usePlacementStore();
  return (
    <AppShell title="Low-Energy Mode" subtitle="15–30 min wins">
      <PageHeader title="Low-Energy Study" description="Momentum > intensity. Streak preserved with minimum viable effort." />
      <button onClick={() => setEnergyMode("low")} className="btn-primary mb-4">Enable Low-Energy Mode</button>
      {tasks.map((t, i) => (
        <GlassCard key={t} className="mb-2" delay={i * 0.03} hover={false}><p className="text-sm">{t}</p></GlassCard>
      ))}
    </AppShell>
  );
}
