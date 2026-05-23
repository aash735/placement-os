"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import {
  Battery, BatteryLow, CheckCircle2, Circle, Moon,
  Zap, RefreshCw, Flame, Heart, Coffee
} from "lucide-react";

// ─── Task definitions ─────────────────────────────────────────────────────────

interface LowEnergyTask {
  id: string;
  text: string;
  xp: number;
  category: "review" | "practice" | "organize" | "recharge";
  icon: React.ElementType;
  duration: string;
}

const LOW_ENERGY_TASKS: LowEnergyTask[] = [
  {
    id: "le-1", text: "Re-read 1 problem you solved before",
    xp: 10, category: "review", icon: RefreshCw, duration: "10 min",
  },
  {
    id: "le-2", text: "Do 3 easy aptitude questions (no pressure)",
    xp: 15, category: "practice", icon: Zap, duration: "10 min",
  },
  {
    id: "le-3", text: "Update or improve 1 resume bullet point",
    xp: 10, category: "organize", icon: CheckCircle2, duration: "10 min",
  },
  {
    id: "le-4", text: "Watch 1 visual DSA pattern explanation",
    xp: 20, category: "review", icon: Moon, duration: "15 min",
  },
  {
    id: "le-5", text: "Organize your notes — no new content",
    xp: 10, category: "organize", icon: Heart, duration: "10 min",
  },
  {
    id: "le-6", text: "Read someone else's clean solution for 1 solved problem",
    xp: 15, category: "review", icon: RefreshCw, duration: "12 min",
  },
  {
    id: "le-7", text: "Write your top-3 DSA patterns in your own words",
    xp: 20, category: "organize", icon: CheckCircle2, duration: "10 min",
  },
  {
    id: "le-8", text: "Take a 5-minute walk, then open 1 solved problem",
    xp: 5, category: "recharge", icon: Coffee, duration: "15 min",
  },
];

const CATEGORY_CONFIG = {
  review:    { color: "text-violet-400",  bg: "bg-violet-500/8",  border: "border-violet-500/15",  label: "Review" },
  practice:  { color: "text-cyan-400",    bg: "bg-cyan-500/8",    border: "border-cyan-500/15",    label: "Practice" },
  organize:  { color: "text-amber-400",   bg: "bg-amber-500/8",   border: "border-amber-500/15",   label: "Organize" },
  recharge:  { color: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/15", label: "Recharge" },
};

const STORAGE_KEY = "placement-os-low-energy-v1";

function loadChecked(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const { date, ids } = JSON.parse(raw);
    // Reset daily
    const today = new Date().toISOString().slice(0, 10);
    if (date !== today) return new Set();
    return new Set(ids);
  } catch { return new Set(); }
}

function saveChecked(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      ids: [...ids],
    }));
  } catch { /* ignore */ }
}

export default function LowEnergyPage() {
  const setEnergyMode = useProgressStore((s) => s.setEnergyMode);
  const energyMode    = useProgressStore((s) => s.energyMode);
  const addXp         = useProgressStore((s) => s.addXp);


  const [checked, setChecked] = useState<Set<string>>(() => loadChecked());
  const [modeActive, setModeActive] = useState(() => energyMode === "low");

  useEffect(() => {
    setModeActive(energyMode === "low");
  }, [energyMode]);

  const toggleTask = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        const task = LOW_ENERGY_TASKS.find((t) => t.id === id);
        if (task) addXp(task.xp);
      }
      saveChecked(next);
      return next;
    });
  };

  const enableMode = () => {
    setEnergyMode("low");
    setModeActive(true);
  };

  const disableMode = () => {
    setEnergyMode("normal");
    setModeActive(false);
  };

  const totalXp = LOW_ENERGY_TASKS.filter((t) => checked.has(t.id)).reduce((s, t) => s + t.xp, 0);
  const completedCount = checked.size;
  const totalTasks = LOW_ENERGY_TASKS.length;
  const progress = Math.round((completedCount / totalTasks) * 100);

  return (
    <AppShell title="Low-Energy Mode" subtitle="Momentum > intensity · Streak preserved">
      <PageHeader
        title="Low-Energy Study"
        description="Micro-wins keep your streak alive. Pick 2–3 tasks that feel doable today."
      />

      {/* Mode toggle banner */}
      <div
        className={`rounded-2xl border p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between transition-all duration-500 ${
          modeActive
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-white/10 bg-white/3"
        }`}
      >
        <div className="flex items-center gap-3">
          {modeActive
            ? <BatteryLow className="h-5 w-5 text-amber-400 shrink-0" />
            : <Battery className="h-5 w-5 text-zinc-500 shrink-0" />
          }
          <div>
            <p className="text-sm font-bold text-white">
              {modeActive ? "Low-Energy Mode Active" : "Normal Mode"}
            </p>
            <p className="text-xs text-zinc-500">
              {modeActive
                ? "Reduced expectations · streak-safe · focus on light wins"
                : "Enable when you're drained or overwhelmed"
              }
            </p>
          </div>
        </div>
        <button
          onClick={modeActive ? disableMode : enableMode}
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
            modeActive
              ? "bg-white/5 border-white/15 text-zinc-400 hover:text-white hover:border-white/25"
              : "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
          }`}
          id="low-energy-toggle-btn"
        >
          {modeActive ? "Return to Normal" : "Enable Low-Energy Mode"}
        </button>
      </div>

      {/* Progress summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <GlassCard className="p-4 text-center" hover={false}>
          <p className="text-2xl font-bold text-cyan-400">{completedCount}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Done Today</p>
        </GlassCard>
        <GlassCard className="p-4 text-center" hover={false}>
          <p className="text-2xl font-bold text-violet-400">+{totalXp}</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">XP Earned</p>
        </GlassCard>
        <GlassCard className="p-4 text-center" hover={false}>
          <p className="text-2xl font-bold text-amber-400">{progress}%</p>
          <p className="text-[10px] text-zinc-500 mt-0.5">Progress</p>
        </GlassCard>
      </div>

      {/* Overall progress bar */}
      {completedCount > 0 && (
        <div className="mb-5 px-1">
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="text-center text-xs text-emerald-400 font-bold mt-2 animate-pulse">
              🎉 All tasks done! Streak is safe. Rest now.
            </p>
          )}
        </div>
      )}

      {/* Motivational reminder */}
      <GlassCard className="p-4 mb-5 border-violet-500/15 bg-violet-500/5" hover={false}>
        <div className="flex items-start gap-3">
          <Flame className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">Momentum &gt; Intensity</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Completing even 1 task today keeps your streak alive and your brain in motion.
              A low-energy day today means a stronger day tomorrow.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Task list */}
      <div className="space-y-2">
        {LOW_ENERGY_TASKS.map((task, i) => {
          const done = checked.has(task.id);
          const catConfig = CATEGORY_CONFIG[task.category];
          const Icon = task.icon;

          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 group ${
                done
                  ? "border-emerald-500/20 bg-emerald-500/5 opacity-70"
                  : "border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15"
              }`}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Check indicator */}
              <div className="shrink-0 transition-all duration-200">
                {done
                  ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  : <Circle className="h-5 w-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                }
              </div>

              {/* Task icon */}
              <div className={`shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${catConfig.bg} ${catConfig.border} border`}>
                <Icon className={`h-3.5 w-3.5 ${catConfig.color}`} />
              </div>

              {/* Task content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${done ? "line-through text-zinc-500" : "text-white"}`}>
                  {task.text}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-semibold ${catConfig.color}`}>{catConfig.label}</span>
                  <span className="text-[10px] text-zinc-600">·</span>
                  <span className="text-[10px] text-zinc-600">{task.duration}</span>
                </div>
              </div>

              {/* XP badge */}
              <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                done
                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  : "text-zinc-500 bg-white/5 border-white/10"
              }`}>
                +{task.xp} XP
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-zinc-700 mt-6">
        Tasks reset daily · XP is immediately added to your profile
      </p>
    </AppShell>
  );
}
