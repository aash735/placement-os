"use client";

import { useState, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Plus, Target, Trash2, CheckCircle2, Circle,
  ChevronDown, ChevronUp, Flag, Edit3, Save, X,
  Calendar, Clock, Flame, Zap, Trophy, Star
} from "lucide-react";
import { format, differenceInDays, parseISO } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "High" | "Medium" | "Low";
type GoalStatus = "active" | "completed" | "paused";

interface Milestone {
  id: string;
  text: string;
  done: boolean;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  priority: Priority;
  status: GoalStatus;
  focusText: string;
  milestones: Milestone[];
  createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string; border: string; label: string }> = {
  High:   { color: "text-rose-400",    bg: "bg-rose-500/10",    border: "border-rose-500/25",    label: "🔴 High" },
  Medium: { color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/25",   label: "🟡 Medium" },
  Low:    { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/25", label: "🟢 Low" },
};

const STATUS_CONFIG: Record<GoalStatus, { color: string; label: string }> = {
  active:    { color: "text-cyan-400",    label: "Active" },
  completed: { color: "text-emerald-400", label: "Completed" },
  paused:    { color: "text-zinc-500",    label: "Paused" },
};

const EXAMPLE_GOALS: Partial<Goal>[] = [
  { title: "Crack Amazon Internship", priority: "High",   focusText: "Focus on LP + DSA rounds" },
  { title: "Become 5★ on CodeChef",   priority: "Medium", focusText: "1800+ rating target" },
  { title: "Finish Graph Revision",    priority: "High",   focusText: "All BFS/DFS/Dijkstra patterns" },
  { title: "30-Day LeetCode Sprint",   priority: "Medium", focusText: "1 easy + 1 medium daily" },
];

const STORAGE_KEY = "placement-os-goals-v1";

// ─── Persistence helpers ──────────────────────────────────────────────────────

function loadGoals(): Goal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveGoals(goals: Goal[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(goals)); } catch { /* ignore */ }
}

function genId() { return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }
function milestoneId() { return `ms-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`; }

// ─── Empty form state ─────────────────────────────────────────────────────────

const EMPTY_FORM = {
  title: "", description: "", targetDate: "", priority: "High" as Priority,
  focusText: "", milestones: [] as Milestone[],
};

// ─── Subcomponents ────────────────────────────────────────────────────────────

function DaysChip({ targetDate, status }: { targetDate: string; status: GoalStatus }) {
  if (!targetDate || status === "completed") return null;
  const days = differenceInDays(parseISO(targetDate), new Date());
  const overdue = days < 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
      overdue ? "text-rose-400 bg-rose-500/10 border-rose-500/20"
               : days <= 7 ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
               : "text-zinc-400 bg-white/5 border-white/10"
    }`}>
      <Calendar className="h-2.5 w-2.5" />
      {overdue ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today!" : `${days}d left`}
    </span>
  );
}

function ProgressBar({ milestones }: { milestones: Milestone[] }) {
  if (!milestones.length) return null;
  const pct = Math.round((milestones.filter((m) => m.done).length / milestones.length) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-zinc-600">
        <span>{milestones.filter((m) => m.done).length}/{milestones.length} milestones</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function GoalsRoadmapPage() {
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | GoalStatus>("all");

  // Form state
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [newMilestone, setNewMilestone] = useState("");

  const persist = useCallback((updated: Goal[]) => {
    setGoals(updated);
    saveGoals(updated);
  }, []);

  // ── Form actions ────────────────────────────────────────────────────────
  const openCreate = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (goal: Goal) => {
    setForm({
      title: goal.title,
      description: goal.description,
      targetDate: goal.targetDate,
      priority: goal.priority,
      focusText: goal.focusText,
      milestones: [...goal.milestones],
    });
    setEditingId(goal.id);
    setShowForm(true);
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setNewMilestone("");
  };

  const saveGoal = () => {
    if (!form.title.trim()) return;
    if (editingId) {
      persist(goals.map((g) => g.id === editingId ? { ...g, ...form } : g));
    } else {
      const newGoal: Goal = {
        id: genId(),
        status: "active",
        createdAt: new Date().toISOString(),
        ...form,
      };
      persist([newGoal, ...goals]);
    }
    cancelForm();
  };

  const deleteGoal = (id: string) => {
    persist(goals.filter((g) => g.id !== id));
  };

  const toggleStatus = (id: string) => {
    persist(goals.map((g) =>
      g.id === id
        ? { ...g, status: g.status === "completed" ? "active" : "completed" }
        : g
    ));
  };

  const toggleMilestone = (goalId: string, msId: string) => {
    persist(goals.map((g) =>
      g.id === goalId
        ? { ...g, milestones: g.milestones.map((m) => m.id === msId ? { ...m, done: !m.done } : m) }
        : g
    ));
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // ── Form milestone actions ───────────────────────────────────────────────
  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setForm((f) => ({
      ...f,
      milestones: [...f.milestones, { id: milestoneId(), text: newMilestone.trim(), done: false }],
    }));
    setNewMilestone("");
  };

  const removeMilestone = (id: string) => {
    setForm((f) => ({ ...f, milestones: f.milestones.filter((m) => m.id !== id) }));
  };

  // ── Computed ─────────────────────────────────────────────────────────────
  const filtered = goals.filter((g) => filter === "all" || g.status === filter);
  const activeCount = goals.filter((g) => g.status === "active").length;
  const completedCount = goals.filter((g) => g.status === "completed").length;
  const highPriorityCount = goals.filter((g) => g.priority === "High" && g.status === "active").length;

  const useExample = (ex: Partial<Goal>) => {
    setForm({
      ...EMPTY_FORM,
      title: ex.title ?? "",
      priority: ex.priority ?? "Medium",
      focusText: ex.focusText ?? "",
    });
    setShowForm(true);
  };

  return (
    <AppShell title="Goals & Roadmap" subtitle={`${activeCount} active · ${completedCount} completed`}>
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Active Goals",   value: activeCount,    icon: Target,  color: "text-cyan-400" },
          { label: "Completed",      value: completedCount, icon: Trophy,  color: "text-emerald-400" },
          { label: "High Priority",  value: highPriorityCount, icon: Flame, color: "text-rose-400" },
          { label: "Total Goals",    value: goals.length,   icon: Star,    color: "text-violet-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <GlassCard key={label} className="p-4 flex items-center gap-3" hover={false}>
            <Icon className={`h-5 w-5 shrink-0 ${color}`} />
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-[10px] text-zinc-500">{label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Actions bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "completed", "paused"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize ${
                filter === f
                  ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-400"
                  : "bg-white/5 border-white/10 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {f === "all" ? `All (${goals.length})` : f}
            </button>
          ))}
        </div>
        <button
          onClick={openCreate}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold shadow-lg hover:opacity-90 transition-all"
          id="add-goal-btn"
        >
          <Plus className="h-4 w-4" /> Add Goal
        </button>
      </div>

      {/* ── CREATE / EDIT FORM ── */}
      {showForm && (
        <GlassCard className="p-5 mb-5 border-cyan-500/20" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-cyan-400" />
              {editingId ? "Edit Goal" : "Create New Goal"}
            </h3>
            <button onClick={cancelForm} className="text-zinc-500 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Title */}
            <input
              type="text"
              placeholder="Goal title (e.g. Crack Amazon Internship)"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all"
              id="goal-title-input"
            />

            {/* Description */}
            <textarea
              placeholder="Short description (optional)"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Target date */}
              <div>
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Target Date</label>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(e) => setForm((f) => ({ ...f, targetDate: e.target.value }))}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                >
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>
            </div>

            {/* Focus text */}
            <input
              type="text"
              placeholder="Focus text (what to keep in mind)"
              value={form.focusText}
              onChange={(e) => setForm((f) => ({ ...f, focusText: e.target.value }))}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all"
            />

            {/* Milestones */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Milestones / Checklist</p>
              <div className="space-y-1.5 mb-2">
                {form.milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <Circle className="h-3 w-3 text-zinc-600 shrink-0" />
                    <span className="text-xs text-zinc-300 flex-1">{m.text}</span>
                    <button onClick={() => removeMilestone(m.id)} className="text-zinc-600 hover:text-rose-400 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a milestone..."
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addMilestone())}
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                <button
                  onClick={addMilestone}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Save */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={saveGoal}
                disabled={!form.title.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold disabled:opacity-40 hover:opacity-90 transition-all"
                id="save-goal-btn"
              >
                <Save className="h-3.5 w-3.5" /> {editingId ? "Save Changes" : "Create Goal"}
              </button>
              <button onClick={cancelForm} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-sm hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* ── GOALS LIST ── */}
      {filtered.length === 0 ? (
        <GlassCard className="p-10 text-center" hover={false}>
          <Target className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 font-semibold mb-1">No goals yet</p>
          <p className="text-xs text-zinc-600 mb-5">Set your first goal and start tracking progress.</p>
          
          {/* Example goals */}
          {filter === "all" && (
            <div className="space-y-2 max-w-sm mx-auto">
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-bold mb-3">Quick Start Examples</p>
              {EXAMPLE_GOALS.map((ex) => (
                <button
                  key={ex.title}
                  onClick={() => useExample(ex)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/3 border border-white/8 text-left hover:bg-white/8 transition-all group"
                >
                  <div>
                    <p className="text-sm text-white font-medium">{ex.title}</p>
                    <p className="text-[10px] text-zinc-500">{ex.focusText}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${PRIORITY_CONFIG[ex.priority!].color} ${PRIORITY_CONFIG[ex.priority!].bg} ${PRIORITY_CONFIG[ex.priority!].border}`}>
                    {ex.priority}
                  </span>
                </button>
              ))}
            </div>
          )}
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((goal) => {
            const isExpanded = expandedIds.has(goal.id);
            const pConfig = PRIORITY_CONFIG[goal.priority];
            const sConfig = STATUS_CONFIG[goal.status];
            const daysLeft = goal.targetDate ? differenceInDays(parseISO(goal.targetDate), new Date()) : null;
            const isOverdue = daysLeft !== null && daysLeft < 0 && goal.status !== "completed";

            return (
              <GlassCard
                key={goal.id}
                className={`transition-all ${goal.status === "completed" ? "opacity-60" : ""}`}
                hover={false}
              >
                {/* Goal header */}
                <div
                  className="flex items-start gap-3 p-4 cursor-pointer"
                  onClick={() => toggleExpand(goal.id)}
                >
                  {/* Complete toggle */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleStatus(goal.id); }}
                    className="mt-0.5 shrink-0 transition-all hover:scale-110"
                    aria-label="Toggle completion"
                  >
                    {goal.status === "completed"
                      ? <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      : <Circle className="h-5 w-5 text-zinc-600 hover:text-cyan-400" />
                    }
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <h3 className={`font-bold text-sm ${goal.status === "completed" ? "line-through text-zinc-500" : "text-white"}`}>
                        {goal.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pConfig.color} ${pConfig.bg} ${pConfig.border}`}>
                          {goal.priority}
                        </span>
                        <span className={`text-[10px] font-semibold ${sConfig.color}`}>
                          {sConfig.label}
                        </span>
                      </div>
                    </div>

                    {goal.description && (
                      <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{goal.description}</p>
                    )}

                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <DaysChip targetDate={goal.targetDate} status={goal.status} />
                      {goal.focusText && (
                        <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                          <Zap className="h-2.5 w-2.5" /> {goal.focusText}
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    {goal.milestones.length > 0 && (
                      <div className="mt-3">
                        <ProgressBar milestones={goal.milestones} />
                      </div>
                    )}
                  </div>

                  {/* Expand toggle */}
                  <div className="shrink-0 mt-0.5">
                    {isExpanded
                      ? <ChevronUp className="h-4 w-4 text-zinc-600" />
                      : <ChevronDown className="h-4 w-4 text-zinc-600" />
                    }
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-white/5 px-4 pb-4 pt-3 space-y-3">
                    {/* Milestones checklist */}
                    {goal.milestones.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Milestones</p>
                        {goal.milestones.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => toggleMilestone(goal.id, m.id)}
                            className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-white/5 transition-all group text-left"
                          >
                            {m.done
                              ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              : <Circle className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors" />
                            }
                            <span className={`text-xs ${m.done ? "line-through text-zinc-500" : "text-zinc-300"}`}>
                              {m.text}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-[10px] text-zinc-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        Created {format(new Date(goal.createdAt), "MMM d")}
                      </span>
                      {goal.targetDate && (
                        <span className="flex items-center gap-1">
                          <Flag className="h-2.5 w-2.5" />
                          Due {format(parseISO(goal.targetDate), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => openEdit(goal)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400 hover:text-white hover:border-white/20 transition-all"
                      >
                        <Edit3 className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => toggleStatus(goal.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          goal.status === "completed"
                            ? "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                            : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {goal.status === "completed" ? "Reopen" : "Complete"}
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs text-rose-500 hover:bg-rose-500/15 transition-all ml-auto"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
