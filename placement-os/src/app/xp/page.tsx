"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { usePlacementStore } from "@/lib/store";
import { levelFromXp, xpProgressInLevel, xpToNextLevel } from "@/lib/xp";

export default function XPPage() {
  const xp = usePlacementStore((s) => s.xp);
  const level = levelFromXp(xp);
  const progress = xpProgressInLevel(xp);
  const toNext = xpToNextLevel(xp);

  return (
    <AppShell title="XP & Levels" subtitle="Builder rank progression">
      <PageHeader title={`Level ${level}`} description={`${xp} XP · ${toNext} XP to next level`} />
      <GlassCard>
        <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${progress}%` }} /></div>
        <p className="mt-4 text-sm text-zinc-400">Earn XP: solve problems (+50), quests (+20–50), habits (+10), weekly review (+100)</p>
      </GlassCard>
    </AppShell>
  );
}
