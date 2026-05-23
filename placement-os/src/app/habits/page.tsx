"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";

const habits = ["Sleep before 12", "Phone outside desk (focus)", "1 DSA block", "10 aptitude", "No comparison scroll"];

export default function HabitsPage() {
  return (
    <AppShell title="Habits" subtitle="Identity-based consistency">
      <PageHeader title="Habit Tracker" description="Track up to 5 daily habits. Fewer habits means higher consistency." />
      {habits.map((h, i) => (
        <GlassCard key={h} className="mb-2 flex items-center gap-3" delay={i * 0.03}>
          <input type="checkbox" className="h-4 w-4 rounded" />
          <span className="text-sm">{h}</span>
        </GlassCard>
      ))}
    </AppShell>
  );
}
