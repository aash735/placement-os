"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";

export default function MockInterviewPage() {
  return (
    <AppShell title="Mock Interview" subtitle="Think-aloud practice">
      <PageHeader title="Mock Interview Dashboard" description="Week 4+ of DSA roadmap: schedule 1 mock/week." />
      <div className="grid gap-4 md:grid-cols-2">
        <GlassCard><h3 className="font-semibold">DSA Mock</h3><p className="mt-2 text-sm text-zinc-400">1 easy + 1 medium · 45 min · explain brute → optimal</p></GlassCard>
        <GlassCard><h3 className="font-semibold">Project Deep Dive</h3><p className="mt-2 text-sm text-zinc-400">Anony Talk architecture · tradeoffs · what you&apos;d improve</p></GlassCard>
        <GlassCard><h3 className="font-semibold">HR Mock</h3><p className="mt-2 text-sm text-zinc-400">STAR stories: conflict, failure, leadership</p></GlassCard>
        <GlassCard><h3 className="font-semibold">Frontend Round</h3><p className="mt-2 text-sm text-zinc-400">Build mini component live · React state · CSS animation</p></GlassCard>
      </div>
    </AppShell>
  );
}
