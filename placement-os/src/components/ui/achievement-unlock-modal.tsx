"use client";
 
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Award,
  ShieldCheck,
  Flame,
  Star,
  Zap,
  X,
  Sparkles,
  Timer,
  Cpu,
  GitMerge,
  ListTodo,
  Moon,
  Sun,
  BookOpen,
  UserCheck,
  Terminal,
  Brain
} from "lucide-react";
import { useProgressStore } from "@/lib/progress-store";
import { cn } from "@/lib/utils";
import { Portal } from "./portal";
 
export const ACHIEVEMENT_DETAILS: Record<string, {
  name: string;
  desc: string;
  icon: any;
  color: string;
  glow: string;
  rarity: string;
  badgeStyle: string;
}> = {
  // === DSA BADGES ===
  first_solve: {
    name: "First Solve",
    desc: "Marked 1 problem as solved in your tracking dashboard",
    icon: Trophy,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  array_apprentice: {
    name: "Array Apprentice",
    desc: "Solved 5+ Array problems successfully",
    icon: Award,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  sliding_window_ninja: {
    name: "Sliding Window Ninja",
    desc: "Solved 3+ Sliding Window problems successfully",
    icon: Award,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  binary_search_specialist: {
    name: "Binary Search Specialist",
    desc: "Solved 3+ Binary Search problems successfully",
    icon: Award,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  greedy_strategist: {
    name: "Greedy Strategist",
    desc: "Solved 4+ Greedy algorithm problems successfully",
    icon: Award,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  graph_master: {
    name: "Graph Master",
    desc: "Solved 5+ Graph problems successfully",
    icon: GitMerge,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  tree_architect: {
    name: "Tree Architect",
    desc: "Solved 6+ Tree or BST problems successfully",
    icon: Star,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  dsa_50: {
    name: "50 Problems Solved",
    desc: "Successfully solved 50 coding problems",
    icon: Award,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  dsa_100: {
    name: "100 Problems Solved",
    desc: "Successfully solved 100 coding problems",
    icon: ShieldCheck,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  dp_expert: {
    name: "DP Expert",
    desc: "Solved 5+ Dynamic Programming problems successfully",
    icon: Cpu,
    color: "text-pink-500",
    glow: "rgba(236, 72, 153, 0.35)",
    rarity: "Legendary",
    badgeStyle: "text-pink-400 border-pink-500/40 bg-pink-500/15 shadow-[0_0_15px_rgba(236,72,153,0.2)]",
  },
  dsa_500: {
    name: "500 Problems Solved",
    desc: "A true DSA Master! Solved 500 coding problems",
    icon: Trophy,
    color: "text-pink-500",
    glow: "rgba(236, 72, 153, 0.35)",
    rarity: "Legendary",
    badgeStyle: "text-pink-400 border-pink-500/40 bg-pink-500/15 shadow-[0_0_15px_rgba(236,72,153,0.2)]",
  },

  // === STREAK BADGES ===
  streak_3: {
    name: "3-Day Streak",
    desc: "Kept the fire burning for 3 consecutive days",
    icon: Flame,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  never_missed_monday: {
    name: "Never Missed Monday",
    desc: "Crushed tasks on Monday for two consecutive weeks",
    icon: Award,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  streak_7: {
    name: "7-Day Streak",
    desc: "Maintained a 7-day study consistency streak",
    icon: Flame,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  streak_guardian: {
    name: "Streak Guardian",
    desc: "Protected and held your consistency streak for 7 days",
    icon: ShieldCheck,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  streak_14: {
    name: "14-Day Streak",
    desc: "Two full weeks of relentless daily progress!",
    icon: Flame,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  consistency_king: {
    name: "Consistency King",
    desc: "Logged study activity for 15 days total in your logs",
    icon: Star,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  streak_30: {
    name: "30-Day Streak",
    desc: "Unstoppable! Reached a 30-day streak",
    icon: Flame,
    color: "text-pink-500",
    glow: "rgba(236, 72, 153, 0.35)",
    rarity: "Legendary",
    badgeStyle: "text-pink-400 border-pink-500/40 bg-pink-500/15 shadow-[0_0_15px_rgba(236,72,153,0.2)]",
  },

  // === FOCUS MODE BADGES ===
  deep_work_rookie: {
    name: "Deep Work Rookie",
    desc: "Completed your first deep work focus session (25 mins)",
    icon: Timer,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  first_focus: {
    name: "First Focus Session",
    desc: "Completed your first deep work focus session",
    icon: Timer,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  focus_champion: {
    name: "Focus Champion",
    desc: "Completed 5+ focused study sessions",
    icon: Star,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  focus_warrior: {
    name: "Focus Warrior",
    desc: "Accumulated 150+ minutes of deep focus mode",
    icon: Zap,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  deep_work_beast: {
    name: "Deep Work Beast",
    desc: "Completed 15+ focused study sessions",
    icon: Zap,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  focus_10hr: {
    name: "10-Hour Grinder",
    desc: "Accumulated 10 hours (600 mins) of focus mode sessions",
    icon: Trophy,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  marathon_focus_beast: {
    name: "Marathon Focus Beast",
    desc: "Accumulated 20 hours (1200 mins) of focus mode sessions",
    icon: Trophy,
    color: "text-pink-500",
    glow: "rgba(236, 72, 153, 0.35)",
    rarity: "Legendary",
    badgeStyle: "text-pink-400 border-pink-500/40 bg-pink-500/15 shadow-[0_0_15px_rgba(236,72,153,0.2)]",
  },

  // === MOCK INTERVIEW BADGES ===
  mock_starter: {
    name: "Mock Starter",
    desc: "Completed your first mock interview simulation",
    icon: Terminal,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  hr_survivor: {
    name: "HR Survivor",
    desc: "Completed your first behavioral HR mock interview",
    icon: UserCheck,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  hr_master: {
    name: "HR Round Master",
    desc: "Completed your first behavioral HR mock interview",
    icon: UserCheck,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  frontend_pro: {
    name: "Frontend Interview Pro",
    desc: "Completed your first frontend mock interview round",
    icon: Award,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  frontend_wizard: {
    name: "Frontend Wizard",
    desc: "Scored 80%+ on a Frontend mock interview simulation",
    icon: Award,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  system_design_challenger: {
    name: "System Design Challenger",
    desc: "Completed a System Design mock interview successfully",
    icon: Award,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  dsa_interview_cracker: {
    name: "DSA Interview Cracker",
    desc: "Scored 85%+ on a DSA technical mock interview round",
    icon: ShieldCheck,
    color: "text-pink-500",
    glow: "rgba(236, 72, 153, 0.35)",
    rarity: "Legendary",
    badgeStyle: "text-pink-400 border-pink-500/40 bg-pink-500/15 shadow-[0_0_15px_rgba(236,72,153,0.2)]",
  },

  // === PRODUCTIVITY BADGES ===
  night_owl: {
    name: "Night Owl",
    desc: "Solved a problem or studied between 11 PM and 4 AM",
    icon: Moon,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  early_starter: {
    name: "Early Starter",
    desc: "Solved a problem or studied between 4 AM and 8 AM",
    icon: Sun,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  revision_warrior: {
    name: "Revision Warrior",
    desc: "Completed 5+ problem revisions",
    icon: BookOpen,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  planner_master: {
    name: "Planner Master",
    desc: "Completed 5+ daily planning checklist blocks",
    icon: ListTodo,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  weekly_dominator: {
    name: "Weekly Dominator",
    desc: "Completed all sprint items for 3 weeks in the strategy planner",
    icon: BookOpen,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  deadline_crusher: {
    name: "Deadline Crusher",
    desc: "Completed 3+ countdown goal milestones on time",
    icon: ShieldCheck,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },

  // === ROADMAP BADGES ===
  goal_setter: {
    name: "Goal Setter",
    desc: "Created at least 1 custom countdown goal in your roadmap",
    icon: Star,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  milestone_crusher: {
    name: "Milestone Crusher",
    desc: "Completed at least 1 countdown goal milestone",
    icon: ShieldCheck,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  roadmap_architect: {
    name: "Roadmap Architect",
    desc: "Created at least 3 custom countdown goals",
    icon: Star,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },

  // === MCQ ARENA BADGES ===
  mcq_beginner: {
    name: "MCQ Beginner",
    desc: "Attempted your first multiple-choice question in the MCQ Arena",
    icon: Brain,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  mcq_explorer: {
    name: "MCQ Explorer",
    desc: "Attempted 20+ multiple-choice questions in the MCQ Arena",
    icon: Brain,
    color: "text-zinc-400",
    glow: "rgba(161, 161, 170, 0.15)",
    rarity: "Common",
    badgeStyle: "text-zinc-300 border-zinc-500/30 bg-zinc-500/10",
  },
  mcq_specialist: {
    name: "MCQ Specialist",
    desc: "Attempted 50+ multiple-choice questions in the MCQ Arena",
    icon: Brain,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  mcq_master: {
    name: "MCQ Master",
    desc: "Attempted 100+ multiple-choice questions in the MCQ Arena",
    icon: Trophy,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  mcq_100_correct: {
    name: "MCQ Centurion",
    desc: "Answered 100+ multiple-choice questions correctly",
    icon: Award,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  mcq_500_correct: {
    name: "MCQ Gladiator",
    desc: "Answered 500+ multiple-choice questions correctly",
    icon: Trophy,
    color: "text-amber-400",
    glow: "rgba(251, 191, 36, 0.30)",
    rarity: "Legendary",
    badgeStyle: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },
  oa_warrior: {
    name: "OA Warrior",
    desc: "Completed 3+ Company Online Assessments",
    icon: Zap,
    color: "text-amber-400",
    glow: "rgba(251, 191, 36, 0.30)",
    rarity: "Legendary",
    badgeStyle: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  },

  // === OTHERS / LEGACY ===
  pattern_builder: {
    name: "Pattern Builder",
    desc: "Solved 10 algorithmic problems across different patterns",
    icon: Award,
    color: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.20)",
    rarity: "Rare",
    badgeStyle: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  oa_ready: {
    name: "OA Ready",
    desc: "Completed 30% of your total placement question bank",
    icon: ShieldCheck,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  level_5: {
    name: "Level 5+",
    desc: "Reached builder level 5 based on XP earned",
    icon: Star,
    color: "text-indigo-400",
    glow: "rgba(99, 102, 241, 0.25)",
    rarity: "Epic",
    badgeStyle: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
  },
  century: {
    name: "Century",
    desc: "Accumulated 1000+ XP in your overall profile",
    icon: Zap,
    color: "text-pink-500",
    glow: "rgba(236, 72, 153, 0.35)",
    rarity: "Legendary",
    badgeStyle: "text-pink-400 border-pink-500/40 bg-pink-500/15 shadow-[0_0_15px_rgba(236,72,153,0.2)]",
  },
};
 
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

export function AchievementUnlockModal() {
  const { pendingAchievementsQueue, clearRecentUnlock, energyMode } = useProgressStore();
  
  // Read first item in queue
  const currentUnlock = pendingAchievementsQueue && pendingAchievementsQueue.length > 0 ? pendingAchievementsQueue[0] : null;
  const details = currentUnlock ? ACHIEVEMENT_DETAILS[currentUnlock] : null;
  
  const [particles, setParticles] = useState<Particle[]>([]);

  // Generate particles on unlock
  useEffect(() => {
    if (currentUnlock && energyMode !== "low") {
      const colors = ["#22d3ee", "#6366f1", "#ec4899", "#f59e0b", "#10b981", "#ef4444"];
      const newParticles: Particle[] = Array.from({ length: 30 }).map((_, idx) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 80 + Math.random() * 120;
        return {
          id: idx,
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 6,
          delay: Math.random() * 0.2,
        };
      });
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [currentUnlock, energyMode]);

  // Auto-dismiss logic
  useEffect(() => {
    if (currentUnlock) {
      const timer = setTimeout(() => {
        clearRecentUnlock();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [currentUnlock, clearRecentUnlock]);
 
  const IconComponent = details?.icon;
  const isLowEnergy = energyMode === "low";

  return (
    <Portal>
      <AnimatePresence>
        {currentUnlock && details && IconComponent && (
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
            {/* Particle animations stylesheet */}
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes particle-burst-anim {
                0% {
                  transform: translate(0, 0) scale(1);
                  opacity: 1;
                }
                100% {
                  transform: translate(var(--p-x), var(--p-y)) scale(0);
                  opacity: 0;
                }
              }
              @keyframes border-glow-pulsate {
                0%, 100% {
                  box-shadow: 0 4px 30px rgba(0,0,0,0.6), 0 0 15px var(--glow-color);
                  border-color: var(--border-glow-color);
                }
                50% {
                  box-shadow: 0 4px 30px rgba(0,0,0,0.6), 0 0 35px var(--glow-color);
                  border-color: var(--border-glow-active);
                }
              }
            `}} />

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={clearRecentUnlock}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
     
            {/* Modal container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center shadow-2xl"
              style={
                !isLowEnergy
                  ? {
                      animation: "border-glow-pulsate 3s infinite ease-in-out",
                      "--glow-color": details.glow.replace("0.25", "0.15").replace("0.35", "0.20"),
                      "--border-glow-color": details.rarity === "Legendary" ? "rgba(236,72,153,0.4)" : details.rarity === "Epic" ? "rgba(99,102,241,0.3)" : details.rarity === "Rare" ? "rgba(34,211,238,0.3)" : "rgba(63,63,70,0.4)",
                      "--border-glow-active": details.rarity === "Legendary" ? "rgba(236,72,153,0.7)" : details.rarity === "Epic" ? "rgba(99,102,241,0.6)" : details.rarity === "Rare" ? "rgba(34,211,238,0.6)" : "rgba(63,63,70,0.7)",
                    } as any
                  : undefined
              }
            >
              {/* Close button */}
              <button
                onClick={clearRecentUnlock}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
     
              {/* Rotating ambient glow */}
              {!isLowEnergy && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-72 h-72 rounded-full filter blur-[60px] opacity-35 mix-blend-screen"
                  style={{
                    background: `radial-gradient(circle, ${details.glow} 0%, transparent 70%)`
                  }}
                />
              )}
     
              {/* Confetti Particles Burst */}
              {!isLowEnergy && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {particles.map((p) => (
                    <div
                      key={p.id}
                      className="absolute rounded-full"
                      style={{
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        "--p-x": `${p.x}px`,
                        "--p-y": `${p.y}px`,
                        animation: `particle-burst-anim 1.2s ease-out ${p.delay}s forwards`,
                      } as any}
                    />
                  ))}
                </div>
              )}

              {/* Sparkles / confetti effect wrapper */}
              <div className="flex justify-center mb-6 relative">
                {!isLowEnergy && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className={cn(
                      "absolute -inset-4 rounded-full border border-dashed",
                      details.rarity === "Legendary" ? "border-pink-500/20" : details.rarity === "Epic" ? "border-indigo-500/20" : details.rarity === "Rare" ? "border-cyan-500/20" : "border-zinc-500/10"
                    )}
                  />
                )}
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 shadow-inner"
                >
                  <IconComponent className={`h-10 w-10 ${details.color} ${!isLowEnergy && "animate-pulse"}`} />
                  <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-yellow-400 animate-bounce" />
                </motion.div>
              </div>
     
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${details.badgeStyle}`}>
                  {details.rarity} Achievement
                </span>
     
                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  Achievement Unlocked!
                </h2>
                
                <p className="text-xl font-bold text-cyan-400">
                  {details.name}
                </p>
     
                <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                  {details.desc}
                </p>
     
                <div className="pt-4 flex flex-col gap-2 items-center justify-center">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest">Reward Unlocked</span>
                  <div className="flex items-center gap-1 bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full text-cyan-300 font-mono text-sm font-semibold">
                    <span>+100 XP</span>
                    <span className="text-[10px] text-cyan-400/70">Bonus</span>
                  </div>
                </div>
     
                <button
                  onClick={clearRecentUnlock}
                  className="btn-primary mt-6 w-full py-2.5 font-bold uppercase tracking-wider"
                >
                  {pendingAchievementsQueue.length > 1 ? "Next Unlock! 🚀" : "Awesome, Let's Go!"}
                </button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
