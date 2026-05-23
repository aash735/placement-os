"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";

const PRESETS = [
  { label: "Focus", minutes: 25, color: "text-cyan-400" },
  { label: "Short Break", minutes: 5, color: "text-emerald-400" },
  { label: "Long Break", minutes: 15, color: "text-violet-400" },
];

export default function PomodoroPage() {
  const recordFocus = useProgressStore((s) => s.recordFocusMinutes);
  const [presetIdx, setPresetIdx] = useState(0);
  const [sec, setSec] = useState(PRESETS[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  // Use refs to prevent stale closures and interval leaks
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secRef = useRef(sec);
  const runningRef = useRef(running);

  secRef.current = sec;
  runningRef.current = running;

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    intervalRef.current = setInterval(() => {
      setSec((prev) => {
        if (prev <= 1) {
          clearTimer();
          setRunning(false);
          // Auto-record focus when a focus session completes
          if (presetIdx === 0) {
            recordFocus(PRESETS[0].minutes);
            setCycles((c) => c + 1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer, presetIdx, recordFocus]);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), [clearTimer]);

  const toggleRunning = () => {
    if (running) {
      clearTimer();
      setRunning(false);
    } else {
      setRunning(true);
      startTimer();
    }
  };

  const reset = () => {
    clearTimer();
    setRunning(false);
    const totalSec = PRESETS[presetIdx].minutes * 60;
    const elapsed = totalSec - sec;
    if (elapsed > 60 && presetIdx === 0) {
      recordFocus(Math.floor(elapsed / 60));
    }
    setSec(totalSec);
  };

  const switchPreset = (idx: number) => {
    clearTimer();
    setRunning(false);
    setPresetIdx(idx);
    setSec(PRESETS[idx].minutes * 60);
  };

  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const total = PRESETS[presetIdx].minutes * 60;
  const progress = ((total - sec) / total) * 100;
  const preset = PRESETS[presetIdx];

  return (
    <AppShell title="Pomodoro Timer" subtitle="Deep work cycles · Track your focus">
      <div className="max-w-md mx-auto space-y-4">
        {/* Preset selector */}
        <div className="flex gap-2 p-1 rounded-xl bg-black/20 border border-white/5">
          {PRESETS.map((p, i) => (
            <button
              key={p.label}
              onClick={() => switchPreset(i)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                presetIdx === i
                  ? "bg-white/10 text-white shadow"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Timer card */}
        <GlassCard className="p-8 text-center" hover={false}>
          {/* Circular progress ring */}
          <div className="relative mx-auto mb-6 w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80" cy="80" r="70"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              <circle
                cx="80" cy="80" r="70"
                fill="none"
                stroke={presetIdx === 0 ? "#22d3ee" : presetIdx === 1 ? "#34d399" : "#a78bfa"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - progress / 100)}`}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-mono text-5xl font-bold ${preset.color}`}>
                {m}:{s.toString().padStart(2, "0")}
              </span>
              <span className="text-xs text-zinc-500 mt-1">{preset.label}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={reset}
              className="h-11 w-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Reset timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={toggleRunning}
              className={`h-14 w-14 rounded-full flex items-center justify-center font-semibold transition-all shadow-lg ${
                running
                  ? "bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:bg-rose-500/30"
                  : "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30"
              }`}
              aria-label={running ? "Pause timer" : "Start timer"}
            >
              {running ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </button>
            <button
              onClick={() => switchPreset(1)}
              className="h-11 w-11 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Take a break"
              title="Short break"
            >
              <Coffee className="h-4 w-4" />
            </button>
          </div>
        </GlassCard>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <GlassCard className="p-4 text-center" hover={false}>
            <p className="text-2xl font-bold text-cyan-400">{cycles}</p>
            <p className="text-xs text-zinc-500 mt-1">Cycles Today</p>
          </GlassCard>
          <GlassCard className="p-4 text-center" hover={false}>
            <p className="text-2xl font-bold text-violet-400">{cycles * 25}m</p>
            <p className="text-xs text-zinc-500 mt-1">Focus Minutes</p>
          </GlassCard>
        </div>

        <p className="text-center text-xs text-zinc-600">
          Focus sessions auto-log to your analytics when completed or reset.
        </p>
      </div>
    </AppShell>
  );
}
