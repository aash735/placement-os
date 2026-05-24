"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { Play, Pause, RotateCcw, Flame, CheckCircle, Shield } from "lucide-react";

export default function PomodoroPage() {
  const {
    focusSession,
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    resetFocusSession,
    tickFocusSession,
    completeFocusSession
  } = useProgressStore();

  // Suspension-resilient timer tick hook
  useEffect(() => {
    if (!focusSession.isRunning) return;

    let lastTime = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.round((now - lastTime) / 1000);
      if (elapsed >= 1) {
        tickFocusSession(elapsed);
        lastTime = now;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [focusSession.isRunning, tickFocusSession]);

  const m = Math.floor(focusSession.timeLeft / 60);
  const s = focusSession.timeLeft % 60;
  const progressPercent = focusSession.duration > 0 ? ((focusSession.duration - focusSession.timeLeft) / focusSession.duration) * 100 : 0;

  const handleStartDefault = () => {
    startFocusSession("Pomodoro Focus Session", 25, null);
  };

  return (
    <AppShell title="Pomodoro Focus" subtitle="25/5 work cycles with distraction blocking">
      <div className="max-w-md mx-auto space-y-6">
        <GlassCard className="text-center relative overflow-hidden p-8" hover={false}>
          {/* Subtle Progress Background */}
          <div
            className="absolute bottom-0 left-0 h-1 bg-cyan-500/20 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />

          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-950/10 text-xs font-semibold text-cyan-400">
              <Shield className="h-3.5 w-3.5" />
              Distraction Shield Active
            </span>

            {focusSession.startTime && (
              <p className="text-sm font-semibold text-zinc-300 truncate max-w-xs mx-auto">
                Current Task: {focusSession.task}
              </p>
            )}

            <p className="font-mono text-7xl font-extrabold tracking-tight text-white py-4 select-none">
              {m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}
            </p>

            <div className="flex justify-center gap-3 pt-2">
              {!focusSession.startTime ? (
                <button
                  onClick={handleStartDefault}
                  className="btn-primary px-6 py-2.5 flex items-center gap-2 font-bold"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Start Focus (25 min)
                </button>
              ) : (
                <>
                  {focusSession.isRunning ? (
                    <button
                      onClick={pauseFocusSession}
                      className="btn-primary bg-amber-600 hover:bg-amber-500 px-5 py-2.5 flex items-center gap-2 font-bold"
                    >
                      <Pause className="h-4 w-4 fill-current" />
                      Pause
                    </button>
                  ) : (
                    <button
                      onClick={resumeFocusSession}
                      className="btn-primary px-5 py-2.5 flex items-center gap-2 font-bold"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      Resume
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm("Reset current pomodoro? Elapse focus minutes will be recorded.")) {
                        completeFocusSession();
                        resetFocusSession();
                      }
                    }}
                    className="btn-ghost flex items-center gap-1.5 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 py-2.5 px-4"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </button>
                </>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Tip Deck */}
        <div className="flex gap-3 bg-zinc-900/20 border border-zinc-900 rounded-xl p-4 text-xs text-zinc-400 leading-relaxed">
          <Flame className="h-5 w-5 text-orange-500 shrink-0" />
          <p>
            The Pomodoro Technique is designed for intense focus bursts. Finish this 25-minute cycle, then take a short 5-minute break. Navigating away keeps the session ticking persistently in the background.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
