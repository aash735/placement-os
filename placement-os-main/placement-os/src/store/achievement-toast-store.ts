import { create } from "zustand";
import type { Rarity } from "@/lib/badges";

export interface AchievementToast {
  id: string;
  badgeId: string;
  name: string;
  description: string;
  rarity: Rarity;
  iconName: string;
}

interface AchievementToastState {
  toasts: AchievementToast[];
  addToast: (toast: Omit<AchievementToast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useAchievementToastStore = create<AchievementToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `${toast.badgeId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    set((s) => ({
      toasts: [...s.toasts, { ...toast, id }],
    }));
  },
  removeToast: (id) => {
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    }));
  },
}));
