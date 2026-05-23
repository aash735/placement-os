"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Flame, Rocket, Shield, Sparkles, Target, Zap } from "lucide-react";

const features = [
  { icon: Target, title: "Placement-First DSA", desc: "Not CP grind—campus-optimized patterns & curated questions" },
  { icon: Brain, title: "AI Mentor", desc: "Learn to think with AI—not depend on it" },
  { icon: Flame, title: "Anti-Burnout OS", desc: "Low-energy modes, recovery weeks, realistic schedules" },
  { icon: Sparkles, title: "Project-First Identity", desc: "Track Anony Talk, HireLens, J.A.R.V.I.S. as hiring assets" },
  { icon: Shield, title: "Company Hub", desc: "TCS to startups—OA patterns, HR prep, strategy" },
  { icon: Zap, title: "Gamified Execution", desc: "XP, streaks, quests—dopamine without toxicity" },
];

export default function LandingPage() {
  return (
    <div className="mesh-bg min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <Rocket className="h-7 w-7 text-cyan-400" />
          <span className="text-lg font-bold">Placement OS</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login" className="btn-ghost hidden sm:inline-flex">Log in</Link>
          <Link href="/dashboard" className="btn-primary">Launch App</Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12 text-center lg:pt-20">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-sm font-medium uppercase tracking-widest text-cyan-400">
          7th Semester · Product Engineer Path
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl"
        >
          Your placement prep,
          <br />
          <span className="gradient-text">rebuilt as an OS</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }} className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Notion × Duolingo × LeetCode—for creative frontend builders who learn by shipping, not endless theory.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }} className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/dashboard" className="btn-primary gap-2">
            Open Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/dsa/roadmap" className="btn-ghost">View DSA Roadmap</Link>
        </motion.div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <f.icon className="mb-3 h-8 w-8 text-cyan-400" />
            <h3 className="font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        Built for product-oriented CSE students · Good-enough DSA + strong projects
      </footer>
    </div>
  );
}
