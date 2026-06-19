"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { usePlacementStore } from "@/lib/store";

export default function StreaksPage() {
  const streak = usePlacementStore((s) => s.streak);
  return (
    <AppShell title="Streaks" subtitle="Consistency without guilt">
      <PageHeader title="Streak System" description="Minimum viable day counts: 15 min counts. Rest days planned, not failed." />
      <GlassCard className="text-center">
        <p className="text-6xl font-bold text-orange-400">{streak}</p>
        <p className="mt-2 text-zinc-400">day streak · freeze available 1×/month (v2)</p>
      </GlassCard>
    </AppShell>
  );
}
