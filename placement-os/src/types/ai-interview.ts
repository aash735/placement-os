export type InterviewCategory =
  | "dsa"
  | "os"
  | "dbms"
  | "cn"
  | "oop"
  | "frontend"
  | "backend"
  | "system_design"
  | "hr_behavioral";

export type InterviewDifficulty = "easy" | "medium" | "hard";

export type InterviewDurationOption = "15" | "30" | "45" | "custom";

export type InterviewStage =
  | "Introduction"
  | "Fundamentals"
  | "Intermediate Assessment"
  | "Advanced Assessment"
  | "Final Evaluation";

export interface InterviewMessage {
  id: string;
  role: "interviewer" | "candidate";
  content: string;
  timestamp: string;
}

export interface InterviewSettings {
  category: InterviewCategory;
  difficulty: InterviewDifficulty;
  durationOption: InterviewDurationOption;
  customDurationMinutes?: number;
}

export interface InterviewReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  improvementSuggestions: string[];
  recommendedTopics: string[];
}

export interface ActiveSession {
  id: string;
  settings: InterviewSettings;
  messages: InterviewMessage[];
  currentStage: InterviewStage;
  startTime: string; // ISO String
  timeLeftSeconds: number;
  isRunning: boolean;
  isCompleted: boolean;
  isEvaluating: boolean;
  currentQuestionCount: number;
  error: string | null;
  provider: "gemini" | "openai" | "ollama";
  tempApiKey?: string; // Stored only in active memory
}

export interface CompletedInterviewReport {
  id: string;
  date: string; // ISO String
  category: InterviewCategory;
  difficulty: InterviewDifficulty;
  durationMinutes: number;
  report: InterviewReport;
}

export const CATEGORY_LABELS: Record<InterviewCategory, string> = {
  dsa: "Data Structures & Algorithms",
  os: "Operating Systems",
  dbms: "Database Management Systems",
  cn: "Computer Networks",
  oop: "Object-Oriented Programming",
  frontend: "Frontend Development",
  backend: "Backend Development",
  system_design: "System Design",
  hr_behavioral: "HR / Behavioral Interview",
};

export const DIFFICULTY_LABELS: Record<InterviewDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};
