"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  id?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
};

export function GlassCard({ children, className, hover = true, delay = 0, id, onClick, style }: GlassCardProps) {
  return (
    <motion.div
      id={id}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={hover ? { y: -3, scale: 1.005 } : undefined}
      onClick={onClick}
      className={cn(
        // Uses CSS custom properties — works in both dark and light mode
        "rounded-2xl border p-5 shadow-lg backdrop-blur-xl transition-shadow",
        "bg-[var(--bg-elevated)] border-[var(--border-normal)] shadow-[var(--shadow-card)]",
        hover && "cursor-pointer hover:shadow-[var(--shadow-hover)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
