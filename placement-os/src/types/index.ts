/** Database-aligned types (Supabase-ready) */

export type QuestionStatus =
  | "not_started"
  | "attempted"
  | "solved"
  | "revised"
  | "mastered";

export type QuestionCategory =
  | "beginner"
  | "easy"
  | "medium"
  | "interview"
  | "revision"
  | "mock";

export type TopicLevel = 1 | 2 | 3 | 4;

export type Platform = "LeetCode" | "GFG" | "NeetCode" | "Striver" | "CodeStudio";

export interface DSAQuestion {
  id: string;
  title: string;
  topicId: string;
  level: TopicLevel;
  category: QuestionCategory;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: Platform;
  url: string;
  altUrl?: string;
  pattern: string;
  subtopic?: string;
  companies: string[];
  estimatedMinutes: number;
  interviewFrequency: "very-high" | "high" | "medium" | "low";
  revisionPriority: "critical" | "high" | "medium" | "low";
  explanationImportance: "must" | "recommended" | "optional";
  neetCodeRef?: string;
  striverRef?: string;
  explanationUrl?: string;
  videoUrl?: string;
  tags?: string[];
  xpReward?: number;
  unlockLevel?: TopicLevel;
  prerequisites?: string[];
  notes?: string;

  // Excel Workbook Ingestion extensions
  slug?: string;
  takeaways?: string;
  approach?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  sourceSheet?: string;
  createdAt?: string;
  updatedAt?: string;
  additionalTopicIds?: string[];
  sq1?: string;
  sq1Url?: string;
  sq2?: string;
  sq2Url?: string;
  sq3?: string;
  sq3Url?: string;
}

export interface DSATopicMeta {
  id: string;
  name: string;
  slug: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  importanceScore: number;
  interviewFrequency: "very-high" | "high" | "medium" | "low";
  estimatedHours: number;
  tier: "must" | "important" | "optional";
  overview: string;
  patterns: string[];
  unlockAfterTopicId?: string;
}

export interface UserQuestionProgress {
  questionId: string;
  status: QuestionStatus;
  attempts: number;
  lastAttemptAt?: string;
  solvedAt?: string;
  revisedAt?: string;
  masteredAt?: string;
  nextRevisionAt?: string;
  timeSpentMin: number;
  notes?: string;
}

export interface UserTopicProgress {
  topicId: string;
  levelUnlocked: TopicLevel;
  revisionCount: number;
  lastStudiedAt?: string;
}

export interface RevisionEntry {
  id: string;
  questionId: string;
  reviewedAt: string;
}

export interface MockTestRecord {
  id: string;
  title: string;
  questionIds: string[];
  completedAt?: string;
  score?: number;
  durationMin: number;
  // Extended result tracking fields
  totalQuestions?: number;
  attempted?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
}

export interface DailyLog {
  date: string;
  questionsSolved: number;
  revisionsDone: number;
  xpEarned: number;
  focusMinutes: number;
}

export interface AptitudeAttempt {
  id: string;
  testType: "mock" | "practice";
  category?: string; // If practice mode
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedAnswers: number;
  timeSpentSec: number; // in seconds
  completedAt: string;
  answers: Record<string, string>; // questionId -> selectedOptionText
  categoryScores?: Record<string, { score: number; total: number }>;
}

export interface ProjectTask {
  id: string;
  name: string;
  description: string;
  stack: string;
  status: "todo" | "in-progress" | "review" | "done";
  readiness: number; // 0 to 100
  tags: string[];
}

export interface CsSubjectState {
  status: "not-started" | "studying" | "completed";
  score?: number;
  checkedItems: string[];
}

export interface AptitudePracticeAttempt {
  id: string;
  topicId: string;
  questionId: string;
  isCorrect: boolean;
  timeSpentSec: number;
  completedAt: string;
  userAnswer: string;
}

/** Schema documentation */
export const DB_SCHEMA = {
  users: ["id", "email", "name", "semester", "path", "created_at"],
  questions: ["id", "topic_id", "level", "title", "url", "difficulty", "metadata_json"],
  user_question_progress: ["id", "user_id", "question_id", "status", "attempts", "solved_at", "next_revision_at"],
  revision_history: ["id", "user_id", "question_id", "reviewed_at"],
  daily_streaks: ["user_id", "date", "completed", "xp"],
  xp_system: ["user_id", "total_xp", "level"],
  achievements: ["user_id", "achievement_id", "unlocked_at"],
  mock_tests: ["id", "user_id", "title", "score", "total_questions", "attempted", "correct_answers", "wrong_answers", "duration", "question_ids", "completed_at", "created_at"],
  weak_areas: ["user_id", "topic_id", "score", "detected_at"],
  company_preparation: ["user_id", "company_slug", "status", "notes"],
} as const;

export * from "./mcq";

