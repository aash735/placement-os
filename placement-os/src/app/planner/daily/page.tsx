"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Activity,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
  X
} from "lucide-react";

export default function DailyPlannerPage() {
  const {
    dailyPlannerBlocks,
    addPlannerBlock,
    deletePlannerBlock,
    togglePlannerBlock
  } = useProgressStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [timeText, setTimeText] = useState("");
  const [energyLevel, setEnergyLevel] = useState<"normal" | "low" | "recovery">("normal");

  const handleAddBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim() || !timeText.trim()) return;

    addPlannerBlock({
      time: timeText,
      task: taskText,
      energy: energyLevel,
    });

    setTaskText("");
    setTimeText("");
    setEnergyLevel("normal");
    setShowAddForm(false);
  };

  const totalBlocks = dailyPlannerBlocks.length;
  const completedBlocks = dailyPlannerBlocks.filter((b) => b.completed).length;
  const completionRate = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 105) : 0; // scale or show percentage
  const pct = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

  return (
    <AppShell title="Daily Planner" subtitle="sustainable blocks execution">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Daily Planner & Execution Blocks"
          description="Build a sustainable routine. Execute placement work in manageable blocks synchronized with your energy levels."
        />
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-1.5 self-start md:self-auto py-2.5 px-4"
        >
          <Plus className="h-4 w-4" />
          Add Time Block
        </button>
      </div>

      {/* Quick Summary Widgets */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <GlassCard className="p-4 flex items-center gap-3" hover={false}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/40 border border-cyan-850 text-cyan-400">
            <CheckSquare className="h-5 w-5" />
          </span>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Completed Blocks</span>
            <span className="text-lg font-bold text-white">{completedBlocks} / {totalBlocks} Tasks</span>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3" hover={false}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/40 border border-cyan-850 text-cyan-400">
            <TrendingUp className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Execution Index</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-white">{pct}%</span>
              <div className="h-1.5 flex-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-900">
                <div
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 flex items-center gap-3" hover={false}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/40 border border-cyan-850 text-cyan-400">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Rewards Claimed</span>
            <span className="text-lg font-bold text-cyan-400">+{completedBlocks * 25} XP Earned</span>
          </div>
        </GlassCard>
      </div>

      {/* Add Block Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowAddForm(false)} />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-400" /> Create Execution Block
            </h3>

            <form onSubmit={handleAddBlock} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1 space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 17:00"
                    required
                    value={timeText}
                    onChange={(e) => setTimeText(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Task Name / Goal</label>
                  <input
                    type="text"
                    placeholder="e.g. Solve 1 DSA problem"
                    required
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Energy Requirement</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "normal", "recovery"] as const).map((energy) => (
                    <button
                      key={energy}
                      type="button"
                      onClick={() => setEnergyLevel(energy)}
                      className={`py-2 rounded-lg border text-xs capitalize transition-all ${
                        energyLevel === energy
                          ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-300 font-bold"
                          : "border-zinc-850 bg-zinc-900 text-zinc-400"
                      }`}
                    >
                      {energy}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3 mt-2 font-bold uppercase tracking-wider text-xs">
                Commit Time Block
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Daily Planner List */}
      <div className="space-y-3">
        {dailyPlannerBlocks.map((b) => (
          <GlassCard
            key={b.id}
            className="flex items-center justify-between border p-4 transition-all duration-200"
            hover={false}
            style={
              b.completed
                ? {
                    borderLeft: "4px solid rgba(6, 182, 212, 0.4)",
                  }
                : undefined
            }
          >
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                onClick={() => togglePlannerBlock(b.id)}
                className="rounded-lg text-zinc-500 hover:text-cyan-400 shrink-0 transition-colors"
                title={b.completed ? "Mark Incomplete" : "Mark Complete"}
              >
                {b.completed ? (
                  <CheckSquare className="h-5.5 w-5.5 text-cyan-400" />
                ) : (
                  <Square className="h-5.5 w-5.5 text-zinc-700 hover:text-zinc-500" />
                )}
              </button>

              <span className="font-mono text-xs text-cyan-400 shrink-0 bg-zinc-900/60 border border-zinc-850 px-2.5 py-1.5 rounded-lg select-none">
                {b.time}
              </span>

              <div className="min-w-0">
                <p className={`text-sm font-semibold truncate ${
                  b.completed ? "line-through text-zinc-500" : "text-white"
                }`}>
                  {b.task}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Activity className="h-3 w-3 text-zinc-500" />
                  <span className="text-[10px] capitalize text-zinc-500 font-medium">
                    {b.energy} energy level
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm(`Delete block "${b.task}"?`)) {
                  deletePlannerBlock(b.id);
                }
              }}
              className="rounded-lg p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-950/10 border border-transparent hover:border-rose-950/20 transition-all shrink-0 ml-4"
              title="Delete Time Block"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          </GlassCard>
        ))}

        {totalBlocks === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-900 rounded-2xl">
            <Clock className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-zinc-300 font-bold text-sm">No Time Blocks Allocated</h3>
            <p className="text-zinc-500 text-xs mt-1">Configure your execution blocks and allocate daily routines.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
