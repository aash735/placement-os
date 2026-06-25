"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useDataStore } from "@/store/data-store";
import { useProgressStore } from "@/lib/progress-store";
import { cn } from "@/lib/utils";
import { getTcsSlugFromResourceId, isTcsInteractiveMcq, isTcsCodingChallenge } from "@/lib/tcs-utils";
import {
  FileText,
  Brain,
  GitBranch,
  Notebook,
  Award,
  Download,
  CheckCircle,
  Search,
  BookOpen,
  Trophy,
  Layers
} from "lucide-react";

const STATUSES = ["not-started", "preparing", "applied", "oa-done", "interview"] as const;

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function getCategoryIcon(cat: string) {
  switch (cat) {
    case "DSA": return GitBranch;
    case "Aptitude": return Brain;
    case "Verbal Ability": return FileText;
    case "Core Subjects": return Notebook;
    default: return Award;
  }
}

export default function CompanyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const companies = useDataStore((s) => s.companies);
  const company = companies.find((c) => c.slug === slug);
  const status = useProgressStore((s) => s.companyTargets[slug] ?? "not-started");
  const setCompanyStatus = useProgressStore((s) => s.setCompanyStatus);
  const resourceProgress = useProgressStore((s) => s.resourceProgress ?? {});
  const setResourceProgress = useProgressStore((s) => s.setResourceProgress);
  const resources = useDataStore((s) => s.resources ?? []);

  const loading = useDataStore((s) => s.loading);
  const lastFetched = useDataStore((s) => s.lastFetched);

  const [activeTab, setActiveTab] = useState<"overview" | "resources">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const companyResources = useMemo(() => {
    return resources.filter((r) => r.company === slug);
  }, [resources, slug]);

  const categories = useMemo(() => {
    const list = new Set<string>();
    companyResources.forEach((r) => {
      if (r.category) list.add(r.category);
    });
    return ["All", ...Array.from(list)];
  }, [companyResources]);

  const filteredResources = useMemo(() => {
    return companyResources.filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (r.subtopic && r.subtopic.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [companyResources, searchQuery, selectedCategory]);

  const progressStats = useMemo(() => {
    const total = companyResources.length;
    const completed = companyResources.filter((r) => resourceProgress[resIdClean(r.id)] === "completed").length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Total XP reward potential
    const completedXp = companyResources
      .filter((r) => resourceProgress[resIdClean(r.id)] === "completed")
      .reduce((sum, r) => sum + (r.xpReward || 50), 0);

    return { total, completed, pct, completedXp };
  }, [companyResources, resourceProgress]);

  // Normalize resource key to clean string
  function resIdClean(id: string): string {
    return id.replace(/"/g, "").trim();
  }

  if (!company) {
    if (loading || !lastFetched) {
      return (
        <AppShell title="Loading Company Profile...">
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          </div>
        </AppShell>
      );
    }
    return (
      <AppShell title="Not found">
        <Link href="/companies" className="text-cyan-400">Back</Link>
      </AppShell>
    );
  }

  const sections = [
    ["OA Pattern", company.oaPattern],
    ["Coding Difficulty", company.codingDifficulty],
    ["Aptitude Weight", company.aptitudeWeight],
    ["Rounds", company.rounds.join(" → ")],
    ["Strategy", company.strategy],
  ];

  const hasResources = companyResources.length > 0;

  return (
    <AppShell title={company.name} subtitle={company.type}>
      {/* Tab Navigation if resources are available */}
      {hasResources && (
        <div className="mb-6 flex space-x-2 border-b border-white/5 pb-px">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "px-4 py-2 text-xs font-semibold border-b-2 transition-all",
              activeTab === "overview"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-zinc-400 hover:text-white"
            )}
          >
            Syllabus & Strategy
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={cn(
              "px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5",
              activeTab === "resources"
                ? "border-cyan-400 text-cyan-400"
                : "border-transparent text-zinc-400 hover:text-white"
            )}
          >
            Study Materials & PYQs
            <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[9px] text-cyan-300">
              {companyResources.length}
            </span>
          </button>
        </div>
      )}

      {activeTab === "overview" ? (
        <div className="space-y-6">
          <GlassCard hover={false}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Application status</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setCompanyStatus(slug, s)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs capitalize transition-all border",
                    status === s
                      ? "bg-cyan-500/10 border-cyan-400 text-cyan-300"
                      : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {s.replace("-", " ")}
                </button>
              ))}
            </div>
          </GlassCard>
          
          <div className="grid gap-4">
            {sections.map(([title, body], i) => (
              <GlassCard key={title} delay={i * 0.02} hover={false}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">{title}</h3>
                <p className="mt-2 text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{body}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Overview Panel */}
          <div className="grid gap-4 sm:grid-cols-3">
            <GlassCard className="p-4 flex items-center justify-between" hover={false}>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500">Document Completion</p>
                <h4 className="text-xl font-bold text-white mt-1">
                  {progressStats.completed} / {progressStats.total}
                </h4>
              </div>
              <div className="h-10 w-10 shrink-0 rounded-full border-2 border-white/5 flex items-center justify-center text-[10px] font-bold text-cyan-400 font-mono">
                {progressStats.pct}%
              </div>
            </GlassCard>

            <GlassCard className="p-4 flex items-center justify-between" hover={false}>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500">Total XP Claimed</p>
                <h4 className="text-xl font-bold text-emerald-400 mt-1 flex items-center gap-1">
                  +{progressStats.completedXp} XP
                </h4>
              </div>
              <Trophy className="h-6 w-6 text-amber-400 shrink-0" />
            </GlassCard>

            <GlassCard className="p-4 flex items-center justify-between" hover={false}>
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500">Resource Categories</p>
                <h4 className="text-xl font-bold text-white mt-1">
                  {categories.length - 1} Tracks
                </h4>
              </div>
              <Layers className="h-6 w-6 text-cyan-400 shrink-0" />
            </GlassCard>
          </div>

          {/* Search and Filter Panel */}
          <GlassCard className="p-4" hover={false}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Category selector */}
              <div className="flex flex-wrap gap-1.5 order-2 sm:order-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                      selectedCategory === cat
                        ? "bg-cyan-500/10 border-cyan-400 text-cyan-300"
                        : "bg-white/2 border-white/5 text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search bar */}
              <div className="relative w-full max-w-xs order-1 sm:order-2 shrink-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="field-input w-full pl-9 pr-4 text-xs"
                />
              </div>
            </div>
          </GlassCard>

          {/* Resources Grid */}
          {filteredResources.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/5 rounded-2xl bg-black/10">
              <BookOpen className="h-8 w-8 text-zinc-600 mx-auto" />
              <p className="text-xs font-medium text-zinc-400 mt-3">No matching documents found</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((res, i) => {
                const cleanId = resIdClean(res.id);
                const isCompleted = resourceProgress[cleanId] === "completed";
                const Icon = getCategoryIcon(res.category);
                
                return (
                  <GlassCard
                    key={res.id}
                    delay={i * 0.01}
                    className={cn(
                      "p-4 border flex flex-col justify-between transition-all",
                      isCompleted ? "border-emerald-500/10 bg-emerald-500/5" : "border-white/5"
                    )}
                    hover={true}
                  >
                    <div>
                      {/* Top Header info */}
                      <div className="flex items-start justify-between">
                        <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center text-cyan-300 shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        {/* Checkbox */}
                        <button
                          onClick={() => setResourceProgress(cleanId, isCompleted ? "not-started" : "completed")}
                          className={cn(
                            "h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-all",
                            isCompleted 
                              ? "border-emerald-400 bg-emerald-500 text-black" 
                              : "border-zinc-600 hover:border-zinc-400 bg-black/40"
                          )}
                        >
                          {isCompleted && <CheckCircle className="h-3.5 w-3.5 shrink-0" />}
                        </button>
                      </div>

                      {/* Title & Metadata */}
                      <h4 className={cn("text-xs font-bold mt-3 leading-snug", isCompleted ? "text-zinc-500 line-through" : "text-white")}>
                        {res.title}
                      </h4>
                      
                      <div className="mt-1 flex flex-wrap gap-1">
                        <span className="text-[9px] uppercase font-bold text-zinc-500">
                          {res.category}
                        </span>
                        {res.subtopic && (
                          <span className="text-[9px] font-semibold text-cyan-400 bg-cyan-500/5 px-1.5 py-0.5 rounded">
                            {res.subtopic}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Metadata & Actions */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-2">
                        <span>{formatBytes(res.sizeBytes)}</span>
                        <span>•</span>
                        <span>{res.estimatedMinutes} mins</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-[9px] font-bold text-emerald-400 light:text-emerald-700 bg-emerald-500/5 px-2 py-0.5 rounded-full shrink-0">
                          +{res.xpReward} XP
                        </span>
                        
                        {slug === "tcs" && isTcsInteractiveMcq(res.id) ? (
                          <Link
                            href={`/aptitude/test/${getTcsSlugFromResourceId(res.id)}`}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/20 hover:border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-[10px] font-bold transition-all shrink-0"
                          >
                            Start Practice Set
                          </Link>
                        ) : slug === "tcs" && isTcsCodingChallenge(res.id) ? (
                          <Link
                            href={`/dsa/coding/${getTcsSlugFromResourceId(res.id)}`}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/15 to-violet-600/15 border border-cyan-500/25 hover:from-cyan-500/25 hover:to-violet-600/25 text-cyan-300 hover:text-cyan-200 text-[10px] font-bold transition-all shrink-0"
                          >
                            Solve Challenge
                          </Link>
                        ) : (
                          <a
                            href={res.filePath}
                            download={res.title}
                            title="Download Resource"
                            className="h-7 w-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-cyan-500/10 hover:text-cyan-300 hover:border-cyan-500/20 transition-all shrink-0"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
