"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { usePlacementStore } from "@/lib/store";

export default function BurnoutPage() {
  const setEnergyMode = usePlacementStore((s) => s.setEnergyMode);
  return (
    <AppShell title="Burnout Recovery" subtitle="Comeback system">
      <PageHeader title="Recovery Mode" description="A 72-hour minimum recovery period for when sleep is broken, you dread opening your laptop, or you're experiencing zero information retention." />
      <GlassCard hover={false}>
        <h3 className="font-semibold">Recovery Week Protocol</h3>
        <ul className="mt-3 space-y-2 text-sm text-zinc-300">
          <li>Day 1–2: No DSA. Walk + sleep + light project browsing only</li>
          <li>Day 3–4: 1 easy problem + 10 aptitude</li>
          <li>Day 5–7: Resume normal schedule at 70% volume</li>
        </ul>
        <button onClick={() => setEnergyMode("recovery")} className="btn-primary mt-4">Activate Recovery Mode</button>
        <Link href="/low-energy" className="btn-ghost ml-2 mt-4 inline-flex">Low-Energy Mode</Link>
      </GlassCard>
    </AppShell>
  );
}
