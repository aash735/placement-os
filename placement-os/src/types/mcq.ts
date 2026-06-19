export interface MCQQuestion {
  id: string;
  question: string;
  title: string;
  scenario?: string;
  code?: string;
  options: string[];
  answer: string; // e.g. "A", "B", "C", "D"
  explanation: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  companyRelevance?: string[];
}

export interface MCQAttempt {
  id: string;
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
  timeSpentSec: number;
  attemptType: "practice" | "quiz" | "oa";
  sessionId?: string;
  completedAt: string;
}

export interface MCQSession {
  id: string;
  type: "quiz" | "oa";
  title: string;
  companyName?: string;
  questionIds: string[];
  answers: Record<string, string>; // questionId -> selectedOption
  correctCount: number;
  totalQuestions: number;
  timeSpentSec: number;
  completedAt: string;
}
