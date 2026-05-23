"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy } from "lucide-react";
import { useAchievementToastStore, type AchievementToast } from "@/store/achievement-toast-store";
import { RARITY_CONFIG, ICON_MAP } from "@/lib/badges";
import { useProgressStore } from "@/lib/progress-store";

// ─── Mini Confetti Burst Component (CSS-driven, zero external JS cost) ──────────
function MiniConfetti({ disabled }: { disabled?: boolean }) {
  const [particles, setParticles] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    if (disabled) return;
    const colors = ["#22d3ee", "#a78bfa", "#fbbf24", "#38bdf8", "#ec4899", "#10b981"];
    const particlesCount = 28;

    const generated = Array.from({ length: particlesCount }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 45 + Math.random() * 65;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const size = 4 + Math.random() * 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const delay = Math.random() * 0.08;

      return {
        id: i,
        style: {
          position: "absolute",
          top: "50%",
          left: "50%",
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          borderRadius: Math.random() > 0.4 ? "50%" : "2px",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          animation: `achievement-confetti 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) ${delay}s forwards`,
          "--tx": `${tx}px`,
          "--ty": `${ty}px`,
        } as React.CSSProperties,
      };
    });
    setParticles(generated);
  }, [disabled]);

  if (disabled || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
      {particles.map((p) => (
        <span key={p.id} style={p.style} />
      ))}
    </div>
  );
}

// ─── Single Toast Item ──────────────────────────────────────────────────────────
function ToastItem({ toast, isLowEnergy }: { toast: AchievementToast; isLowEnergy: boolean }) {
  const removeToast = useAchievementToastStore((s) => s.removeToast);
  const cfg = RARITY_CONFIG[toast.rarity];
  const Icon = ICON_MAP[toast.iconName] || Trophy;

  // Auto dismiss
  useEffect(() => {
    const t = setTimeout(() => removeToast(toast.id), 5000);
    return () => clearTimeout(t);
  }, [toast.id, removeToast]);

  const glowColorMap = {
    Common: "rgba(115,115,115,0.1)",
    Rare: "rgba(34,211,238,0.25)",
    Epic: "rgba(167,139,250,0.3)",
    Legendary: "rgba(251,191,36,0.4)"
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="pointer-events-auto relative w-full overflow-visible"
    >
      {/* Confetti fly burst */}
      <MiniConfetti disabled={isLowEnergy} />

      {/* Main Toast UI */}
      <div
        className={`flex items-center gap-3.5 p-4 rounded-2xl border ${cfg.bg} ${cfg.border} ${cfg.glow} shadow-2xl relative overflow-hidden`}
        style={{
          borderWidth: "1.5px",
          animation: !isLowEnergy && (toast.rarity === "Legendary" || toast.rarity === "Epic")
            ? "achievement-glow-pulse 2.5s infinite ease-in-out"
            : undefined,
          ["--glow-color" as any]: glowColorMap[toast.rarity],
        } as React.CSSProperties}
      >
        {/* Animated Rarity Accent Line */}
        <div className={`absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b ${cfg.gradient}`} />

        {/* Badge Icon */}
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${cfg.gradient}`}
          style={{
            animation: !isLowEnergy ? "achievement-icon-wobble 0.8s ease-out 0.2s 1" : undefined
          }}
        >
          <Icon className="h-5.5 w-5.5 text-white" />
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400">
            🏆 Achievement Unlocked
          </p>
          <p className={`text-sm font-black truncate leading-snug mt-0.5 ${cfg.color}`}>
            {toast.name}
          </p>
          <p className="text-[11px] text-zinc-400 leading-snug truncate mt-0.5">
            {toast.description}
          </p>
          <span className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/5 mt-1 border border-white/5 capitalize ${cfg.color}`}>
            {toast.rarity}
          </span>
        </div>

        {/* Manual Close Button */}
        <button
          onClick={() => removeToast(toast.id)}
          className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-all shrink-0 cursor-pointer"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Global Container ───────────────────────────────────────────────────────────
export function AchievementToastContainer() {
  const toasts = useAchievementToastStore((s) => s.toasts);
  const energyMode = useProgressStore((s) => s.energyMode);
  const isLowEnergy = energyMode === "low";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes achievement-confetti {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(280deg) scale(0);
            opacity: 0;
          }
        }
        @keyframes achievement-glow-pulse {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(0,0,0,0.5), 0 0 10px var(--glow-color);
          }
          50% {
            box-shadow: 0 4px 12px rgba(0,0,0,0.5), 0 0 24px var(--glow-color);
          }
        }
        @keyframes achievement-icon-wobble {
          0%, 100% { transform: scale(1) rotate(0deg); }
          20% { transform: scale(1.2) rotate(-12deg); }
          45% { transform: scale(1.2) rotate(10deg); }
          70% { transform: scale(1.1) rotate(-6deg); }
          85% { transform: scale(1.1) rotate(4deg); }
        }
      `}} />

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} isLowEnergy={isLowEnergy} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
