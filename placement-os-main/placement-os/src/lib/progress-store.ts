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
} from "@/types";
import { useDataStore } from "@/store/data-store";
import * as db from "./supabase-db";

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
  
  // New States
  aptitudeAttempts: AptitudeAttempt[];
  projects: ProjectTask[];
  csSubjects: Record<string, CsSubjectState>;
  llmApiKey: string;
  shortcutsEnabled: boolean;

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

  // Supabase Hydration and Management
  hydrateFromDb: (userId: string) => Promise<void>;
  clearProgress: () => void;
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
            llmApiKey: data.llmApiKey,
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
          });
          get().refreshScores();
        } else {
          set({ userId });
        }
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
        });
        get().refreshScores();
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

        // Weighted placement readiness calculation
        const readiness = Math.round(
          (dsaPct * 0.5) + (aptPct * 0.2) + (projPct * 0.2) + (csPct * 0.1)
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
