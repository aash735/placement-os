"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";

export default function SocialTrackerPage() {
  return (
    <AppShell title="GitHub / LinkedIn" subtitle="Public proof of work">
      <PageHeader title="Social Tracker" description="Weekly: 1 commit day · 1 LinkedIn post/month · README polish" />
      <GlassCard><h3 className="font-semibold">GitHub</h3><p className="text-sm text-zinc-400">Pin: HireLens, Anony Talk, Placement OS</p></GlassCard>
      <GlassCard className="mt-4"><h3 className="font-semibold">LinkedIn</h3><p className="text-sm text-zinc-400">Headline: Product-oriented Frontend Engineer · AI-augmented builder</p></GlassCard>
    </AppShell>
  );
}
