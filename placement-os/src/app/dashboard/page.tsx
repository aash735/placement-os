"use client";

import Link from "next/link";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { 
  Brain, 
  Calendar, 
  Flame, 
  Target, 
  Trophy, 
  Zap, 
  AlertTriangle, 
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  BookOpen,
  Briefcase,
  CheckCircle
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/ui/stat-card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { QuestionCard } from "@/components/dsa/question-card";
import { useProgressStore } from "@/lib/progress-store";
import { useDSAStats } from "@/hooks/use-dsa";
import { useDataStore } from "@/store/data-store";
import { computePlacementReadiness } from "@/lib/dsa-engine";
import { format } from "date-fns";

export default function DashboardPage() {
  const xp = useProgressStore((s) => s.xp);
  const level = useProgressStore((s) => s.level);
  const streak = useProgressStore((s) => s.streak);
  const placementReadiness = useProgressStore((s) => s.placementReadiness);
  const confidenceScore = useProgressStore((s) => s.confidenceScore);
  const productivityScore = useProgressStore((s) => s.productivityScore);
  const focusScore = useProgressStore((s) => s.focusScore);
  const completedToday = useProgressStore((s) => s.completedToday);
  const completeTask = useProgressStore((s) => s.completeTask);
  const setQuestionStatus = useProgressStore((s) => s.setQuestionStatus);
  const aptitudeAttempts = useProgressStore((s) => s.aptitudeAttempts ?? []);
  const projects = useProgressStore((s) => s.projects ?? []);
  const csSubjects = useProgressStore((s) => s.csSubjects ?? {});
  const dailyLogs = useProgressStore((s) => s.dailyLogs ?? []);

  const { dueRevisions, weakTopics, dailyChallenge, solved, total } = useDSAStats();

  const weekData = dailyLogs.slice(-7).map((l) => ({
    day: format(new Date(l.date), "EEE"),
    xp: l.xpEarned,
    solved: l.questionsSolved,
  }));

  // Compute stats for achievements
  const totalFocusMin = dailyLogs.reduce((acc, l) => acc + (l.focusMinutes || 0), 0);
  const totalSolvedDSA = solved;
  const totalAptMock = aptitudeAttempts.length;
  
  // Badge Definitions
  const achievements = [
    {
      id: "badge-dsa-ninja",
      name: "DSA Ninja",
      desc: "Solve 10+ DSA questions",
      unlocked: totalSolvedDSA >= 10,
      icon: Target,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      id: "badge-quant-wizard",
      name: "Quant Wizard",
      desc: "Complete 1+ Aptitude Mock Tests",
      unlocked: totalAptMock >= 1,
      icon: Sparkles,
      color: "text-violet-400 bg-violet-500/10 border-violet-500/30",
    },
    {
      id: "badge-focus-master",
      name: "Focus Master",
      desc: "Log 60+ Focus Minutes",
      unlocked: totalFocusMin >= 60,
      icon: Zap,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "badge-streak-legend",
      name: "Streak Legend",
      desc: "Maintain a 3+ day streak",
      unlocked: streak >= 3,
      icon: Flame,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    }
  ];

  // Daily quests list
  const dailyQuests = [
    { 
      id: "quest-dsa", 
      title: "Solve today's DSA challenge", 
      xp: 50, 
      href: "/dsa/daily", 
      action: () => dailyChallenge && setQuestionStatus(dailyChallenge.id, "solved", dailyChallenge.estimatedMinutes) 
    },
    { 
      id: "quest-aptitude", 
      title: "Practice a Mock Aptitude Test", 
      xp: 40, 
      href: "/aptitude" 
    },
    { 
      id: "quest-project", 
      title: "Update a project readiness metric", 
      xp: 30, 
      href: "/projects" 
    },
  ];

  // Component breakdown for Placement Readiness
  // 1. DSA Sheet Progress (50%)
  const questions = useDataStore((s) => s.questions);
  const questionProgress = useProgressStore((s) => s.questionProgress);
  const dsaWeightVal = computePlacementReadiness(questions, questionProgress);
  
  // 2. Aptitude Performance (20%)
  let aptWeightVal = 0;
  if (aptitudeAttempts.length > 0) {
    const totalCorrect = aptitudeAttempts.reduce((acc, a) => acc + a.correctAnswers, 0);
    const totalQuestions = aptitudeAttempts.reduce((acc, a) => acc + a.totalQuestions, 0);
    aptWeightVal = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  }
  // 3. Project Completion (20%)
  let projWeightVal = 0;
  if (projects.length > 0) {
    const totalReadiness = projects.reduce((acc, p) => acc + p.readiness, 0);
    projWeightVal = Math.round(totalReadiness / projects.length);
  }
  // 4. CS Core Subjects (10%)
  let totalChecked = 0;
  Object.values(csSubjects).forEach((sub: any) => {
    if (sub?.checkedItems) {
      totalChecked += sub.checkedItems.length;
    }
  });
  const csWeightVal = Math.min(100, Math.round((totalChecked / 20) * 100));

  return (
    <AppShell title="Command Center" subtitle={`${format(new Date(), "EEEE, MMMM d")} · System Live`}>
      <PageHeader
        title="Welcome back, Builder"
        description={`${solved}/${total} DSA problems completed · ${totalAptMock} Aptitude mock exams logged`}
        action={<Link href="/dsa/daily" className="btn-primary text-sm shadow-[0_4px_15px_rgba(6,182,212,0.25)]">Continue Roadmap</Link>}
      />

      {/* CORE METRICS ROW */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Placement Readiness" value={`${placementReadiness}%`} sub="4-component weighted score" icon={Target} />
        <StatCard label="Rank Level" value={level} sub={`${xp} total XP`} icon={Trophy} accent="from-amber-400 to-orange-500" />
        <StatCard label="Consistency Streak" value={`${streak} days`} sub="Daily study commitment" icon={Flame} accent="from-orange-400 to-rose-500" />
        <StatCard label="Productivity Rating" value={`${productivityScore}%`} sub={`Focus minutes: ${totalFocusMin}m`} icon={Zap} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* WEEKLY ACTIVITY GRAPH */}
        <GlassCard className="lg:col-span-2 p-6" delay={0.1}>
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-cyan-400" />
            Weekly Learning Activity
          </h3>
          <p className="text-xs text-zinc-500 mt-1">XP gains recorded over the last 7 active sessions</p>
          
          <div className="mt-6 h-48 min-h-[12rem]">
            <ResponsiveContainer width="100%" height="100%" minHeight={192}>
              <AreaChart data={weekData.length ? weekData : [{ day: "—", xp: 0, solved: 0 }]}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-normal)", borderRadius: 12, color: "var(--text-primary)" }} labelStyle={{ color: "var(--text-secondary)" }} />
                <Area type="monotone" dataKey="xp" stroke="#22d3ee" fill="url(#xpGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* WEIGHTED READINESS CIRCLE & EXPLANATION */}
        <GlassCard className="p-6 flex flex-col justify-between" delay={0.15}>
          <div className="flex flex-col items-center pt-2">
            <ProgressRing value={placementReadiness} size={130} />
            <p className="mt-4 text-center text-sm font-semibold text-white">Placement Readiness</p>
            <p className="text-xs text-zinc-500 mt-0.5">Confidence Score: {confidenceScore}%</p>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4 space-y-2.5 relative group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                Readiness Weights
              </span>
              <span className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer underline decoration-dotted">
                How is this calculated?
              </span>
            </div>

            {/* Hover Tooltip Popover */}
            <div className="absolute bottom-full left-0 right-0 mb-3 hidden group-hover:block z-30 p-4 rounded-xl border border-white/10 bg-black/95 backdrop-blur-xl text-[11px] text-zinc-300 leading-relaxed shadow-xl animate-fade-in pointer-events-none">
              <p className="font-bold text-white mb-2 text-xs">Readiness Score Formula</p>
              <p className="mb-2">Formula: <code className="text-cyan-400">DSA*50% + Aptitude*20% + Projects*20% + CS Core*10%</code></p>
              
              <div className="space-y-1.5 border-t border-white/10 pt-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">DSA Component:</span>
                  <span className="font-semibold text-white">{dsaWeightVal}% (Raw: {solved}/{total} solved, {questions.filter(q => questionProgress[q.id]?.status === "mastered").length} mastered)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Aptitude:</span>
                  <span className="font-semibold text-white">{aptWeightVal}% (Raw: {aptitudeAttempts.length > 0 ? `${aptitudeAttempts.reduce((acc, a) => acc + a.correctAnswers, 0)}/${aptitudeAttempts.reduce((acc, a) => acc + a.totalQuestions, 0)} correct` : "No tests"})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Projects:</span>
                  <span className="font-semibold text-white">{projWeightVal}% (Raw: {projects.length} projects average)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">CS Core:</span>
                  <span className="font-semibold text-white">{csWeightVal}% (Raw: {totalChecked}/20 topics)</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold">
                <span className="text-zinc-400">Weighted Total:</span>
                <span className="text-violet-400">{(dsaWeightVal * 0.5 + aptWeightVal * 0.2 + projWeightVal * 0.2 + csWeightVal * 0.1).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between font-bold text-xs mt-0.5">
                <span className="text-zinc-400">Final Rounded Score:</span>
                <span className="text-cyan-400">{placementReadiness}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-zinc-400">DSA (50%)</span>
                <span className="text-cyan-400 font-bold">{dsaWeightVal}%</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-zinc-400">Aptitude (20%)</span>
                <span className="text-violet-400 font-bold">{aptWeightVal}%</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-zinc-400">Projects (20%)</span>
                <span className="text-amber-400 font-bold">{projWeightVal}%</span>
              </div>
              <div className="flex justify-between p-1.5 rounded bg-white/5 border border-white/5">
                <span className="text-zinc-400">CS Core (10%)</span>
                <span className="text-emerald-400 font-bold">{csWeightVal}%</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* DAILY QUESTS / TARGETS */}
        <GlassCard className="p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <Calendar className="h-4.5 w-4.5 text-cyan-400" /> 
            Active Daily Quests
          </h3>
          <ul className="space-y-3">
            {dailyQuests.map((q) => {
              const done = completedToday.includes(q.id);
              return (
                <li key={q.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/20 p-3.5 hover:bg-white/5 transition-all">
                  <button
                    onClick={() => {
                      completeTask(q.id);
                      q.action?.();
                    }}
                    className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                      done ? "border-cyan-400 bg-cyan-500 text-black" : "border-zinc-600 hover:border-zinc-400 bg-black/40"
                    }`}
                    aria-label={`Complete ${q.title}`}
                  >
                    {done && <CheckCircle className="h-3.5 w-3.5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${done ? "text-zinc-500 line-through font-medium" : "text-white font-medium"}`}>
                      {q.title}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">+{q.xp} XP reward</p>
                  </div>
                  <Link href={q.href} className="text-xs text-cyan-400 font-semibold hover:underline flex items-center">
                    <span>Go</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </GlassCard>

        {/* ACHIEVEMENTS / BADGES */}
        <GlassCard className="p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <Award className="h-4.5 w-4.5 text-violet-400" />
            Milestone Achievement Badges
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {achievements.map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`flex items-start space-x-3 p-3 rounded-xl border transition-all ${
                    badge.unlocked
                      ? `${badge.color} shadow-[0_0_10px_rgba(255,255,255,0.02)]`
                      : "bg-white/2 border-white/5 opacity-40 grayscale"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${badge.unlocked ? "bg-black/30" : "bg-black/10"}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{badge.desc}</p>
                    <span className="text-[9px] font-semibold mt-1 inline-block">
                      {badge.unlocked ? "✓ Unlocked" : "Locked"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* SRS REVISIONS SECTION */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <RotateCcw className="h-4.5 w-4.5 text-amber-400" /> 
            Pending Spaced Revisions ({dueRevisions.length})
          </h3>
          {dueRevisions.length === 0 ? (
            <div className="py-6 text-center border border-dashed border-white/5 rounded-xl">
              <BookOpen className="h-7 w-7 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">No revisions due today.</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">We track your solved questions using an SRS algorithm.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dueRevisions.slice(0, 3).map(({ question }) => (
                <div key={question.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-xs font-semibold text-white truncate max-w-[70%]">
                    {question.title}
                  </span>
                  <Link
                    href={`/dsa/question/${question.id}`}
                    className="text-xs font-bold text-cyan-400 light:text-cyan-600 hover:text-white px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 border border-cyan-500/20 hover:text-black transition-all"
                  >
                    Review Now
                  </Link>
                </div>
              ))}
              <div className="text-center pt-2">
                <Link href="/revision" className="text-xs text-cyan-400 hover:underline">
                  View complete revision queue →
                </Link>
              </div>
            </div>
          )}
        </GlassCard>

        {/* WEAK AREA ALERTS */}
        <GlassCard className="p-6">
          <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-400" /> 
            Placement Vulnerabilities
          </h3>
          {weakTopics.length === 0 ? (
            <div className="py-6 text-center border border-dashed border-white/5 rounded-xl">
              <Target className="h-7 w-7 text-zinc-600 mx-auto mb-2" />
              <p className="text-xs text-zinc-500">No vulnerabilities detected.</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Keep solving to maintain topic proficiency.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">
                The algorithm identified structural weaknesses in these topics based on attempts:
              </p>
              <div className="flex flex-wrap gap-2">
                {weakTopics.map((w) => (
                  <Link key={w.topicId} href={`/dsa/topic/${w.topicId}`} className="flex items-center space-x-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/20 transition-all">
                    <span>{w.name}</span>
                    <span className="text-[10px] text-zinc-400">({w.score}%)</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* TODAY'S CHALLENGE */}
      {dailyChallenge && (
        <div className="mt-6">
          <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
            <Brain className="h-4.5 w-4.5 text-violet-400 animate-pulse" /> 
            Today&apos;s Featured Challenge
          </h3>
          <QuestionCard question={dailyChallenge} />
        </div>
      )}

      {/* NAVIGATION LINKS */}
      <div className="mt-8 border-t border-white/5 pt-6 flex flex-wrap gap-3">
        <Link href="/ai-mentor" className="btn-ghost text-xs font-semibold flex items-center gap-1">
          <Brain className="h-3.5 w-3.5 text-violet-400" /> AI Mentor
        </Link>
        <Link href="/projects" className="btn-ghost text-xs font-semibold flex items-center gap-1">
          <Briefcase className="h-3.5 w-3.5 text-amber-400" /> Projects Board
        </Link>
        <Link href="/subjects" className="btn-ghost text-xs font-semibold flex items-center gap-1">
          <BookOpen className="h-3.5 w-3.5 text-emerald-400" /> Core CS Tracker
        </Link>
        <Link href="/settings" className="btn-ghost text-xs font-semibold flex items-center gap-1">
          <Layers className="h-3.5 w-3.5 text-zinc-400" /> Settings
        </Link>
      </div>
    </AppShell>
  );
}
