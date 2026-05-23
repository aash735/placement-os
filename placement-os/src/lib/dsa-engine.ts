import type {
  DSAQuestion,
  DSATopicMeta,
  QuestionStatus,
  TopicLevel,
  UserQuestionProgress,
  UserTopicProgress,
} from "@/types";

const LEVEL_UNLOCK_THRESHOLD = 0.6;
const SRS_DAYS = { solved: 3, revised: 7, mastered: 14 };

export const STATUS_ORDER: QuestionStatus[] = [
  "not_started",
  "attempted",
  "solved",
  "revised",
  "mastered",
];

export const STATUS_LABELS: Record<QuestionStatus, string> = {
  not_started: "Not Started",
  attempted: "Attempted",
  solved: "Solved",
  revised: "Revised",
  mastered: "Mastered",
};

export const STATUS_XP: Record<QuestionStatus, number> = {
  not_started: 0,
  attempted: 10,
  solved: 50,
  revised: 30,
  mastered: 20,
};

export const tierLabels: Record<string, string> = {
  must: "Must Master",
  important: "Important",
  optional: "Optional",
  ignore: "Ignore For Now",
};

export function defaultQuestionProgress(questionId: string): UserQuestionProgress {
  return { questionId, status: "not_started", attempts: 0, timeSpentMin: 0 };
}

export function defaultTopicProgress(topicId: string): UserTopicProgress {
  return { topicId, levelUnlocked: 1, revisionCount: 0 };
}

export function getQuestionsByTopic(questions: DSAQuestion[], topicId: string) {
  return questions.filter((q) => q.topicId === topicId);
}

export function isTopicUnlocked(
  topicId: string,
  topics: DSATopicMeta[],
  topicProgress: Record<string, UserTopicProgress>,
  questionProgress: Record<string, UserQuestionProgress>,
  questions: DSAQuestion[]
): boolean {
  return true; // Guidance-based refactor: all topics are unlocked by default!
}

export function getLevelCompletionPercent(
  topicId: string,
  level: TopicLevel,
  questionProgress: Record<string, UserQuestionProgress>,
  questions: DSAQuestion[]
): number {
  const qs = getQuestionsByTopic(questions, topicId).filter((q) => q.level === level);
  if (!qs.length) return 0;
  const done = qs.filter((q) => isSolvedOrBetter(questionProgress[q.id]?.status)).length;
  return Math.round((done / qs.length) * 100);
}

export function isSolvedOrBetter(status?: QuestionStatus): boolean {
  return status === "solved" || status === "revised" || status === "mastered";
}

export function getTopicCompletionPercent(
  topicId: string,
  questionProgress: Record<string, UserQuestionProgress>,
  questions: DSAQuestion[]
): number {
  const qs = getQuestionsByTopic(questions, topicId);
  if (!qs.length) return 0;
  const done = qs.filter((q) => isSolvedOrBetter(questionProgress[q.id]?.status)).length;
  return Math.round((done / qs.length) * 100);
}

export function getTopicMasteryLevel(
  topicId: string,
  questionProgress: Record<string, UserQuestionProgress>,
  questions: DSAQuestion[]
): "beginner" | "learning" | "proficient" | "mastered" {
  const pct = getTopicCompletionPercent(topicId, questionProgress, questions);
  if (pct >= 90) return "mastered";
  if (pct >= 60) return "proficient";
  if (pct >= 25) return "learning";
  return "beginner";
}

export function computeLevelUnlocked(
  topicId: string,
  questionProgress: Record<string, UserQuestionProgress>,
  questions: DSAQuestion[]
): TopicLevel {
  let unlocked: TopicLevel = 1;
  for (let level = 1; level <= 3; level++) {
    const pct = getLevelCompletionPercent(topicId, level as TopicLevel, questionProgress, questions);
    if (pct >= LEVEL_UNLOCK_THRESHOLD * 100) unlocked = (level + 1) as TopicLevel;
    else break;
  }
  const l3 = getLevelCompletionPercent(topicId, 3, questionProgress, questions);
  if (l3 >= LEVEL_UNLOCK_THRESHOLD * 100) return 4;
  return unlocked;
}

export function getNextRevisionDate(status: QuestionStatus, fromDate = new Date()): string | undefined {
  const days =
    status === "solved" ? SRS_DAYS.solved : status === "revised" ? SRS_DAYS.revised : status === "mastered" ? SRS_DAYS.mastered : undefined;
  if (!days) return undefined;
  const d = new Date(fromDate);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function getDueRevisions(
  questions: DSAQuestion[],
  questionProgress: Record<string, UserQuestionProgress>,
  now = new Date()
): { question: DSAQuestion; progress: UserQuestionProgress }[] {
  const nowMs = now.getTime();
  return questions
    .map((question) => {
      const progress = questionProgress[question.id] ?? defaultQuestionProgress(question.id);
      return { question, progress };
    })
    .filter(({ progress }) => {
      if (!progress.nextRevisionAt) return false;
      if (progress.status !== "solved" && progress.status !== "revised") return false;
      return new Date(progress.nextRevisionAt).getTime() <= nowMs;
    })
    .sort((a, b) => (a.progress.nextRevisionAt ?? "").localeCompare(b.progress.nextRevisionAt ?? ""));
}

export function detectWeakTopics(
  questions: DSAQuestion[],
  topics: DSATopicMeta[],
  questionProgress: Record<string, UserQuestionProgress>
): { topicId: string; name: string; score: number; reason: string }[] {
  return topics
    .map((topic) => {
      const qs = getQuestionsByTopic(questions, topic.id);
      const attempted = qs.filter((q) => questionProgress[q.id]?.status === "attempted").length;
      const completion = getTopicCompletionPercent(topic.id, questionProgress, questions);
      const weakness = attempted * 15 + (100 - completion) * 0.5 + (topic.importanceScore > 85 ? 10 : 0);
      return {
        topicId: topic.id,
        name: topic.name,
        score: Math.min(100, Math.round(weakness)),
        reason:
          attempted > 2 ? `${attempted} stuck in attempted` : completion < 30 ? "Low completion" : "Needs practice",
      };
    })
    .filter((w) => w.score > 35)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function computePlacementReadiness(
  questions: DSAQuestion[],
  questionProgress: Record<string, UserQuestionProgress>
): number {
  const total = questions.length;
  if (!total) return 0;
  const solved = questions.filter((q) => isSolvedOrBetter(questionProgress[q.id]?.status)).length;
  const mastered = questions.filter((q) => questionProgress[q.id]?.status === "mastered").length;
  const base = (solved / total) * 70 + (mastered / total) * 30;
  return Math.min(100, Math.round(base));
}

export function computeConsistencyScore(dailyLogs: { date: string; questionsSolved: number }[]): number {
  const last7 = dailyLogs.slice(-7);
  if (!last7.length) return 0;
  const activeDays = last7.filter((d) => d.questionsSolved > 0).length;
  return Math.round((activeDays / 7) * 100);
}

export function getDailyChallengeQuestion(
  questions: DSAQuestion[],
  questionProgress: Record<string, UserQuestionProgress>,
  dateStr: string
): DSAQuestion | null {
  if (!questions.length) return null;
  const seed = dateStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const unsolved = questions.filter((q) => !isSolvedOrBetter(questionProgress[q.id]?.status));
  const pool = unsolved.length ? unsolved : questions;
  return pool[seed % pool.length];
}

export function getHeatmapData(
  questions: DSAQuestion[],
  topics: DSATopicMeta[],
  questionProgress: Record<string, UserQuestionProgress>
): { topicId: string; name: string; value: number }[] {
  return topics.map((t) => ({
    topicId: t.id,
    name: t.name,
    value: getTopicCompletionPercent(t.id, questionProgress, questions),
  }));
}

export function advanceStatus(current: QuestionStatus): QuestionStatus {
  const idx = STATUS_ORDER.indexOf(current);
  if (idx < 0 || idx >= STATUS_ORDER.length - 1) return current;
  return STATUS_ORDER[idx + 1];
}

export function xpForStatus(status: QuestionStatus, question?: DSAQuestion): number {
  const base = STATUS_XP[status];
  if (question?.xpReward && status === "solved") return question.xpReward;
  return base;
}
