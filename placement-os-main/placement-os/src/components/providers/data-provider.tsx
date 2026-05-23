"use client";

import { useEffect } from "react";
import { useSheetData } from "@/hooks/use-sheet-data";
import { useProgressStore } from "@/lib/progress-store";
import { ErrorBoundary } from "@/components/ui/error-boundary";

import { AchievementWatcher } from "@/components/ui/achievement-watcher";
import { AchievementToastContainer } from "@/components/ui/achievement-toast-container";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { loading, error, refetch, mockTests, questions } = useSheetData();
  const syncMockTests = useProgressStore((s) => s.syncMockTestsFromSheet);
  const refreshScores = useProgressStore((s) => s.refreshScores);

  useEffect(() => {
    if (mockTests.length) {
      syncMockTests(
        mockTests.map((m) => ({
          id: m.id,
          title: m.title,
          durationMin: m.durationMin,
          questionIds: m.questionIds,
        }))
      );
    }
  }, [mockTests, syncMockTests]);

  useEffect(() => {
    if (questions.length) refreshScores();
  }, [questions.length, refreshScores]);

  if (error) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8">
        <p className="text-rose-400">Failed to load sheet data: {error}</p>
        <p className="text-sm text-zinc-500">Ensure /sheets exists. Run: npm run sheets:sync</p>
        <button type="button" onClick={() => refetch()} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  if (loading && !questions.length) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
        <span className="ml-3 text-zinc-400">Loading from /sheets…</span>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {children}
      <AchievementWatcher />
      <AchievementToastContainer />
    </ErrorBoundary>
  );
}

