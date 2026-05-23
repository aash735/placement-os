"use client";

import type { QuestionStatus } from "@/types";
import { STATUS_LABELS, STATUS_ORDER } from "@/lib/dsa-engine";
import { cn } from "@/lib/utils";

type StatusSelectorProps = {
  value: QuestionStatus;
  onChange: (status: QuestionStatus) => void;
};

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_ORDER.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition",
            value === s ? "bg-cyan-500/25 text-cyan-300 ring-1 ring-cyan-500/50" : "bg-white/5 text-zinc-400 hover:bg-white/10"
          )}
        >
          {STATUS_LABELS[s]}
        </button>
      ))}
    </div>
  );
}
