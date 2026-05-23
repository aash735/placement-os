"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { ProjectTask } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Briefcase,
  Layers,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Sliders,
  CheckCircle,
  HelpCircle,
  Tag
} from "lucide-react";

const COLUMNS = [
  { id: "todo", name: "To Do", color: "border-zinc-500/30 text-zinc-400 bg-zinc-500/5" },
  { id: "in-progress", name: "In Progress", color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5" },
  { id: "review", name: "Under Review", color: "border-violet-500/30 text-violet-400 bg-violet-500/5" },
  { id: "done", name: "Completed", color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" }
] as const;

export default function ProjectsPage() {
  const {
    projects = [],
    addProjectTask,
    updateProjectTaskStatus,
    updateProjectTaskReadiness,
    deleteProjectTask
  } = useProgressStore();

  const [showAddForm, setShowAddForm] = useState(false);
  
  // New Project Form State
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [stack, setStack] = useState("");
  const [readiness, setReadiness] = useState(50);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addProjectTask({
      name,
      description: desc,
      stack,
      status: "todo",
      readiness,
      tags
    });

    // Reset Form
    setName("");
    setDesc("");
    setStack("");
    setReadiness(50);
    setTagInput("");
    setShowAddForm(false);
  };

  const moveLeft = (id: string, currentStatus: ProjectTask["status"]) => {
    const sequence: ProjectTask["status"][] = ["todo", "in-progress", "review", "done"];
    const idx = sequence.indexOf(currentStatus);
    if (idx > 0) {
      updateProjectTaskStatus(id, sequence[idx - 1]);
    }
  };

  const moveRight = (id: string, currentStatus: ProjectTask["status"]) => {
    const sequence: ProjectTask["status"][] = ["todo", "in-progress", "review", "done"];
    const idx = sequence.indexOf(currentStatus);
    if (idx < sequence.length - 1) {
      updateProjectTaskStatus(id, sequence[idx + 1]);
    }
  };

  return (
    <AppShell title="Projects Board" subtitle="Your primary hiring differentiator">
      <PageHeader 
        title="Technical Projects Board" 
        description="For top-tier product roles, a polished and deployable project with real users often outweighs standard DSA scores alone. Track your build milestones below." 
        action={
          <button 
            onClick={() => setShowAddForm(true)}
            className="btn-primary text-xs flex items-center space-x-1 shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Project Milestone</span>
          </button>
        }
      />

      {/* ADD PROJECT MODAL */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/85 backdrop-blur-sm"
          >
            <GlassCard className="max-w-md w-full p-6 border-white/10 relative" hover={false}>
              <h3 className="text-base font-bold text-white mb-4 flex items-center">
                <Briefcase className="h-4.5 w-4.5 mr-2 text-cyan-400" />
                Initialize Project Milestone
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Project Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. HireLens ATS Analyzer"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Tech Stack</label>
                  <input
                    type="text"
                    required
                    value={stack}
                    onChange={(e) => setStack(e.target.value)}
                    placeholder="e.g. Next.js, Python, Tailwind"
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Milestone Description</label>
                  <textarea
                    rows={3}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Describe specific features or goals for this milestone..."
                    className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Readiness ({readiness}%)</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={readiness}
                      onChange={(e) => setReadiness(Number(e.target.value))}
                      className="w-full accent-cyan-400 bg-zinc-800 rounded-lg cursor-pointer h-2 mt-3"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 font-semibold mb-1">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="e.g. Frontend, API"
                      className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="py-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all shadow-[0_4px_12px_rgba(6,182,212,0.3)]"
                  >
                    Create Card
                  </button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KANBAN LAYOUT */}
      <div className="grid gap-4 lg:grid-cols-4 overflow-x-auto min-h-[500px] pb-6">
        {COLUMNS.map((col) => {
          const colTasks = projects.filter((p) => p.status === col.id);
          return (
            <div key={col.id} className="min-w-[250px] flex flex-col space-y-4">
              {/* Column Header */}
              <div className={`p-3 rounded-xl border flex items-center justify-between font-bold text-xs uppercase tracking-wider ${col.color}`}>
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  {col.name}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px]">
                  {colTasks.length}
                </span>
              </div>

              {/* Column Card Container */}
              <div className="flex-1 rounded-2xl bg-zinc-950/20 border border-white/5 p-3 space-y-3 min-h-[400px]">
                {colTasks.length === 0 ? (
                  <div className="py-12 text-center text-[10px] text-zinc-600 italic">
                    No active tasks
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <GlassCard key={task.id} className="p-4 border-white/5 group relative overflow-hidden" hover={false}>
                      <h4 className="text-sm font-bold text-white mb-1 leading-snug">{task.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium line-clamp-2 mb-2 leading-relaxed">
                        {task.description}
                      </p>
                      <p className="text-[10px] text-cyan-300/80 font-mono font-semibold mb-3">
                        Stack: {task.stack}
                      </p>

                      {/* Progress slider bar */}
                      <div className="space-y-1 mt-3">
                        <div className="flex justify-between items-center text-[9px] text-zinc-500">
                          <span className="flex items-center">
                            <Sliders className="h-2.5 w-2.5 mr-0.5" /> Readiness
                          </span>
                          <span className="font-bold text-zinc-300">{task.readiness}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={task.readiness}
                          onChange={(e) => updateProjectTaskReadiness(task.id, Number(e.target.value))}
                          className="w-full accent-cyan-400 bg-zinc-800 rounded-lg cursor-pointer h-1.5"
                        />
                      </div>

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3.5">
                          {task.tags.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] text-zinc-400 font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-3.5">
                        <button
                          onClick={() => deleteProjectTask(task.id)}
                          className="p-1.5 rounded bg-white/5 text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                          title="Delete Card"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>

                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => moveLeft(task.id, task.status)}
                            disabled={task.status === "todo"}
                            className="p-1.5 rounded bg-white/5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                          >
                            <ArrowLeft className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => moveRight(task.id, task.status)}
                            disabled={task.status === "done"}
                            className="p-1.5 rounded bg-white/5 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
