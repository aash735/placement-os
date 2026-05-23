"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useTheme } from "@/components/providers/theme-provider";
import { useProgressStore } from "@/lib/progress-store";
import { useAuth } from "@/components/providers/auth-provider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Zap,
  Shield,
  Key,
  Eye,
  EyeOff,
  Save,
  Check,
  Keyboard,
  Download,
  Compass,
  Info,
  AlertCircle,
  LogOut
} from "lucide-react";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  
  // Progress Store Values
  const {
    energyMode = "normal",
    setEnergyMode,
    llmApiKey = "",
    setLlmApiKey,
    shortcutsEnabled = true,
    setShortcutsEnabled,
    exportProgress
  } = useProgressStore();

  // Local States
  const [apiKeyInput, setApiKeyInput] = useState(llmApiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [careerPath, setCareerPath] = useState("product");

  useEffect(() => {
    setApiKeyInput(llmApiKey);
  }, [llmApiKey]);

  useEffect(() => {
    const savedPath = localStorage.getItem("placement-os-career-path") || "product";
    setCareerPath(savedPath);
  }, []);

  const handleCareerPathChange = (path: string) => {
    setCareerPath(path);
    localStorage.setItem("placement-os-career-path", path);
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setLlmApiKey(apiKeyInput.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `placement-os-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell title="Command Center Settings" subtitle="Personalize your preparation environment">
      <PageHeader 
        title="Settings & Configurations" 
        description="Configure your LLM connections, appearance toggles, shortcut grids, and custom energy performance thresholds." 
      />

      <div className="grid gap-6 md:grid-cols-2 pb-12">
        {/* LEFT COLUMN: APPEARANCE & AI CONFIG */}
        <div className="space-y-6">
          {/* Theme & Energy Mode Settings */}
          <GlassCard hover={false} className="p-6 border-white/5 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sun className="h-4 w-4 text-cyan-400" />
              Appearance & Performance
            </h3>

            {/* Light/Dark Toggle */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <span className="text-xs font-semibold text-zinc-300">Color Palette</span>
                <p className="text-[11px] text-zinc-500 mt-0.5">Toggle between dark and light themes</p>
              </div>
              <button
                type="button"
                onClick={toggle}
                className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs font-semibold text-white flex items-center gap-2 hover:bg-white/10 transition-all"
              >
                {theme === "dark" ? (
                  <>
                    <Moon className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Energy mode selection */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-zinc-300">Energy Optimization Mode</span>
                <p className="text-[11px] text-zinc-500 mt-0.5">Select a profile matching your study flow and device setup</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "normal", name: "Normal", color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5", desc: "Full animations and active quest notifications." },
                  { id: "low", name: "Low-Energy", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", desc: "Reduces visual effects and saves laptop battery cycles." },
                  { id: "recovery", name: "Recovery", color: "text-violet-400 border-violet-500/20 bg-violet-500/5", desc: "Spaces revisions, adjusts daily streaks, prevents burnout." }
                ].map((mode) => {
                  const isActive = energyMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setEnergyMode(mode.id as any)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isActive
                          ? `${mode.color} ring-1 ring-white/10 shadow-[0_4px_12px_rgba(6,182,212,0.1)]`
                          : "border-white/5 bg-black/20 hover:bg-white/5 text-zinc-400"
                      }`}
                    >
                      <span className="text-xs font-bold flex items-center gap-1">
                        <Zap className={`h-3 w-3 ${isActive ? "" : "text-zinc-500"}`} />
                        {mode.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanatory Banner */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[10px] text-zinc-400 leading-relaxed flex items-start gap-2">
                <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  {energyMode === "normal" && "Normal Mode: Rendering all animations and full dynamic visual roadmaps."}
                  {energyMode === "low" && "Low-Energy Mode: Animation frames are capped, high emissions and gradients are simplified."}
                  {energyMode === "recovery" && "Recovery Mode: Dynamic quest scheduler adapts goals to half sizes to recover from misses."}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* AI Credentials (Gemini) */}
          <GlassCard hover={false} className="p-6 border-white/5 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-violet-400" />
              AI Counselor Integration
            </h3>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">Gemini API Credentials</label>
                <p className="text-[11px] text-zinc-500 mt-0.5 mb-2">Used directly inside the client to fetch answers from gemini-2.5-flash.</p>
                
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-4 w-4 text-zinc-500" />
                  </span>
                  <input
                    type={showKey ? "text" : "password"}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-9 pr-10 py-2.5 text-xs text-white bg-black/40 border border-white/10 rounded-xl focus:border-cyan-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white"
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-[10px] text-zinc-400 leading-relaxed space-y-1">
                <p>
                  🔑 Your API key is saved locally in your browser storage and never uploaded to external servers except direct Google API calls.
                </p>
                <p>
                  Get a free API key at{" "}
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline font-bold"
                  >
                    Google AI Studio
                  </a>.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
              >
                {isSaved ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Credentials Updated</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save API Credentials</span>
                  </>
                )}
              </button>
            </form>
          </GlassCard>

          {/* Account & Session Settings */}
          <GlassCard hover={false} className="p-6 border-white/5 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-rose-400" />
              Account & Session
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-zinc-300 block">Active Profile</span>
                <p className="text-[11px] text-zinc-500 mt-1">
                  Logged in as <strong className="text-zinc-200 font-semibold">{user?.name || user?.username || "Guest"}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={signOut}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-500/40 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout / End Session</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: HOTKEYS, SYNC & TARGETS */}
        <div className="space-y-6">
          {/* Keyboard Shortcuts Settings */}
          <GlassCard hover={false} className="p-6 border-white/5 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-emerald-400" />
                Keyboard Shortcuts
              </h3>

              <button
                type="button"
                onClick={() => setShortcutsEnabled(!shortcutsEnabled)}
                className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                  shortcutsEnabled
                    ? "bg-emerald-500/15 border-emerald-500 text-emerald-400"
                    : "border-white/5 bg-white/5 text-zinc-400"
                }`}
              >
                {shortcutsEnabled ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-semibold text-zinc-300">Exam Hall Shortcuts Legend</span>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Use these hotkeys inside standard practice and exam test environments to save screening time.
              </p>

              <div className="space-y-2 mt-2">
                {[
                  { key: "ArrowRight", action: "Navigate to the next question in the test." },
                  { key: "ArrowLeft", action: "Navigate to the previous question in the test." },
                  { key: "Space", action: "Cycle options (A → B → C → D) and clear selection." },
                  { key: "Ctrl + Enter", action: "Submit entire exam script for grading." },
                  { key: "Alt + C", action: "Toggle standard mathematical calculator widget." }
                ].map((item) => (
                  <div key={item.key} className="flex justify-between items-center p-2.5 rounded-xl bg-white/2 border border-white/5 text-[11px]">
                    <span className="font-semibold text-zinc-300">{item.action}</span>
                    <kbd className="px-2 py-1 rounded bg-zinc-800 border border-white/10 text-cyan-400 font-mono text-[10px]">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Sync & Target Pathways */}
          <GlassCard hover={false} className="p-6 border-white/5 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="h-4 w-4 text-amber-400" />
              Placement Benchmark Targets
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300">Hiring Benchmark Strategy</label>
                <p className="text-[11px] text-zinc-500 mt-0.5 mb-2">Adjusts platform recommendations based on typical hiring patterns.</p>
                
                <select
                  value={careerPath}
                  onChange={(e) => handleCareerPathChange(e.target.value)}
                  className="w-full text-xs text-white bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="product">Product / Frontend Engineer Benchmark</option>
                  <option value="fullstack">Full-Stack / Core Service Benchmark</option>
                  <option value="startup">Startup Builder / SaaS Architect Benchmark</option>
                </select>
              </div>

              {/* Explanatory text */}
              <div className="p-3.5 rounded-xl bg-white/2 border border-white/5 text-[11px] text-zinc-400 leading-relaxed">
                {careerPath === "product" && "📌 Focuses heavily on high-difficulty DSA and modern web technology stacks (Next.js, system performance, UI interactions)."}
                {careerPath === "fullstack" && "📌 Targets relational databases (SQL joins, transactions), networks, server deployments, and structured system designs."}
                {careerPath === "startup" && "📌 Emphasizes fast end-to-end shipping speed, API creation, rapid projects build metrics, and UI mockups."}
              </div>

              {/* Data Portability */}
              <div className="border-t border-white/5 pt-4">
                <span className="text-xs font-semibold text-zinc-300 block mb-1">Backup Offline Profile</span>
                <p className="text-[11px] text-zinc-500 mb-3">Download your streak records, question solve progress, and score logs in a single JSON backup.</p>
                <button
                  type="button"
                  onClick={handleExport}
                  className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs font-semibold text-white flex items-center gap-1.5 hover:bg-white/10 transition-all"
                >
                  <Download className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Download Progress Backup (JSON)</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
