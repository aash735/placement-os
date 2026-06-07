"use client";

import Link from "next/link";
import { ChevronRight, Lock } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

type TopicCardProps = {
  id: string;
  name: string;
  completion: number;
  mastery: string;
  levelUnlocked: number;
  questionCount: number;
  solvedCount: number;
  estimatedHours: number;
  xp: number;
  importanceScore: number;
  unlocked: boolean;
  revisionCount: number;
  delay?: number;
};

export function TopicCard({
  id,
  name,
  completion,
  mastery,
  levelUnlocked,
  questionCount,
  solvedCount,
  estimatedHours,
  xp,
  importanceScore,
  unlocked,
  revisionCount,
  delay = 0,
}: TopicCardProps) {
  const completionColor =
    completion >= 80
      ? "text-emerald-400"
      : completion >= 50
      ? "text-cyan-400"
      : completion >= 20
      ? "text-amber-400"
      : "var(--text-muted)";

  return (
    <Link href={`/dsa/topic/${id}`}>
      <GlassCard delay={delay} className="h-full group">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3
                className="font-semibold truncate group-hover:text-cyan-400 transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {name}
              </h3>
              {!unlocked && <Lock className="h-3.5 w-3.5 shrink-0 text-zinc-500" />}
            </div>
            <p
              className="mt-1 text-xs capitalize"
              style={{ color: "var(--accent-cyan)" }}
            >
              {mastery} · Level {levelUnlocked}/4 · Imp: {importanceScore}
            </p>
          </div>
          <span className={`text-xl font-extrabold shrink-0 ${completionColor}`}>
            {completion}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="progress-bar mt-3">
          <div className="progress-bar-fill" style={{ width: `${completion}%` }} />
        </div>

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-2 gap-y-2 text-[10px]" style={{ color: "var(--text-secondary)" }}>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">Progress:</span>
            <span className="font-semibold text-white">{solvedCount} / {questionCount} Solved</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <span className="text-zinc-500">Est. Time:</span>
            <span className="font-semibold text-cyan-400">{estimatedHours}h</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500">Topic XP:</span>
            <span className="font-semibold text-violet-400">+{xp} XP</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end">
            <span className="text-zinc-500">Revisions:</span>
            <span className="font-semibold text-amber-400">{revisionCount} due</span>
          </div>
        </div>

        <p
          className="mt-4 flex items-center gap-1 text-xs font-medium text-cyan-500 group-hover:text-cyan-400 transition-colors"
        >
          Continue learning <ChevronRight className="h-3 w-3" />
        </p>
      </GlassCard>
    </Link>
  );
}
