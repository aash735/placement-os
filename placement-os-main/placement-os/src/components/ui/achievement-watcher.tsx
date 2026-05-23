"use client";

import { useEffect, useRef } from "react";
import { useProgressStore } from "@/lib/progress-store";
import { useDSAStats } from "@/hooks/use-dsa";
import { useAchievementToastStore } from "@/store/achievement-toast-store";
import { getBadges, loadUnlockDates, saveUnlockDate } from "@/lib/badges";

export function AchievementWatcher() {
  const {
    xp,
    level,
    streak,
    dailyLogs = [],
    mockTests = [],
    aptitudeAttempts = [],
  } = useProgressStore();

  const { solved, total } = useDSAStats();
  const addToast = useAchievementToastStore((s) => s.addToast);

  // Keep track of initialized state and previously unlocked badge IDs
  const prevUnlockedRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef<boolean>(false);

  // Compute stats needed for badge conditions
  const totalFocusMin = dailyLogs.reduce((acc, l) => acc + (l.focusMinutes || 0), 0);
  const totalRevisions = dailyLogs.reduce((acc, l) => acc + (l.revisionsDone || 0), 0);
  const mocksDone = mockTests.filter((m) => m.completedAt).length + aptitudeAttempts.length;
  const studyDays = dailyLogs.filter((l) => l.questionsSolved > 0 || l.xpEarned > 0).length;

  useEffect(() => {
    // Wait until question bank is loaded before running checks to avoid false unlocks
    if (total === 0) return;

    const currentBadges = getBadges({
      xp,
      level,
      streak,
      solved,
      total,
      totalFocusMin,
      totalRevisions,
      mocksDone,
      studyDays,
    });

    if (!isInitializedRef.current) {
      // 1. Initial Load: Load already saved unlock IDs from localStorage
      const savedUnlockDates = loadUnlockDates();
      const initialUnlockedSet = new Set<string>();

      currentBadges.forEach((b) => {
        if (b.unlocked) {
          initialUnlockedSet.add(b.id);
          // If state says unlocked but localStorage is missing it, save silently without notifying
          if (!savedUnlockDates[b.id]) {
            saveUnlockDate(b.id);
          }
        }
      });

      prevUnlockedRef.current = initialUnlockedSet;
      isInitializedRef.current = true;
    } else {
      // 2. Real-Time Detection: Check if any badge just transitioned to unlocked
      currentBadges.forEach((b) => {
        if (b.unlocked && !prevUnlockedRef.current.has(b.id)) {
          // Double check localStorage to prevent race condition/duplicate toasts
          const savedUnlockDates = loadUnlockDates();
          if (!savedUnlockDates[b.id]) {
            saveUnlockDate(b.id);
            addToast({
              badgeId: b.id,
              name: b.name,
              description: b.description,
              rarity: b.rarity,
              iconName: b.iconName,
            });
          }
          prevUnlockedRef.current.add(b.id);
        }
      });
    }
  }, [
    xp,
    level,
    streak,
    solved,
    total,
    totalFocusMin,
    totalRevisions,
    mocksDone,
    studyDays,
    addToast,
  ]);

  return null; // Watcher is a headless background script
}
export default AchievementWatcher;
