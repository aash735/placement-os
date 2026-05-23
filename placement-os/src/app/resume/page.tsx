"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";

export default function ResumePage() {
  return (
    <AppShell title="Resume" subtitle="ATS-optimized resume tracking">
      <PageHeader title="Resume Builder & Tracker" description="Build a 1-page, impact-driven resume with strong project links and ATS-optimized keywords tailored to your target companies." />
      <GlassCard hover={false}>
        <h3 className="font-semibold">Resume Checklist</h3>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          <li>☐ Use an impact verb and measurable metric in each bullet point</li>
          <li>☐ Achieve an ATS compatibility score above 85 for target companies</li>
          <li>☐ Include GitHub and live demo links for all projects</li>
          <li>☐ Position yourself as a Frontend / Product Engineer</li>
        </ul>
      </GlassCard>
    </AppShell>
  );
}
