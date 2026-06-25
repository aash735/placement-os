"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useProgressStore } from "@/lib/progress-store";
import { aptitudeQuestions } from "@/data/aptitude-questions";
import { motion } from "framer-motion";
import { 
  Play, 
  Award, 
  Activity, 
  Clock, 
  AlertCircle, 
  Settings, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORY_MAP = {
  quant: "Quantitative Aptitude",
  logical: "Logical Reasoning",
  verbal: "Verbal Ability",
  di: "Data Interpretation (DI)",
  puzzles: "Brain Teasers & Puzzles",
};

const PRESETS = [
  {
    id: "preset-tcs",
    name: "TCS NQT Prep Mock",
    description: "Quantitative, Logical and Verbal sections standard assessment.",
    questions: 15,
    time: 20,
    categories: ["quant", "logical", "verbal"],
    negMarking: true,
    difficulty: "Medium",
    company: "TCS"
  },
  {
    id: "preset-infosys",
    name: "Infosys Cognitive Assessment",
    description: "Puzzles and Logical reasoning focus for system engineers.",
    questions: 10,
    time: 15,
    categories: ["logical", "puzzles"],
    negMarking: false,
    difficulty: "Hard",
    company: "Infosys"
  },
  {
    id: "preset-deloitte",
    name: "Deloitte Aptitude & DI",
    description: "Verbal, DI, and Quantitative reasoning assessment.",
    questions: 20,
    time: 25,
    categories: ["quant", "verbal", "di"],
    negMarking: true,
    difficulty: "Medium",
    company: "Deloitte"
  },
  {
    id: "preset-general",
    name: "General Placement Mock",
    description: "Comprehensive mock test with all 5 core sections.",
    questions: 25,
    time: 30,
    categories: ["quant", "logical", "verbal", "di", "puzzles"],
    negMarking: true,
    difficulty: "Medium",
    company: "All MNCs"
  }
];

export default function AptitudePage() {
  const { aptitudeAttempts = [], refreshScores } = useProgressStore();
  
  // Custom builder states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["quant", "logical"]);
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [timeLimit, setTimeLimit] = useState<number>(20);
  const [negMarking, setNegMarking] = useState<boolean>(true);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // Calculate statistics
  const totalTests = aptitudeAttempts.length;
  const averageScore = totalTests > 0 
    ? Math.round((aptitudeAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalTests))
    : 0;
  
  const totalCorrect = aptitudeAttempts.reduce((acc, curr) => acc + curr.correctAnswers, 0);
  const totalAnswered = aptitudeAttempts.reduce((acc, curr) => acc + curr.correctAnswers + curr.wrongAnswers, 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Category accuracy stats
  const categoryStats = Object.keys(CATEGORY_MAP).map(catKey => {
    let catTotal = 0;
    let catCorrect = 0;
    
    aptitudeAttempts.forEach(attempt => {
      if (attempt.answers) {
        // Find questions belonging to this category in this attempt
        Object.entries(attempt.answers).forEach(([qId, ans]) => {
          const q = aptitudeQuestions.find(aq => aq.id === qId);
          if (q && q.category === catKey) {
            catTotal++;
            if (q.answer === ans) {
              catCorrect++;
            }
          }
        });
      }
    });

    const pct = catTotal > 0 ? Math.round((catCorrect / catTotal) * 100) : 0;
    return {
      key: catKey,
      name: CATEGORY_MAP[catKey as keyof typeof CATEGORY_MAP],
      accuracy: pct,
      attempts: catTotal
    };
  });

  return (
    <AppShell title="Aptitude Hub" subtitle="Master quantitative, logical, verbal, and puzzles">
      <PageHeader 
        title="Aptitude & Logical Practice" 
        description="Aptitude is the first elimination round for 90% of on-campus placement drives. Sharpen your skills with timed mock tests." 
      />

      {/* STATS OVERVIEW */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard className="flex items-center space-x-4 p-5" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Mock Tests Attempted</p>
            <h3 className="text-2xl font-bold text-white">{totalTests}</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4 p-5" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Average Score</p>
            <h3 className="text-2xl font-bold text-white">{averageScore}%</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4 p-5" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Overall Accuracy</p>
            <h3 className="text-2xl font-bold text-white">{accuracy}%</h3>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center space-x-4 p-5" hover={false}>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-zinc-400">Aptitude Weight (Placement OS)</p>
            <h3 className="text-2xl font-bold text-white">20%</h3>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* CUSTOM MOCK TEST BUILDER */}
        <div className="lg:col-span-2 space-y-8">
          <GlassCard className="p-6 relative overflow-hidden" hover={false}>
            <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-xl font-bold text-white flex items-center mb-4">
              <Settings className="h-5 w-5 mr-2 text-cyan-400" />
              Custom Mock Test Builder
            </h2>
            <p className="text-sm text-zinc-400 mb-6">
              Create an adaptive practice session. We will compile a balanced test from the question bank.
            </p>

            <div className="space-y-6">
              {/* Category selector */}
              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-3">
                  Select Sections (Choose at least one)
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {Object.entries(CATEGORY_MAP).map(([key, name]) => {
                    const isSelected = selectedCategories.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleCategory(key)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? "bg-cyan-500/15 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                            : "bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span className="text-sm font-medium">{name}</span>
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected ? "border-cyan-400 bg-cyan-400" : "border-zinc-500"
                        }`}>
                          {isSelected && <div className="h-2 w-2 rounded-full bg-black" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Limits */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Questions Count
                  </label>
                  <Select 
                    value={String(questionCount)} 
                    onValueChange={(val) => setQuestionCount(Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="5 Questions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Questions</SelectItem>
                      <SelectItem value="10">10 Questions</SelectItem>
                      <SelectItem value="15">15 Questions</SelectItem>
                      <SelectItem value="20">20 Questions</SelectItem>
                      <SelectItem value="30">30 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Time Limit (Mins)
                  </label>
                  <Select 
                    value={String(timeLimit)} 
                    onValueChange={(val) => setTimeLimit(Number(val))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="5 Minutes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Minutes</SelectItem>
                      <SelectItem value="10">10 Minutes</SelectItem>
                      <SelectItem value="15">15 Minutes</SelectItem>
                      <SelectItem value="20">20 Minutes</SelectItem>
                      <SelectItem value="30">30 Minutes</SelectItem>
                      <SelectItem value="45">45 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    Marking Scheme
                  </label>
                  <Select 
                    value={negMarking ? "neg" : "none"} 
                    onValueChange={(val) => setNegMarking(val === "neg")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Marking Scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="neg">+2.0 / -0.5 (Standard)</SelectItem>
                      <SelectItem value="none">+1.0 / 0.0 (No penalty)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-2">
                <Link
                  href={`/aptitude/test/custom?questions=${questionCount}&time=${timeLimit}&categories=${selectedCategories.join(",")}&negMarking=${negMarking}`}
                >
                  <button className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-[0_4px_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center space-x-2">
                    <Play className="h-5 w-5 fill-current" />
                    <span>Launch Custom Practice Room</span>
                  </button>
                </Link>
              </div>
            </div>
          </GlassCard>

          {/* STANDARDIZED MOCK PRESETS */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <Award className="h-5 w-5 mr-2 text-violet-400" />
              Standardized Corporate Mock Tests
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {PRESETS.map((preset) => (
                <GlassCard key={preset.id} className="p-5 flex flex-col justify-between" hover={true}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/10 text-zinc-300 uppercase tracking-wider border border-white/5">
                        {preset.company}
                      </span>
                      <span className={`text-xs font-semibold ${
                        preset.difficulty === "Easy" ? "text-emerald-400" :
                        preset.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {preset.difficulty}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{preset.name}</h3>
                    <p className="text-xs text-zinc-400 mb-4">{preset.description}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-white/5 pt-3">
                      <span className="flex items-center">
                        <HelpCircle className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                        {preset.questions} Qs
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1 text-cyan-400" />
                        {preset.time} mins
                      </span>
                      <span className="flex items-center text-zinc-300">
                        {preset.negMarking ? "Penalized" : "Safe"}
                      </span>
                    </div>
                    <Link
                      href={`/aptitude/test/${preset.id}?questions=${preset.questions}&time=${preset.time}&categories=${preset.categories.join(",")}&negMarking=${preset.negMarking}`}
                    >
                      <button className="w-full py-2.5 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center space-x-1.5">
                        <span>Begin Exam</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* STATS BREAKDOWN & HISTORY */}
        <div className="space-y-8">
          {/* CATEGORY ACCURACY */}
          <GlassCard className="p-6" hover={false}>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
              <Activity className="h-4.5 w-4.5 mr-2 text-emerald-400" />
              Syllabus Accuracy Metrics
            </h2>
            <div className="space-y-5">
              {categoryStats.map((stat) => (
                <div key={stat.key} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-zinc-300">{stat.name}</span>
                    <span className="text-zinc-400 font-medium">
                      {stat.accuracy}% ({stat.attempts} Qs)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        stat.accuracy >= 70 ? "bg-gradient-to-r from-emerald-500 to-teal-400" :
                        stat.accuracy >= 45 ? "bg-gradient-to-r from-amber-500 to-orange-400" :
                        stat.attempts === 0 ? "bg-zinc-800" : "bg-gradient-to-r from-rose-500 to-red-400"
                      }`}
                      style={{ width: `${stat.attempts === 0 ? 0 : stat.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-start space-x-2">
              <AlertCircle className="h-4.5 w-4.5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Accuracy rates below 60% will flag weak syllabus subtopics. Maintain a high score to unlock more advanced mock tests.
              </p>
            </div>
          </GlassCard>

          {/* RECENT ATTEMPTS */}
          <GlassCard className="p-6" hover={false}>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center">
              <Clock className="h-4.5 w-4.5 mr-2 text-violet-400" />
              Recent Practice Attempts
            </h2>

            {aptitudeAttempts.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
                <HelpCircle className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
                <p className="text-xs text-zinc-500">No test attempts logged yet.</p>
                <p className="text-[10px] text-zinc-600 mt-1">Run a custom mock test to log progress.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {aptitudeAttempts.slice().reverse().map((attempt) => (
                  <div 
                    key={attempt.id} 
                    className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-white capitalize">
                        {attempt.testType === "mock" ? "Mock Exam" : "Practice Session"}
                      </h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {new Date(attempt.completedAt).toLocaleDateString()} · Qs: {attempt.totalQuestions}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <span className={`text-xs font-bold ${
                          attempt.score >= 70 ? "text-emerald-400" :
                          attempt.score >= 50 ? "text-amber-400" : "text-rose-400"
                        }`}>
                          {attempt.score}%
                        </span>
                        <p className="text-[9px] text-zinc-500">{attempt.correctAnswers} Correct</p>
                      </div>
                      <Link 
                        href={`/aptitude/review/${attempt.id}`}
                        className="p-1 rounded bg-white/10 hover:bg-cyan-500 hover:text-black transition-all"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}
