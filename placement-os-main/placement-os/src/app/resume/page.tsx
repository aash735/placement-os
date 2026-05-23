"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { ExternalLink, ScanText } from "lucide-react";

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

      {/* ATS Resume Checker — inline tool */}
      <a
        id="ats-resume-checker-link"
        href="https://hire-lens-ats.vercel.app/index.html"
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <GlassCard hover className="flex items-center gap-4">
          {/* Icon bubble */}
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(34,211,238,0.18), rgba(167,139,250,0.18))",
              border: "1px solid rgba(34,211,238,0.25)",
            }}
          >
            <ScanText className="h-5 w-5" style={{ color: "var(--accent-cyan)" }} />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              ATS Resume Checker
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
              Check your resume ATS score instantly
            </p>
          </div>

          {/* Arrow */}
          <ExternalLink
            className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: "var(--text-faint)" }}
          />
        </GlassCard>
      </a>
    </AppShell>
  );
}

