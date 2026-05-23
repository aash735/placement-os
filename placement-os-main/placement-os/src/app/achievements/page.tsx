"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { useDSAStats } from "@/hooks/use-dsa";
import { Lock, CheckCircle2, Trophy } from "lucide-react";
import {
  getBadges,
  loadUnlockDates,
  RARITY_CONFIG,
  RARITY_ORDER,
  type BadgeDef,
  type Rarity
} from "@/lib/badges";

export default function AchievementsPage() {
  const {
    xp,
    level,
    streak,
    dailyLogs = [],
    aptitudeAttempts = [],
    mockTests = [],
  } = useProgressStore();

  const { solved, total } = useDSAStats();

  const [unlockDates, setUnlockDates] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Rarity | "all">("all");

  // Load unlock dates on client mount and store updates
  useEffect(() => {
    setUnlockDates(loadUnlockDates());
  }, [solved, streak, xp, dailyLogs, mockTests, aptitudeAttempts]);

  // ── Computed stats ──────────────────────────────────────────────────────
  const totalFocusMin   = dailyLogs.reduce((acc, l) => acc + (l.focusMinutes || 0), 0);
  const totalRevisions  = dailyLogs.reduce((acc, l) => acc + (l.revisionsDone || 0), 0);
  const mocksDone       = mockTests.filter((m) => m.completedAt).length + aptitudeAttempts.length;
  const studyDays       = dailyLogs.filter((l) => l.questionsSolved > 0 || l.xpEarned > 0).length;

  const badges = getBadges({
    xp,
    level,
    streak,
    solved,
    total,
    totalFocusMin,
    totalRevisions,
    mocksDone,
    studyDays,
  });

  const filtered = filter === "all"
    ? badges
    : badges.filter((b) => b.rarity === filter);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <AppShell
      title="Achievements"
      subtitle={`${unlockedCount}/${badges.length} badges unlocked`}
    >

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {RARITY_ORDER.map((rarity: Rarity) => {
          const count = badges.filter((b) => b.rarity === rarity && b.unlocked).length;
          const total_r = badges.filter((b) => b.rarity === rarity).length;
          const cfg = RARITY_CONFIG[rarity];
          return (
            <GlassCard key={rarity} className={`p-4 text-center ${count > 0 ? cfg.glow : ""}`} hover={false}>
              <p className={`text-xl font-bold ${count > 0 ? cfg.color : "text-zinc-600"}`}>
                {count}/{total_r}
              </p>
              <p className={`text-[10px] font-bold mt-0.5 ${count > 0 ? cfg.color : "text-zinc-700"}`}>
                {rarity}
              </p>
            </GlassCard>
          );
        })}
      </div>

      {/* Overall progress */}
      <div className="mb-5 px-1">
        <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
          <span>Overall Progress</span>
          <span>{unlockedCount}/{badges.length} ({Math.round((unlockedCount / badges.length) * 100)}%)</span>
        </div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 transition-all duration-700"
            style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {(["all", ...RARITY_ORDER] as const).map((r) => {
          const cfg = r !== "all" ? RARITY_CONFIG[r as Rarity] : null;
          return (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all capitalize ${
                filter === r
                  ? cfg
                    ? `${cfg.color} ${cfg.bg} ${cfg.border}`
                    : "text-white bg-white/10 border-white/20"
                  : "text-zinc-500 bg-white/3 border-white/8 hover:text-zinc-300"
              }`}
            >
              {r === "all" ? `All (${badges.length})` : r}
            </button>
          );
        })}
      </div>

      {/* Badge grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((badge) => {
          const cfg = RARITY_CONFIG[badge.rarity];
          const Icon = badge.icon;
          const pct = badge.progress
            ? Math.round((badge.progress.current / badge.progress.max) * 100)
            : null;

          return (
            <div
              key={badge.id}
              className={`relative rounded-2xl border p-4 transition-all duration-300 ${
                badge.unlocked
                  ? `${cfg.bg} ${cfg.border} ${cfg.glow}`
                  : "bg-white/2 border-white/5 opacity-50 grayscale"
              }`}
            >
              {/* Rarity label */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[9px] font-bold uppercase tracking-widest ${badge.unlocked ? cfg.color : "text-zinc-700"}`}>
                  {badge.rarity}
                </span>
                {badge.unlocked
                  ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  : <Lock className="h-3.5 w-3.5 text-zinc-700" />
                }
              </div>

              {/* Icon */}
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-3 bg-gradient-to-br ${
                badge.unlocked ? cfg.gradient : "from-zinc-800 to-zinc-700"
              }`}>
                <Icon className="h-6 w-6 text-white" />
              </div>

              {/* Name + description */}
              <h3 className={`text-sm font-bold mb-0.5 ${badge.unlocked ? "text-white" : "text-zinc-600"}`}>
                {badge.name}
              </h3>
              <p className="text-[11px] text-zinc-500 mb-3 leading-snug">{badge.description}</p>

              {/* Progress bar */}
              {badge.progress && !badge.unlocked && (
                <div>
                  <div className="flex justify-between text-[9px] text-zinc-700 mb-1">
                    <span>Progress</span>
                    <span>{badge.progress.current}/{badge.progress.max}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient} transition-all duration-500`}
                      style={{ width: `${Math.min(pct ?? 0, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {badge.unlocked && unlockDates[badge.id] && (
                <p className="text-[9px] text-zinc-600 mt-1">
                  Unlocked {new Date(unlockDates[badge.id]).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
