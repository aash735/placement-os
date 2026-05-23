import { GlassCard } from "@/components/ui/glass-card";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <GlassCard
      className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      hover={false}
    >
      <div className="min-w-0 flex-1">
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h2>
        {description && (
          <p
            className="mt-1 max-w-2xl text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </GlassCard>
  );
}
