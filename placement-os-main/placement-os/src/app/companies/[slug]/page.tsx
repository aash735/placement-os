"use client";

import { use } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useDataStore } from "@/store/data-store";
import { useProgressStore } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

const STATUSES = ["not-started", "preparing", "applied", "oa-done", "interview"] as const;

export default function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const companies = useDataStore((s) => s.companies);
  const company = companies.find((c) => c.slug === slug);
  const status = useProgressStore((s) => s.companyTargets[slug] ?? "not-started");
  const setCompanyStatus = useProgressStore((s) => s.setCompanyStatus);

  const loading = useDataStore((s) => s.loading);
  const lastFetched = useDataStore((s) => s.lastFetched);

  if (!company) {
    if (loading || !lastFetched) {
      return (
        <AppShell title="Loading Company Profile...">
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          </div>
        </AppShell>
      );
    }
    return (
      <AppShell title="Not found">
        <Link href="/companies" className="text-cyan-400">Back</Link>
      </AppShell>
    );
  }

  const sections = [
    ["OA Pattern", company.oaPattern],
    ["Coding Difficulty", company.codingDifficulty],
    ["Aptitude Weight", company.aptitudeWeight],
    ["Rounds", company.rounds.join(" → ")],
    ["Strategy", company.strategy],
  ];

  return (
    <AppShell title={company.name} subtitle={company.type}>
      <GlassCard className="mb-6" hover={false}>
        <h3 className="text-sm font-medium uppercase text-cyan-400">Application status</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button key={s} type="button" onClick={() => setCompanyStatus(slug, s)} className={cn("rounded-full px-3 py-1 text-xs capitalize", status === s ? "bg-cyan-500/25 text-cyan-300" : "bg-white/5 text-zinc-400")}>
              {s.replace("-", " ")}
            </button>
          ))}
        </div>
      </GlassCard>
      {sections.map(([title, body], i) => (
        <GlassCard key={title} delay={i * 0.03} hover={false}>
          <h3 className="text-sm font-medium uppercase text-cyan-400">{title}</h3>
          <p className="mt-2 text-zinc-300">{body}</p>
        </GlassCard>
      ))}
    </AppShell>
  );
}
