"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useDataStore } from "@/store/data-store";

type ValidationResult = {
  ok: boolean;
  questionCount: number;
  topicCount: number;
  issues: { row: number; field: string; message: string }[];
  manifest: { path: string; rows: number; updated: string }[];
  loadedAt: string;
};

export default function AdminPage() {
  const refetch = useDataStore((s) => s.fetchData);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [revalidating, setRevalidating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/validate")
      .then((r) => r.json())
      .then(setValidation);
  }, []);

  const handleRevalidate = async () => {
    setRevalidating(true);
    await fetch("/api/data/revalidate", { method: "POST" });
    await refetch(true);
    const v = await fetch("/api/admin/validate").then((r) => r.json());
    setValidation(v);
    setRevalidating(false);
  };

  return (
    <AppShell title="Admin" subtitle="Sheet data management">
      <PageHeader
        title="Sheet Admin Panel"
        description="Edit files in /sheets — validate and hot-reload without redeploy"
        action={
          <button type="button" className="btn-primary text-sm" onClick={handleRevalidate} disabled={revalidating}>
            {revalidating ? "Reloading…" : "Reload sheets"}
          </button>
        }
      />

      <GlassCard className="mb-4" hover={false}>
        <h3 className="font-semibold">How to add questions</h3>
        <ol className="mt-2 list-decimal list-inside space-y-1 text-sm text-zinc-400">
          <li>Edit <code className="text-cyan-400">sheets/dsa/questions.csv</code> or add <code>arrays.xlsx</code> in <code>sheets/dsa/</code></li>
          <li>Click Reload sheets above</li>
          <li>Or run <code>npm run sheets:sync</code> to regenerate from seed</li>
        </ol>
      </GlassCard>

      {validation && (
        <>
          <GlassCard hover={false} className="mb-4">
            <p className={validation.ok ? "text-emerald-400" : "text-rose-400"}>
              {validation.ok ? "✓ All validations passed" : `✗ ${validation.issues.length} issues`}
            </p>
            <p className="mt-2 text-sm text-zinc-400">
              {validation.questionCount} questions · {validation.topicCount} topics · Loaded {validation.loadedAt}
            </p>
          </GlassCard>

          <h3 className="mb-2 font-semibold">Sheet manifest</h3>
          <div className="mb-6 overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-zinc-400">
                <tr><th className="p-2">File</th><th className="p-2">Rows</th><th className="p-2">Updated</th></tr>
              </thead>
              <tbody>
                {validation.manifest.map((m) => (
                  <tr key={m.path} className="border-t border-white/5">
                    <td className="p-2 font-mono text-xs">{m.path}</td>
                    <td className="p-2">{m.rows}</td>
                    <td className="p-2 text-zinc-500">{new Date(m.updated).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {validation.issues.length > 0 && (
            <GlassCard hover={false}>
              <h3 className="font-semibold text-rose-300">Validation issues</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {validation.issues.map((i, idx) => (
                  <li key={idx} className="text-zinc-400">Row {i.row} · {i.field}: {i.message}</li>
                ))}
              </ul>
            </GlassCard>
          )}
        </>
      )}
    </AppShell>
  );
}
