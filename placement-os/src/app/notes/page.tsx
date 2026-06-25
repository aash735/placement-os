"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  Save, 
  Check, 
  FileText, 
  GitBranch, 
  Brain, 
  Layers, 
  Code2, 
  Notebook, 
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const PATTERNS = [
  { id: "sliding_window", label: "Sliding Window", icon: GitBranch, color: "text-cyan-400 light:text-cyan-600", desc: "Subarray search, variable or fixed size windows.", placeholder: "// Sliding Window Template\nint l = 0, r = 0;\nwhile (r < n) {\n    // expand window\n    add(arr[r]);\n    while (invalid()) {\n        // shrink window\n        remove(arr[l]);\n        l++;\n    }\n    r++;\n}" },
  { id: "two_pointers", label: "Two Pointers", icon: Code2, color: "text-emerald-400 light:text-emerald-600", desc: "Linear scan from both ends or slow/fast pointers.", placeholder: "// Slow/Fast Pointers\nListNode slow = head, fast = head;\nwhile (fast != null && fast.next != null) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow == fast) return true; // Cycle detected\n}" },
  { id: "dp", label: "Dynamic Programming", icon: Brain, color: "text-violet-400 light:text-violet-600", desc: "Memoized subproblems, state transitions.", placeholder: "// DP Memoization\nint solve(int i, int w) {\n    if (i == 0 || w == 0) return 0;\n    if (memo[i][w] != -1) return memo[i][w];\n    if (wt[i-1] <= w) {\n        return memo[i][w] = Math.max(val[i-1] + solve(i-1, w - wt[i-1]), solve(i-1, w));\n    }\n    return memo[i][w] = solve(i-1, w);\n}" },
  { id: "graphs", label: "Graphs & DFS/BFS", icon: Layers, color: "text-rose-400 light:text-rose-600", desc: "Adjacency lists, shortest paths, cycles.", placeholder: "// BFS Algorithm\nQueue<Integer> q = new LinkedList<>();\nq.offer(start);\nvisited[start] = true;\nwhile (!q.isEmpty()) {\n    int curr = q.poll();\n    for (int adj : adjList.get(curr)) {\n        if (!visited[adj]) {\n            visited[adj] = true;\n            q.offer(adj);\n        }\n    }\n}" },
  { id: "trees", label: "Trees & Recursion", icon: Notebook, color: "text-amber-400 light:text-amber-600", desc: "Binary search trees, traversals, height-balanced.", placeholder: "// Inorder Traversal\nvoid inorder(TreeNode root) {\n    if (root == null) return;\n    inorder(root.left);\n    print(root.val);\n    inorder(root.right);\n}" },
  { id: "general", label: "General Cheat Sheet", icon: FileText, color: "text-zinc-400 light:text-zinc-600", desc: "Time complexities, sorting algorithms, bitwise hacks.", placeholder: "// Bitwise Hacks\n(x & 1) == 0; // Check even number\n(x & (x - 1)) == 0; // Check power of 2\n(x ^ y) < 0; // Check opposite signs" },
];

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState("sliding_window");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [wordCounts, setWordCounts] = useState<Record<string, number>>({});

  // Load notes from localStorage on mount
  useEffect(() => {
    const loadedNotes: Record<string, string> = {};
    const counts: Record<string, number> = {};
    
    PATTERNS.forEach((p) => {
      const saved = localStorage.getItem(`placement-os-note-${p.id}`) || "";
      loadedNotes[p.id] = saved;
      counts[p.id] = saved.trim() ? saved.trim().split(/\s+/).length : 0;
    });
    
    setNotes(loadedNotes);
    setWordCounts(counts);
  }, []);

  const handleNoteChange = (text: string) => {
    const updated = { ...notes, [activeTab]: text };
    setNotes(updated);
    
    const count = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCounts({ ...wordCounts, [activeTab]: count });
    
    // Auto-save to localStorage
    localStorage.setItem(`placement-os-note-${activeTab}`, text);
  };

  const triggerSaveNotification = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const activePattern = PATTERNS.find((p) => p.id === activeTab) || PATTERNS[0];

  return (
    <AppShell title="Visual Notes" subtitle="Capture and reference patterns offline">
      <PageHeader 
        title="Algorithm Pattern Notes" 
        description="Write templates, cheatsheets, and solutions for recurring patterns. Changes are automatically saved in local storage."
        action={
          <button
            onClick={triggerSaveNotification}
            className="btn-primary text-sm shadow-[0_4px_15px_rgba(6,182,212,0.25)] flex items-center gap-1.5 cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4" />
                <span>Saved Offline</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Notes</span>
              </>
            )}
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3 pb-12">
        {/* Sidebar Selector */}
        <div className="space-y-3 lg:col-span-1">
          {PATTERNS.map((p) => {
            const Icon = p.icon;
            const isActive = activeTab === p.id;
            const count = wordCounts[p.id] || 0;
            return (
              <GlassCard
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                hover={!isActive}
                className={cn(
                  "p-4 border transition-all cursor-pointer text-left",
                  isActive 
                    ? "border-cyan-500/25 bg-cyan-500/5 shadow-[0_4px_12px_rgba(6,182,212,0.06)]" 
                    : "border-white/5 bg-black/20 hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-white/5 shrink-0", p.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className={cn("text-xs font-bold transition-colors", isActive ? "text-cyan-400 light:text-cyan-600" : "text-white")}>
                      {p.label}
                    </h4>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">{p.desc}</p>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-zinc-500 shrink-0 bg-white/5 px-2 py-0.5 rounded-full">
                    {count} words
                  </span>
                </div>
              </GlassCard>
            );
          })}

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-[10px] text-zinc-400 leading-relaxed flex items-start gap-2">
            <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              💡 Staff Engineer Advice: Do not memorize specific questions. Memorize the **state transitions** and **sliding conditions** shown in these templates.
            </span>
          </div>
        </div>

        {/* Text Editor Section */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard hover={false} className="p-6 h-full flex flex-col justify-between border-white/5">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <Sparkles className={cn("h-4 w-4", activePattern.color)} />
                    {activePattern.label} Blueprint
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Customize your template and complexity checklists</p>
                </div>
                <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded-full border border-white/5 text-zinc-400 font-semibold font-mono">
                  Offline Draft
                </span>
              </div>

              <textarea
                value={notes[activeTab] ?? ""}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder={activePattern.placeholder}
                className="field-input w-full min-h-[350px] font-mono text-xs leading-relaxed p-4 bg-zinc-950/40"
              />
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-semibold">
              <span>Saved locally in browser storage</span>
              <span>UTF-8 encoded</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
