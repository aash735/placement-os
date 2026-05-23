"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { GlassCard } from "@/components/ui/glass-card";
import { useDataStore } from "@/store/data-store";
import { useProgressStore } from "@/lib/progress-store";
import { 
  Play, 
  Timer, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  Building2, 
  History, 
  Trophy,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

export default function MockTestPage() {
  const questions = useDataStore((s) => s.questions);
  const topics = useDataStore((s) => s.topics);
  const mockTestsSheet = useDataStore((s) => s.mockTests);
  const getQuestionById = useDataStore((s) => s.getQuestionById);
  
  const mockTestsProgress = useProgressStore((s) => s.mockTests);
  const completeMockTest = useProgressStore((s) => s.completeMockTest);
  const questionProgress = useProgressStore((s) => s.questionProgress);
  const setQuestionStatus = useProgressStore((s) => s.setQuestionStatus);

  // Tabs
  const [activeTab, setActiveTab] = useState<"preset" | "generate" | "history">("preset");

  // Generator form states
  const [testType, setTestType] = useState<"topic" | "company" | "mixed" | "adaptive">("topic");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [customDuration, setCustomDuration] = useState(45);
  const [customCount, setCustomCount] = useState(3);

  // Active Test State
  const [testActive, setTestActive] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<string[]>([]);
  const [activeTitle, setActiveTitle] = useState("");
  const [activeDuration, setActiveDuration] = useState(60);
  const [activeTestId, setActiveTestId] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [solvedInTest, setSolvedInTest] = useState<Record<string, boolean>>({});

  // Ticking Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testActive) {
      // Auto submit when time runs out
      handleSubmitTest();
    }
    return () => clearInterval(interval);
  }, [testActive, timeLeft]);

  // Extract all unique companies from dynamic questions
  const allCompanies = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      q.companies.forEach((c) => {
        if (c.trim()) set.add(c.trim());
      });
    });
    return Array.from(set).sort();
  }, [questions]);

  // Initialize dropdown selections
  useEffect(() => {
    if (topics.length > 0 && !selectedTopic) {
      setSelectedTopic(topics[0].id);
    }
    if (allCompanies.length > 0 && !selectedCompany) {
      setSelectedCompany(allCompanies[0]);
    }
  }, [topics, allCompanies, selectedTopic, selectedCompany]);

  // Launch a sheet preset test
  const startPresetTest = (mockId: string) => {
    const mock = mockTestsSheet.find((m) => m.id === mockId);
    if (!mock) return;

    setActiveTestId(mock.id);
    setActiveQuestions(mock.questionIds);
    setActiveTitle(mock.title);
    setActiveDuration(mock.durationMin);
    setTimeLeft(mock.durationMin * 60);
    setSolvedInTest(Object.fromEntries(mock.questionIds.map((qid) => [qid, false])));
    setTestActive(true);
  };

  // Generate dynamic custom test
  const generateTest = () => {
    let pool = [...questions];
    let title = "Custom Mock Test";

    if (testType === "topic") {
      const topicId = selectedTopic || (topics[0]?.id ?? "");
      pool = pool.filter((q) => q.topicId === topicId);
      const topicName = topics.find((t) => t.id === topicId)?.name || topicId;
      title = `${topicName} Topic Assessment`;
    } else if (testType === "company") {
      const comp = selectedCompany || (allCompanies[0] ?? "");
      pool = pool.filter((q) => q.companies.some((c) => c.toLowerCase() === comp.toLowerCase()));
      title = `${comp} OA Simulation`;
    } else if (testType === "mixed") {
      // Solved/Revised questions prioritised
      const solvedList = pool.filter((q) =>
        ["solved", "revised", "mastered"].includes(questionProgress[q.id]?.status ?? "")
      );
      pool = solvedList.length >= customCount ? solvedList : pool;
      title = `Mixed Revision Challenge`;
    } else if (testType === "adaptive") {
      title = `Adaptive Mastery Assessment`;
      
      const easy = pool.filter((q) => q.difficulty === "Easy");
      const medium = pool.filter((q) => q.difficulty === "Medium");
      const hard = pool.filter((q) => q.difficulty === "Hard");

      const selected: typeof questions = [];
      const draw = (arr: typeof questions, count: number) => {
        const shuffled = [...arr].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };

      if (customCount === 1) {
        selected.push(...draw(medium, 1));
      } else if (customCount === 3) {
        selected.push(...draw(easy, 1));
        selected.push(...draw(medium, 1));
        selected.push(...draw(hard, 1));
      } else if (customCount === 5) {
        selected.push(...draw(easy, 1));
        selected.push(...draw(medium, 3));
        selected.push(...draw(hard, 1));
      } else {
        const perCat = Math.floor(customCount / 3);
        selected.push(...draw(easy, perCat));
        selected.push(...draw(medium, perCat));
        selected.push(...draw(hard, customCount - perCat * 2));
      }

      if (selected.length < customCount) {
        const remaining = pool.filter((q) => !selected.includes(q));
        selected.push(...draw(remaining, customCount - selected.length));
      }
      pool = selected;
    }

    if (pool.length === 0) {
      alert("No questions found matching your selection filters. Please choose another criteria.");
      return;
    }

    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const finalQuestions = shuffled.slice(0, customCount);

    const testId = `custom-mock-${Date.now()}`;
    setActiveTestId(testId);
    setActiveQuestions(finalQuestions.map((q) => q.id));
    setActiveTitle(title);
    setActiveDuration(customDuration);
    setTimeLeft(customDuration * 60);
    setSolvedInTest(Object.fromEntries(finalQuestions.map((q) => [q.id, false])));
    setTestActive(true);
  };

  // Submit test and sync with progress
  const handleSubmitTest = () => {
    setTestActive(false);
    const totalQs = activeQuestions.length;
    if (totalQs === 0) return;
    const solvedCount = Object.values(solvedInTest).filter(Boolean).length;
    const score = Math.round((solvedCount / totalQs) * 100);

    // Save to store
    completeMockTest(activeTestId, score, {
      title: activeTitle,
      durationMin: activeDuration,
      questionIds: activeQuestions,
    });

    // Automatically synchronize progress of solved questions
    activeQuestions.forEach((qid) => {
      if (solvedInTest[qid]) {
        const currentStatus = questionProgress[qid]?.status ?? "not_started";
        if (currentStatus === "not_started" || currentStatus === "attempted") {
          setQuestionStatus(qid, "solved", Math.round(activeDuration / totalQs));
        }
      } else {
        const currentStatus = questionProgress[qid]?.status ?? "not_started";
        if (currentStatus === "not_started") {
          setQuestionStatus(qid, "attempted", 0);
        }
      }
    });

    setActiveTestId("");
    setActiveQuestions([]);
    setSolvedInTest({});
    setActiveTab("history");
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ""}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const timePercent = timeLeft > 0 ? (timeLeft / (activeDuration * 60)) * 100 : 0;

  return (
    <AppShell title="Mock Assessment Center" subtitle="Dynamic timed mock assessments powered entirely by dynamic sheets">
      <PageHeader 
        title="Mock Test Center" 
        description="Simulate real coding rounds. Generate custom sheets-based challenges or take standard pre-sets." 
      />

      {testActive ? (
        /* Live Timer Assessment Simulator Mode */
        <div className="space-y-6">
          <GlassCard className="border-cyan-500/20 bg-cyan-950/5" hover={false}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Live Assessment In Progress
                </span>
                <h2 className="mt-2 text-2xl font-bold text-white">{activeTitle}</h2>
                <p className="text-sm text-zinc-400">
                  {activeQuestions.length} Questions · Track your progress on the right as you solve them on LeetCode/GFG
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-black/40 p-4 border border-white/5">
                <Timer className="h-6 w-6 text-cyan-400 animate-pulse" />
                <div>
                  <p className="text-[10px] uppercase text-zinc-500 tracking-wider">Time Remaining</p>
                  <p className="font-mono text-2xl font-bold text-white">{formatTime(timeLeft)}</p>
                </div>
              </div>
            </div>

            <div className="progress-bar mt-6 h-2">
              <div 
                className={`progress-bar-fill h-full rounded-full transition-all duration-1000 ${
                  timePercent < 15 ? "bg-rose-500" : timePercent < 40 ? "bg-amber-500" : "bg-cyan-500"
                }`}
                style={{ width: `${timePercent}%` }} 
              />
            </div>
          </GlassCard>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-lg font-bold text-zinc-300">Question List</h3>
              <div className="space-y-3">
                {activeQuestions.map((qid, idx) => {
                  const q = getQuestionById(qid);
                  return (
                    <GlassCard key={qid} hover={false} className="border-white/5 bg-white/5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-black/30 px-2 py-1 text-xs font-mono text-cyan-300">
                              Problem {idx + 1}
                            </span>
                            {q?.difficulty && (
                              <span className={`text-[10px] rounded px-1.5 py-0.5 font-semibold ${
                                q.difficulty === "Easy" ? "bg-emerald-500/10 text-emerald-400" : 
                                q.difficulty === "Hard" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"
                              }`}>
                                {q.difficulty}
                              </span>
                            )}
                          </div>
                          <h4 className="mt-2 font-semibold text-white text-base">
                            {q?.title ?? `Question ID: ${qid}`}
                          </h4>
                          {q?.pattern && (
                            <p className="text-xs text-zinc-400 mt-1">
                              Pattern: {q.pattern} · Recommended time: {q.estimatedMinutes} mins
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {q?.url && (
                            <a 
                              href={q.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn-primary text-xs flex items-center gap-1.5 px-4 py-2"
                            >
                              Solve Problem <ArrowRight className="h-3 w-3" />
                            </a>
                          )}
                          <label className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 border border-white/5 cursor-pointer hover:bg-white/10 select-none">
                            <input 
                              type="checkbox" 
                              checked={!!solvedInTest[qid]} 
                              onChange={(e) => setSolvedInTest(prev => ({ ...prev, [qid]: e.target.checked }))}
                              className="rounded border-white/10 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-transparent h-4.5 w-4.5"
                            />
                            <span className="text-xs font-medium text-zinc-300">I Solved It</span>
                          </label>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>

            <div>
              <GlassCard hover={false} className="border-white/5 bg-white/5 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-zinc-300">Submit Assessment</h3>
                  <p className="text-sm text-zinc-400 mt-2">
                    Check off the problems you completed successfully. Once finished, click below to end the test.
                  </p>
                  
                  <div className="mt-6 rounded-xl bg-black/30 p-4 space-y-3 border border-white/5">
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Total Questions</span>
                      <span className="font-bold text-white">{activeQuestions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-400">
                      <span>Marked Solved</span>
                      <span className="font-bold text-cyan-400">
                        {Object.values(solvedInTest).filter(Boolean).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-3 text-sm font-semibold text-white">
                      <span>Completion Score</span>
                      <span>
                        {Math.round((Object.values(solvedInTest).filter(Boolean).length / activeQuestions.length) * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start gap-2 text-xs text-zinc-500">
                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-500/80" />
                    <span>
                      Solved problems will automatically update in your primary DSA progress tracker, increasing your XP and streak.
                    </span>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={handleSubmitTest} 
                  className="btn-primary w-full mt-8 py-3 font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="h-4.5 w-4.5" /> Submit & Finish Assessment
                </button>
              </GlassCard>
            </div>
          </div>
        </div>
      ) : (
        /* Standard Test Lists & Controls */
        <>
          <div className="mb-6 flex gap-2 border-b border-white/10 pb-px">
            <button 
              type="button" 
              onClick={() => setActiveTab("preset")}
              className={`pb-3 text-sm font-semibold transition-all relative ${
                activeTab === "preset" ? "text-cyan-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Preset Sheet Assessments
              {activeTab === "preset" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab("generate")}
              className={`pb-3 text-sm font-semibold transition-all relative ml-6 ${
                activeTab === "generate" ? "text-cyan-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Dynamic Custom Generator
              {activeTab === "generate" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab("history")}
              className={`pb-3 text-sm font-semibold transition-all relative ml-6 ${
                activeTab === "history" ? "text-cyan-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Assessment History
              {activeTab === "history" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />}
            </button>
          </div>

          {activeTab === "preset" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockTestsSheet.length > 0 ? (
                mockTestsSheet.map((mock) => {
                  const record = mockTestsProgress.find((m) => m.id === mock.id);
                  return (
                    <GlassCard key={mock.id} hover={true} className="flex flex-col justify-between h-48">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
                            {mock.durationMin} mins
                          </span>
                          {record?.score !== undefined && (
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              record.score >= 70 ? "bg-emerald-500/10 text-emerald-400" :
                              record.score >= 40 ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                            }`}>
                              Score: {record.score}%
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-white mt-3 text-lg leading-tight">{mock.title}</h3>
                        <p className="text-xs text-zinc-500 mt-2 font-mono">
                          {mock.questionIds.length} questions
                        </p>
                        {mock.companyTags.length > 0 && (
                          <div className="mt-2 flex gap-1">
                            {mock.companyTags.map(c => (
                              <span key={c} className="rounded bg-cyan-500/10 px-1 text-[9px] text-cyan-400 font-medium">{c}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        {record?.completedAt ? (
                          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Solved {new Date(record.completedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-500">Not started</span>
                        )}
                        <button 
                          type="button" 
                          className="btn-primary text-xs flex items-center gap-1 py-1.5 px-3"
                          onClick={() => startPresetTest(mock.id)}
                        >
                          <Play className="h-3 w-3" /> Start Test
                        </button>
                      </div>
                    </GlassCard>
                  );
                })
              ) : (
                <div className="col-span-full py-8 text-center text-zinc-500">
                  No preset assessments available. Add entries to your mock-tests sheet to see them here.
                </div>
              )}
            </div>
          )}

          {activeTab === "generate" && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <GlassCard hover={false} className="space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-cyan-400" /> Dynamic Assessment Generator
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Create a unique timed assessment compiled instantly from your dynamic sheet data.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-2 mt-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">
                        Assessment Type
                      </label>
                      <select 
                        value={testType} 
                        onChange={(e) => setTestType(e.target.value as any)}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                      >
                        <option value="topic">Topic Assessment (Targeted)</option>
                        <option value="company">Company Simulation (TCS, Amazon, etc.)</option>
                        <option value="mixed">Mixed Revision (Solves & Revisions)</option>
                        <option value="adaptive">Adaptive Challenge (Easy to Hard)</option>
                      </select>
                    </div>

                    {testType === "topic" && (
                      <div>
                        <label className="block text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">
                          Select Topic
                        </label>
                        <select 
                          value={selectedTopic} 
                          onChange={(e) => setSelectedTopic(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                        >
                          {topics.map((t) => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {testType === "company" && (
                      <div>
                        <label className="block text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">
                          Target Company
                        </label>
                        <select 
                          value={selectedCompany} 
                          onChange={(e) => setSelectedCompany(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                        >
                          {allCompanies.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">
                        Questions Count
                      </label>
                      <select 
                        value={customCount} 
                        onChange={(e) => setCustomCount(Number(e.target.value))}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                      >
                        <option value={1}>1 Question Challenge</option>
                        <option value={3}>3 Questions Assessment</option>
                        <option value={5}>5 Questions Assessment</option>
                        <option value={8}>8 Questions OA Marathon</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-zinc-400 tracking-wider mb-2">
                        Assessment Duration
                      </label>
                      <select 
                        value={customDuration} 
                        onChange={(e) => setCustomDuration(Number(e.target.value))}
                        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
                      >
                        <option value={15}>15 Minutes (Sprint)</option>
                        <option value={30}>30 Minutes</option>
                        <option value={45}>45 Minutes (Standard)</option>
                        <option value={60}>60 Minutes (Deep Session)</option>
                        <option value={90}>90 Minutes (Standard OA)</option>
                        <option value={120}>120 Minutes (Full Marathon)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={generateTest}
                    className="btn-primary w-full py-3 mt-6 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5"
                  >
                    <Play className="h-4.5 w-4.5" /> Compile & Start Custom Assessment
                  </button>
                </GlassCard>
              </div>

              <div>
                <GlassCard hover={false} className="h-full">
                  <h4 className="font-bold text-zinc-300">Assessment Engine Info</h4>
                  <ul className="mt-4 space-y-4 text-xs text-zinc-400">
                    <li className="flex items-start gap-2.5">
                      <BookOpen className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Topic Mode</strong> targets a single selected topic (e.g. Arrays, Trees) to benchmark your subject mastery.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Building2 className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Company Mode</strong> selects questions indexed with your target employer (e.g. Amazon, TCS, Infosys) for simulated mock placement tests.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <History className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Mixed Revision</strong> creates randomized pools from previously encountered questions, enforcing spacing repetitions.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Trophy className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Adaptive Assessment</strong> scales the difficulty dynamically (drawing Easy, Medium, and Hard proportionally) to measure your threshold.
                      </span>
                    </li>
                  </ul>
                </GlassCard>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-300">Attempt Logs</h3>
              {mockTestsProgress.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      <tr>
                        <th className="p-4">Date</th>
                        <th className="p-4">Assessment Title</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">Questions</th>
                        <th className="p-4 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockTestsProgress
                        .slice()
                        .sort((a, b) => (b.completedAt || "").localeCompare(a.completedAt || ""))
                        .map((record) => (
                          <tr key={record.id} className="border-t border-white/5 hover:bg-white/5">
                            <td className="p-4 text-zinc-400 font-mono text-xs">
                              {record.completedAt ? new Date(record.completedAt).toLocaleString() : "-"}
                            </td>
                            <td className="p-4 font-semibold text-white">
                              {record.title}
                            </td>
                            <td className="p-4 text-zinc-400">
                              {record.durationMin} mins
                            </td>
                            <td className="p-4 text-zinc-500 text-xs">
                              {record.questionIds.length} items
                            </td>
                            <td className="p-4 text-right">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                (record.score ?? 0) >= 70 ? "bg-emerald-500/10 text-emerald-400" :
                                (record.score ?? 0) >= 40 ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                              }`}>
                                {record.score ?? 0}%
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <GlassCard hover={false} className="py-12 text-center text-zinc-500">
                  No assessment attempts recorded yet. Head to &quot;Preset Assessments&quot; or &quot;Dynamic Custom Generator&quot; to get started.
                </GlassCard>
              )}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
