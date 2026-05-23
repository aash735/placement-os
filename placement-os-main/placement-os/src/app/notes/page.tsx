"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";

export default function NotesPage() {
  return (
    <AppShell title="Notes" subtitle="Visual pattern cards">
      <PageHeader title="Pattern Notes" description="Capture one note per algorithm pattern. Link notes directly to problems you've solved." />
      <textarea className="min-h-[200px] w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm" placeholder="Sliding window template: expand right until invalid, shrink left..." />
    </AppShell>
  );
}
