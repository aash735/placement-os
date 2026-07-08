"use client";

import Link from "next/link";
import { ExternalLink, ChevronRight, Bookmark, Video, Code2, Clock, Star } from "lucide-react";
import type { DSAQuestion, QuestionStatus } from "@/types";
import { GlassCard } from "@/components/ui/glass-card";
import { STATUS_LABELS } from "@/lib/dsa-engine";
import { useProgressStore } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<QuestionStatus, string> = {
  not_started: "bg-zinc-500/10 text-zinc-400 light:text-zinc-700 light:bg-zinc-100 border-zinc-500/20 light:border-zinc-300",
  attempted:   "bg-amber-500/10 text-amber-400 light:text-amber-700 light:bg-amber-100 border-amber-500/20 light:border-amber-300",
  solved:      "bg-cyan-500/10 text-cyan-400 light:text-cyan-700 light:bg-cyan-100 border-cyan-500/20 light:border-cyan-300",
  revised:     "bg-violet-500/10 text-violet-400 light:text-violet-700 light:bg-violet-100 border-violet-500/20 light:border-violet-300",
  mastered:    "bg-emerald-500/10 text-emerald-400 light:text-emerald-700 light:bg-emerald-100 border-emerald-500/20 light:border-emerald-300",
};

// Difficulty pill styles
const DIFF_STYLES: Record<string, string> = {
  Easy:   "diff-easy",
  Medium: "diff-medium",
  Hard:   "diff-hard",
};

const FREQ_LABELS: Record<string, string> = {
  "very-high": "🔥 Very High",
  high:        "⚡ High",
  medium:      "📈 Medium",
  low:         "📉 Low",
};

type QuestionCardProps = {
  question: DSAQuestion;
  showTopic?: boolean;
  compact?: boolean;
};

export function QuestionCard({ question, showTopic, compact }: QuestionCardProps) {
  const progress      = useProgressStore((s) => s.questionProgress[question.id]);
  const cycleStatus   = useProgressStore((s) => s.cycleQuestionStatus);
  const toggleBookmark = useProgressStore((s) => s.toggleBookmark);
  const bookmarks     = useProgressStore((s) => s.bookmarks);
  const status        = progress?.status ?? "not_started";
  const bookmarked    = (bookmarks ?? []).includes(question.id);

  const solveLabel = question.url.includes("leetcode")
    ? "LeetCode"
    : question.url.includes("geeksforgeeks") || question.url.includes("gfg")
    ? "GFG"
    : question.url.includes("google.com/search")
    ? "Search"
    : question.platform || "Solve";

  const neetCodeUrl = question.neetCodeRef
    ? question.neetCodeRef.startsWith("http")
      ? question.neetCodeRef
      : `https://neetcode.io/problems/${question.neetCodeRef}`
    : null;

  return (
    <GlassCard
      hover={false}
      className={cn(
        "transition-all duration-200",
        status === "mastered" && "border-emerald-500/20",
        status === "solved"   && "border-cyan-500/15",
        status === "revised"  && "border-violet-500/15",
        compact && "!p-3"
      )}
    >
      <div className={cn("flex flex-col gap-3", !compact && "lg:flex-row lg:items-start lg:justify-between")}>
        {/* ── Left: Main Info ── */}
        <div className="min-w-0 flex-1">
          {/* Badge row */}
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {/* Status badge — clickable */}
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold cursor-pointer hover:opacity-75 transition-opacity",
                STATUS_STYLES[status]
              )}
              onClick={() => cycleStatus(question.id)}
              title="Click to update status"
            >
              {STATUS_LABELS[status]}
            </span>

            {/* Difficulty */}
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold", DIFF_STYLES[question.difficulty] ?? "badge-cyan")}>
              {question.difficulty}
            </span>

            {/* Level */}
            <span className="badge-violet">L{question.level}</span>

            {/* Pattern */}
            {question.pattern && question.pattern !== "General" && (
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-500 font-medium">
                {question.pattern}
              </span>
            )}

            {/* Time */}
            <span className="flex items-center gap-0.5 text-[10px]" style={{ color: "var(--text-faint)" }}>
              <Clock className="h-3 w-3" />
              {question.estimatedMinutes}m
            </span>

            {/* XP */}
            {question.xpReward && (
              <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-semibold">
                <Star className="h-3 w-3" />
                +{question.xpReward}
              </span>
            )}

            {/* Sheet Sources */}
            {question.sources && question.sources.map((src) => (
              <span
                key={src}
                className="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-400 font-semibold font-mono"
              >
                {src}
              </span>
            ))}

            {/* Bookmark */}
            <button
              type="button"
              onClick={() => toggleBookmark(question.id)}
              className={cn(
                "ml-auto p-0.5 rounded transition-colors",
                bookmarked ? "text-cyan-500" : "hover:text-cyan-400"
              )}
              style={{ color: bookmarked ? undefined : "var(--text-faint)" }}
              aria-label="Bookmark"
            >
              <Bookmark className={cn("h-3.5 w-3.5", bookmarked && "fill-cyan-500")} />
            </button>
          </div>

          {/* Title */}
          <Link href={`/dsa/question/${question.id}`} className="group block">
            <h3
              className={cn(
                "font-semibold group-hover:text-cyan-500 transition-colors",
                compact ? "text-sm" : "text-base"
              )}
              style={{ color: "var(--text-primary)" }}
            >
              {question.title}
            </h3>
          </Link>

          {/* Subtopic + frequency */}
          {!compact && (
            <p className="mt-1 text-[11px]" style={{ color: "var(--text-faint)" }}>
              {question.subtopic && question.subtopic !== question.pattern && (
                <span>{question.subtopic} · </span>
              )}
              {FREQ_LABELS[question.interviewFrequency] ?? question.interviewFrequency}
              {" "}·{" "}
              <span className="capitalize">{question.revisionPriority} priority</span>
            </p>
          )}

          {/* Topic label */}
          {showTopic && (
            <Link href={`/dsa/topic/${question.topicId}`}>
              <p
                className="mt-1 text-[10px] uppercase tracking-wider hover:text-cyan-500 transition-colors"
                style={{ color: "var(--text-faint)" }}
              >
                {question.topicId.replace(/-/g, " ")}
              </p>
            </Link>
          )}

          {/* Companies */}
          {question.companies.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {question.companies.slice(0, compact ? 3 : 6).map((c) => (
                <span
                  key={c}
                  className="rounded-md border px-1.5 py-0.5 text-[10px]"
                  style={{
                    background: "var(--bg-overlay)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {c}
                </span>
              ))}
              {question.companies.length > (compact ? 3 : 6) && (
                <span className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                  +{question.companies.length - (compact ? 3 : 6)}
                </span>
              )}
            </div>
          )}

          {/* Tags */}
          {!compact && question.tags && question.tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {question.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{
                    background: "var(--bg-overlay)",
                    color: "var(--text-faint)",
                  }}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Notes preview */}
          {progress?.notes && (
            <div className="mt-2 rounded border border-amber-500/20 bg-amber-500/5 p-2 text-[10px] text-amber-600 max-w-md">
              <span className="font-semibold text-amber-500">Note: </span>
              {progress.notes.length > 100 ? `${progress.notes.slice(0, 100)}…` : progress.notes}
            </div>
          )}
        </div>

        {/* ── Right: Action Buttons ── */}
        <div className={cn("flex shrink-0 flex-wrap gap-2", compact && "mt-2")}>
          <a
            href={question.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-1 text-xs py-1.5 px-3 font-semibold"
            onClick={(e) => e.stopPropagation()}
          >
            <Code2 className="h-3.5 w-3.5" />
            {solveLabel}
            <ExternalLink className="h-3 w-3 ml-0.5 opacity-70" />
          </a>

          {neetCodeUrl && (
            <a
              href={neetCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-1 text-xs py-1.5 px-3"
              onClick={(e) => e.stopPropagation()}
            >
              NeetCode
              <ExternalLink className="h-3 w-3 opacity-70" />
            </a>
          )}

          {question.videoUrl && (
            <a
              href={question.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center gap-1 text-xs py-1.5 px-3 text-rose-500 border-rose-500/20"
              onClick={(e) => e.stopPropagation()}
            >
              <Video className="h-3.5 w-3.5" />
              Video
            </a>
          )}

          {!compact && (
            <Link
              href={`/dsa/question/${question.id}`}
              className="btn-ghost inline-flex items-center gap-1 text-xs py-1.5 px-3"
            >
              Details <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Revision date */}
      {progress?.nextRevisionAt && status !== "not_started" && (
        <p
          className="mt-2 pt-2 text-[10px] text-amber-500"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          Next revision:{" "}
          {new Date(progress.nextRevisionAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </p>
      )}
    </GlassCard>
  );
}
