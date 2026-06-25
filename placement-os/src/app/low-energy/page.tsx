"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { usePlacementStore } from "@/lib/store";
import { 
  Zap, 
  CheckCircle, 
  Flame, 
  Circle,
  HelpCircle,
  TrendingUp,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const TASKS = [
  { id: "le-task-1", text: "Re-read 1 solved easy problem (10 min)", icon: Flame, color: "text-rose-400" },
  { id: "le-task-2", text: "Solve 5 aptitude questions only (10 min)", icon: HelpCircle, color: "text-cyan-400" },
  { id: "le-task-3", text: "Update 1 resume bullet point (5 min)", icon: Zap, color: "text-amber-400" },
  { id: "le-task-4", text: "Watch 1 visual DSA pattern video (15 min max)", icon: TrendingUp, color: "text-violet-400" },
  { id: "le-task-5", text: "Organize notes—no new learning (10 min)", icon: Zap, color: "text-emerald-400" },
];

export default function LowEnergyPage() {
  const energyMode = usePlacementStore((s) => s.energyMode);
  const setEnergyMode = usePlacementStore((s) => s.setEnergyMode);
  const isActive = energyMode === "low";
  
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Load completion states from localStorage on mount
  useEffect(() => {
    const states: Record<string, boolean> = {};
    TASKS.forEach((t) => {
      states[t.id] = localStorage.getItem(`placement-os-le-${t.id}`) === "true";
    });
    setCompleted(states);
  }, []);

  const toggleTask = (id: string) => {
    const nextVal = !completed[id];
    setCompleted({ ...completed, [id]: nextVal });
    localStorage.setItem(`placement-os-le-${id}`, String(nextVal));
  };

  const toggleLowEnergyMode = () => {
    setEnergyMode(isActive ? "normal" : "low");
  };

  return (
    <AppShell title="Low-Energy Mode" subtitle="Maintain daily consistency">
      <PageHeader 
        title="Low-Energy Study Hub" 
        description="Momentum beats intensity. Maintain your streak with minimum viable effort when willpower is low." 
      />

      <div className="grid gap-6 lg:grid-cols-3 pb-12">
        {/* Status Panel */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard 
            hover={false}
            className={cn(
              "p-6 border transition-all",
              isActive 
                ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_4px_20px_rgba(52,211,153,0.1)]"
                : "border-white/5 bg-black/20"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl bg-white/5", isActive ? "text-emerald-400" : "text-zinc-500")}>
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Streak Saver</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Energy Mode Configuration</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Current Mode</span>
                <h4 className={cn("text-base font-extrabold mt-1 capitalize", isActive ? "text-emerald-400 light:text-emerald-600" : "text-zinc-400")}>
                  {isActive ? "✨ Low-Energy Active" : "Normal Mode"}
                </h4>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {isActive 
                  ? "Animations are capped and high emissions are simplified. Focus on low-energy tasks to keep your streak alive."
                  : "Enable Low-Energy Mode to simplify visual styles and adjust daily streak checkpoints."}
              </p>

              <button
                onClick={toggleLowEnergyMode}
                className={cn(
                  "w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer",
                  isActive
                    ? "bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400"
                    : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_4px_12px_rgba(52,211,153,0.2)]"
                )}
              >
                {isActive ? "Deactivate Low-Energy" : "Activate Low-Energy Mode"}
              </button>
            </div>
          </GlassCard>

          <GlassCard hover={false} className="p-4 border-white/5 text-[10px] text-zinc-400 leading-relaxed flex items-start gap-2 bg-black/40">
            <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              💡 Strategy: Doing just 15 minutes of low-effort review prevents neural pathways from resetting. It keeps the context active in your head.
            </span>
          </GlassCard>
        </div>

        {/* Tasks List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">
            Minimum Viable Tasks (Select 1-2 to save streak)
          </h3>
          
          {TASKS.map((t, i) => {
            const isDone = completed[t.id];
            const Icon = t.icon;
            
            return (
              <GlassCard
                key={t.id}
                delay={i * 0.02}
                hover={!isDone}
                onClick={() => toggleTask(t.id)}
                className={cn(
                  "p-4 border transition-all cursor-pointer flex items-center justify-between",
                  isDone 
                    ? "border-emerald-500/20 bg-emerald-500/[0.02] opacity-60" 
                    : "border-white/5 bg-black/20 hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("p-2 rounded-lg bg-white/5 shrink-0", t.color)}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <p className={cn("text-xs font-semibold truncate", isDone ? "text-zinc-500 line-through" : "text-white")}>
                    {t.text}
                  </p>
                </div>
                
                <button
                  type="button"
                  className={cn(
                    "h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all",
                    isDone 
                      ? "border-emerald-400 bg-emerald-500 text-black" 
                      : "border-zinc-650 hover:border-zinc-400 bg-black/40"
                  )}
                >
                  {isDone && <CheckCircle className="h-3.5 w-3.5" />}
                </button>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
