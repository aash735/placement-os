"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Rocket,
  User,
  Lock,
  Mail,
  GraduationCap,
  Eye,
  EyeOff,
  ArrowRight,
  AtSign,
} from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { hasSupabaseConfig } from "@/lib/supabase";
import { GlassCard } from "@/components/ui/glass-card";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInAsGuest } = useAuth();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [semester, setSemester] = useState("7th Semester — Placement Season");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password || !name.trim()) return;

    setLoading(true);
    setMessage(null);

    const { error } = await signUp(
      username.trim(),
      password,
      name.trim(),
      semester,
      email.trim() || undefined
    );

    if (error) {
      setMessage({ type: "error", text: error });
      setLoading(false);
    } else {
      setMessage({ type: "success", text: "Account created! Redirecting to Command Center…" });
      router.replace("/dashboard");
    }
  };

  return (
    <div className="mesh-bg flex min-h-screen items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <GlassCard className="p-8" hover={false}>
          {/* Header */}
          <div className="mb-6 flex items-center gap-2">
            <Rocket className="h-6 w-6 text-cyan-500" />
            <span className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
              Placement OS
            </span>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Create your OS
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {hasSupabaseConfig
                ? "Sign up to start your cloud-synced placement journey."
                : "Database not configured — accounts cannot be created."}
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
              {/* Full Name */}
              <label className="block text-sm">
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                  Full Name
                </span>
                <div className="relative mt-1.5">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-faint)" }} />
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="field-input w-full pl-9"
                    placeholder="John Doe"
                  />
                </div>
              </label>

              {/* Username */}
              <label className="block text-sm">
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                  Username
                </span>
                <div className="relative mt-1.5">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-faint)" }} />
                  <input
                    required
                    minLength={3}
                    pattern="[a-zA-Z0-9_.\\-]+"
                    title="Letters, numbers, underscores, dots, or hyphens only"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    className="field-input w-full pl-9"
                    placeholder="john_doe"
                  />
                </div>
                <p className="mt-1 text-[11px]" style={{ color: "var(--text-faint)" }}>
                  Letters, numbers, underscores, dots — 3+ chars
                </p>
              </label>

              {/* Email (Optional) */}
              <label className="block text-sm">
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                  Email{" "}
                  <span className="font-normal" style={{ color: "var(--text-faint)" }}>
                    (optional)
                  </span>
                </span>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-faint)" }} />
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="field-input w-full pl-9"
                    placeholder="you@college.edu (optional)"
                  />
                </div>
              </label>

              {/* Password */}
              <label className="block text-sm">
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                  Password
                </span>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-faint)" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="field-input w-full pl-9 pr-10"
                    placeholder="Min. 6 characters"
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

              {/* Semester */}
              <label className="block text-sm">
                <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
                  Semester
                </span>
                <div className="relative mt-1.5">
                  <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-faint)" }} />
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="field-input w-full pl-9 pr-4 appearance-none"
                  >
                    <option value="7th Semester — Placement Season">7th Semester — Placement Season</option>
                    <option value="6th Semester — Building Foundation">6th Semester — Building Foundation</option>
                    <option value="5th Semester or lower — Early Track">5th Semester or lower — Early Track</option>
                  </select>
                </div>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                id="signup-submit-btn"
                className="btn-primary mt-6 w-full flex items-center justify-center gap-2 py-2.5 font-semibold disabled:opacity-50"
              >
                {loading ? (
                  "Creating account…"
                ) : (
                  <>
                    Launch Placement OS <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-600 leading-relaxed">
                Supabase credentials have not been configured. Add them to{" "}
                <code className="rounded bg-black/10 px-1 py-0.5">.env.local</code> and restart.
              </div>
              <button
                type="button"
                onClick={signInAsGuest}
                className="btn-primary w-full py-2.5 font-bold tracking-wide flex items-center justify-center gap-1.5"
              >
                <Rocket className="h-4 w-4" /> Continue as Guest
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm" style={{ color: "var(--text-faint)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" className="text-cyan-500 font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
