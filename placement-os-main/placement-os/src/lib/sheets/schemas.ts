/** Column specs for every sheet — single source of truth for validation */

export const DSA_QUESTION_COLUMNS = [
  "question_id",
  "title",
  "url",
  "platform",
  "difficulty",
  "topic",
  "subtopic",
  "pattern",
  "companies",
  "frequency",
  "estimated_time",
  "revision_priority",
  "explanation_url",
  "video_url",
  "neetcode_ref",
  "striver_ref",
  "tags",
  "xp_reward",
  "unlock_level",
  "prerequisites",
  "level",
  "category",
  "alt_url",
] as const;

export const DSA_TOPIC_COLUMNS = [
  "id",
  "name",
  "slug",
  "difficulty",
  "importance_score",
  "interview_frequency",
  "estimated_hours",
  "tier",
  "overview",
  "patterns",
  "unlock_after_topic_id",
] as const;

export const MOCK_TEST_COLUMNS = ["id", "title", "duration_min", "question_ids", "company_tags"] as const;

export const COMPANY_COLUMNS = [
  "slug",
  "name",
  "type",
  "oa_pattern",
  "coding_difficulty",
  "aptitude_weightage",
  "rounds",
  "communication",
  "resume",
  "projects",
  "hr_questions",
  "priority",
  "strategy",
] as const;

export const APTITUDE_TOPIC_COLUMNS = [
  "id",
  "category",
  "name",
  "priority",
  "difficulty",
  "strategy",
  "shortcuts",
  "revision",
] as const;

export type SheetRow = Record<string, string>;

export function splitList(value: string | undefined, sep = "|"): string[] {
  if (!value?.trim()) return [];
  return value.split(sep).map((s) => s.trim()).filter(Boolean);
}

export function parseNumber(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
