"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Rocket, X, LogOut } from "lucide-react";
import { mainNav } from "@/lib/navigation";
import { usePlacementStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DataProvider } from "@/components/providers/data-provider";
import { useAuth } from "@/components/providers/auth-provider";

export function AppShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { xp, level, streak } = usePlacementStore();
  const { user, signOut } = useAuth();

  return (
    <div className="mesh-bg min-h-screen" style={{ color: "var(--text-primary)" }}>
      <div className="flex min-h-screen">
        {/* ── Sidebar ── */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full"
          )}
          style={{
            background: "var(--bg-elevated)",
            borderRight: "1px solid var(--border-subtle)",
          }}
        >
          {/* Logo */}
          <div
            className="flex h-16 items-center gap-2 px-5"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <Rocket className="h-6 w-6 text-cyan-500" />
            <span className="font-bold tracking-tight gradient-text">Placement OS</span>
          </div>

          {/* Navigation */}
          <nav className="h-[calc(100vh-8rem)] overflow-y-auto p-3">
            {mainNav.map((group) => (
              <div key={group.title} className="mb-4">
                <p
                  className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-faint)" }}
                >
                  {group.title}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname.startsWith(item.href + "/"));
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "nav-item",
                            active && "active"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto badge-violet">{item.badge}</span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* User Footer */}
          <div
            className="absolute bottom-0 left-0 right-0 p-4 space-y-3"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            {user && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                      {user.name || user.username}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Lv.{level} · {xp} XP · 🔥 {streak}d
                    </p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="btn-logout"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </aside>

        {/* Mobile overlay */}
        {open && (
          <button
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
        )}

        {/* ── Main ── */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <header
            className="sticky top-0 z-20 flex h-16 items-center gap-4 px-4 lg:px-8"
            style={{
              background: "color-mix(in srgb, var(--bg-elevated) 85%, transparent)",
              borderBottom: "1px solid var(--border-subtle)",
              backdropFilter: "blur(20px)",
            }}
          >
            <button
              className="rounded-lg p-2 lg:hidden transition-colors"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1
                className="truncate text-base font-semibold lg:text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className="truncate text-xs lg:text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            <Link
              href="/focus"
              className="hidden rounded-full px-4 py-1.5 text-sm font-medium sm:block transition-colors"
              style={{
                background: "rgba(34,211,238,0.12)",
                color: "var(--accent-cyan)",
                border: "1px solid rgba(34,211,238,0.20)",
              }}
            >
              Enter Focus
            </Link>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 lg:p-8">
            <DataProvider>{children}</DataProvider>
          </main>
        </div>
      </div>
    </div>
  );
}
