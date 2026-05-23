"use client";

import { cn } from "@/lib/utils";

type HeatmapProps = {
  data: { topicId: string; name: string; value: number }[];
};

export function ProgressHeatmap({ data }: HeatmapProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {data.map((cell) => (
        <div
          key={cell.topicId}
          title={`${cell.name}: ${cell.value}%`}
          className={cn(
            "rounded-xl border border-white/10 p-3 text-center transition hover:scale-[1.02]",
            cell.value >= 75 && "bg-emerald-500/20",
            cell.value >= 50 && cell.value < 75 && "bg-cyan-500/15",
            cell.value >= 25 && cell.value < 50 && "bg-amber-500/15",
            cell.value < 25 && "bg-white/5"
          )}
        >
          <p className="truncate text-[10px] font-medium text-zinc-300">{cell.name}</p>
          <p className="mt-1 text-sm font-bold">{cell.value}%</p>
        </div>
      ))}
    </div>
  );
}
