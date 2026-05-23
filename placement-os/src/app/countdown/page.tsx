"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";

export default function CountdownPage() {
  const target = new Date("2026-08-01");
  const now = new Date();
  const days = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <AppShell title="Countdown" subtitle="Placement season anchor">
      <GlassCard className="text-center">
        <p className="text-7xl font-bold gradient-text">{days}</p>
        <p className="mt-2 text-zinc-400">days to target season (Aug 2026)</p>
        <p className="mt-4 text-sm text-zinc-500">Milestones: 60% DSA must-tier · HireLens live · 3 mock interviews</p>
      </GlassCard>
    </AppShell>
  );
}
