"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Rocket } from "lucide-react";
import { getSession, setSession, clearSession } from "@/lib/session-store";
import type { SessionUser } from "@/lib/session-store";
import { registerUser, loginUser } from "@/lib/custom-auth";
import { useProgressStore } from "@/lib/progress-store";

// ─── Auth Context Type ────────────────────────────────────────────────────────

type AuthContextType = {
  user: SessionUser | null;
  loading: boolean;
  signOut: () => void;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    username: string,
    password: string,
    name: string,
    semester: string,
    email?: string
  ) => Promise<{ error: string | null }>;
  signInAsGuest: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Protected routes (client-side guard) ─────────────────────────────────────

const PROTECTED_PATHS = [
  "/dashboard",
  "/dsa",
  "/revision",
  "/ai-mentor",
  "/analytics",
  "/companies",
  "/subjects",
  "/settings",
  "/focus",
  "/habits",
  "/pomodoro",
  "/planner",
  "/xp",
  "/achievements",
  "/low-energy",
  "/burnout",
  "/mock-interview",
  "/social-tracker",
  "/roadmap",
  "/topic",
  "/aptitude",
  "/projects",
  "/interview",
];

const AUTH_PATHS = ["/auth/login", "/auth/signup"];

function isProtected(path: string): boolean {
  return PROTECTED_PATHS.some((p) => path === p || path.startsWith(p + "/"));
}

function isAuthPath(path: string): boolean {
  return AUTH_PATHS.some((p) => path.startsWith(p));
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const hydrateFromDb = useProgressStore((s) => s.hydrateFromDb);
  const clearProgress = useProgressStore((s) => s.clearProgress);

  // ── On mount: restore session from localStorage ──────────────────────────
  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
      // Hydrate progress store from DB using stored user ID
      hydrateFromDb(session.id).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Route guard: runs whenever path changes ───────────────────────────────
  useEffect(() => {
    if (loading) return; // Wait for session restore before guarding

    if (!user && isProtected(pathname)) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    } else if (user && isAuthPath(pathname)) {
      router.replace("/dashboard");
    }
  }, [user, pathname, loading, router]);

  // ── Sign In ───────────────────────────────────────────────────────────────
  const signIn = async (
    username: string,
    password: string
  ): Promise<{ error: string | null }> => {
    const result = await loginUser(username, password);
    if (result.error || !result.user) {
      return { error: result.error ?? "Login failed." };
    }

    setSession(result.user);
    setUser(result.user);

    // Hydrate progress from DB
    try {
      await hydrateFromDb(result.user.id);
    } catch (err) {
      console.error("Hydration error on login:", err);
    }

    return { error: null };
  };

  // ── Sign Up ───────────────────────────────────────────────────────────────
  const signUp = async (
    username: string,
    password: string,
    name: string,
    semester: string,
    email?: string
  ): Promise<{ error: string | null }> => {
    const result = await registerUser(username, password, name, semester, email);
    if (result.error || !result.user) {
      return { error: result.error ?? "Registration failed." };
    }

    setSession(result.user);
    setUser(result.user);

    // No prior data to hydrate; just set userId in progress store
    useProgressStore.setState({ userId: result.user.id });

    return { error: null };
  };

  // ── Sign In As Guest ──────────────────────────────────────────────────────
  const signInAsGuest = () => {
    const guestUser: SessionUser = {
      id: "guest-user-id",
      username: "guest_builder",
      name: "Guest Builder",
      email: "guest@placementos.local",
      semester: "7th Semester — Placement Season",
      token: "guest-token",
      createdAt: new Date().toISOString(),
    };
    setSession(guestUser);
    setUser(guestUser);
    useProgressStore.setState({ userId: guestUser.id });
    router.replace("/dashboard");
  };

  // ── Sign Out ──────────────────────────────────────────────────────────────
  const signOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("placement-os-user");
      localStorage.removeItem("placement-os-session");
    }
    clearSession();
    setUser(null);
    clearProgress();
    router.replace("/auth/login");
  };

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="mesh-bg flex min-h-screen flex-col items-center justify-center p-6 text-zinc-100">
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30">
            <Rocket className="h-8 w-8 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 animate-spin rounded-2xl border border-transparent border-t-cyan-400" />
          </div>
          <div className="space-y-1.5 text-center">
            <h2 className="text-xl font-bold tracking-tight text-white">Placement OS</h2>
            <p className="text-sm text-zinc-500 font-medium">Restoring your session…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn, signUp, signInAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
