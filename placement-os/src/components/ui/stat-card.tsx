import { LucideIcon } from "lucide-react";
import { GlassCard } from "./glass-card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  icon: LucideIcon;
  accent?: string;
  delay?: number;
};

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "from-cyan-400 to-violet-500",
  delay = 0,
}: StatCardProps) {
  return (
    <GlassCard delay={delay}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </p>
          <p
            className="mt-1.5 text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {value}
          </p>
          {sub && (
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              {sub}
            </p>
          )}
        </div>
        <div className={cn("shrink-0 rounded-xl bg-gradient-to-br p-2.5", accent)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </GlassCard>
  );
}
