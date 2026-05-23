"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Rocket,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { hasSupabaseConfig } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/glass-card";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setMessage(null);

    const { error } = await signIn(username.trim(), password);

    if (error) {
      setMessage({ type: "error", text: error });
      setLoading(false);
    } else {
      setMessage({ type: "success", text: "Login successful! Loading dashboard…" });
      router.replace("/dashboard");
    }
  };

  const handleGuestBypass = () => {
    router.push("/dashboard");
  };

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8" hover={false}>
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-cyan-500" />
              <span
                className="font-bold text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                Placement OS
              </span>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 text-[10px] font-semibold text-cyan-500">
              <Shield className="h-3 w-3" /> Secure Login
            </span>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {hasSupabaseConfig
                ? "Sign in with your username and password."
                : "Credentials sync is unavailable — database not configured."}
            </p>
          </div>

          {/* Status message */}
          {message && (
            <div
              className={`mt-4 rounded-xl border p-3.5 text-xs ${
                message.type === "success"
                  ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600"
                  : "border-rose-500/25 bg-rose-500/10 text-rose-600"
              }`}
            >
              {message.text}
            </div>
          )}

          {hasSupabaseConfig ? (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {/* Username */}
              <label className="block text-sm">
                <span
                  className="font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Username
                </span>
                <div className="relative mt-1.5">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                    style={{ color: "var(--text-faint)" }}
                  />
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="field-input w-full pl-9"
                    placeholder="your_username"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block text-sm">
                <span
                  className="font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Password
                </span>
                <div className="relative mt-1.5">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                    style={{ color: "var(--text-faint)" }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="field-input w-full pl-9 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors focus:outline-none"
                    style={{ color: "var(--text-faint)" }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                id="login-submit-btn"
                className="btn-primary mt-6 w-full flex items-center justify-center gap-2 py-2.5 font-semibold disabled:opacity-50"
              >
                {loading ? (
                  "Authenticating…"
                ) : (
                  <>
                    Continue to Command Center <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Guest mode fallback */
            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-600 leading-relaxed">
                No Supabase credentials found in{" "}
                <code className="rounded bg-black/10 px-1 py-0.5">.env.local</code>.
                The app will run in offline guest mode — your progress will be saved locally only.
              </div>
              <button
                type="button"
                onClick={handleGuestBypass}
                className="btn-primary w-full py-2.5 font-bold tracking-wide flex items-center justify-center gap-1.5"
              >
                <Rocket className="h-4 w-4" /> Enter Workspace as Guest
              </button>
            </div>
          )}

          {/* Footer */}
          {hasSupabaseConfig && (
            <div className="mt-6 text-center text-xs" style={{ color: "var(--text-faint)" }}>
              New to Placement OS?{" "}
              <Link href="/auth/signup" className="text-cyan-500 font-semibold hover:underline">
                Create an account
              </Link>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
