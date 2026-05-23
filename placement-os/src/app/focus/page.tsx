"use client";

import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";

export default function FocusPage() {
  return (
    <div className="mesh-bg fixed inset-0 z-50 flex flex-col items-center justify-center p-8">
      <GlassCard className="max-w-lg text-center" hover={false}>
        <h1 className="text-2xl font-bold">Focus Mode</h1>
        <p className="mt-4 text-zinc-400">One task. No sidebar. Timer in Pomodoro.</p>
        <p className="mt-8 font-mono text-4xl text-cyan-400">35:00</p>
        <p className="mt-4 text-sm">Current: Solve 1 medium array problem</p>
        <a href="/dashboard" className="btn-ghost mt-8 inline-flex">Exit Focus</a>
      </GlassCard>
    </div>
  );
}
