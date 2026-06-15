"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useDataStore } from "@/store/data-store";
import { useProgressStore } from "@/lib/progress-store";
import { tcsCodingQuestions } from "@/data/tcs-questions";
import { getTcsSlugFromResourceId } from "@/lib/tcs-utils";
import { 
  ChevronLeft, 
  Terminal, 
  Code2, 
  Play, 
  CheckCircle, 
  Sparkles, 
  FileCode, 
  Award, 
  Cpu, 
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CodingChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // Load resources & progress state
  const resources = useDataStore((s) => s.resources || []);
  const resourceProgress = useProgressStore((s) => s.resourceProgress ?? {});
  const setResourceProgress = useProgressStore((s) => s.setResourceProgress);
  const addXp = useProgressStore((s) => s.addXp);

  // Find matching coding challenge
  const challenge = tcsCodingQuestions.find((q) => q.id === id);

  // Find corresponding resource ID
  const matchingResource = challenge
    ? resources.find((r) => getTcsSlugFromResourceId(r.id) === id)
    : null;

  const resourceId = matchingResource?.id || `tcs-res-${id}`;
  const isCompleted = resourceProgress[resourceId] === "completed";

  // Code editor states
  const [language, setLanguage] = useState("cpp");
  const [userCode, setUserCode] = useState("");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Initialize placeholder code based on selected language
  useEffect(() => {
    if (challenge) {
      if (language === "cpp" || language === "c") {
        setUserCode(challenge.solutionCode || "// Write your code here");
      } else if (language === "python") {
        setUserCode(`# Python Solution for: ${challenge.title}\n\ndef solve():\n    # Enter code here\n    pass\n\nif __name__ == '__main__':\n    solve()`);
      } else if (language === "java") {
        setUserCode(`import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write code here\n    }\n}`);
      } else {
        setUserCode(`// Javascript Solution\nfunction main() {\n    // Write code here\n}\n\nmain();`);
      }
    }
  }, [language, challenge]);

  if (!challenge) {
    return (
      <AppShell title="Challenge Not Found">
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <AlertCircle className="h-12 w-12 text-rose-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Coding Challenge Not Found</h2>
          <p className="text-zinc-400 mb-6 max-w-md">The requested coding challenge could not be located in the question database.</p>
          <Link href="/companies/tcs" className="btn-primary">Return to TCS Prep Hub</Link>
        </div>
      </AppShell>
    );
  }

  // Handle run code
  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleLogs(["🚀 Initializing sandbox environment...", "📦 Compiling source code..."]);

    setTimeout(() => {
      setConsoleLogs((prev) => [
        ...prev,
        "⚙️ Running simulated test cases...",
        "🟢 Test Case 1: Passed!",
        "🟢 Test Case 2: Passed!",
        "🎉 Verification complete. Code outputs match correct expectations.",
      ]);
      setIsRunning(false);
    }, 1500);
  };

  // Handle submit code
  const handleSubmitCode = () => {
    setIsSubmitting(true);
    setConsoleLogs((prev) => [...prev, "🚀 Submitting code to evaluation server..."]);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);

      // Award progress and XP if not completed already
      if (!isCompleted) {
        setResourceProgress(resourceId, "completed");
        // We award 100 XP for completing a native coding challenge
        addXp(100);
      }
    }, 1200);
  };

  // Estimated XP Reward
  const xpReward = matchingResource?.xpReward || 100;

  return (
    <AppShell title={challenge.title} subtitle="Corporate Coding Challenge">
      {/* BACK BUTTON */}
      <div className="mb-4">
        <Link 
          href="/companies/tcs?tab=resources" 
          className="inline-flex items-center text-xs font-semibold text-zinc-400 hover:text-white transition-all gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to TCS Hub</span>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* LEFT COLUMN: PROBLEM DESCRIPTION (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-6 h-[72vh] flex flex-col justify-between overflow-y-auto border-white/5" hover={false}>
            <div>
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {challenge.difficulty}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-white/5 text-zinc-400 border border-white/5">
                    {challenge.topicId.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>{challenge.estimatedMinutes} mins</span>
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl font-bold text-white mb-4">{challenge.title}</h2>
              <div className="space-y-4 text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                  <p className="font-semibold text-white mb-2">Problem Statement</p>
                  <p>{challenge.description}</p>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">Input Format</p>
                  <p className="text-xs text-zinc-400 font-mono bg-black/30 p-2.5 rounded-lg border border-white/5">
                    Standard input stream containing parameters. Refer to code stub/comments.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-white mb-2">Output Format</p>
                  <p className="text-xs text-zinc-400 font-mono bg-black/30 p-2.5 rounded-lg border border-white/5">
                    Print the resulting outputs or output patterns on a new line.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions: View Solution */}
            <div className="border-t border-white/5 pt-4 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Award className="h-4 w-4" />
                  <span>+{xpReward} XP Reward</span>
                </div>

                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <FileCode className="h-4 w-4" />
                  <span>{showSolution ? "Hide Solution" : "Reveal Solution"}</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: CODE EDITOR & CONSOLE (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* EDITOR CARD */}
          <GlassCard className="p-4 border-white/5 flex flex-col justify-between" hover={false}>
            <div>
              {/* Toolbar */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <Code2 className="h-4 w-4" />
                  <span>Interactive Editor</span>
                </div>

                {/* Language Selector */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-black/60 border border-white/10 rounded-lg text-xs font-semibold px-2 py-1 text-zinc-300 outline-none focus:border-cyan-400 transition-all cursor-pointer"
                >
                  <option value="cpp">C++ (GCC 17)</option>
                  <option value="c">C (GCC 11)</option>
                  <option value="python">Python 3.10</option>
                  <option value="java">Java 17</option>
                  <option value="javascript">JavaScript (ES6)</option>
                </select>
              </div>

              {/* Textarea Code Stub */}
              <div className="relative font-mono text-xs rounded-xl overflow-hidden border border-white/5 bg-black/40">
                {/* Simulated editor line numbers */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-black/60 text-zinc-600 flex flex-col items-center pt-3 select-none border-r border-white/5">
                  {Array.from({ length: Math.max(15, userCode.split("\n").length) }).map((_, i) => (
                    <span key={i} className="leading-relaxed h-[18px] block">{i + 1}</span>
                  ))}
                </div>

                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  spellCheck={false}
                  className="w-full h-[40vh] bg-transparent text-zinc-200 outline-none pl-11 pr-4 py-3 leading-relaxed font-mono resize-none focus:text-white"
                />
              </div>
            </div>

            {/* Run Actions */}
            <div className="flex items-center justify-end gap-2 mt-4 pt-2 border-t border-white/5">
              <button
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 disabled:opacity-35 transition-all flex items-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isRunning ? "Running..." : "Run Tests"}</span>
              </button>

              <button
                onClick={handleSubmitCode}
                disabled={isRunning || isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white disabled:opacity-35 transition-all flex items-center gap-1.5 shadow-[0_4px_15px_rgba(6,182,212,0.15)]"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{isSubmitting ? "Submitting..." : "Submit Code"}</span>
              </button>
            </div>
          </GlassCard>

          {/* MOCK CONSOLE CARD */}
          <GlassCard className="p-4 border-white/5" hover={false}>
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-400 border-b border-white/5 pb-2 mb-2">
              <Terminal className="h-3.5 w-3.5" />
              <span>Console Output</span>
            </div>

            <div className="h-[12vh] overflow-y-auto font-mono text-[11px] text-zinc-300 space-y-1 bg-black/60 p-3 rounded-lg border border-white/5 select-text">
              {consoleLogs.length === 0 ? (
                <span className="text-zinc-500">Run code or submit to view compiling results here.</span>
              ) : (
                consoleLogs.map((log, idx) => (
                  <p key={idx} className="leading-normal">{log}</p>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* SOLUTION MODAL/DRAWER */}
      <AnimatePresence>
        {showSolution && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-x-4 bottom-4 z-40 max-w-4xl mx-auto"
          >
            <GlassCard className="p-5 border-cyan-500/20 shadow-2xl relative" hover={false}>
              <div className="flex justify-between items-center mb-3 border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center">
                  <FileCode className="h-4 w-4 mr-1.5" /> Parsed Solution Code (C/C++ Reference)
                </span>
                <button
                  onClick={() => setShowSolution(false)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="max-h-[30vh] overflow-y-auto bg-black/60 rounded-xl border border-white/5 p-4">
                <pre className="text-xs font-mono text-cyan-300/95 leading-relaxed whitespace-pre-wrap select-text">
                  {challenge.solutionCode}
                </pre>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS POPUP MODAL */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm"
          >
            <GlassCard className="max-w-md p-8 text-center border-emerald-500/20" hover={false}>
              <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-7 w-7 text-emerald-400 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Challenge Solved!</h2>
              <p className="text-sm text-zinc-400 mb-6">
                Congratulations! Your solution for <span className="text-cyan-400 font-semibold">{challenge.title}</span> has passed all test cases.
              </p>

              <div className="flex items-center justify-center gap-6 py-3 px-4 rounded-xl bg-white/2 border border-white/5 mb-6">
                <div className="text-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase block">XP Awarded</span>
                  <span className="text-lg font-bold text-emerald-400 mt-0.5 block">+{xpReward} XP</span>
                </div>
                <div className="h-8 w-px bg-white/5" />
                <div className="text-center">
                  <span className="text-xs font-bold text-zinc-500 uppercase block">Checklist Status</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">Completed</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push("/companies/tcs?tab=resources");
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-[0_4px_15px_rgba(16,185,129,0.3)] transition-all"
              >
                Continue Preparation
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
