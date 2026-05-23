"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useDataStore } from "@/store/data-store";

export default function WeeklyReviewPage() {
  const weeklyPlan = useDataStore((s) => s.data?.weeklyPlan ?? []);

  return (
    <AppShell title="Weekly Review" subtitle="From sheets/analytics/weekly-plan.csv">
      <PageHeader title="Weekly Review" description="Edit CSV to change plan without code" />
      {weeklyPlan.map((w) => (
        <GlassCard key={w.week} className="mb-4" hover={false}>
          <h3 className="font-semibold">Week {w.week}: {w.focus}</h3>
          <p className="text-xs text-zinc-500">{w.hours}</p>
          <ul className="mt-2 text-sm text-zinc-300">{w.days.map((d) => <li key={d}>• {d}</li>)}</ul>
        </GlassCard>
      ))}
    </AppShell>
  );
}
