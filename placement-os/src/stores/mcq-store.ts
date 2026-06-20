import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MCQAttempt } from "@/types";
import { useProgressStore } from "@/lib/progress-store";
import * as db from "@/lib/supabase-db";
import mcqBank from "@/data/mcq-bank.json";

interface McqState {
  bookmarks: string[];
  attempts: MCQAttempt[];
  toggleBookmark: (questionId: string) => void;
  addAttempt: (attempt: Omit<MCQAttempt, "id" | "completedAt">) => void;
  resetProgress: () => void;
}

export const useMcqStore = create<McqState>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      attempts: [],

      toggleBookmark: (questionId) => {
        const bookmarks = get().bookmarks || [];
        const isBookmarked = bookmarks.includes(questionId);
        const newBookmarks = isBookmarked
          ? bookmarks.filter((id) => id !== questionId)
          : [...bookmarks, questionId];

        set({ bookmarks: newBookmarks });

        // Sync with Supabase if user is logged in
        const userId = useProgressStore.getState().userId;
        if (userId && !db.isGuest(userId)) {
          db.saveMcqBookmark(userId, questionId, !isBookmarked);
        }
      },

      addAttempt: (partialAttempt) => {
        const id = `mcq-att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const completedAt = new Date().toISOString();
        const attempt: MCQAttempt = {
          ...partialAttempt,
          id,
          completedAt,
        };

        const attempts = [...(get().attempts || []), attempt];
        set({ attempts });

        // Lookup question difficulty from the parsed bank for XP reward
        const question = mcqBank.find((q) => q.id === attempt.questionId);
        let xpGain = 0;
        if (attempt.isCorrect) {
          // Check if this was already solved correctly to prevent XP farming
          const alreadySolved = (get().attempts || []).some(
            (a) => a.questionId === attempt.questionId && a.isCorrect
          );
          if (!alreadySolved) {
            const diff = question?.difficulty || "Medium";
            if (diff === "Easy") xpGain = 5;
            else if (diff === "Medium") xpGain = 10;
            else if (diff === "Hard") xpGain = 20;
          }
        }

        // Apply XP rewards via the main progress store
        if (xpGain > 0) {
          useProgressStore.getState().addXp(xpGain);
        }

        // Register the attempt in the main progress store as well
        // so that the general Placement Readiness calculation picks it up!
        useProgressStore.getState().addMcqAttempt(attempt);

        // Sync with Supabase if user is logged in
        const userId = useProgressStore.getState().userId;
        if (userId && !db.isGuest(userId)) {
          db.saveMcqAttempt(userId, attempt);
        }
      },

      resetProgress: () => {
        set({ bookmarks: [], attempts: [] });
      },
    }),
    {
      name: "placement-os-mcq-store",
    }
  )
);
