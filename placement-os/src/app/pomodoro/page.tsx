"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";

export default function PomodoroPage() {
  const recordFocus = useProgressStore((s) => s.recordFocusMinutes);
  const [sec, setSec] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || sec <= 0) return;
    const t = setInterval(() => setSec((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, sec]);

  const m = Math.floor(sec / 60);
  const s = sec % 60;

  return (
    <AppShell title="Pomodoro" subtitle="25/5 cycles">
      <GlassCard className="text-center">
        <p className="font-mono text-6xl text-cyan-400">{m}:{s.toString().padStart(2, "0")}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => setRunning(!running)} className="btn-primary">{running ? "Pause" : "Start"}</button>
          <button
            onClick={() => {
              if (sec < 25 * 60) recordFocus(25 - Math.floor(sec / 60));
              setSec(25 * 60);
              setRunning(false);
            }}
            className="btn-ghost"
          >
            Reset & log focus
          </button>
        </div>
      </GlassCard>
    </AppShell>
  );
}
