import React from "react";
import {
  Trophy, Star, Zap, Flame, Brain,
  Target, BookOpen, Shield, Award, CheckCircle2,
  TrendingUp, Clock
} from "lucide-react";

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

export interface BadgeDef {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconName: string;
  rarity: Rarity;
  unlocked: boolean;
  progress?: { current: number; max: number };
  unlockedAt?: string;
}

export const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy, Star, Zap, Flame, Brain,
  Target, BookOpen, Shield, Award, CheckCircle2,
  TrendingUp, Clock
};

export const RARITY_CONFIG: Record<Rarity, {
  label: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  gradient: string;
}> = {
  Common: {
    label: "Common",
    color: "text-zinc-300",
    bg: "bg-zinc-900/90 backdrop-blur-md",
    border: "border-zinc-800",
    glow: "shadow-[0_4px_12px_rgba(0,0,0,0.5)]",
    gradient: "from-zinc-600 to-zinc-400",
  },
  Rare: {
    label: "Rare",
    color: "text-cyan-300",
    bg: "bg-cyan-950/20 backdrop-blur-md",
    border: "border-cyan-500/30",
    glow: "shadow-[0_0_20px_rgba(34,211,238,0.15)]",
    gradient: "from-cyan-500 to-blue-500",
  },
  Epic: {
    label: "Epic",
    color: "text-violet-300",
    bg: "bg-violet-950/20 backdrop-blur-md",
    border: "border-violet-500/30",
    glow: "shadow-[0_0_24px_rgba(167,139,250,0.20)]",
    gradient: "from-violet-500 to-purple-600",
  },
  Legendary: {
    label: "Legendary",
    color: "text-amber-300",
    bg: "bg-amber-950/20 backdrop-blur-md",
    border: "border-amber-500/30",
    glow: "shadow-[0_0_32px_rgba(251,191,36,0.25)]",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
  },
};

export const RARITY_ORDER: Rarity[] = ["Legendary", "Epic", "Rare", "Common"];

export const STORAGE_KEY = "placement-os-badge-unlocks-v1";

export function loadUnlockDates(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function saveUnlockDate(id: string): string {
  const current = loadUnlockDates();
  const dateStr = new Date().toISOString();
  if (!current[id]) {
    current[id] = dateStr;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch { /* ignore */ }
  }
  return current[id] || dateStr;
}

export function getBadges(state: {
  xp: number;
  level: number;
  streak: number;
  solved: number;
  total: number;
  totalFocusMin: number;
  totalRevisions: number;
  mocksDone: number;
  studyDays: number;
}): BadgeDef[] {
  const { xp, level, streak, solved, total, totalFocusMin, totalRevisions, mocksDone, studyDays } = state;
  return [
    // ── Common
    {
      id: "first-blood",
      name: "First Blood",
      description: "Solve your very first DSA problem",
      icon: Target, iconName: "Target", rarity: "Common",
      unlocked: solved >= 1,
      progress: { current: Math.min(solved, 1), max: 1 },
    },
    {
      id: "streak-starter",
      name: "Streak Starter",
      description: "Maintain a 3-day study streak",
      icon: Flame, iconName: "Flame", rarity: "Common",
      unlocked: streak >= 3,
      progress: { current: Math.min(streak, 3), max: 3 },
    },
    {
      id: "first-mock",
      name: "Mock Debutant",
      description: "Complete your first aptitude or mock test",
      icon: Brain, iconName: "Brain", rarity: "Common",
      unlocked: mocksDone >= 1,
      progress: { current: Math.min(mocksDone, 1), max: 1 },
    },
    {
      id: "xp-rookie",
      name: "XP Rookie",
      description: "Earn 100+ total XP",
      icon: Zap, iconName: "Zap", rarity: "Common",
      unlocked: xp >= 100,
      progress: { current: Math.min(xp, 100), max: 100 },
    },

    // ── Rare
    {
      id: "pattern-builder",
      name: "Pattern Builder",
      description: "Solve 10 DSA problems",
      icon: TrendingUp, iconName: "TrendingUp", rarity: "Rare",
      unlocked: solved >= 10,
      progress: { current: Math.min(solved, 10), max: 10 },
    },
    {
      id: "week-warrior",
      name: "Week Warrior",
      description: "Maintain a 7-day study streak",
      icon: Flame, iconName: "Flame", rarity: "Rare",
      unlocked: streak >= 7,
      progress: { current: Math.min(streak, 7), max: 7 },
    },
    {
      id: "focus-master",
      name: "Focus Master",
      description: "Accumulate 60+ focus minutes",
      icon: Clock, iconName: "Clock", rarity: "Rare",
      unlocked: totalFocusMin >= 60,
      progress: { current: Math.min(totalFocusMin, 60), max: 60 },
    },
    {
      id: "revision-warrior",
      name: "Revision Warrior",
      description: "Complete 10+ revision sessions",
      icon: BookOpen, iconName: "BookOpen", rarity: "Rare",
      unlocked: totalRevisions >= 10,
      progress: { current: Math.min(totalRevisions, 10), max: 10 },
    },
    {
      id: "level-5",
      name: "Rising Builder",
      description: "Reach Level 5",
      icon: Star, iconName: "Star", rarity: "Rare",
      unlocked: level >= 5,
      progress: { current: Math.min(level, 5), max: 5 },
    },
    {
      id: "oa-ready",
      name: "OA Ready",
      description: "Solve 30% of the question bank",
      icon: Shield, iconName: "Shield", rarity: "Rare",
      unlocked: total > 0 && solved >= total * 0.3,
      progress: { current: Math.round((solved / Math.max(total, 1)) * 100), max: 30 },
    },

    // ── Epic
    {
      id: "dsa-ninja",
      name: "DSA Ninja",
      description: "Solve 50+ DSA problems",
      icon: Target, iconName: "Target", rarity: "Epic",
      unlocked: solved >= 50,
      progress: { current: Math.min(solved, 50), max: 50 },
    },
    {
      id: "streak-legend",
      name: "Streak Legend",
      description: "Maintain a 21-day study streak",
      icon: Flame, iconName: "Flame", rarity: "Epic",
      unlocked: streak >= 21,
      progress: { current: Math.min(streak, 21), max: 21 },
    },
    {
      id: "mock-expert",
      name: "Mock Interview Expert",
      description: "Complete 5+ mock tests",
      icon: Brain, iconName: "Brain", rarity: "Epic",
      unlocked: mocksDone >= 5,
      progress: { current: Math.min(mocksDone, 5), max: 5 },
    },
    {
      id: "focus-champion",
      name: "Focus Champion",
      description: "Log 300+ total focus minutes",
      icon: Clock, iconName: "Clock", rarity: "Epic",
      unlocked: totalFocusMin >= 300,
      progress: { current: Math.min(totalFocusMin, 300), max: 300 },
    },
    {
      id: "consistent-scholar",
      name: "Consistent Scholar",
      description: "Study on 30+ different days",
      icon: CheckCircle2, iconName: "CheckCircle2", rarity: "Epic",
      unlocked: studyDays >= 30,
      progress: { current: Math.min(studyDays, 30), max: 30 },
    },
    {
      id: "century-xp",
      name: "Century Club",
      description: "Earn 1000+ XP",
      icon: Zap, iconName: "Zap", rarity: "Epic",
      unlocked: xp >= 1000,
      progress: { current: Math.min(xp, 1000), max: 1000 },
    },

    // ── Legendary
    {
      id: "graph-master",
      name: "Graph Master",
      description: "Solve 100+ problems and maintain a 30-day streak",
      icon: Award, iconName: "Award", rarity: "Legendary",
      unlocked: solved >= 100 && streak >= 30,
      progress: { current: Math.min(solved, 100), max: 100 },
    },
    {
      id: "placement-champion",
      name: "Placement Champion",
      description: "Solve 75%+ of the question bank",
      icon: Trophy, iconName: "Trophy", rarity: "Legendary",
      unlocked: total > 0 && solved >= total * 0.75,
      progress: { current: Math.round((solved / Math.max(total, 1)) * 100), max: 75 },
    },
    {
      id: "iron-will",
      name: "Iron Will",
      description: "Maintain a 60-day streak",
      icon: Flame, iconName: "Flame", rarity: "Legendary",
      unlocked: streak >= 60,
      progress: { current: Math.min(streak, 60), max: 60 },
    },
    {
      id: "xp-legend",
      name: "XP Legend",
      description: "Earn 5000+ total XP",
      icon: Star, iconName: "Star", rarity: "Legendary",
      unlocked: xp >= 5000,
      progress: { current: Math.min(xp, 5000), max: 5000 },
    },
  ];
}
