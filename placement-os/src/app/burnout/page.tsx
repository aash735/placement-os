"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { usePlacementStore } from "@/lib/store";
import { 
  ShieldAlert, 
  Sparkles, 
  Heart, 
  Smile, 
  BatteryCharging,
  ArrowRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROTOCOL_STEPS = [
  { days: "Days 1–2", title: "Pure Decompression", desc: "Strictly no DSA, no complex coding. Rest, sleep at least 8 hours, and restrict screen time. Go for a walk or browse light designs.", icon: Heart, color: "text-rose-400 light:text-rose-600" },
  { days: "Days 3–4", title: "Soft Warm-up", desc: "Solve 1 easy DSA problem only. Review notes. Do 5-10 aptitude questions to restore baseline focus without pressure.", icon: BatteryCharging, color: "text-amber-400 light:text-amber-600" },
  { days: "Days 5–7", title: "Gradual Re-entry", desc: "Resume standard DSA blocks at 70% volume. Begin active project coding again but avoid overnight grinds.", icon: Smile, color: "text-emerald-400 light:text-emerald-600" }
];

export default function BurnoutPage() {
  const energyMode = usePlacementStore((s) => s.energyMode);
  const setEnergyMode = usePlacementStore((s) => s.setEnergyMode);
  const isActive = energyMode === "recovery";

  const toggleRecoveryMode = () => {
    setEnergyMode(isActive ? "normal" : "recovery");
  };

  return (
    <AppShell title="Burnout Recovery" subtitle="Restore preparation momentum">
      <PageHeader 
        title="Burnout Recovery Center" 
        description="A science-backed decompression protocol for when sleep is broken, you dread opening your IDE, or you feel zero information retention." 
      />

      <div className="grid gap-6 lg:grid-cols-3 pb-12">
        {/* Status Panel */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard 
            hover={false}
            className={cn(
              "p-6 border transition-all",
              isActive 
                ? "border-violet-500/30 bg-violet-500/5 shadow-[0_4px_20px_rgba(167,139,250,0.1)]"
                : "border-white/5 bg-black/20"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn("p-2.5 rounded-xl bg-white/5", isActive ? "text-violet-400" : "text-zinc-500")}>
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">System Status</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Burnout Level Evaluator</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-white/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Current Mode</span>
                <h4 className={cn("text-base font-extrabold mt-1 capitalize", isActive ? "text-violet-400 light:text-violet-600" : "text-zinc-400")}>
                  {isActive ? "✨ Recovery Active" : "Normal Mode"}
                </h4>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {isActive 
                  ? "Revisions are currently spaced out and daily quests are halved to reduce prep fatigue."
                  : "Enable Recovery Mode to scale down daily targets and restore your energy levels."}
              </p>

              <button
                onClick={toggleRecoveryMode}
                className={cn(
                  "w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer",
                  isActive
                    ? "bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400"
                    : "bg-violet-500 hover:bg-violet-400 text-black shadow-[0_4px_12px_rgba(167,139,250,0.2)]"
                )}
              >
                {isActive ? "Deactivate Recovery" : "Activate Recovery Protocol"}
              </button>
            </div>
          </GlassCard>

          <GlassCard hover={false} className="p-4 border-white/5 text-[10px] text-zinc-400 leading-relaxed flex items-start gap-2 bg-black/40">
            <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              💡 Placement Tip: Startups and MNCs look for builders who can work sustainably. Taking a 3-day rest is better than a 3-week total crash.
            </span>
          </GlassCard>
        </div>

        {/* Timeline Protocol */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard hover={false} className="p-6 border-white/5">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5 border-b border-white/5 pb-4 mb-5">
              <Sparkles className="h-4.5 w-4.5 text-cyan-400" />
              The 7-Day Comeback Protocol
            </h3>

            <div className="relative border-l border-white/10 pl-6 ml-3 space-y-8">
              {PROTOCOL_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={idx} className="relative">
                    {/* Circle bullet */}
                    <div className="absolute -left-[35px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-950 border border-white/10 text-[10px] text-zinc-400 font-bold">
                      {idx + 1}
                    </div>

                    <div className="space-y-1">
                      <span className={cn("text-[9px] uppercase font-bold tracking-widest", step.color)}>
                        {step.days}
                      </span>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Icon className="h-4 w-4 shrink-0" />
                        {step.title}
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed max-w-xl">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500 font-semibold">Self-paced system</span>
              <Link href="/low-energy" className="text-xs text-cyan-450 hover:underline flex items-center gap-1 font-semibold">
                <span>Try Low-Energy Mode</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
