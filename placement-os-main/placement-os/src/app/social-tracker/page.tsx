"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import {
  Briefcase, Plus, Edit3, Trash2, Save, X, ExternalLink,
  CheckCircle2, Clock, AlertCircle, TrendingUp, Star
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PortfolioStatus = "live" | "in-progress" | "planned" | "archived";

interface PortfolioProject {
  id: string;
  name: string;
  description: string;
  tech: string;
  liveUrl?: string;
  status: PortfolioStatus;
  highlights: string[];
  featuredIn: string[];
  createdAt: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PortfolioStatus, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  live:        { label: "Live",        color: "text-emerald-400", bg: "bg-emerald-500/8",  border: "border-emerald-500/20", icon: CheckCircle2 },
  "in-progress": { label: "In Progress", color: "text-amber-400",   bg: "bg-amber-500/8",    border: "border-amber-500/20",   icon: Clock },
  planned:     { label: "Planned",     color: "text-zinc-400",    bg: "bg-white/5",        border: "border-white/10",       icon: Star },
  archived:    { label: "Archived",    color: "text-zinc-600",    bg: "bg-white/3",        border: "border-white/5",        icon: AlertCircle },
};

const STORAGE_KEY = "placement-os-portfolio-v1";

function load(): PortfolioProject[] {
  if (typeof window === "undefined") return DEFAULT_PROJECTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_PROJECTS;
  } catch { return DEFAULT_PROJECTS; }
}

function save(projects: PortfolioProject[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(projects)); } catch { /* ignore */ }
}

const DEFAULT_PROJECTS: PortfolioProject[] = [
  {
    id: "p1", name: "Placement OS", description: "AI-powered placement preparation and productivity OS for CSE students.",
    tech: "Next.js, React, Supabase, TypeScript",
    status: "in-progress", highlights: ["Session-based auth", "DSA tracker", "Analytics dashboard"], featuredIn: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2", name: "HireLens", description: "Privacy-first ATS resume analyzer with AI feedback.",
    tech: "Next.js, Python, AI/ML", liveUrl: "",
    status: "in-progress", highlights: ["Resume scoring engine", "ATS keyword analysis", "Privacy-first design"], featuredIn: [],
    createdAt: new Date().toISOString(),
  },
];

const EMPTY_FORM = { name: "", description: "", tech: "", liveUrl: "", status: "in-progress" as PortfolioStatus, highlights: [] as string[], featuredIn: [] as string[] };

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PortfolioTrackerPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>(() => load());
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [highlightInput, setHighlightInput] = useState("");

  const persist = (updated: PortfolioProject[]) => { setProjects(updated); save(updated); };

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setEditId(null); setShowForm(true); };
  const openEdit   = (p: PortfolioProject) => {
    setForm({ name: p.name, description: p.description, tech: p.tech, liveUrl: p.liveUrl ?? "", status: p.status, highlights: [...p.highlights], featuredIn: [...p.featuredIn] });
    setEditId(p.id); setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setEditId(null); setForm({ ...EMPTY_FORM }); setHighlightInput(""); };

  const saveProject = () => {
    if (!form.name.trim()) return;
    if (editId) {
      persist(projects.map((p) => p.id === editId ? { ...p, ...form } : p));
    } else {
      persist([{ id: `p-${Date.now()}`, ...form, createdAt: new Date().toISOString() }, ...projects]);
    }
    cancel();
  };

  const deleteProject = (id: string) => persist(projects.filter((p) => p.id !== id));

  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setForm((f) => ({ ...f, highlights: [...f.highlights, highlightInput.trim()] }));
    setHighlightInput("");
  };

  const liveCount = projects.filter((p) => p.status === "live").length;
  const inProgressCount = projects.filter((p) => p.status === "in-progress").length;

  return (
    <AppShell title="Portfolio Tracker" subtitle={`${liveCount} live · ${inProgressCount} in progress`}>
      <PageHeader
        title="Portfolio Tracker"
        description="Track your projects, highlights, and portfolio readiness for placement."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {(["live", "in-progress", "planned", "archived"] as PortfolioStatus[]).map((s) => {
          const count = projects.filter((p) => p.status === s).length;
          const cfg = STATUS_CONFIG[s];
          const Icon = cfg.icon;
          return (
            <GlassCard key={s} className="p-4 flex items-center gap-2.5" hover={false}>
              <Icon className={`h-4 w-4 shrink-0 ${cfg.color}`} />
              <div>
                <p className={`text-xl font-bold ${cfg.color}`}>{count}</p>
                <p className="text-[10px] text-zinc-600">{cfg.label}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Add button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold shadow-lg hover:opacity-90 transition-all"
          id="add-portfolio-btn"
        >
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <GlassCard className="p-5 mb-5 border-cyan-500/20" hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-cyan-400" />
              {editId ? "Edit Project" : "New Project"}
            </h3>
            <button onClick={cancel} className="text-zinc-500 hover:text-white"><X className="h-4 w-4" /></button>
          </div>
          <div className="space-y-3">
            <input type="text" placeholder="Project name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
            <textarea placeholder="Short description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" placeholder="Tech stack (e.g. React, Next.js)" value={form.tech} onChange={(e) => setForm((f) => ({ ...f, tech: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
              <input type="url" placeholder="Live URL (optional)" value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
            </div>
            <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PortfolioStatus }))}
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all">
              <option value="in-progress">In Progress</option>
              <option value="live">Live</option>
              <option value="planned">Planned</option>
              <option value="archived">Archived</option>
            </select>
            {/* Highlights */}
            <div>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Key Highlights</p>
              <div className="space-y-1.5 mb-2">
                {form.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <TrendingUp className="h-3 w-3 text-cyan-400 shrink-0" />
                    <span className="text-xs text-zinc-300 flex-1">{h}</span>
                    <button onClick={() => setForm((f) => ({ ...f, highlights: f.highlights.filter((_, j) => j !== i) }))} className="text-zinc-600 hover:text-rose-400">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Add a highlight..." value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
                <button onClick={addHighlight} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={saveProject} disabled={!form.name.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-bold disabled:opacity-40 hover:opacity-90 transition-all">
                <Save className="h-3.5 w-3.5" /> {editId ? "Save Changes" : "Add Project"}
              </button>
              <button onClick={cancel} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 text-sm hover:text-white transition-all">Cancel</button>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Projects list */}
      {projects.length === 0 ? (
        <GlassCard className="p-10 text-center" hover={false}>
          <Briefcase className="h-10 w-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 font-semibold">No projects yet</p>
          <p className="text-xs text-zinc-600 mt-1">Add your first portfolio project to track its readiness.</p>
        </GlassCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => {
            const cfg = STATUS_CONFIG[p.status];
            const Icon = cfg.icon;
            return (
              <GlassCard key={p.id} className="p-5" hover={false}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-bold text-white">{p.name}</h3>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                        <Icon className="h-2.5 w-2.5" /> {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{p.description}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-all">
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => deleteProject(p.id)} className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {p.tech && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {p.tech.split(",").map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-zinc-400">{t.trim()}</span>
                    ))}
                  </div>
                )}

                {p.highlights.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {p.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <TrendingUp className="h-2.5 w-2.5 text-cyan-400 shrink-0" /> {h}
                      </li>
                    ))}
                  </ul>
                )}

                {p.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                    <ExternalLink className="h-3 w-3" /> View Live
                  </a>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
