import { create } from "zustand";
import { persist } from "zustand/middleware";
import { format } from "date-fns";
import {
  advanceStatus,
  computeConsistencyScore,
  computePlacementReadiness,
  computeLevelUnlocked,
  defaultQuestionProgress,
  defaultTopicProgress,
  getNextRevisionDate,
  xpForStatus,
} from "@/lib/dsa-engine";
import { syncLevelFromXp } from "@/lib/xp";
import type {
  DailyLog,
  MockTestRecord,
  QuestionStatus,
  RevisionEntry,
  UserQuestionProgress,
  UserTopicProgress,
  AptitudeAttempt,
  ProjectTask,
  CsSubjectState,
  MCQAttempt,
  MCQSession,
  MCQQuestion,
} from "@/types";
import { useDataStore } from "@/store/data-store";
import * as db from "./supabase-db";
import mcqQuestions from "@/data/mcq-questions.json";

// Re-export xp helpers
export { levelFromXp } from "@/lib/xp";

interface ProgressState {
  userId: string | null;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  placementReadiness: number;
  confidenceScore: number;
  productivityScore: number;
  focusScore: number;
  energyMode: "normal" | "low" | "recovery";
  questionProgress: Record<string, UserQuestionProgress>;
  topicProgress: Record<string, UserTopicProgress>;
  revisionHistory: RevisionEntry[];
  dailyLogs: DailyLog[];
  mockTests: MockTestRecord[];
  completedToday: string[];
  companyTargets: Record<string, "not-started" | "preparing" | "applied" | "oa-done" | "interview">;
  bookmarks: string[];
  resourceProgress: Record<string, "not-started" | "reading" | "completed">;
  
  // New States
  aptitudeAttempts: AptitudeAttempt[];
  projects: ProjectTask[];
  csSubjects: Record<string, CsSubjectState>;
  llmApiKey: string;
  shortcutsEnabled: boolean;

  // Added States
  focusSession: {
    startTime: string | null;
    endTime: string | null;
    pausedTimeLeft: number;
    duration: number;
    timeLeft: number;
    task: string;
    questionId: string | null;
    isRunning: boolean;
    lastTickTime?: number;
  };
  unlockedAchievements: string[];
  recentUnlock: string | null;
  pendingAchievementsQueue: string[];
  countdownGoals: {
    id: string;
    title: string;
    targetDate: string;
    milestones: { text: string; completed: boolean }[];
  }[];
  interviewSession: {
    id: string;
    type: "dsa" | "hr" | "frontend" | "project";
    status: "in-progress" | "completed";
    score: number;
    questions: any[];
    answers: Record<string, string>;
    feedback?: string;
    timeLeft: number;
    isRunning: boolean;
    endTime: string | null;
    pausedTimeLeft: number;
  } | null;
  interviewHistory: {
    id: string;
    type: string;
    status: string;
    score: number;
    questions: any[];
    answers: Record<string, string>;
    feedback?: string;
    completedAt: string;
  }[];
  dailyPlannerBlocks: {
    id: string;
    time: string;
    task: string;
    energy: string;
    completed: boolean;
  }[];
  customWeeklyPlan: {
    week: number;
    focus: string;
    hours: string;
    days: string[];
  }[];
  weeklyPlanInitialized: boolean;

  setQuestionStatus: (questionId: string, status: QuestionStatus, timeSpentMin?: number) => void;
  setQuestionNotes: (questionId: string, notes: string) => void;
  toggleBookmark: (questionId: string) => void;
  markAttempted: (questionId: string) => void;
  markSolved: (questionId: string, timeSpentMin?: number) => void;
  markRevised: (questionId: string) => void;
  markMastered: (questionId: string) => void;
  cycleQuestionStatus: (questionId: string) => void;
  completeQuest: (id: string) => void;
  completeMockTest: (mockId: string, score: number, details?: { title: string; durationMin: number; questionIds: string[] }) => void;
  setCompanyStatus: (slug: string, status: ProgressState["companyTargets"][string]) => void;
  setEnergyMode: (mode: ProgressState["energyMode"]) => void;
  exportProgress: () => string;
  recordFocusMinutes: (minutes: number) => void;
  refreshScores: () => void;
  addXp: (amount: number) => void;
  completeTask: (id: string) => void;
  syncMockTestsFromSheet: (tests: { id: string; title: string; durationMin: number; questionIds: string[] }[]) => void;
  
  // New Actions
  completeAptitudeAttempt: (attempt: AptitudeAttempt) => void;
  addProjectTask: (task: Omit<ProjectTask, "id">) => void;
  updateProjectTaskStatus: (id: string, status: ProjectTask["status"]) => void;
  updateProjectTaskReadiness: (id: string, readiness: number) => void;
  deleteProjectTask: (id: string) => void;
  updateCsSubject: (subjectId: string, status: CsSubjectState["status"], score?: number, checkedItems?: string[]) => void;
  setLlmApiKey: (key: string) => void;
  setShortcutsEnabled: (enabled: boolean) => void;
  setResourceProgress: (resourceId: string, status: "not-started" | "reading" | "completed") => void;

  // Added Actions
  startFocusSession: (task: string, durationMin?: number, questionId?: string | null) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  resetFocusSession: () => void;
  tickFocusSession: (elapsedSeconds?: number) => void;
  completeFocusSession: () => void;

  unlockAchievement: (id: string) => void;
  clearRecentUnlock: () => void;
  checkAchievements: () => void;

  addCountdownGoal: (goal: { title: string; targetDate: string; milestones: string[] }) => void;
  updateCountdownGoal: (id: string, goal: { title: string; targetDate: string; milestones?: { text: string; completed: boolean }[] }) => void;
  deleteCountdownGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneIndex: number) => void;

  startInterviewSession: (type: "dsa" | "hr" | "frontend" | "project", questions: any[]) => void;
  tickInterviewSession: (elapsedSeconds?: number) => void;
  updateInterviewAnswer: (questionId: string, answerText: string) => void;
  submitInterviewSession: (score: number, feedback?: string) => void;
  discardInterviewSession: () => void;

  addPlannerBlock: (block: { time: string; task: string; energy: string }) => void;
  updatePlannerBlock: (id: string, updates: Partial<{ time: string; task: string; energy: string; completed: boolean }>) => void;
  deletePlannerBlock: (id: string) => void;
  togglePlannerBlock: (id: string) => void;

  setWeeklyPlan: (plan: { week: number; focus: string; hours: string; days: string[] }[]) => void;
  updateWeeklyWeek: (weekNum: number, focus: string, hours: string) => void;
  addWeeklyTask: (weekNum: number, task: string) => void;
  removeWeeklyTask: (weekNum: number, taskIndex: number) => void;
  updateWeeklyTask: (weekNum: number, taskIndex: number, newTask: string) => void;
  addWeeklyWeek: (week: { week: number; focus: string; hours: string; days: string[] }) => void;
  deleteWeeklyWeek: (weekNum: number) => void;

  // Supabase Hydration and Management
  hydrateFromDb: (userId: string) => Promise<void>;
  clearProgress: () => void;
  validateStreak: () => void;

  // MCQ Arena State & Actions
  mcqAttempts: MCQAttempt[];
  mcqBookmarks: string[];
  mcqSessions: MCQSession[];
  addMcqAttempt: (attempt: Omit<MCQAttempt, "id" | "completedAt">) => void;
  toggleMcqBookmark: (questionId: string) => void;
  completeMcqSession: (session: MCQSession) => void;
}

function today() {
  return format(new Date(), "yyyy-MM-dd");
}

function ensureDailyLog(logs: DailyLog[]): DailyLog[] {
  const d = today();
  if (logs.some((l) => l.date === d)) return logs;
  return [...logs, { date: d, questionsSolved: 0, revisionsDone: 0, xpEarned: 0, focusMinutes: 0 }];
}

function updateStreak(lastActiveDate: string, streak: number): { lastActiveDate: string; streak: number } {
  const d = today();
  if (lastActiveDate === d) return { lastActiveDate: d, streak };
  const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
  const newStreak = lastActiveDate === yesterday ? streak + 1 : 1;
  return { lastActiveDate: d, streak: newStreak };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      userId: null,
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: "",
      placementReadiness: 0,
      confidenceScore: 50,
      productivityScore: 50,
      focusScore: 50,
      energyMode: "normal",
      questionProgress: {},
      topicProgress: {},
      revisionHistory: [],
      dailyLogs: [],
      mockTests: [],
      completedToday: [],
      companyTargets: {},
      bookmarks: [],
      resourceProgress: {},
      mcqAttempts: [],
      mcqBookmarks: [],
      mcqSessions: [],

      // New default states
      aptitudeAttempts: [],
      projects: [
        { id: "proj-1", name: "Anony Talk", description: "Anonymous chat with 3D elements and wellness UX", stack: "React, 3D, CSS", status: "todo", readiness: 75, tags: ["Frontend", "Socket.io"] },
        { id: "proj-2", name: "HireLens", description: "ATS analyzer, privacy-first resume evaluator", stack: "Next.js, Python", status: "in-progress", readiness: 80, tags: ["AI/ML", "Next.js"] },
        { id: "proj-3", name: "J.A.R.V.I.S.", description: "Local AI productivity assistant with voice interface", stack: "Electron, Python", status: "todo", readiness: 60, tags: ["AI/ML", "Electron"] }
      ],
      csSubjects: {
        dbms: { status: "not-started", checkedItems: [] },
        os: { status: "not-started", checkedItems: [] },
        cn: { status: "not-started", checkedItems: [] },
        oop: { status: "not-started", checkedItems: [] }
      },
      llmApiKey: "",
      shortcutsEnabled: true,

      // Added default states
      focusSession: {
        startTime: null,
        endTime: null,
        pausedTimeLeft: 0,
        duration: 25 * 60,
        timeLeft: 25 * 60,
        task: "",
        questionId: null,
        isRunning: false,
      },
      unlockedAchievements: [],
      recentUnlock: null,
      pendingAchievementsQueue: [],
      countdownGoals: [
        {
          id: "goal-default",
          title: "Target Season (Aug 2026)",
          targetDate: "2026-08-01",
          milestones: [
            { text: "60% DSA must-tier", completed: false },
            { text: "HireLens live", completed: false },
            { text: "3 mock interviews", completed: false }
          ]
        }
      ],
      interviewSession: null,
      interviewHistory: [],
      dailyPlannerBlocks: [
        { id: "block-1", time: "7:30", task: "Wake + 5 min plan (Placement OS)", energy: "low", completed: false },
        { id: "block-2", time: "9:00", task: "College / classes", energy: "normal", completed: false },
        { id: "block-3", time: "17:00", task: "DSA 1 problem (35 min)", energy: "normal", completed: false },
        { id: "block-4", time: "17:45", task: "Aptitude 15 questions", energy: "normal", completed: false },
        { id: "block-5", time: "18:15", task: "Project 30 min (HireLens)", energy: "normal", completed: false },
        { id: "block-6", time: "21:00", task: "Wind-down · no YouTube spiral", energy: "recovery", completed: false },
      ],
      customWeeklyPlan: [],
      weeklyPlanInitialized: false,

      hydrateFromDb: async (userId) => {
        const data = await db.fetchUserData(userId);
        if (data) {
          set({
            userId,
            xp: data.xp,
            level: data.level,
            streak: data.streak,
            lastActiveDate: data.lastActiveDate,
            energyMode: data.energyMode,
            llmApiKey: get().llmApiKey || "",
            shortcutsEnabled: data.shortcutsEnabled,
            questionProgress: data.questionProgress,
            bookmarks: data.bookmarks,
            mockTests: data.mockTests,
            aptitudeAttempts: data.aptitudeAttempts,
            projects: data.projects,
            csSubjects: data.csSubjects,
            companyTargets: data.companyTargets,
            dailyLogs: data.dailyLogs,
            revisionHistory: data.revisionHistory,
            resourceProgress: data.resourceProgress && Object.keys(data.resourceProgress).length > 0 ? data.resourceProgress : get().resourceProgress || {},
            // Added states hydration
            unlockedAchievements: data.unlockedAchievements || [],
            countdownGoals: data.countdownGoals && data.countdownGoals.length > 0 ? data.countdownGoals : [
              {
                id: "goal-default",
                title: "Target Season (Aug 2026)",
                targetDate: "2026-08-01",
                milestones: [
                  { text: "60% DSA must-tier", completed: false },
                  { text: "HireLens live", completed: false },
                  { text: "3 mock interviews", completed: false }
                ]
              }
            ],
            interviewHistory: data.interviewHistory || [],
            dailyPlannerBlocks: data.dailyPlannerBlocks && data.dailyPlannerBlocks.length > 0 ? data.dailyPlannerBlocks : [
              { id: "block-1", time: "7:30", task: "Wake + 5 min plan (Placement OS)", energy: "low", completed: false },
              { id: "block-2", time: "9:00", task: "College / classes", energy: "normal", completed: false },
              { id: "block-3", time: "17:00", task: "DSA 1 problem (35 min)", energy: "normal", completed: false },
              { id: "block-4", time: "17:45", task: "Aptitude 15 questions", energy: "normal", completed: false },
              { id: "block-5", time: "18:15", task: "Project 30 min (HireLens)", energy: "normal", completed: false },
              { id: "block-6", time: "21:00", task: "Wind-down · no YouTube spiral", energy: "recovery", completed: false },
            ],
            customWeeklyPlan: data.customWeeklyPlan || [],
            weeklyPlanInitialized: (data.customWeeklyPlan && data.customWeeklyPlan.length > 0) ? true : get().weeklyPlanInitialized,
            mcqAttempts: data.mcqAttempts || [],
            mcqBookmarks: data.mcqBookmarks || [],
            mcqSessions: data.mcqSessions || [],
          });
          get().refreshScores();
        } else {
          set({ userId });
        }
        get().validateStreak();
      },

      clearProgress: () => {
        set({
          userId: null,
          xp: 0,
          level: 1,
          streak: 0,
          lastActiveDate: "",
          questionProgress: {},
          topicProgress: {},
          revisionHistory: [],
          dailyLogs: [],
          mockTests: [],
          completedToday: [],
          companyTargets: {},
          bookmarks: [],
          resourceProgress: {},
          aptitudeAttempts: [],
          projects: [
            { id: "proj-1", name: "Anony Talk", description: "Anonymous chat with 3D elements and wellness UX", stack: "React, 3D, CSS", status: "todo", readiness: 75, tags: ["Frontend", "Socket.io"] },
            { id: "proj-2", name: "HireLens", description: "ATS analyzer, privacy-first resume evaluator", stack: "Next.js, Python", status: "in-progress", readiness: 80, tags: ["AI/ML", "Next.js"] },
            { id: "proj-3", name: "J.A.R.V.I.S.", description: "Local AI productivity assistant with voice interface", stack: "Electron, Python", status: "todo", readiness: 60, tags: ["AI/ML", "Electron"] }
          ],
          csSubjects: {
            dbms: { status: "not-started", checkedItems: [] },
            os: { status: "not-started", checkedItems: [] },
            cn: { status: "not-started", checkedItems: [] },
            oop: { status: "not-started", checkedItems: [] }
          },
          llmApiKey: "",
          shortcutsEnabled: true,
           // Added states clear
          focusSession: {
            startTime: null,
            endTime: null,
            pausedTimeLeft: 0,
            duration: 25 * 60,
            timeLeft: 25 * 60,
            task: "",
            questionId: null,
            isRunning: false,
          },
          unlockedAchievements: [],
          recentUnlock: null,
          pendingAchievementsQueue: [],
          countdownGoals: [
            {
              id: "goal-default",
              title: "Target Season (Aug 2026)",
              targetDate: "2026-08-01",
              milestones: [
                { text: "60% DSA must-tier", completed: false },
                { text: "HireLens live", completed: false },
                { text: "3 mock interviews", completed: false }
              ]
            }
          ],
          interviewSession: null,
          interviewHistory: [],
          dailyPlannerBlocks: [
            { id: "block-1", time: "7:30", task: "Wake + 5 min plan (Placement OS)", energy: "low", completed: false },
            { id: "block-2", time: "9:00", task: "College / classes", energy: "normal", completed: false },
            { id: "block-3", time: "17:00", task: "DSA 1 problem (35 min)", energy: "normal", completed: false },
            { id: "block-4", time: "17:45", task: "Aptitude 15 questions", energy: "normal", completed: false },
            { id: "block-5", time: "18:15", task: "Project 30 min (HireLens)", energy: "normal", completed: false },
            { id: "block-6", time: "21:00", task: "Wind-down · no YouTube spiral", energy: "recovery", completed: false },
          ],
          customWeeklyPlan: [],
          weeklyPlanInitialized: false,
          mcqAttempts: [],
          mcqBookmarks: [],
          mcqSessions: [],
        });
        get().refreshScores();
      },

      validateStreak: () => {
        const state = get();
        const { lastActiveDate, streak, userId } = state;
        if (!lastActiveDate) return;
        const d = today();
        if (lastActiveDate === d) return;
        const yesterday = format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
        if (lastActiveDate !== yesterday) {
          set({ streak: 0 });
          if (userId && !db.isGuest(userId)) {
            db.saveUserProfile(userId, {
              xp: state.xp,
              level: state.level,
              streak: 0,
              lastActiveDate,
              energyMode: state.energyMode,
              shortcutsEnabled: state.shortcutsEnabled,
            });
          }
        }
      },

      refreshScores: () => {
        const questions = useDataStore.getState().questions;
        const { questionProgress, dailyLogs, aptitudeAttempts = [], projects = [], csSubjects = {} } = get();
        
        // 1. DSA Sheet Progress (50%)
        const dsaPct = computePlacementReadiness(questions, questionProgress);
        
        // 2. Aptitude Performance (20%)
        let aptPct = 0;
        if (aptitudeAttempts.length > 0) {
          const totalCorrect = aptitudeAttempts.reduce((acc, a) => acc + a.correctAnswers, 0);
          const totalQuestions = aptitudeAttempts.reduce((acc, a) => acc + a.totalQuestions, 0);
          aptPct = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        }
        
        // 3. Project Completion (20%)
        let projPct = 0;
        if (projects.length > 0) {
          const totalReadiness = projects.reduce((acc, p) => acc + p.readiness, 0);
          projPct = Math.round(totalReadiness / projects.length);
        }
        
        // 4. CS Core Subjects (10%)
        let totalChecked = 0;
        Object.values(csSubjects).forEach((sub: any) => {
          if (sub?.checkedItems) {
            totalChecked += sub.checkedItems.length;
          }
        });
        const csPct = Math.min(100, Math.round((totalChecked / 20) * 100)); // 20 total topics in our syllabus

        // 5. MCQ Performance (20%)
        let mcqPct = 0;
        const mcqAttempts = get().mcqAttempts || [];
        if (mcqAttempts.length > 0) {
          const totalAttempts = mcqAttempts.length;
          const correctAttempts = mcqAttempts.filter((a) => a.isCorrect).length;
          const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) : 0;
          const volumeFactor = Math.min(1.0, totalAttempts / 50); // cap at 50 attempts for volume max
          mcqPct = Math.round((accuracy * 0.6 + volumeFactor * 0.4) * 100);
        }

        // 6. Mock Interview Scores (15%)
        let interviewPct = 0;
        const interviewHistory = get().interviewHistory || [];
        if (interviewHistory.length > 0) {
          const totalScore = interviewHistory.reduce((acc, i) => acc + (i.score || 0), 0);
          interviewPct = Math.round(totalScore / interviewHistory.length);
        }
        // No default — 0 interviewPct when no sessions done (prevents score inflation)

        // Weighted placement readiness calculation
        const readiness = Math.round(
          (dsaPct * 0.35) + (mcqPct * 0.2) + (interviewPct * 0.15) + (aptPct * 0.15) + (projPct * 0.1) + (csPct * 0.05)
        );
        
        const consistency = computeConsistencyScore(dailyLogs);
        
        set({
          placementReadiness: readiness,
          productivityScore: consistency,
          confidenceScore: Math.min(100, Math.round(readiness * 0.7 + consistency * 0.3)),
        });
      },

      syncMockTestsFromSheet: (tests) => {
        const existing = get().mockTests;
        const merged = tests.map((t) => {
          const prev = existing.find((e) => e.id === t.id);
          return {
            id: t.id,
            title: t.title,
            questionIds: t.questionIds,
            durationMin: t.durationMin,
            completedAt: prev?.completedAt,
            score: prev?.score,
          };
        });
        set({ mockTests: merged });
        // Sync mock tests list to DB if logged in
        const { userId } = get();
        if (userId) {
          merged.forEach((m) => db.saveMockTest(userId, m));
        }
      },

      setQuestionStatus: (questionId, status, timeSpentMin = 0) => {
        const state = get();
        const prev = state.questionProgress[questionId] ?? defaultQuestionProgress(questionId);
        const prevStatus = prev.status;
        const sheetQuestion = useDataStore.getState().getQuestionById(questionId);
        const xpGain = Math.max(
          0,
          xpForStatus(status, sheetQuestion) - xpForStatus(prevStatus, sheetQuestion)
        );

        const now = new Date().toISOString();
        const updated: UserQuestionProgress = {
          ...prev,
          status,
          attempts: prev.attempts + (status !== prevStatus ? 1 : 0),
          lastAttemptAt: now,
          timeSpentMin: prev.timeSpentMin + timeSpentMin,
        };

        if (status === "solved" && !prev.solvedAt) updated.solvedAt = now;
        if (status === "revised") updated.revisedAt = now;
        if (status === "mastered") updated.masteredAt = now;
        updated.nextRevisionAt = getNextRevisionDate(status, new Date());

        const topicId = sheetQuestion?.topicId ?? "";
        const allQuestions = useDataStore.getState().questions;
        const topicProg = { ...(state.topicProgress[topicId] ?? defaultTopicProgress(topicId)) };
        if (status === "revised") topicProg.revisionCount += 1;
        topicProg.lastStudiedAt = now;
        if (topicId) {
          topicProg.levelUnlocked = computeLevelUnlocked(
            topicId,
            { ...state.questionProgress, [questionId]: updated },
            allQuestions
          );
        }

        const logs = ensureDailyLog(state.dailyLogs).map((l) =>
          l.date === today()
            ? {
                ...l,
                questionsSolved: l.questionsSolved + (status === "solved" && prevStatus !== "solved" ? 1 : 0),
                revisionsDone: l.revisionsDone + (status === "revised" && prevStatus !== "revised" ? 1 : 0),
                xpEarned: l.xpEarned + xpGain,
                focusMinutes: l.focusMinutes,
              }
            : l
        );

        const streakUpdate = updateStreak(state.lastActiveDate, state.streak);
        const newXp = state.xp + xpGain;

        set({
          questionProgress: { ...state.questionProgress, [questionId]: updated },
          topicProgress: { ...state.topicProgress, [topicId]: topicProg },
          revisionHistory:
            status === "revised" && prevStatus !== "revised"
              ? [...state.revisionHistory, { id: `${questionId}-${now}`, questionId, reviewedAt: now }]
              : state.revisionHistory,
          dailyLogs: logs,
          ...syncLevelFromXp(newXp),
          ...streakUpdate,
        });

        // Supabase DB Sync
        if (state.userId) {
          db.saveQuestionProgress(state.userId, updated);
          const activeLog = logs.find((l) => l.date === today());
          if (activeLog) db.saveDailyLog(state.userId, activeLog);
          db.saveUserProfile(state.userId, {
            xp: newXp,
            level: syncLevelFromXp(newXp).level,
            streak: streakUpdate.streak,
            lastActiveDate: streakUpdate.lastActiveDate,
            energyMode: state.energyMode,
          });
          if (status === "revised" && prevStatus !== "revised") {
            db.saveRevisionLog(state.userId, { id: `${questionId}-${now}`, questionId, reviewedAt: now });
          }
        }

        state.checkAchievements();
        get().refreshScores();
      },

      setQuestionNotes: (questionId, notes) => {
        const state = get();
        const prev = state.questionProgress[questionId] ?? defaultQuestionProgress(questionId);
        const updated = { ...prev, notes };
        set({
          questionProgress: { ...state.questionProgress, [questionId]: updated }
        });
        // DB sync
        if (state.userId) {
          db.saveQuestionProgress(state.userId, updated);
        }
      },

      toggleBookmark: (questionId) =>
        set((s) => {
          const isBookmarked = !s.bookmarks.includes(questionId);
          // DB sync
          if (s.userId) {
            db.saveBookmark(s.userId, questionId, isBookmarked);
          }
          return {
            bookmarks: isBookmarked
              ? [...s.bookmarks, questionId]
              : s.bookmarks.filter((id) => id !== questionId),
          };
        }),

      markAttempted: (id) => get().setQuestionStatus(id, "attempted"),
      markSolved: (id, min) => get().setQuestionStatus(id, "solved", min),
      markRevised: (id) => get().setQuestionStatus(id, "revised"),
      markMastered: (id) => get().setQuestionStatus(id, "mastered"),

      cycleQuestionStatus: (questionId) => {
        const prev = get().questionProgress[questionId]?.status ?? "not_started";
        const next = advanceStatus(prev);
        get().setQuestionStatus(questionId, next);
      },

      completeQuest: (id) =>
        set((s) => ({
          completedToday: s.completedToday.includes(id) ? s.completedToday : [...s.completedToday, id],
        })),

      completeMockTest: (mockId, score, details) => {
        const state = get();
        const xpGain = Math.round(score * 2);
        const newXp = state.xp + xpGain + 100;
        const exists = state.mockTests.some((m) => m.id === mockId);
        let updatedMockTests;
        if (exists) {
          updatedMockTests = state.mockTests.map((m) =>
            m.id === mockId ? { ...m, completedAt: new Date().toISOString(), score } : m
          );
        } else {
          updatedMockTests = [
            ...state.mockTests,
            {
              id: mockId,
              title: details?.title || "Custom Mock Test",
              durationMin: details?.durationMin || 60,
              questionIds: details?.questionIds || [],
              completedAt: new Date().toISOString(),
              score,
            }
          ];
        }
        set({
          mockTests: updatedMockTests,
          ...syncLevelFromXp(newXp),
          ...updateStreak(state.lastActiveDate, state.streak),
        });

        // Supabase DB Sync
        if (state.userId) {
          const updatedTest = updatedMockTests.find((m) => m.id === mockId);
          if (updatedTest) db.saveMockTest(state.userId, updatedTest);
          
          db.saveUserProfile(state.userId, {
            xp: newXp,
            level: syncLevelFromXp(newXp).level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: state.energyMode,
          });
        }

        state.checkAchievements();
        get().refreshScores();
      },

      setCompanyStatus: (slug, status) =>
        set((s) => {
          if (s.userId) {
            db.saveCompanyTarget(s.userId, slug, status);
          }
          return { companyTargets: { ...s.companyTargets, [slug]: status } };
        }),

      setEnergyMode: (mode) => {
        const state = get();
        if (state.userId) {
          db.saveUserProfile(state.userId, {
            xp: state.xp,
            level: state.level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: mode,
            llmApiKey: state.llmApiKey,
            shortcutsEnabled: state.shortcutsEnabled,
          });
        }
        set({ energyMode: mode });
      },

      recordFocusMinutes: (minutes) => {
        const logs = ensureDailyLog(get().dailyLogs).map((l) =>
          l.date === today() ? { ...l, focusMinutes: l.focusMinutes + minutes } : l
        );
        set({
          dailyLogs: logs,
          focusScore: Math.min(100, get().focusScore + Math.floor(minutes / 5)),
        });

        // Supabase DB Sync
        const { userId } = get();
        if (userId) {
          const activeLog = logs.find((l) => l.date === today());
          if (activeLog) db.saveDailyLog(userId, activeLog);
        }
        get().checkAchievements();
      },

      addXp: (amount) => {
        const state = get();
        const newXp = state.xp + amount;
        set(syncLevelFromXp(newXp));
        
        // Supabase DB Sync
        if (state.userId) {
          db.saveUserProfile(state.userId, {
            xp: newXp,
            level: syncLevelFromXp(newXp).level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: state.energyMode,
          });
        }
        state.checkAchievements();
        get().refreshScores();
      },

      completeTask: (id) => get().completeQuest(id),

      // New Actions implementations
      completeAptitudeAttempt: (attempt) => {
        const state = get();
        const attempts = [...(state.aptitudeAttempts || []), attempt];
        const xpGain = attempt.correctAnswers * 15 + 100; // 15 XP per correct answer + 100 completion bonus
        const newXp = state.xp + xpGain;
        const logs = ensureDailyLog(state.dailyLogs).map((l) =>
          l.date === today()
            ? { ...l, xpEarned: l.xpEarned + xpGain }
            : l
        );
        
        set({
          aptitudeAttempts: attempts,
          dailyLogs: logs,
          ...syncLevelFromXp(newXp),
          ...updateStreak(state.lastActiveDate, state.streak),
        });

        // Supabase DB Sync
        if (state.userId) {
          db.saveAptitudeAttempt(state.userId, attempt);
          db.saveUserProfile(state.userId, {
            xp: newXp,
            level: syncLevelFromXp(newXp).level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: state.energyMode,
          });
          const activeLog = logs.find((l) => l.date === today());
          if (activeLog) db.saveDailyLog(state.userId, activeLog);
        }

        state.checkAchievements();
        get().refreshScores();
      },

      addMcqAttempt: (partialAttempt) => {
        const state = get();
        const id = `mcq-att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const completedAt = new Date().toISOString();
        const attempt: MCQAttempt = {
          ...partialAttempt,
          id,
          completedAt,
        };

        const attempts = [...(state.mcqAttempts || []), attempt];
        const question = (mcqQuestions as any[]).find((q) => q.id === attempt.questionId);
        
        let xpGain = 0;
        if (attempt.isCorrect) {
          const alreadySolved = (state.mcqAttempts || []).some(
            (a) => a.questionId === attempt.questionId && a.isCorrect
          );
          if (!alreadySolved) {
            const diff = question?.difficulty || "Medium";
            if (diff === "Easy") xpGain = 5;
            else if (diff === "Medium") xpGain = 10;
            else if (diff === "Hard") xpGain = 20;
          }
        }
        
        const newXp = state.xp + xpGain;
        const logs = ensureDailyLog(state.dailyLogs).map((l) =>
          l.date === today()
            ? { ...l, xpEarned: l.xpEarned + xpGain }
            : l
        );
        
        set({
          mcqAttempts: attempts,
          dailyLogs: logs,
          ...syncLevelFromXp(newXp),
          ...updateStreak(state.lastActiveDate, state.streak),
        });

        const userId = state.userId;
        if (userId && !db.isGuest(userId)) {
          db.saveMcqAttempt(userId, attempt);
          if (xpGain > 0) {
            db.saveUserProfile(userId, {
              xp: newXp,
              level: syncLevelFromXp(newXp).level,
              streak: state.streak,
              lastActiveDate: state.lastActiveDate,
              energyMode: state.energyMode,
            });
            const activeLog = logs.find((l) => l.date === today());
            if (activeLog) db.saveDailyLog(userId, activeLog);
          }
        }
        
        state.checkAchievements();
        get().refreshScores();
      },

      toggleMcqBookmark: (questionId) => {
        const state = get();
        const bookmarks = state.mcqBookmarks || [];
        const isBookmarked = bookmarks.includes(questionId);
        const newBookmarks = isBookmarked
          ? bookmarks.filter((id) => id !== questionId)
          : [...bookmarks, questionId];
          
        set({ mcqBookmarks: newBookmarks });
        
        const userId = state.userId;
        if (userId && !db.isGuest(userId)) {
          db.saveMcqBookmark(userId, questionId, !isBookmarked);
        }
      },

      completeMcqSession: (session) => {
        const state = get();
        const sessions = [...(state.mcqSessions || []), session];
        
        const isOa = session.type === "oa";
        const completionBonus = isOa ? 150 : 50;
        
        let xpGain = completionBonus;
        const newAttempts = [...(state.mcqAttempts || [])];
        
        session.questionIds.forEach((qId) => {
          const selected = session.answers[qId] || "";
          const question = (mcqQuestions as any[]).find((q) => q.id === qId);
          const isCorrect = question ? (selected === question.answer) : false;
          
          const attemptId = `mcq-att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const attempt: MCQAttempt = {
            id: attemptId,
            questionId: qId,
            selectedOption: selected,
            isCorrect,
            timeSpentSec: Math.round(session.timeSpentSec / session.questionIds.length),
            attemptType: session.type,
            sessionId: session.id,
            completedAt: session.completedAt,
          };
          
          newAttempts.push(attempt);
          
          if (isCorrect) {
            const alreadySolved = (state.mcqAttempts || []).some(
              (a) => a.questionId === qId && a.isCorrect
            );
            if (!alreadySolved) {
              const diff = question?.difficulty || "Medium";
              if (diff === "Easy") xpGain += 5;
              else if (diff === "Medium") xpGain += 10;
              else if (diff === "Hard") xpGain += 20;
            }
          }
        });
        
        const newXp = state.xp + xpGain;
        const logs = ensureDailyLog(state.dailyLogs).map((l) =>
          l.date === today()
            ? { ...l, xpEarned: l.xpEarned + xpGain }
            : l
        );
        
        set({
          mcqSessions: sessions,
          mcqAttempts: newAttempts,
          dailyLogs: logs,
          ...syncLevelFromXp(newXp),
          ...updateStreak(state.lastActiveDate, state.streak),
        });

        const userId = state.userId;
        if (userId && !db.isGuest(userId)) {
          db.saveMcqSession(userId, session);
          session.questionIds.forEach((qId) => {
            const att = newAttempts.find((a) => a.sessionId === session.id && a.questionId === qId);
            if (att) db.saveMcqAttempt(userId, att);
          });
          db.saveUserProfile(userId, {
            xp: newXp,
            level: syncLevelFromXp(newXp).level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: state.energyMode,
          });
          const activeLog = logs.find((l) => l.date === today());
          if (activeLog) db.saveDailyLog(userId, activeLog);
        }
        
        state.checkAchievements();
        get().refreshScores();
      },

      addProjectTask: (task) => {
        const state = get();
        const newTask: ProjectTask = {
          ...task,
          id: `proj-${Date.now()}`,
        };
        set({ projects: [...(state.projects || []), newTask] });

        // Supabase DB Sync
        if (state.userId) {
          db.saveProjectTask(state.userId, newTask);
        }
        get().refreshScores();
      },

      updateProjectTaskStatus: (id, status) => {
        const state = get();
        const projects = (state.projects || []).map((p) =>
          p.id === id ? { ...p, status } : p
        );
        set({ projects });

        // Supabase DB Sync
        const updatedTask = projects.find((p) => p.id === id);
        if (state.userId && updatedTask) {
          db.saveProjectTask(state.userId, updatedTask);
        }
        get().refreshScores();
      },

      updateProjectTaskReadiness: (id, readiness) => {
        const state = get();
        const projects = (state.projects || []).map((p) =>
          p.id === id ? { ...p, readiness } : p
        );
        set({ projects });

        // Supabase DB Sync
        const updatedTask = projects.find((p) => p.id === id);
        if (state.userId && updatedTask) {
          db.saveProjectTask(state.userId, updatedTask);
        }
        get().refreshScores();
      },

      deleteProjectTask: (id) => {
        const state = get();
        set({ projects: (state.projects || []).filter((p) => p.id !== id) });

        // Supabase DB Sync
        if (state.userId) {
          db.deleteProjectTask(state.userId, id);
        }
        get().refreshScores();
      },

      updateCsSubject: (subjectId, status, score, checkedItems) => {
        const state = get();
        const currentSub = state.csSubjects[subjectId] || { status: "not-started", checkedItems: [] };
        const updatedSub: CsSubjectState = {
          status,
          score: score !== undefined ? score : currentSub.score,
          checkedItems: checkedItems !== undefined ? checkedItems : currentSub.checkedItems,
        };

        let xpGain = 0;
        if (checkedItems && checkedItems.length > currentSub.checkedItems.length) {
          xpGain += (checkedItems.length - currentSub.checkedItems.length) * 15;
        }
        if (status === "completed" && currentSub.status !== "completed") {
          xpGain += 100;
        }

        const newXp = state.xp + xpGain;
        const logs = ensureDailyLog(state.dailyLogs).map((l) =>
          l.date === today() ? { ...l, xpEarned: l.xpEarned + xpGain } : l
        );

        set({
          csSubjects: {
            ...state.csSubjects,
            [subjectId]: updatedSub,
          },
          dailyLogs: logs,
          ...syncLevelFromXp(newXp),
          ...updateStreak(state.lastActiveDate, state.streak),
        });

        // Supabase DB Sync
        if (state.userId) {
          db.saveCsSubject(state.userId, subjectId, updatedSub);
          db.saveUserProfile(state.userId, {
            xp: newXp,
            level: syncLevelFromXp(newXp).level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: state.energyMode,
          });
          const activeLog = logs.find((l) => l.date === today());
          if (activeLog) db.saveDailyLog(state.userId, activeLog);
        }

        state.checkAchievements();
        get().refreshScores();
      },

      setResourceProgress: (resourceId, status) => {
        const state = get();
        const resProg = state.resourceProgress || {};
        const prevStatus = resProg[resourceId] ?? "not-started";
        if (prevStatus === status) return;

        let xpGain = 0;
        if (status === "completed" && prevStatus !== "completed") {
          const resource = useDataStore.getState().resources.find((r) => r.id === resourceId);
          xpGain = resource?.xpReward ?? 50;
        } else if (status !== "completed" && prevStatus === "completed") {
          const resource = useDataStore.getState().resources.find((r) => r.id === resourceId);
          xpGain = -(resource?.xpReward ?? 50);
        }

        const newXp = Math.max(0, state.xp + xpGain);
        const logs = ensureDailyLog(state.dailyLogs).map((l) =>
          l.date === today() ? { ...l, xpEarned: Math.max(0, l.xpEarned + xpGain) } : l
        );

        set({
          resourceProgress: { ...resProg, [resourceId]: status },
          dailyLogs: logs,
          ...syncLevelFromXp(newXp),
          ...updateStreak(state.lastActiveDate, state.streak),
        });

        if (state.userId) {
          db.saveUserProfile(state.userId, {
            xp: newXp,
            level: syncLevelFromXp(newXp).level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: state.energyMode,
          });
          const activeLog = logs.find((l) => l.date === today());
          if (activeLog) db.saveDailyLog(state.userId, activeLog);
        }

        state.checkAchievements();
        get().refreshScores();
      },

      setLlmApiKey: (key) => {
        const state = get();
        set({ llmApiKey: key });
        if (state.userId) {
          db.saveUserProfile(state.userId, {
            xp: state.xp,
            level: state.level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: state.energyMode,
            llmApiKey: key,
            shortcutsEnabled: state.shortcutsEnabled,
          });
        }
      },

      setShortcutsEnabled: (enabled) => {
        const state = get();
        set({ shortcutsEnabled: enabled });
        if (state.userId) {
          db.saveUserProfile(state.userId, {
            xp: state.xp,
            level: state.level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: state.energyMode,
            llmApiKey: state.llmApiKey,
            shortcutsEnabled: enabled,
          });
        }
      },

      // Added Actions implementations
      startFocusSession: (task, durationMin = 25, questionId = null) => {
        const durationSec = durationMin * 60;
        const now = Date.now();
        const endTime = new Date(now + durationSec * 1000).toISOString();
        set({
          focusSession: {
            startTime: new Date(now).toISOString(),
            endTime,
            pausedTimeLeft: 0,
            duration: durationSec,
            timeLeft: durationSec,
            task,
            questionId,
            isRunning: true,
            lastTickTime: now,
          },
        });
      },

      pauseFocusSession: () => {
        set((s) => {
          const now = Date.now();
          let timeLeft = s.focusSession.timeLeft;
          if (s.focusSession.endTime) {
            timeLeft = Math.max(0, Math.round((new Date(s.focusSession.endTime).getTime() - now) / 1000));
          }
          return {
            focusSession: {
              ...s.focusSession,
              isRunning: false,
              endTime: null,
              pausedTimeLeft: timeLeft,
              timeLeft,
            },
          };
        });
      },

      resumeFocusSession: () => {
        set((s) => {
          const now = Date.now();
          const durationLeftSec = s.focusSession.pausedTimeLeft > 0 ? s.focusSession.pausedTimeLeft : s.focusSession.timeLeft;
          const endTime = new Date(now + durationLeftSec * 1000).toISOString();
          return {
            focusSession: {
              ...s.focusSession,
              isRunning: true,
              endTime,
              pausedTimeLeft: 0,
              timeLeft: durationLeftSec,
              lastTickTime: now,
            },
          };
        });
      },

      resetFocusSession: () => {
        set((s) => ({
          focusSession: {
            ...s.focusSession,
            startTime: null,
            endTime: null,
            pausedTimeLeft: 0,
            timeLeft: s.focusSession.duration,
            isRunning: false,
          },
        }));
      },

      tickFocusSession: (elapsedSeconds) => {
        const s = get();
        if (!s.focusSession.isRunning) return;
        const now = Date.now();
        let newTimeLeft = s.focusSession.timeLeft;
        if (s.focusSession.endTime) {
          newTimeLeft = Math.max(0, Math.round((new Date(s.focusSession.endTime).getTime() - now) / 1000));
        } else {
          const elapsed = elapsedSeconds !== undefined ? elapsedSeconds : 1;
          newTimeLeft = Math.max(0, s.focusSession.timeLeft - elapsed);
        }
        set({
          focusSession: {
            ...s.focusSession,
            timeLeft: newTimeLeft,
            lastTickTime: now,
            isRunning: newTimeLeft > 0,
          },
        });
        if (newTimeLeft === 0) {
          s.completeFocusSession();
        }
      },

      completeFocusSession: () => {
        const state = get();
        const durationMin = Math.round(state.focusSession.duration / 60);
        const xpGain = durationMin * 2;
        const newXp = state.xp + xpGain;

        const logs = ensureDailyLog(state.dailyLogs).map((l) =>
          l.date === today()
            ? {
                ...l,
                focusMinutes: l.focusMinutes + durationMin,
                xpEarned: l.xpEarned + xpGain,
              }
            : l
        );

        set({
          focusSession: {
            ...state.focusSession,
            isRunning: false,
            endTime: null,
            pausedTimeLeft: 0,
            timeLeft: 0,
          },
          dailyLogs: logs,
          focusScore: Math.min(100, state.focusScore + Math.floor(durationMin / 5)),
          ...syncLevelFromXp(newXp),
          ...updateStreak(state.lastActiveDate, state.streak),
        });

        // Supabase DB Sync
        if (state.userId) {
          const activeLog = logs.find((l) => l.date === today());
          if (activeLog) db.saveDailyLog(state.userId, activeLog);
          db.saveUserProfile(state.userId, {
            xp: newXp,
            level: syncLevelFromXp(newXp).level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: state.energyMode,
          });
        }

        if (state.focusSession.questionId) {
          const qProg = state.questionProgress[state.focusSession.questionId];
          if (!qProg || qProg.status === "not_started") {
            state.setQuestionStatus(state.focusSession.questionId, "attempted", durationMin);
          } else {
            state.setQuestionStatus(state.focusSession.questionId, qProg.status, durationMin);
          }
        } else {
          state.checkAchievements();
        }
        get().refreshScores();
      },

      unlockAchievement: (id) => {
        const state = get();
        if (state.unlockedAchievements.includes(id)) return;

        const newUnlocked = [...state.unlockedAchievements, id];
        const newQueue = [...(state.pendingAchievementsQueue || []), id];
        const xpGain = 100;
        const newXp = state.xp + xpGain;
        const streakUpdate = updateStreak(state.lastActiveDate, state.streak);

        set({
          unlockedAchievements: newUnlocked,
          recentUnlock: id,
          pendingAchievementsQueue: newQueue,
          ...syncLevelFromXp(newXp),
          ...streakUpdate,
        });

        // Supabase DB Sync
        if (state.userId) {
          db.saveAchievement(state.userId, id);
          db.saveUserProfile(state.userId, {
            xp: newXp,
            level: syncLevelFromXp(newXp).level,
            streak: streakUpdate.streak,
            lastActiveDate: streakUpdate.lastActiveDate,
            energyMode: state.energyMode,
          });
        }
        get().refreshScores();
      },

      clearRecentUnlock: () => {
        set((s) => {
          const nextQueue = s.pendingAchievementsQueue.slice(1);
          return {
            pendingAchievementsQueue: nextQueue,
            recentUnlock: nextQueue.length > 0 ? nextQueue[0] : null,
          };
        });
      },

      checkAchievements: () => {
        const state = get();
        const questions = useDataStore.getState().questions;
        const total = questions.length || 1;
        const solved = questions.filter((q) =>
          ["solved", "revised", "mastered"].includes(state.questionProgress[q.id]?.status ?? "")
        ).length;
        const streak = state.streak;
        const level = state.level;
        const xp = state.xp;

        // Specific topics
        const graphSolved = questions.filter((q) =>
          q.topicId === "graphs" &&
          ["solved", "revised", "mastered"].includes(state.questionProgress[q.id]?.status ?? "")
        ).length;
        const dpSolved = questions.filter((q) =>
          q.topicId === "dp" &&
          ["solved", "revised", "mastered"].includes(state.questionProgress[q.id]?.status ?? "")
        ).length;
        const arraySolved = questions.filter((q) =>
          q.topicId === "arrays" &&
          ["solved", "revised", "mastered"].includes(state.questionProgress[q.id]?.status ?? "")
        ).length;
        const binarySearchSolved = questions.filter((q) =>
          q.topicId === "binary-search" &&
          ["solved", "revised", "mastered"].includes(state.questionProgress[q.id]?.status ?? "")
        ).length;
        const greedySolved = questions.filter((q) =>
          q.topicId === "greedy" &&
          ["solved", "revised", "mastered"].includes(state.questionProgress[q.id]?.status ?? "")
        ).length;
        const slidingWindowSolved = questions.filter((q) =>
          q.topicId === "sliding-window" &&
          ["solved", "revised", "mastered"].includes(state.questionProgress[q.id]?.status ?? "")
        ).length;
        const treeSolved = questions.filter((q) =>
          (q.topicId === "trees" || q.topicId === "bst") &&
          ["solved", "revised", "mastered"].includes(state.questionProgress[q.id]?.status ?? "")
        ).length;

        // Focus minutes
        const totalFocusMinutes = state.dailyLogs.reduce((sum, log) => sum + (log.focusMinutes || 0), 0);

        // MCQ Arena stats
        const mcqAttemptsCount = state.mcqAttempts?.length || 0;
        const mcqCorrectCount = (state.mcqAttempts || []).filter((a) => a.isCorrect).length;
        const oaSessionsCount = (state.mcqSessions || []).filter((s) => s.type === "oa").length;

        // Mocks
        const mockCompleted = state.mockTests.filter((m) => m.completedAt).length + (state.interviewHistory?.length || 0);
        const hrMockCompleted = (state.interviewHistory || []).filter((i) => i.type === "hr").length;
        const frontendMockCompleted = (state.interviewHistory || []).filter((i) => i.type === "frontend").length;

        // Productivity
        const revisionCount = state.revisionHistory ? state.revisionHistory.length : 0;
        const completedPlannerTasks = state.dailyPlannerBlocks ? state.dailyPlannerBlocks.filter(b => b.completed).length : 0;

        // Monday check
        const mondayLogs = state.dailyLogs.filter((l) => {
          try {
            const [year, month, dayNum] = l.date.split("-").map(Number);
            const dateObj = new Date(year, month - 1, dayNum);
            const day = dateObj.getDay();
            return day === 1 && (l.questionsSolved > 0 || l.revisionsDone > 0 || l.focusMinutes > 0);
          } catch {
            return false;
          }
        });
        const neverMissedMonday = mondayLogs.length >= 2;

        // Countdown milestones
        const completedMilestonesCount = state.countdownGoals.reduce((sum, g) =>
          sum + (g.milestones?.filter((m: any) => m.completed).length || 0), 0
        );

        // Night owl / Early starter checks
        let hasNightOwl = false;
        let hasEarlyStarter = false;
        Object.values(state.questionProgress || {}).forEach((prog) => {
          if (prog.solvedAt) {
            const hr = new Date(prog.solvedAt).getHours();
            if (hr >= 23 || hr < 4) hasNightOwl = true;
            if (hr >= 4 && hr < 8) hasEarlyStarter = true;
          }
        });

        const checks = [
          // DSA
          { id: "first_solve", condition: solved >= 1 },
          { id: "dsa_50", condition: solved >= 50 },
          { id: "dsa_100", condition: solved >= 100 },
          { id: "dsa_500", condition: solved >= 500 },
          { id: "graph_master", condition: graphSolved >= 5 },
          { id: "dp_expert", condition: dpSolved >= 5 },
          { id: "array_apprentice", condition: arraySolved >= 5 },
          { id: "binary_search_specialist", condition: binarySearchSolved >= 3 },
          { id: "greedy_strategist", condition: greedySolved >= 4 },
          { id: "sliding_window_ninja", condition: slidingWindowSolved >= 3 },
          { id: "tree_architect", condition: treeSolved >= 6 },

          // MCQ Arena
          { id: "mcq_beginner", condition: mcqAttemptsCount >= 1 },
          { id: "mcq_explorer", condition: mcqAttemptsCount >= 20 },
          { id: "mcq_specialist", condition: mcqAttemptsCount >= 50 },
          { id: "mcq_master", condition: mcqAttemptsCount >= 100 },
          { id: "oa_warrior", condition: oaSessionsCount >= 3 },
          { id: "mcq_100_correct", condition: mcqCorrectCount >= 100 },
          { id: "mcq_500_correct", condition: mcqCorrectCount >= 500 },

          // Focus
          { id: "first_focus", condition: totalFocusMinutes >= 25 },
          { id: "focus_champion", condition: totalFocusMinutes >= 125 },
          { id: "deep_work_beast", condition: totalFocusMinutes >= 375 },
          { id: "focus_10hr", condition: totalFocusMinutes >= 600 },
          // Note: "deep_work_rookie" was a duplicate of "first_focus" (same condition) — removed to prevent double XP
          { id: "focus_warrior", condition: totalFocusMinutes >= 150 },
          { id: "marathon_focus_beast", condition: totalFocusMinutes >= 1200 },

          // Streaks
          { id: "streak_3", condition: streak >= 3 },
          { id: "streak_7", condition: streak >= 7 },
          // Note: "streak_guardian" was a duplicate of "streak_7" (same condition) — removed to prevent double XP
          { id: "streak_14", condition: streak >= 14 },
          { id: "streak_30", condition: streak >= 30 },
          { id: "never_missed_monday", condition: neverMissedMonday },
          { id: "consistency_king", condition: state.dailyLogs.filter(l => l.questionsSolved > 0 || l.revisionsDone > 0 || l.focusMinutes > 0).length >= 15 },

          // Mocks
          { id: "mock_starter", condition: mockCompleted >= 1 },
          { id: "hr_master", condition: hrMockCompleted >= 1 },
          // Note: "hr_survivor" was a duplicate of "hr_master" (same condition) — removed to prevent double XP
          { id: "frontend_pro", condition: frontendMockCompleted >= 1 },
          { id: "frontend_wizard", condition: (state.interviewHistory || []).some(i => i.type === "frontend" && i.score >= 80) },
          { id: "dsa_interview_cracker", condition: (state.interviewHistory || []).some(i => i.type === "dsa" && i.score >= 85) },
          { id: "system_design_challenger", condition: (state.interviewHistory || []).some(i => i.type === "system-design" || i.type === "project") },

          // Productivity
          { id: "revision_warrior", condition: revisionCount >= 5 },
          { id: "planner_master", condition: completedPlannerTasks >= 5 },
          { id: "weekly_dominator", condition: state.customWeeklyPlan.length >= 3 },
          { id: "deadline_crusher", condition: completedMilestonesCount >= 3 },
          { id: "night_owl", condition: hasNightOwl },
          { id: "early_starter", condition: hasEarlyStarter },

          // Roadmap
          { id: "goal_setter", condition: state.countdownGoals.filter(g => g.id !== "goal-default").length >= 1 },
          { id: "milestone_crusher", condition: state.countdownGoals.some(g => g.milestones.some(m => m.completed)) },
          { id: "roadmap_architect", condition: state.countdownGoals.filter(g => g.id !== "goal-default").length >= 3 },

          // Legacy / others
          { id: "pattern_builder", condition: solved >= 10 },
          { id: "oa_ready", condition: solved >= total * 0.3 },
          { id: "level_5", condition: level >= 5 },
          { id: "century", condition: xp >= 1000 },
        ];

        checks.forEach((c) => {
          if (c.condition && !state.unlockedAchievements.includes(c.id)) {
            state.unlockAchievement(c.id);
          }
        });
      },

      addCountdownGoal: (goal) => {
        const state = get();
        const newGoal = {
          id: `goal-${Date.now()}`,
          title: goal.title,
          targetDate: goal.targetDate,
          milestones: goal.milestones.map((m) => ({ text: m, completed: false })),
        };
        const updated = [...state.countdownGoals, newGoal];
        set({ countdownGoals: updated });
        if (state.userId) {
          db.saveCountdownGoal(state.userId, newGoal);
        }
      },

      updateCountdownGoal: (id, goal) => {
        const state = get();
        const updated = state.countdownGoals.map((g) =>
          g.id === id
            ? {
                ...g,
                title: goal.title,
                targetDate: goal.targetDate,
                milestones: goal.milestones !== undefined ? goal.milestones : g.milestones,
              }
            : g
        );
        set({ countdownGoals: updated });
        const updatedGoal = updated.find((g) => g.id === id);
        if (state.userId && updatedGoal) {
          db.saveCountdownGoal(state.userId, updatedGoal);
        }
      },

      deleteCountdownGoal: (id) => {
        const state = get();
        const updated = state.countdownGoals.filter((g) => g.id !== id);
        set({ countdownGoals: updated });
        if (state.userId) {
          db.deleteCountdownGoal(state.userId, id);
        }
      },

      toggleMilestone: (goalId, milestoneIndex) => {
        const state = get();
        const updated = state.countdownGoals.map((g) => {
          if (g.id !== goalId) return g;
          const newMilestones = g.milestones.map((m, idx) =>
            idx === milestoneIndex ? { ...m, completed: !m.completed } : m
          );
          return { ...g, milestones: newMilestones };
        });
        set({ countdownGoals: updated });
        const updatedGoal = updated.find((g) => g.id === goalId);
        if (state.userId && updatedGoal) {
          db.saveCountdownGoal(state.userId, updatedGoal);
        }
      },

      startInterviewSession: (type, questions) => {
        const durationSec = 45 * 60;
        const now = Date.now();
        const endTime = new Date(now + durationSec * 1000).toISOString();
        const session = {
          id: `int-${now}`,
          type,
          status: "in-progress" as const,
          score: 0,
          questions,
          answers: {},
          timeLeft: durationSec,
          isRunning: true,
          endTime,
          pausedTimeLeft: 0,
        };
        set({ interviewSession: session });
      },

      tickInterviewSession: (elapsedSeconds) => {
        const state = get();
        if (!state.interviewSession || !state.interviewSession.isRunning) return;
        const now = Date.now();
        let newTimeLeft = state.interviewSession.timeLeft;
        if (state.interviewSession.endTime) {
          newTimeLeft = Math.max(0, Math.round((new Date(state.interviewSession.endTime).getTime() - now) / 1000));
        } else {
          const elapsed = elapsedSeconds !== undefined ? elapsedSeconds : 1;
          newTimeLeft = Math.max(0, state.interviewSession.timeLeft - elapsed);
        }
        set({
          interviewSession: {
            ...state.interviewSession,
            timeLeft: newTimeLeft,
            isRunning: newTimeLeft > 0,
          },
        });
        if (newTimeLeft === 0) {
          state.submitInterviewSession(50, "Time expired during mock interview.");
        }
      },

      updateInterviewAnswer: (questionId, answerText) => {
        set((s) => {
          if (!s.interviewSession) return {};
          return {
            interviewSession: {
              ...s.interviewSession,
              answers: {
                ...s.interviewSession.answers,
                [questionId]: answerText,
              },
            },
          };
        });
      },

      submitInterviewSession: (score, feedback = "Well structured outline. Focus on optimizing time complexity.") => {
        const state = get();
        if (!state.interviewSession) return;

        const completedInterview = {
          id: state.interviewSession.id,
          type: state.interviewSession.type,
          status: "completed",
          score,
          questions: state.interviewSession.questions,
          answers: state.interviewSession.answers,
          feedback,
          completedAt: new Date().toISOString(),
        };

        const xpGain = score * 3 + 150;
        const newXp = state.xp + xpGain;
        const logs = ensureDailyLog(state.dailyLogs).map((l) =>
          l.date === today() ? { ...l, xpEarned: l.xpEarned + xpGain } : l
        );

        set({
          interviewSession: null,
          interviewHistory: [...state.interviewHistory, completedInterview],
          dailyLogs: logs,
          ...syncLevelFromXp(newXp),
          ...updateStreak(state.lastActiveDate, state.streak),
        });

        // Supabase DB Sync
        if (state.userId) {
          db.saveMockInterview(state.userId, completedInterview);
          db.saveUserProfile(state.userId, {
            xp: newXp,
            level: syncLevelFromXp(newXp).level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: state.energyMode,
          });
          const activeLog = logs.find((l) => l.date === today());
          if (activeLog) db.saveDailyLog(state.userId, activeLog);
        }

        state.checkAchievements();
        get().refreshScores();
      },

      discardInterviewSession: () => {
        set({ interviewSession: null });
      },

      addPlannerBlock: (block) => {
        const state = get();
        const newBlock = {
          id: `block-${Date.now()}`,
          time: block.time,
          task: block.task,
          energy: block.energy,
          completed: false,
        };
        const updated = [...state.dailyPlannerBlocks, newBlock];
        set({ dailyPlannerBlocks: updated });
        if (state.userId) {
          db.savePlannerBlock(state.userId, newBlock);
        }
      },

      updatePlannerBlock: (id, updates) => {
        const state = get();
        const updated = state.dailyPlannerBlocks.map((b) => {
          if (b.id !== id) return b;
          return { ...b, ...updates };
        });
        set({ dailyPlannerBlocks: updated });
        const updatedBlock = updated.find((b) => b.id === id);
        if (state.userId && updatedBlock) {
          db.savePlannerBlock(state.userId, updatedBlock);
        }
      },

      deletePlannerBlock: (id) => {
        const state = get();
        const updated = state.dailyPlannerBlocks.filter((b) => b.id !== id);
        set({ dailyPlannerBlocks: updated });
        if (state.userId) {
          db.deletePlannerBlock(state.userId, id);
        }
      },

      togglePlannerBlock: (id) => {
        const state = get();
        const block = state.dailyPlannerBlocks.find((b) => b.id === id);
        if (!block) return;

        const newCompleted = !block.completed;
        const xpGain = newCompleted ? 25 : -25;
        const newXp = Math.max(0, state.xp + xpGain);

        const updated = state.dailyPlannerBlocks.map((b) =>
          b.id === id ? { ...b, completed: newCompleted } : b
        );

        const logs = ensureDailyLog(state.dailyLogs).map((l) =>
          l.date === today() ? { ...l, xpEarned: Math.max(0, l.xpEarned + xpGain) } : l
        );

        set({
          dailyPlannerBlocks: updated,
          dailyLogs: logs,
          ...syncLevelFromXp(newXp),
          ...updateStreak(state.lastActiveDate, state.streak),
        });

        // Supabase DB Sync
        const updatedBlock = updated.find((b) => b.id === id);
        if (state.userId && updatedBlock) {
          db.savePlannerBlock(state.userId, updatedBlock);
          db.saveUserProfile(state.userId, {
            xp: newXp,
            level: syncLevelFromXp(newXp).level,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
            energyMode: state.energyMode,
          });
          const activeLog = logs.find((l) => l.date === today());
          if (activeLog) db.saveDailyLog(state.userId, activeLog);
        }

        state.checkAchievements();
        get().refreshScores();
      },

      setWeeklyPlan: (plan) => {
        const seen = new Set<number>();
        const cleanPlan = plan
          .filter((w) => w && typeof w.week === "number" && !isNaN(w.week) && w.week > 0)
          .filter((w) => {
            if (seen.has(w.week)) return false;
            seen.add(w.week);
            return true;
          })
          .sort((a, b) => a.week - b.week);

        set({ customWeeklyPlan: cleanPlan, weeklyPlanInitialized: true });
        const { userId } = get();
        if (userId) {
          cleanPlan.forEach((w) => db.saveWeeklyWeek(userId, w));
        }
      },

      updateWeeklyWeek: (weekNum, focus, hours) => {
        set((s) => {
          const updated = s.customWeeklyPlan.map((w) =>
            w.week === weekNum ? { ...w, focus, hours } : w
          );
          const { userId } = s;
          if (userId) {
            const target = updated.find((w) => w.week === weekNum);
            if (target) db.saveWeeklyWeek(userId, target);
          }
          return { customWeeklyPlan: updated };
        });
      },

      addWeeklyTask: (weekNum, task) => {
        set((s) => {
          const updated = s.customWeeklyPlan.map((w) =>
            w.week === weekNum ? { ...w, days: [...w.days, task] } : w
          );
          const { userId } = s;
          if (userId) {
            const target = updated.find((w) => w.week === weekNum);
            if (target) db.saveWeeklyWeek(userId, target);
          }
          return { customWeeklyPlan: updated };
        });
      },

      removeWeeklyTask: (weekNum, taskIndex) => {
        set((s) => {
          const updated = s.customWeeklyPlan.map((w) =>
            w.week === weekNum ? { ...w, days: w.days.filter((_, idx) => idx !== taskIndex) } : w
          );
          const { userId } = s;
          if (userId) {
            const target = updated.find((w) => w.week === weekNum);
            if (target) db.saveWeeklyWeek(userId, target);
          }
          return { customWeeklyPlan: updated };
        });
      },

      updateWeeklyTask: (weekNum, taskIndex, newTask) => {
        set((s) => {
          const updated = s.customWeeklyPlan.map((w) =>
            w.week === weekNum ? { ...w, days: w.days.map((d, idx) => idx === taskIndex ? newTask : d) } : w
          );
          const { userId } = s;
          if (userId) {
            const target = updated.find((w) => w.week === weekNum);
            if (target) db.saveWeeklyWeek(userId, target);
          }
          return { customWeeklyPlan: updated };
        });
      },

      addWeeklyWeek: (week) => {
        if (!week || typeof week.week !== "number" || isNaN(week.week) || week.week <= 0) return;
        set((s) => {
          const exists = s.customWeeklyPlan.some((w) => w.week === week.week);
          let updated;
          if (exists) {
            updated = s.customWeeklyPlan.map((w) => w.week === week.week ? week : w);
          } else {
            updated = [...s.customWeeklyPlan, week];
          }
          updated.sort((a, b) => a.week - b.week);
          const { userId } = s;
          if (userId) {
            db.saveWeeklyWeek(userId, week);
          }
          return { customWeeklyPlan: updated, weeklyPlanInitialized: true };
        });
      },

      deleteWeeklyWeek: (weekNum) => {
        set((s) => {
          const updated = s.customWeeklyPlan.filter((w) => w.week !== weekNum);
          const { userId } = s;
          if (userId) {
            db.deleteWeeklyWeek(userId, weekNum);
          }
          return { customWeeklyPlan: updated };
        });
      },

      exportProgress: () => {
        const s = get();
        return JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            xp: s.xp,
            level: s.level,
            streak: s.streak,
            placementReadiness: s.placementReadiness,
            questionProgress: s.questionProgress,
            topicProgress: s.topicProgress,
            dailyLogs: s.dailyLogs,
            mockTests: s.mockTests,
            aptitudeAttempts: s.aptitudeAttempts,
            projects: s.projects,
            csSubjects: s.csSubjects,
            energyMode: s.energyMode,
            resourceProgress: s.resourceProgress,
            // Added properties for complete backup
            mcqAttempts: s.mcqAttempts,
            mcqBookmarks: s.mcqBookmarks,
            mcqSessions: s.mcqSessions,
            unlockedAchievements: s.unlockedAchievements,
            countdownGoals: s.countdownGoals,
            interviewHistory: s.interviewHistory,
            dailyPlannerBlocks: s.dailyPlannerBlocks,
            customWeeklyPlan: s.customWeeklyPlan,
          },
          null,
          2
        );
      },
    }),
    {
      name: "placement-os-progress-v2",
      version: 2,
      onRehydrateStorage: () => (state) => {
        if (state) {
          const synced = syncLevelFromXp(state.xp);
          state.xp = synced.xp;
          state.level = synced.level;
          state.refreshScores();
        }
      },
    }
  )
);

// Merge old store key migration - keep usePlacementStore as alias
export const usePlacementStore = useProgressStore;
