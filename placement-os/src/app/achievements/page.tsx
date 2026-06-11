"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { useDataStore } from "@/store/data-store";
import { ACHIEVEMENT_DETAILS } from "@/components/ui/achievement-unlock-modal";
import { cn } from "@/lib/utils";
import { Trophy, Zap, Star, Shield } from "lucide-react";

export default function AchievementsPage() {
  const {
    unlockedAchievements,
    streak,
    level,
    xp,
    questionProgress,
    dailyLogs,
    mockTests,
    interviewHistory,
    revisionHistory,
    dailyPlannerBlocks,
  } = useProgressStore();

  const { questions, fetchData } = useDataStore();

  // Load questions if not available yet
  useEffect(() => {
    if (questions.length === 0) {
      fetchData();
    }
  }, [questions, fetchData]);

  // Compute stats for progress tracking
  const total = questions.length || 1;
  const solved = questions.filter((q) =>
    ["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
  ).length;

  const graphSolved = questions.filter((q) =>
    (q.topicId === "graphs" || q.additionalTopicIds?.includes("graphs")) &&
    ["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
  ).length;

  const dpSolved = questions.filter((q) =>
    (q.topicId === "dp" || q.additionalTopicIds?.includes("dp")) &&
    ["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
  ).length;

  const totalFocusMinutes = dailyLogs.reduce((sum, log) => sum + (log.focusMinutes || 0), 0);
  const mockCompleted = mockTests.filter((m) => m.completedAt).length + (interviewHistory?.length || 0);
  const hrMockCompleted = (interviewHistory || []).filter((i) => i.type === "hr").length;
  const frontendMockCompleted = (interviewHistory || []).filter((i) => i.type === "frontend").length;

  const revisionCount = revisionHistory ? revisionHistory.length : 0;
  const completedPlannerTasks = dailyPlannerBlocks ? dailyPlannerBlocks.filter(b => b.completed).length : 0;

  let hasNightOwl = false;
  let hasEarlyStarter = false;
  Object.values(questionProgress || {}).forEach((prog) => {
    if (prog.solvedAt) {
      const hr = new Date(prog.solvedAt).getHours();
      if (hr >= 23 || hr < 4) hasNightOwl = true;
      if (hr >= 4 && hr < 8) hasEarlyStarter = true;
    }
  });

  // Get progress metrics helper
  const getProgress = (id: string) => {
    switch (id) {
      case "first_solve": return { current: solved, target: 1 };
      case "dsa_50": return { current: solved, target: 50 };
      case "dsa_100": return { current: solved, target: 100 };
      case "graph_master": return { current: graphSolved, target: 5 };
      case "dp_expert": return { current: dpSolved, target: 5 };
      case "first_focus": return { current: totalFocusMinutes, target: 25 };
      case "focus_champion": return { current: totalFocusMinutes, target: 125 };
      case "deep_work_beast": return { current: totalFocusMinutes, target: 375 };
      case "focus_10hr": return { current: totalFocusMinutes, target: 600 };
      case "streak_3": return { current: streak, target: 3 };
      case "streak_7": return { current: streak, target: 7 };
      case "streak_guardian": return { current: streak, target: 7 };
      case "streak_30": return { current: streak, target: 30 };
      case "mock_starter": return { current: mockCompleted, target: 1 };
      case "hr_master": return { current: hrMockCompleted, target: 1 };
      case "frontend_pro": return { current: frontendMockCompleted, target: 1 };
      case "revision_warrior": return { current: revisionCount, target: 5 };
      case "planner_master": return { current: completedPlannerTasks, target: 5 };
      case "night_owl": return { current: hasNightOwl ? 1 : 0, target: 1 };
      case "early_starter": return { current: hasEarlyStarter ? 1 : 0, target: 1 };
      case "pattern_builder": return { current: solved, target: 10 };
      case "oa_ready": return { current: solved, target: Math.ceil(total * 0.3) };
      case "level_5": return { current: level, target: 5 };
      case "century": return { current: xp, target: 1000 };
      default: return { current: 0, target: 1 };
    }
  };

  const achievementsList = Object.entries(ACHIEVEMENT_DETAILS).map(([id, details]) => {
    const isUnlocked = unlockedAchievements.includes(id);
    const progress = getProgress(id);
    const pct = Math.min(100, Math.round((progress.current / progress.target) * 100));
    return {
      id,
      ...details,
      unlocked: isUnlocked,
      progress,
      pct,
    };
  });

  const unlockedCount = achievementsList.filter((a) => a.unlocked).length;

  return (
    <AppShell title="Achievements" subtitle={`${unlockedCount}/${achievementsList.length} Unlocked`}>
      <PageHeader
        title="Achievements & Badges"
        description="Earn XP and unlock badges automatically as you hit key milestones in DSA, consistency, and levels."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {achievementsList.map((a, i) => {
          const IconComponent = a.icon;
          const isLegendary = a.rarity === "Legendary";
          const isEpic = a.rarity === "Epic";
          const isRare = a.rarity === "Rare";

          // Curated Rarity Styling Options
          const rarityBorderColor = a.unlocked
            ? isLegendary
              ? "border-pink-500/50"
              : isEpic
              ? "border-indigo-500/40"
              : isRare
              ? "border-cyan-500/40"
              : "border-zinc-700/50"
            : "border-zinc-900/60";

          const rarityBgColor = a.unlocked
            ? isLegendary
              ? "bg-gradient-to-br from-zinc-950/95 via-pink-950/10 to-zinc-950/90"
              : isEpic
              ? "bg-gradient-to-br from-zinc-950/95 via-indigo-950/10 to-zinc-950/90"
              : isRare
              ? "bg-gradient-to-br from-zinc-950/95 via-cyan-950/10 to-zinc-950/90"
              : "bg-zinc-950/70"
            : "bg-zinc-950/20 opacity-55 hover:opacity-75";

          const rarityShadow = a.unlocked
            ? isLegendary
              ? "shadow-[0_4px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05),0_0_20px_rgba(236,72,153,0.15)]"
              : isEpic
              ? "shadow-[0_4px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05),0_0_15px_rgba(99,102,241,0.12)]"
              : isRare
              ? "shadow-[0_4px_30px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05),0_0_12px_rgba(34,211,238,0.10)]"
              : "shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
            : undefined;

          const progressColor = isLegendary
            ? "bg-pink-500"
            : isEpic
            ? "bg-indigo-500"
            : isRare
            ? "bg-cyan-500"
            : "bg-zinc-500";

          return (
            <GlassCard
              key={a.id}
              delay={i * 0.03}
              className={cn(
                "relative flex flex-col justify-between overflow-hidden border p-6 transition-all duration-300",
                rarityBorderColor,
                rarityBgColor,
                rarityShadow
              )}
            >
              {/* Rare top line accent */}
              {a.unlocked && (
                <div
                  className="absolute top-0 right-0 w-28 h-[2px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${
                      isLegendary ? "#ec4899" : isEpic ? "#6366f1" : isRare ? "#22d3ee" : "#a1a1aa"
                    })`,
                  }}
                />
              )}

              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-xl border transition-colors",
                      a.unlocked
                        ? isLegendary
                          ? "border-pink-500/20 bg-pink-950/20"
                          : isEpic
                          ? "border-indigo-500/20 bg-indigo-950/20"
                          : isRare
                          ? "border-cyan-500/20 bg-cyan-950/20"
                          : "border-zinc-800 bg-zinc-900"
                        : "border-zinc-900 bg-zinc-950"
                    )}
                  >
                    <IconComponent
                      className={cn(
                        "h-6 w-6 transition-all",
                        a.unlocked ? a.color : "text-zinc-650"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest",
                      a.unlocked
                        ? isLegendary
                          ? "text-pink-400 border-pink-500/30 bg-pink-500/10"
                          : isEpic
                          ? "text-indigo-400 border-indigo-500/30 bg-indigo-500/10"
                          : isRare
                          ? "text-cyan-400 border-cyan-500/30 bg-cyan-500/10"
                          : "text-zinc-400 border-zinc-700 bg-zinc-800/20"
                        : "text-zinc-600 border-zinc-900 bg-zinc-950/50"
                    )}
                  >
                    {a.rarity}
                  </span>
                </div>

                <h3
                  className={cn(
                    "text-base font-extrabold tracking-tight",
                    a.unlocked ? "text-white" : "text-zinc-500"
                  )}
                >
                  {a.name}
                </h3>
                <p className="mt-2 text-xs text-zinc-400 leading-relaxed min-h-8">{a.desc}</p>
              </div>

              {/* Progress Tracking Section */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-zinc-500 uppercase tracking-wider">
                    {a.unlocked ? "Completed" : "Progress"}
                  </span>
                  <span className={cn("font-mono", a.unlocked ? progressColor.replace("bg-", "text-") : "text-zinc-400")}>
                    {a.unlocked ? "100%" : `${a.progress.current} / ${a.progress.target}`}
                  </span>
                </div>
                {/* Progress Bar */}
                <div className="h-1 w-full bg-zinc-900/60 rounded-full overflow-hidden border border-zinc-900/30">
                  <div
                    className={cn("h-full transition-all duration-500", progressColor)}
                    style={{ width: `${a.unlocked ? 100 : a.pct}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-900/40 pt-3">
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                  Reward
                </span>
                <span
                  className={cn(
                    "text-[10px] font-bold font-mono",
                    a.unlocked ? "text-cyan-400" : "text-zinc-600"
                  )}
                >
                  {a.unlocked ? "+100 XP Claimed" : "+100 XP Locked"}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </AppShell>
  );
}
