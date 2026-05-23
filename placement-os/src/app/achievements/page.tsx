"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { useDSAStats } from "@/hooks/use-dsa";

export default function AchievementsPage() {
  const { streak, xp, level } = useProgressStore();
  const { solved, total } = useDSAStats();

  const achievements = [
    { name: "First Solve", desc: "Mark 1 problem as solved", unlocked: solved >= 1 },
    { name: "Pattern Builder", desc: "Solve 10 problems", unlocked: solved >= 10 },
    { name: "OA Ready", desc: "Solve 30% of question bank", unlocked: solved >= total * 0.3 },
    { name: "Streak Guardian", desc: "7-day study streak", unlocked: streak >= 7 },
    { name: "Level 5+", desc: "Reach builder level 5", unlocked: level >= 5 },
    { name: "Century", desc: "1000+ XP earned", unlocked: xp >= 1000 },
  ];

  return (
    <AppShell title="Achievements" subtitle={`${achievements.filter((a) => a.unlocked).length}/${achievements.length} unlocked`}>
      <PageHeader title="Achievements" description="Unlocked automatically from real progress" />
      <div className="grid gap-4 sm:grid-cols-2">
        {achievements.map((a, i) => (
          <GlassCard key={a.name} delay={i * 0.05} className={a.unlocked ? "" : "opacity-50"}>
            <h3 className="font-semibold">{a.unlocked ? "🏆" : "🔒"} {a.name}</h3>
            <p className="mt-1 text-sm text-zinc-400">{a.desc}</p>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  );
}
