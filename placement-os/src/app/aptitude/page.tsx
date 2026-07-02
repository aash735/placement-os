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
  TrendingUp,
  BookOpen
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

const PRACTICE_CATEGORIES = [
  {
    id: "quant",
    name: "Quantitative Aptitude",
    description: "Numerical ability, arithmetic, and mathematical reasoning.",
    topics: [
      { id: "number-system", name: "Number System", count: 0 },
      { id: "h-c-f-and-l-c-m-of-numbers", name: "H.C.F. and L.C.M. of Numbers", count: 0 },
      { id: "decimal-fractions", name: "Decimal Fractions", count: 0 },
      { id: "simplification", name: "Simplification", count: 0 },
      { id: "square-roots-and-cube-roots", name: "Square Roots and Cube Roots", count: 0 },
      { id: "average", name: "Average", count: 0 },
      { id: "problems-on-numbers", name: "Problems on Numbers", count: 0 },
      { id: "problems-on-ages", name: "Problems on Ages", count: 0 },
      { id: "surds-and-indices", name: "Surds and Indices", count: 0 },
      { id: "logarithms", name: "Logarithms", count: 0 },
      { id: "percentage", name: "Percentage", count: 0 },
      { id: "profit-and-loss", name: "Profit and Loss", count: 0 },
      { id: "ratio-and-proportion", name: "Ratio and Proportion", count: 0 },
      { id: "partnership", name: "Partnership", count: 0 },
      { id: "chain-rule", name: "Chain Rule", count: 0 },
      { id: "pipes-and-cisterns", name: "Pipes and Cisterns", count: 0 },
      { id: "time-and-work", name: "Time and Work", count: 0 },
      { id: "time-distance", name: "Time and Distance", count: 0 },
      { id: "boats-and-streams", name: "Boats and Streams", count: 0 },
      { id: "problems-on-trains", name: "Problems on Trains", count: 0 },
      { id: "alligation-or-mixture", name: "Alligation or Mixture", count: 0 },
      { id: "simple-interest", name: "Simple Interest", count: 0 },
      { id: "compound-interest", name: "Compound Interest", count: 0 },
      { id: "area", name: "Area", count: 0 },
      { id: "volume-and-surface-areas", name: "Volume and Surface Areas", count: 0 },
      { id: "races-and-games-of-skill", name: "Races and Games of Skill", count: 0 },
      { id: "stocks-and-shares", name: "Stocks and Shares", count: 0 },
      { id: "permutation-and-combination", name: "Permutations & Combinations", count: 0 },
      { id: "probability", name: "Probability", count: 0 },
      { id: "true-discount", name: "True Discount", count: 0 },
      { id: "banker-s-discount", name: "Banker's Discount", count: 0 },
      { id: "heights-and-distances", name: "Heights and Distances", count: 0 }
    ]
  },
  {
    id: "logical",
    name: "Logical Reasoning",
    description: "Logical deduction, patterns, and arrangements.",
    topics: [
      { id: "calendar", name: "Calendar", count: 0 },
      { id: "clocks", name: "Clocks", count: 0 },
      { id: "odd-man-out-and-series", name: "Odd Man Out and Series", count: 0 },
      { id: "direction-sense", name: "Direction Sense", count: 0 },
      { id: "blood-relations", name: "Blood Relations", count: 0 },
      { id: "coding-decoding", name: "Coding Decoding", count: 0 },
      { id: "syllogism", name: "Syllogism", count: 0 },
      { id: "seating-arrangement", name: "Seating Arrangement", count: 0 },
      { id: "statement-conclusion", name: "Statement Conclusion", count: 0 },
      { id: "series", name: "Series", count: 0 },
      { id: "analogy", name: "Analogy", count: 0 }
    ]
  },
  {
    id: "verbal",
    name: "Verbal Ability",
    description: "English grammar, reading comprehension, and vocabulary.",
    topics: [
      { id: "synonyms", name: "Synonyms", count: 0 },
      { id: "antonyms", name: "Antonyms", count: 0 },
      { id: "sentence-improvement", name: "Sentence Improvement", count: 0 },
      { id: "rc", name: "Reading Comprehension", count: 0 },
      { id: "error-detection", name: "Error Detection", count: 0 },
      { id: "vocab", name: "Vocabulary", count: 0 }
    ]
  },
  {
    id: "di",
    name: "Data Interpretation",
    description: "Analyzing charts, tables, and graphs.",
    topics: [
      { id: "tabulation", name: "Tabulation", count: 0 },
      { id: "bar-graphs", name: "Bar Graphs", count: 0 },
      { id: "pie-chart", name: "Pie Charts", count: 0 },
      { id: "line-graphs", name: "Line Graphs", count: 0 },
      { id: "caselets", name: "Caselets", count: 0 }
    ]
  },
  {
    id: "puzzles",
    name: "Brain Teasers & Puzzles",
    description: "Tricky puzzles, brain teasers, and lateral thinking problems.",
    topics: [
      { id: "puzzles", name: "Brain Teasers & Puzzles", count: 0 }
    ]
  }
];

export default function AptitudePage() {
  const { 
    aptitudeAttempts = [], 
    aptitudePracticeAttempts = [],
    refreshScores 
  } = useProgressStore();
  
  const [flowMode, setFlowMode] = useState<"practice" | "test">("practice");

  // Custom builder states
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["quant", "logical"]);
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [timeLimit, setTimeLimit] = useState<number>(20);
  const [negMarking, setNegMarking] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<string>("all");
  const [topicFocus, setTopicFocus] = useState<string>("all");
  const [companyFocus, setCompanyFocus] = useState<string>("all");

  // Dynamically calculate topic counts from the actual database
  const practiceCategories = PRACTICE_CATEGORIES.map(cat => ({
    ...cat,
    topics: cat.topics.map(t => ({
      ...t,
      count: aptitudeQuestions.filter(q => q.category === cat.id && q.topic === t.id).length
    }))
  }));

  const uniqueTopics = Array.from(new Set(aptitudeQuestions.map(q => q.topic))).sort();

  // Dynamically build topic names mapping
  const TOPIC_NAMES: Record<string, string> = {
    general: "General Aptitude"
  };
  PRACTICE_CATEGORIES.forEach(cat => {
    cat.topics.forEach(t => {
      TOPIC_NAMES[t.id] = t.name;
    });
  });

  const COMPANIES = ["TCS", "Infosys", "Deloitte", "Accenture", "Capgemini", "Wipro", "Cognizant", "Google"];

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  // Helper functions for Practice counts
  const getTopicSolvedCount = (topicId: string) => {
    const solved = new Set(
      aptitudePracticeAttempts
        .filter((a) => a.topicId === topicId && a.isCorrect)
        .map((a) => a.questionId)
    );
    return solved.size;
  };

  const getCategorySolvedCount = (catId: string) => {
    const cat = practiceCategories.find((c) => c.id === catId);
    if (!cat) return 0;
    const topicIds = cat.topics.map((t) => t.id);
    const solved = new Set(
      aptitudePracticeAttempts
        .filter((a) => topicIds.includes(a.topicId) && a.isCorrect)
        .map((a) => a.questionId)
    );
    return solved.size;
  };

  const getCategoryTotalSyllabus = (catId: string) => {
    const cat = practiceCategories.find((c) => c.id === catId);
    if (!cat) return 0;
    return cat.topics.reduce((acc, t) => acc + t.count, 0);
  };

  // Calculate statistics (Mock Mode)
  const totalTests = aptitudeAttempts.length;
  const averageScore = totalTests > 0 
    ? Math.round((aptitudeAttempts.reduce((acc, curr) => acc + curr.score, 0) / totalTests))
    : 0;
  
  const totalCorrect = aptitudeAttempts.reduce((acc, curr) => acc + curr.correctAnswers, 0);
  const totalAnswered = aptitudeAttempts.reduce((acc, curr) => acc + curr.correctAnswers + curr.wrongAnswers, 0);
  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  // Calculate statistics (Practice Mode)
  const totalPracticeAttempts = aptitudePracticeAttempts.length;
  const correctPracticeAttempts = aptitudePracticeAttempts.filter(a => a.isCorrect).length;
  const practiceAccuracy = totalPracticeAttempts > 0 
    ? Math.round((correctPracticeAttempts / totalPracticeAttempts) * 100)
    : 0;
  const totalPracticeTimeMin = Math.round(
    aptitudePracticeAttempts.reduce((acc, curr) => acc + (curr.timeSpentSec || 0), 0) / 60
  );
  const solvedTopicIds = Array.from(new Set(aptitudePracticeAttempts.filter(a => a.isCorrect).map(a => a.topicId)));
  const activeTopicsCount = solvedTopicIds.length;

  // Category accuracy stats
  const categoryStats = Object.keys(CATEGORY_MAP).map(catKey => {
    let totalAttempts = 0;
    let correctAttempts = 0;
    
    // 1. Mock Test attempts
    aptitudeAttempts.forEach(attempt => {
      if (attempt.answers) {
        Object.entries(attempt.answers).forEach(([qId, ans]) => {
          const q = aptitudeQuestions.find(aq => aq.id === qId);
          if (q && q.category === catKey) {
            totalAttempts++;
            if (q.answer === ans) {
              correctAttempts++;
            }
          }
        });
      }
    });

    // 2. Practice Mode attempts
    aptitudePracticeAttempts.forEach(attempt => {
      const q = aptitudeQuestions.find(aq => aq.id === attempt.questionId);
      if (q && q.category === catKey) {
        totalAttempts++;
        if (attempt.isCorrect) {
          correctAttempts++;
        }
      }
    });

    const pct = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
    const totalQuestions = aptitudeQuestions.filter(q => q.category === catKey).length;

    return {
      key: catKey,
      name: CATEGORY_MAP[catKey as keyof typeof CATEGORY_MAP],
      accuracy: pct,
      attempts: totalAttempts,
      totalQuestions: totalQuestions
    };
  });

  return (
    <AppShell title="Aptitude Hub" subtitle="Master quantitative, logical, verbal, and puzzles">
      <PageHeader 
        title="Aptitude & Logical Practice" 
        description="Aptitude is the first elimination round for 90% of on-campus placement drives. Sharpen your skills with Practice Mode or timed Mock Tests." 
      />

      {/* STATS OVERVIEW */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {flowMode === "practice" ? (
          <>
            <GlassCard className="flex items-center space-x-4 p-5" hover={false}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Practice Qs Solved</p>
                <h3 className="text-2xl font-bold text-white">
                  {aptitudePracticeAttempts.filter(a => a.isCorrect).length}
                </h3>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center space-x-4 p-5" hover={false}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Practice Accuracy</p>
                <h3 className="text-2xl font-bold text-white">{practiceAccuracy}%</h3>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center space-x-4 p-5" hover={false}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Active Topics</p>
                <h3 className="text-2xl font-bold text-white">{activeTopicsCount} / 35</h3>
              </div>
            </GlassCard>

            <GlassCard className="flex items-center space-x-4 p-5" hover={false}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-zinc-400">Time Spent</p>
                <h3 className="text-2xl font-bold text-white">{totalPracticeTimeMin} min</h3>
              </div>
            </GlassCard>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* TABS SELECTOR */}
      <div className="mb-8 flex space-x-2 p-1 bg-white/5 border border-white/5 rounded-2xl max-w-sm">
        <button
          onClick={() => setFlowMode("practice")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            flowMode === "practice"
              ? "bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
              : "border border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Practice Rooms</span>
        </button>
        <button
          onClick={() => setFlowMode("test")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            flowMode === "test"
              ? "bg-gradient-to-r from-violet-500/20 to-violet-500/10 border border-violet-500/30 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.1)]"
              : "border border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Mock Tests</span>
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* MAIN PANEL CONTENT */}
        <div className="lg:col-span-2 space-y-8">
          {flowMode === "practice" ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Topic-wise Syllabus Library</h2>
                <p className="text-sm text-zinc-400">
                  Select a topic to start untimed practice. Answer reveals and explanations are available on-demand.
                </p>
              </div>

              {practiceCategories.map((category) => {
                const categorySolved = getCategorySolvedCount(category.id);
                
                return (
                  <GlassCard key={category.id} className="p-6 border-white/5" hover={false}>
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                      <div>
                        <h3 className="text-lg font-bold text-white">{category.name}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">{category.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2.5 py-1 rounded-lg">
                          {categorySolved} Solved
                        </span>
                      </div>
                    </div>

                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      {category.topics.map((topic) => {
                        const solved = getTopicSolvedCount(topic.id);
                        const isCompleted = solved > 0;
                        
                        return (
                          <Link 
                            key={topic.id}
                            href={`/aptitude/practice/${topic.id}`}
                            className="block"
                          >
                            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group">
                              <div>
                                <span className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                                  {topic.name}
                                </span>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-[10px] text-zinc-400">
                                    {topic.count} Syllabus Qs
                                  </span>
                                  {isCompleted && (
                                    <>
                                      <span className="h-1 w-1 rounded-full bg-zinc-600" />
                                      <span className="text-[10px] text-emerald-400 font-medium">
                                        {solved} Solved
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          ) : (
            <>
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

                  {/* Advanced Filters */}
                  <div className="grid gap-4 sm:grid-cols-3 border-t border-white/5 pt-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Difficulty Tier
                      </label>
                      <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Difficulties" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Difficulties</SelectItem>
                          <SelectItem value="1">Beginner (Easy)</SelectItem>
                          <SelectItem value="2">Intermediate (Medium)</SelectItem>
                          <SelectItem value="3">Advanced (Hard)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Focus Topic
                      </label>
                      <Select value={topicFocus} onValueChange={setTopicFocus}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Topics" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Topics</SelectItem>
                          {uniqueTopics.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {TOPIC_NAMES[topic] || topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                        Company Target
                      </label>
                      <Select value={companyFocus} onValueChange={setCompanyFocus}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Companies" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Companies</SelectItem>
                          {COMPANIES.map((company) => (
                            <SelectItem key={company} value={company}>
                              {company}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Start Button */}
                  <div className="pt-2">
                    {(() => {
                      const hrefParams = [
                        `questions=${questionCount}`,
                        `time=${timeLimit}`,
                        `categories=${selectedCategories.join(",")}`,
                        `negMarking=${negMarking}`
                      ];
                      if (difficulty !== "all") hrefParams.push(`difficulty=${difficulty}`);
                      if (topicFocus !== "all") hrefParams.push(`topics=${topicFocus}`);
                      if (companyFocus !== "all") hrefParams.push(`company=${companyFocus}`);
                      const finalHref = `/aptitude/test/custom?${hrefParams.join("&")}`;

                      return (
                        <Link href={finalHref}>
                          <button className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white shadow-[0_4px_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center space-x-2">
                            <Play className="h-5 w-5 fill-current" />
                            <span>Launch Custom Mock Test</span>
                          </button>
                        </Link>
                      );
                    })()}
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
            </>
          )}
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
              Recent Activity
            </h2>

            {aptitudeAttempts.length === 0 && aptitudePracticeAttempts.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
                <HelpCircle className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
                <p className="text-xs text-zinc-500">No activity logged yet.</p>
                <p className="text-[10px] text-zinc-600 mt-1">Start practicing or take a mock exam.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {[
                  ...aptitudeAttempts.map(a => ({
                    id: a.id,
                    type: "mock" as const,
                    title: a.testType === "mock" ? "Mock Exam" : "Practice Mock",
                    date: a.completedAt,
                    info: `Qs: ${a.totalQuestions}`,
                    score: `${a.score}%`,
                    subinfo: `${a.correctAnswers} Correct`,
                    href: `/aptitude/review/${a.id}`,
                    colorClass: a.score >= 70 ? "text-emerald-400" : a.score >= 50 ? "text-amber-400" : "text-rose-400"
                  })),
                  ...aptitudePracticeAttempts.slice(-15).map(a => {
                    const q = aptitudeQuestions.find(aq => aq.id === a.questionId);
                    const topicName = TOPIC_NAMES[a.topicId] || a.topicId;
                    return {
                      id: a.id,
                      type: "practice" as const,
                      title: `Practice: ${topicName}`,
                      date: a.completedAt,
                      info: `Time: ${a.timeSpentSec || 0}s`,
                      score: a.isCorrect ? "Correct" : "Incorrect",
                      subinfo: q ? (q.question.substring(0, 30) + "...") : "",
                      href: `/aptitude/practice/${a.topicId}`,
                      colorClass: a.isCorrect ? "text-emerald-400" : "text-rose-400"
                    };
                  })
                ]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((attempt) => (
                    <div 
                      key={attempt.id} 
                      className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                    >
                      <div className="max-w-[70%]">
                        <h4 className="text-xs font-semibold text-white capitalize truncate">
                          {attempt.title}
                        </h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5 truncate font-mono">
                          {new Date(attempt.date).toLocaleDateString()} · {attempt.info}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <span className={`text-xs font-bold ${attempt.colorClass}`}>
                            {attempt.score}
                          </span>
                          <p className="text-[9px] text-zinc-500 truncate max-w-[80px]">{attempt.subinfo}</p>
                        </div>
                        <Link 
                          href={attempt.href}
                          className="p-1 rounded bg-white/10 hover:bg-cyan-500 hover:text-black transition-all font-sans"
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
