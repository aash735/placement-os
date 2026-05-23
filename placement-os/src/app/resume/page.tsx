"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";

export default function ResumePage() {
  return (
    <AppShell title="Resume" subtitle="HireLens-powered ATS optimization">
      <PageHeader title="Resume Builder / Tracker" description="1 page · impact bullets · project links · ATS keywords per company." />
      <GlassCard hover={false}>
        <h3 className="font-semibold">Checklist</h3>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          <li>☐ Impact verb + metric per bullet</li>
          <li>☐ HireLens score &gt; 85 for TCS Digital</li>
          <li>☐ GitHub + live demo links</li>
          <li>☐ Frontend/product engineer positioning</li>
        </ul>
      </GlassCard>
    </AppShell>
  );
}
