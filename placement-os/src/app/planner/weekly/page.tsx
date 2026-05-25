"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useDataStore } from "@/store/data-store";
import { useProgressStore } from "@/lib/progress-store";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  PlusCircle,
  Calendar,
  Clock,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WeeklyReviewPage() {
  const {
    customWeeklyPlan,
    setWeeklyPlan,
    updateWeeklyWeek,
    addWeeklyTask,
    removeWeeklyTask,
    updateWeeklyTask,
    addWeeklyWeek,
    deleteWeeklyWeek
  } = useProgressStore();

  const staticWeeklyPlan = useDataStore((s) => s.data?.weeklyPlan ?? []);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Initialize from sheet data if custom plan is empty after client hydration completes
  useEffect(() => {
    if (hasHydrated && customWeeklyPlan.length === 0 && staticWeeklyPlan.length > 0) {
      setWeeklyPlan(staticWeeklyPlan);
    }
  }, [hasHydrated, customWeeklyPlan, staticWeeklyPlan, setWeeklyPlan]);

  if (!hasHydrated) {
    return (
      <AppShell title="Weekly Strategy Review" subtitle="Loading strategy sprint details...">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
          <span className="ml-3 text-zinc-450">Loading strategy sprint...</span>
        </div>
      </AppShell>
    );
  }

  // Edit states
  const [editingWeekNum, setEditingWeekNum] = useState<number | null>(null);
  const [editFocus, setEditFocus] = useState("");
  const [editHours, setEditHours] = useState("");

  // New task input state per week
  const [newTaskTexts, setNewTaskTexts] = useState<Record<number, string>>({});

  // Editing single task state
  const [editingTaskKey, setEditingTaskKey] = useState<{ weekNum: number; idx: number } | null>(null);
  const [editTaskVal, setEditTaskVal] = useState("");

  // Add week form state
  const [showAddWeekForm, setShowAddWeekForm] = useState(false);
  const [newWeekNum, setNewWeekNum] = useState(customWeeklyPlan.length + 1);
  const [newWeekFocus, setNewWeekFocus] = useState("");
  const [newWeekHours, setNewWeekHours] = useState("10-15 hrs/week");

  const startEditingWeek = (weekNum: number, focus: string, hours: string) => {
    setEditingWeekNum(weekNum);
    setEditFocus(focus);
    setEditHours(hours);
  };

  const saveWeekEdit = (weekNum: number) => {
    updateWeeklyWeek(weekNum, editFocus.trim(), editHours.trim());
    setEditingWeekNum(null);
  };

  const handleAddTask = (weekNum: number) => {
    const text = newTaskTexts[weekNum]?.trim();
    if (!text) return;
    addWeeklyTask(weekNum, text);
    setNewTaskTexts((prev) => ({ ...prev, [weekNum]: "" }));
  };

  const startEditingTask = (weekNum: number, idx: number, val: string) => {
    setEditingTaskKey({ weekNum, idx });
    setEditTaskVal(val);
  };

  const saveTaskEdit = () => {
    if (!editingTaskKey) return;
    const { weekNum, idx } = editingTaskKey;
    if (editTaskVal.trim()) {
      updateWeeklyTask(weekNum, idx, editTaskVal.trim());
    } else {
      removeWeeklyTask(weekNum, idx);
    }
    setEditingTaskKey(null);
  };

  const handleAddWeekSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeekFocus.trim()) return;

    // Check if week already exists
    if (customWeeklyPlan.some((w) => w.week === newWeekNum)) {
      alert(`Week ${newWeekNum} already exists in your plan!`);
      return;
    }

    addWeeklyWeek({
      week: newWeekNum,
      focus: newWeekFocus.trim(),
      hours: newWeekHours.trim(),
      days: [],
    });

    setNewWeekFocus("");
    setNewWeekHours("10-15 hrs/week");
    setNewWeekNum(customWeeklyPlan.length + 2);
    setShowAddWeekForm(false);
  };

  return (
    <AppShell title="Weekly Strategy Review" subtitle="Adapt your syllabus, track outcomes, and iterate dynamically">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <PageHeader
          title="Weekly Review & Roadmap Planner"
          description="Customize your DSA sprint goals, target mock timelines, and allocate revision hours for each milestone."
        />
        <button
          onClick={() => {
            setNewWeekNum(customWeeklyPlan.length > 0 ? Math.max(...customWeeklyPlan.map(w => w.week)) + 1 : 1);
            setShowAddWeekForm(true);
          }}
          className="btn-primary flex items-center gap-1.5 self-start md:self-auto py-2.5 px-4"
        >
          <Plus className="h-4 w-4" />
          Add Week Block
        </button>
      </div>

      {/* Add Week Modal */}
      <AnimatePresence>
        {showAddWeekForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowAddWeekForm(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl z-10"
            >
              <button
                onClick={() => setShowAddWeekForm(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cyan-400" /> Create Weekly Plan Block
              </h3>

              <form onSubmit={handleAddWeekSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5 col-span-1">
                    <label className="text-xs font-semibold text-zinc-400">Week #</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={newWeekNum}
                      onChange={(e) => setNewWeekNum(parseInt(e.target.value) || 1)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-zinc-400">Study Goal / Hours</label>
                    <input
                      type="text"
                      required
                      value={newWeekHours}
                      onChange={(e) => setNewWeekHours(e.target.value)}
                      placeholder="e.g., 12-15 hrs/week"
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Sprint Focus Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dynamic Programming & Graph BFS/DFS"
                    value={newWeekFocus}
                    onChange={(e) => setNewWeekFocus(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full py-3 mt-2 font-bold uppercase tracking-wide">
                  Create Strategy Week
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Week Cards List */}
      <div className="space-y-6">
        {customWeeklyPlan.map((w, index) => {
          const isWeekEditing = editingWeekNum === w.week;
          return (
            <GlassCard
              key={`week-${w.week}-${index}`}
              className="p-6 md:p-8 relative overflow-hidden transition-all duration-300 border border-zinc-800 bg-zinc-950/40"
              hover={false}
            >
              <div className="flex flex-col lg:flex-row gap-6 justify-between lg:items-start">
                
                {/* Week Header Info */}
                <div className="flex-1 space-y-4">
                  {isWeekEditing ? (
                    <div className="space-y-3 max-w-xl">
                      <div className="flex gap-2">
                        <span className="text-cyan-400 font-bold text-lg pt-1.5 shrink-0">Week {w.week}:</span>
                        <input
                          type="text"
                          value={editFocus}
                          onChange={(e) => setEditFocus(e.target.value)}
                          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-bold"
                          placeholder="Week Focus"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                        <input
                          type="text"
                          value={editHours}
                          onChange={(e) => setEditHours(e.target.value)}
                          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
                          placeholder="Recommended Hours"
                        />
                        <button
                          onClick={() => saveWeekEdit(w.week)}
                          className="rounded-lg p-1.5 bg-cyan-950 text-cyan-400 border border-cyan-800/40 hover:bg-cyan-900 hover:text-white transition-all ml-2"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditingWeekNum(null)}
                          className="rounded-lg p-1.5 bg-zinc-900 text-zinc-400 border border-zinc-850 hover:bg-zinc-800 hover:text-white transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-950/40 border border-cyan-850 text-cyan-400 shrink-0">
                          <BookOpen className="h-5 w-5" />
                        </span>
                        <div>
                          <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            Week {w.week}: {w.focus}
                          </h3>
                          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5 font-medium">
                            <Clock className="h-3 w-3 text-cyan-500/80" />
                            Target Hours: {w.hours}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tasks / Days Sprint Detail */}
                <div className="lg:w-[500px] space-y-4">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Sprint Syllabus Checklist</h4>
                  
                  {/* Task List */}
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2">
                    {w.days.map((dayText, idx) => {
                      const isTaskEditing = editingTaskKey?.weekNum === w.week && editingTaskKey?.idx === idx;
                      return (
                        <div
                          key={`task-${w.week}-${idx}`}
                          className="flex items-center justify-between gap-2.5 rounded-lg p-2 bg-zinc-900/20 border border-zinc-900/40 text-xs hover:bg-zinc-900/40 transition-colors"
                        >
                          {isTaskEditing ? (
                            <div className="flex-1 flex gap-1.5 items-center">
                              <input
                                type="text"
                                value={editTaskVal}
                                onChange={(e) => setEditTaskVal(e.target.value)}
                                className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                                autoFocus
                                onKeyDown={(e) => e.key === "Enter" && saveTaskEdit()}
                              />
                              <button
                                onClick={saveTaskEdit}
                                className="text-cyan-400 hover:text-white transition-colors"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingTaskKey(null)}
                                className="text-zinc-500 hover:text-white transition-colors"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="text-zinc-300 leading-relaxed">• {dayText}</span>
                              <div className="flex items-center gap-1 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                                <button
                                  onClick={() => startEditingTask(w.week, idx, dayText)}
                                  className="text-zinc-500 hover:text-cyan-400 p-1"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => removeWeeklyTask(w.week, idx)}
                                  className="text-zinc-500 hover:text-rose-400 p-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}

                    {w.days.length === 0 && (
                      <p className="text-zinc-600 text-xs italic p-3 text-center bg-zinc-900/10 rounded-xl border border-zinc-900/30">
                        No sprint items added. Plan your days below!
                      </p>
                    )}
                  </div>

                  {/* Add Task Input Form */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add sprint item (e.g. Day 1: Solve 3 Graph DFS)..."
                      value={newTaskTexts[w.week] || ""}
                      onChange={(e) => setNewTaskTexts((prev) => ({ ...prev, [w.week]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleAddTask(w.week)}
                      className="flex-1 rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-1.5 text-xs text-white placeholder-zinc-650 focus:border-cyan-500 focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddTask(w.week)}
                      className="rounded-lg p-2 bg-cyan-950 text-cyan-400 border border-cyan-800/30 hover:bg-cyan-500 hover:text-white transition-all"
                      title="Add Sprint Item"
                    >
                      <PlusCircle className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Edit / Delete Week Card Controls */}
                <div className="flex gap-1.5 self-end lg:self-start shrink-0">
                  <button
                    onClick={() => startEditingWeek(w.week, w.focus, w.hours)}
                    disabled={isWeekEditing}
                    className="rounded-lg p-2 text-zinc-500 hover:text-cyan-400 hover:bg-cyan-950/10 border border-transparent hover:border-cyan-950/20 transition-all disabled:opacity-20"
                    title="Edit Week"
                  >
                    <Edit2 className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove Week ${w.week} strategy from planner?`)) {
                        deleteWeeklyWeek(w.week);
                      }
                    }}
                    className="rounded-lg p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/10 border border-transparent hover:border-rose-950/20 transition-all"
                    title="Delete Week"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          );
        })}

        {customWeeklyPlan.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-900 rounded-2xl">
            <BookOpen className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-zinc-300 font-bold text-sm">Your Weekly Planner is Empty</h3>
            <p className="text-zinc-500 text-xs mt-1">Establish your syllabus and track outcomes week-by-week.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
