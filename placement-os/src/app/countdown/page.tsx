"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import {
  Calendar,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Clock,
  ChevronRight,
  TrendingUp,
  X,
  Target,
  Edit2
} from "lucide-react";
import { format } from "date-fns";

// Difference calculator
function getTimeRemaining(targetDateStr: string) {
  const target = new Date(`${targetDateStr}T00:00:00`);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const seconds = Math.floor((diffMs / 1000) % 60);
  const minutes = Math.floor((diffMs / 1000 / 60) % 60);
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return { total: diffMs, days, hours, minutes, seconds };
}

export default function CountdownPage() {
  const { countdownGoals, addCountdownGoal, updateCountdownGoal, deleteCountdownGoal, toggleMilestone } = useProgressStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newMilestonesText, setNewMilestonesText] = useState("");

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editMilestonesText, setEditMilestonesText] = useState("");

  // Live timer tick state
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    const milestones = newMilestonesText
      .split("\n")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    addCountdownGoal({
      title: newTitle,
      targetDate: newDate,
      milestones,
    });

    setNewTitle("");
    setNewDate("");
    setNewMilestonesText("");
    setShowAddForm(false);
  };

  return (
    <AppShell title="Countdown Anchor" subtitle="Sync milestones to targets">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Countdown & Target Anchors"
          description="Keep your sights locked on company timelines, hackathons, and placement seasons."
        />
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center gap-1.5 self-start md:self-auto py-2.5 px-4"
        >
          <Plus className="h-4 w-4" />
          Add Target Anchor
        </button>
      </div>

      {/* Goal Add Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setShowAddForm(false)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddForm(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-400" /> Create Target Anchor
            </h3>

            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Anchor Title</label>
                <input
                  type="text"
                  placeholder="e.g., Google Summer OA, Placement Season 2026"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Target Date</label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  Milestones (one per line)
                </label>
                <textarea
                  placeholder="e.g.&#10;Solve 50 graph problems&#10;Optimize portfolio website&#10;Schedule 3 mock interviews"
                  value={newMilestonesText}
                  onChange={(e) => setNewMilestonesText(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3 mt-2 font-bold uppercase tracking-wide">
                Establish Anchor
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Countdown Goal Cards */}
      <div className="space-y-6">
        {countdownGoals.map((g) => {
          const rem = getTimeRemaining(g.targetDate);
          const totalMilestones = g.milestones.length;
          const completedMilestones = g.milestones.filter((m) => m.completed).length;
          const pct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;
          const isExpired = rem.total <= 0;

          return (
            <GlassCard key={g.id} className="relative overflow-hidden p-6 md:p-8" hover={false}>
              <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
                {/* Info and Ticker */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/40 border border-cyan-850 text-cyan-400 shrink-0">
                      <Target className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white">{g.title}</h3>
                      <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        Target Date: {format(new Date(`${g.targetDate}T00:00:00`), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  {/* Monospace Countdown Ticker */}
                  {!isExpired ? (
                    <div className="flex gap-2 items-center font-mono text-zinc-300">
                      <div className="bg-zinc-900/60 border border-zinc-900 px-3.5 py-2 rounded-xl text-center min-w-16">
                        <span className="block text-2xl font-bold text-cyan-400">{rem.days}</span>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500">Days</span>
                      </div>
                      <div className="text-zinc-600 font-bold text-lg">:</div>
                      <div className="bg-zinc-900/60 border border-zinc-900 px-3.5 py-2 rounded-xl text-center min-w-16">
                        <span className="block text-2xl font-bold text-zinc-300">
                          {rem.hours.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500">Hrs</span>
                      </div>
                      <div className="text-zinc-600 font-bold text-lg">:</div>
                      <div className="bg-zinc-900/60 border border-zinc-900 px-3.5 py-2 rounded-xl text-center min-w-16">
                        <span className="block text-2xl font-bold text-zinc-300">
                          {rem.minutes.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500">Min</span>
                      </div>
                      <div className="text-zinc-600 font-bold text-lg">:</div>
                      <div className="bg-zinc-900/60 border border-zinc-900 px-3.5 py-2 rounded-xl text-center min-w-16">
                        <span className="block text-2xl font-bold text-zinc-400">
                          {rem.seconds.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-zinc-500">Sec</span>
                      </div>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-red-500/20 bg-red-950/10 text-xs font-semibold text-red-400">
                      <Clock className="h-4 w-4" />
                      Target Timeline Reached (Season Commenced)
                    </div>
                  )}
                </div>

                {/* Milestones checklists */}
                <div className="lg:w-96 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-zinc-400 flex items-center gap-1">
                        <TrendingUp className="h-3.5 w-3.5 text-cyan-400" /> Milestone Readiness
                      </span>
                      <span className="font-mono font-bold text-cyan-400">{pct}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-900">
                      <div
                        className="h-full bg-cyan-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-2">
                    {g.milestones.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => toggleMilestone(g.id, idx)}
                        className="w-full flex items-start gap-2.5 text-left rounded-lg p-2 hover:bg-zinc-900/40 text-xs transition-colors"
                      >
                        {m.completed ? (
                          <CheckSquare className="h-4.5 w-4.5 text-cyan-400 shrink-0" />
                        ) : (
                          <Square className="h-4.5 w-4.5 text-zinc-600 shrink-0" />
                        )}
                        <span className={m.completed ? "line-through text-zinc-500" : "text-zinc-300"}>
                          {m.text}
                        </span>
                      </button>
                    ))}
                    {totalMilestones === 0 && (
                      <p className="text-zinc-600 text-xs italic p-2 text-center">No milestones added yet.</p>
                    )}
                  </div>
                </div>

                {/* Edit & Delete Controls */}
                <div className="flex gap-1.5 justify-end lg:self-start lg:pt-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingGoalId(g.id);
                      setEditTitle(g.title);
                      setEditDate(g.targetDate);
                      setEditMilestonesText(g.milestones.map((m) => m.text).join("\n"));
                    }}
                    className="rounded-lg p-2 text-zinc-500 hover:text-cyan-400 hover:bg-cyan-950/10 border border-transparent hover:border-cyan-950/20 transition-all"
                    title="Edit Goal"
                  >
                    <Edit2 className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove countdown goal "${g.title}"?`)) {
                        deleteCountdownGoal(g.id);
                      }
                    }}
                    className="rounded-lg p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/10 border border-transparent hover:border-rose-950/20 transition-all"
                    title="Delete Goal"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}

        {countdownGoals.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-900 rounded-2xl">
            <Target className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-zinc-300 font-bold text-sm">No Active Target Anchors</h3>
            <p className="text-zinc-500 text-xs mt-1">Setup milestones and timers for your dream companies today.</p>
          </div>
        )}
      </div>

      {/* Goal Edit Modal */}
      {editingGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setEditingGoalId(null)}
          />
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl z-10">
            <button
              onClick={() => setEditingGoalId(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-400" /> Edit Target Anchor
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!editTitle.trim() || !editDate) return;
                const originalGoal = countdownGoals.find((g) => g.id === editingGoalId);
                if (!originalGoal) return;

                const lines = editMilestonesText.split("\n").map((l) => l.trim()).filter(Boolean);
                const updatedMilestones = lines.map((text) => {
                  const existing = originalGoal.milestones.find((m) => m.text === text);
                  return {
                    text,
                    completed: existing ? existing.completed : false,
                  };
                });

                updateCountdownGoal(editingGoalId, {
                  title: editTitle,
                  targetDate: editDate,
                  milestones: updatedMilestones,
                });
                setEditingGoalId(null);
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Anchor Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">Target Date</label>
                <input
                  type="date"
                  required
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400">
                  Milestones (one per line)
                </label>
                <textarea
                  value={editMilestonesText}
                  onChange={(e) => setEditMilestonesText(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3 mt-2 font-bold uppercase tracking-wide">
                Update Anchor Detail
              </button>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
