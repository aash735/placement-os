"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useDataStore } from "@/store/data-store";

export default function CompaniesPage() {
  const companies = useDataStore((s) => s.companies);

  return (
    <AppShell title="Companies" subtitle="Research and prepare for target companies">
      <PageHeader title="Company Preparation Hub" description="Explore company profiles, OA patterns, and hiring strategies for your target employers." />
      <div className="grid gap-4 sm:grid-cols-2">
        {companies.map((c, i) => (
          <Link key={c.slug} href={`/companies/${c.slug}`}>
            <GlassCard delay={i * 0.03}>
              <h3 className="font-semibold">{c.name}</h3>
              <p className="mt-1 text-xs capitalize text-violet-300">{c.type}</p>
              <p className="mt-2 text-sm text-zinc-400">{c.priority}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
