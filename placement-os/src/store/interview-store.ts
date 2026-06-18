import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ActiveSession,
  CompletedInterviewReport,
  InterviewMessage,
  InterviewReport,
  InterviewSettings,
  CATEGORY_LABELS,
  DIFFICULTY_LABELS,
} from "@/types/ai-interview";

interface InterviewStore {
  activeSession: ActiveSession | null;
  history: CompletedInterviewReport[];
  isHydrated: boolean;
  
  setHydrated: (val: boolean) => void;
  startSession: (
    settings: InterviewSettings,
    provider: "gemini" | "openai" | "ollama",
    tempApiKey?: string
  ) => void;
  addMessage: (role: "interviewer" | "candidate", content: string) => void;
  tickTimer: () => void;
  advanceStage: () => void;
  setError: (error: string | null) => void;
  setEvaluating: (isEvaluating: boolean) => void;
  completeInterview: (report: InterviewReport) => void;
  abandonInterview: () => void;
  loadHistory: () => void;
}

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (
      set: (partial: Partial<InterviewStore> | ((state: InterviewStore) => Partial<InterviewStore>)) => void,
      get: () => InterviewStore
    ) => ({
      activeSession: null,
      history: [],
      isHydrated: false,

      setHydrated: (val: boolean) => set({ isHydrated: val }),

      startSession: (settings: InterviewSettings, provider: "gemini" | "openai" | "ollama", tempApiKey?: string) => {
        const id = `session-${Math.random().toString(36).substring(2, 11)}`;
        
        let durationMinutes = 30;
        if (settings.durationOption === "15") durationMinutes = 15;
        else if (settings.durationOption === "30") durationMinutes = 30;
        else if (settings.durationOption === "45") durationMinutes = 45;
        else if (settings.durationOption === "custom" && settings.customDurationMinutes) {
          durationMinutes = settings.customDurationMinutes;
        }

        const initialMessage: InterviewMessage = {
          id: `msg-${Math.random().toString(36).substring(2, 11)}`,
          role: "interviewer",
          content: `Hello! I am your interviewer today. Welcome to your AI mock interview on **${CATEGORY_LABELS[settings.category]}**. We will go through five stages: Introduction, Fundamentals, Intermediate Assessment, Advanced Assessment, and Final Evaluation. The interview difficulty is set to **${DIFFICULTY_LABELS[settings.difficulty]}** and we have a timer of **${durationMinutes} minutes**. Let's begin when you're ready! Please say "Ready" or introduce yourself to get started.`,
          timestamp: new Date().toISOString(),
        };

        set({
          activeSession: {
            id,
            settings,
            messages: [initialMessage],
            currentStage: "Introduction",
            startTime: new Date().toISOString(),
            timeLeftSeconds: durationMinutes * 60,
            isRunning: true,
            isCompleted: false,
            isEvaluating: false,
            currentQuestionCount: 0,
            error: null,
            provider,
            tempApiKey,
          },
        });
      },

      addMessage: (role: "interviewer" | "candidate", content: string) => {
        const { activeSession } = get();
        if (!activeSession) return;

        const newMessage: InterviewMessage = {
          id: `msg-${Math.random().toString(36).substring(2, 11)}`,
          role,
          content,
          timestamp: new Date().toISOString(),
        };

        const isQuestion = role === "interviewer" && activeSession.messages.length > 1;

        set({
          activeSession: {
            ...activeSession,
            messages: [...activeSession.messages, newMessage],
            currentQuestionCount: isQuestion 
              ? activeSession.currentQuestionCount + 1 
              : activeSession.currentQuestionCount,
          },
        });
      },

      tickTimer: () => {
        const { activeSession } = get();
        if (!activeSession || !activeSession.isRunning) return;

        if (activeSession.timeLeftSeconds <= 1) {
          set({
            activeSession: {
              ...activeSession,
              timeLeftSeconds: 0,
              isRunning: false,
            },
          });
        } else {
          set({
            activeSession: {
              ...activeSession,
              timeLeftSeconds: activeSession.timeLeftSeconds - 1,
            },
          });
        }
      },

      advanceStage: () => {
        const { activeSession } = get();
        if (!activeSession) return;

        const stages: Record<string, string> = {
          Introduction: "Fundamentals",
          Fundamentals: "Intermediate Assessment",
          "Intermediate Assessment": "Advanced Assessment",
          "Advanced Assessment": "Final Evaluation",
          "Final Evaluation": "Final Evaluation",
        };

        set({
          activeSession: {
            ...activeSession,
            currentStage: (stages[activeSession.currentStage] || "Final Evaluation") as any,
          },
        });
      },

      setError: (error: string | null) => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({ activeSession: { ...activeSession, error } });
      },

      setEvaluating: (isEvaluating: boolean) => {
        const { activeSession } = get();
        if (!activeSession) return;
        set({ activeSession: { ...activeSession, isEvaluating } });
      },

      completeInterview: (report: InterviewReport) => {
        const { activeSession, history } = get();
        if (!activeSession) return;

        let totalDuration = 30;
        if (activeSession.settings.durationOption === "15") totalDuration = 15;
        else if (activeSession.settings.durationOption === "30") totalDuration = 30;
        else if (activeSession.settings.durationOption === "45") totalDuration = 45;
        else if (activeSession.settings.durationOption === "custom" && activeSession.settings.customDurationMinutes) {
          totalDuration = activeSession.settings.customDurationMinutes;
        }

        const elapsedSeconds = totalDuration * 60 - activeSession.timeLeftSeconds;
        const durationMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

        const completedReport: CompletedInterviewReport = {
          id: activeSession.id,
          date: new Date().toISOString(),
          category: activeSession.settings.category,
          difficulty: activeSession.settings.difficulty,
          durationMinutes,
          report,
        };

        const updatedHistory = [completedReport, ...history];

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "placement-os-ai-interview-history",
              JSON.stringify(updatedHistory)
            );
          } catch (e) {
            console.error("Failed to persist history in localStorage", e);
          }
        }

        set({
          activeSession: null,
          history: updatedHistory,
        });
      },

      abandonInterview: () => {
        set({ activeSession: null });
      },

      loadHistory: () => {
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("placement-os-ai-interview-history");
            if (stored) {
              set({ history: JSON.parse(stored) });
            }
          } catch (e) {
            console.error("Failed to load history from localStorage", e);
          }
        }
      },
    }),
    {
      name: "placement-os-ai-interview-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state: InterviewStore) => ({ activeSession: state.activeSession }),
      onRehydrateStorage: () => (state: InterviewStore | undefined) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
