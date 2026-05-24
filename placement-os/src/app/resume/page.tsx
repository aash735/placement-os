"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";

const HireLensATS = dynamic(
  () => import("@/components/ats/HireLens").then((mod) => mod.HireLensATS),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        <p className="text-xs text-zinc-500">Loading HireLens ATS Scanner...</p>
      </div>
    ),
  }
);

export default function ResumePage() {
  return (
    <AppShell title="Resume" subtitle="ATS-optimized resume tracking">
      <PageHeader title="Resume Builder & Tracker" description="Build a 1-page, impact-driven resume with strong project links and ATS-optimized keywords tailored to your target companies." />
      
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Checklist */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard hover={false} className="p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Resume Checklist</h3>
            <ul className="space-y-3 text-xs text-zinc-350 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 shrink-0 font-bold">☐</span>
                <span>Use an impact verb and measurable metric in each bullet point.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 shrink-0 font-bold">☐</span>
                <span>Achieve an ATS compatibility score above 85 for target companies.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 shrink-0 font-bold">☐</span>
                <span>Include GitHub and live demo links for all projects.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-cyan-400 shrink-0 font-bold">☐</span>
                <span>Position yourself as a Frontend / Product Engineer.</span>
              </li>
            </ul>
          </GlassCard>

          <GlassCard hover={false} className="p-6 border-cyan-900/20 bg-cyan-950/5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Why ATS Scores Matter</h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Large companies use applicant tracking systems (ATS) to filter resumes before human recruiters read them. Resumes without sufficient matching keywords are often filtered out automatically.
            </p>
          </GlassCard>

          <GlassCard hover={true} className="p-6 border-cyan-500/10 hover:border-cyan-500/30 transition-all">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-1.5">
              Extended ATS Scanner <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
              Need a deeper diagnostic check? Access the standalone HireLens Extended Analyzer to scan custom descriptions and advanced format parsing.
            </p>
            <a
              href="https://hire-lens-ats.vercel.app/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-500/20 border border-cyan-500/30 text-[10px] text-cyan-400 font-bold uppercase tracking-wider px-4 py-2 transition-all shadow-inner"
            >
              Launch Standalone Checker
            </a>
          </GlassCard>
        </div>

        {/* Right Side: Native HireLens ATS Analyzer */}
        <div className="lg:col-span-2">
          <GlassCard hover={false} className="p-6">
            <div className="border-b border-zinc-900 pb-4 mb-4">
              <h3 className="font-bold text-white">HireLens ATS Scanner</h3>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Scan your resume against standard industry role descriptions to find gaps and optimize your matches.
              </p>
            </div>
            <HireLensATS />
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}

