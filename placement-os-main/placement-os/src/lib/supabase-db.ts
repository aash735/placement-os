/**
 * supabase-db.ts
 *
 * Database operations layer for Placement OS.
 * All tables reference app_users.id (custom auth — no Supabase Auth dependency).
 */

import { supabase, hasSupabaseConfig } from "./supabase";
import type {
  UserQuestionProgress,
  RevisionEntry,
  MockTestRecord,
  AptitudeAttempt,
  ProjectTask,
  CsSubjectState,
  DailyLog,
} from "@/types";

// ─── Error Extraction Helper ──────────────────────────────────────────────────
// Supabase error objects have non-enumerable properties — JSON.stringify gives {}
// We must access .message, .code, .details, .hint directly.
function extractError(err: any): string {
  if (!err) return "Unknown error";
  const msg = err?.message || err?.error_description || err?.hint || "";
  const code = err?.code || err?.status || "";
  const details = err?.details || "";
  if (msg) return code ? `${msg} (code: ${code})` : msg;
  if (details) return details;
  if (code) return `Database error (code: ${code})`;
  return "An unexpected database error occurred.";
}

// ─── Transformation Helpers ──────────────────────────────────────────────────

function mapDbToQuestionProgress(row: any): UserQuestionProgress {
  return {
    questionId: row.question_id,
    status: row.status,
    attempts: row.attempts,
    lastAttemptAt: row.last_attempt_at,
    solvedAt: row.solved_at,
    revisedAt: row.revised_at,
    masteredAt: row.mastered_at,
    nextRevisionAt: row.next_revision_at,
    timeSpentMin: row.time_spent_min,
    notes: row.notes || undefined,
  };
}

function mapDbToProjectTask(row: any): ProjectTask {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    stack: row.stack || "",
    status: row.status as ProjectTask["status"],
    readiness: row.readiness,
    tags: row.tags || [],
  };
}

function mapDbToAptitudeAttempt(row: any): AptitudeAttempt {
  return {
    id: row.id,
    testType: row.test_type as "mock" | "practice",
    category: row.category || undefined,
    score: Number(row.score),
    totalQuestions: row.total_questions,
    correctAnswers: row.correct_answers,
    wrongAnswers: row.wrong_answers,
    skippedAnswers: row.skipped_answers,
    timeSpentSec: row.time_spent_sec,
    completedAt: row.completed_at,
    answers: row.answers || {},
  };
}

// ─── Database API Methods ─────────────────────────────────────────────────────

/** Fetch all user data concurrently from Supabase Postgres */
export async function fetchUserData(userId: string) {
  if (!hasSupabaseConfig) return null;

  try {
    const [
      profileRes,
      progressRes,
      bookmarksRes,
      mockTestsRes,
      aptitudeAttemptsRes,
      projectsRes,
      csSubjectsRes,
      companyTargetsRes,
      dailyLogsRes,
      revisionHistoryRes,
    ] = await Promise.all([
      supabase.from("app_users").select("*").eq("id", userId).maybeSingle(),
      supabase.from("user_progress").select("*").eq("user_id", userId),
      supabase.from("bookmarks").select("question_id").eq("user_id", userId),
      supabase.from("mock_tests").select("*").eq("user_id", userId),
      supabase.from("aptitude_attempts").select("*").eq("user_id", userId),
      supabase.from("projects").select("*").eq("user_id", userId),
      supabase.from("cs_subjects").select("*").eq("user_id", userId),
      supabase.from("company_targets").select("*").eq("user_id", userId),
      supabase.from("analytics").select("*").eq("user_id", userId),
      supabase.from("revision_history").select("*").eq("user_id", userId),
    ]);

    // Profile variables
    const profile = profileRes.data || {};

    // DSA Question Progress
    const questionProgress: Record<string, UserQuestionProgress> = {};
    if (progressRes.data) {
      progressRes.data.forEach((row) => {
        questionProgress[row.question_id] = mapDbToQuestionProgress(row);
      });
    }

    // Bookmarks list
    const bookmarks = bookmarksRes.data?.map((b) => b.question_id) || [];

    // Mock tests completed
    const mockTests: MockTestRecord[] = mockTestsRes.data?.map((m) => ({
      id: m.id,
      title: m.title,
      durationMin: m.duration ?? m.duration_min ?? 0,
      questionIds: m.question_ids ?? [],
      completedAt: m.completed_at,
      score: Number(m.score ?? 0),
      totalQuestions: m.total_questions ?? 0,
      attempted: m.attempted ?? 0,
      correctAnswers: m.correct_answers ?? 0,
      wrongAnswers: m.wrong_answers ?? 0,
    })) || [];

    // Aptitude attempts completed
    const aptitudeAttempts: AptitudeAttempt[] = aptitudeAttemptsRes.data?.map(mapDbToAptitudeAttempt) || [];

    // Projects kanban items
    const projects: ProjectTask[] = projectsRes.data?.map(mapDbToProjectTask) || [];

    // CS core subjects tracking
    const csSubjects: Record<string, CsSubjectState> = {};
    if (csSubjectsRes.data) {
      csSubjectsRes.data.forEach((row) => {
        csSubjects[row.subject_id] = {
          status: row.status as CsSubjectState["status"],
          score: row.score !== null ? Number(row.score) : undefined,
          checkedItems: row.checked_items || [],
        };
      });
    }

    // Target companies
    const companyTargets: Record<string, any> = {};
    if (companyTargetsRes.data) {
      companyTargetsRes.data.forEach((row) => {
        companyTargets[row.company_slug] = row.status;
      });
    }

    // Daily analytics charts logs
    const dailyLogs: DailyLog[] = dailyLogsRes.data?.map((l) => ({
      date: l.date,
      questionsSolved: l.questions_solved,
      revisionsDone: l.revisions_done,
      xpEarned: l.xp_earned,
      focusMinutes: l.focus_minutes,
    })) || [];

    // Spaced revisions history
    const revisionHistory: RevisionEntry[] = revisionHistoryRes.data?.map((r) => ({
      id: r.id,
      questionId: r.question_id,
      reviewedAt: r.reviewed_at,
    })) || [];

    return {
      xp: profile.xp || 0,
      level: profile.level || 1,
      streak: profile.streak || 0,
      lastActiveDate: profile.last_active_date || "",
      energyMode: (profile.energy_mode || "normal") as "normal" | "low" | "recovery",
      llmApiKey: profile.llm_api_key || "",
      shortcutsEnabled: profile.shortcuts_enabled ?? true,
      questionProgress,
      bookmarks,
      mockTests,
      aptitudeAttempts,
      projects,
      csSubjects,
      companyTargets,
      dailyLogs,
      revisionHistory,
    };
  } catch (error) {
    console.error("❌ Error fetching user data from Supabase:", error);
    return null;
  }
}

/** Save or update the core user stats/profile info (in app_users table) */
export async function saveUserProfile(
  userId: string,
  profile: {
    xp: number;
    level: number;
    streak: number;
    lastActiveDate: string;
    energyMode: string;
    llmApiKey?: string;
    shortcutsEnabled?: boolean;
  }
) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.from("app_users").update({
    xp: profile.xp,
    level: profile.level,
    streak: profile.streak,
    last_active_date: profile.lastActiveDate || null,
    energy_mode: profile.energyMode,
    llm_api_key: profile.llmApiKey || null,
    shortcuts_enabled: profile.shortcutsEnabled ?? true,
    updated_at: new Date().toISOString(),
  }).eq("id", userId);
  if (error) console.error("Error saving user profile:", extractError(error));
}

/** Save or update question status/attempts/notes */
export async function saveQuestionProgress(userId: string, p: UserQuestionProgress) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.from("user_progress").upsert({
    user_id: userId,
    question_id: p.questionId,
    status: p.status,
    attempts: p.attempts,
    last_attempt_at: p.lastAttemptAt,
    solved_at: p.solvedAt,
    revised_at: p.revisedAt,
    mastered_at: p.masteredAt,
    next_revision_at: p.nextRevisionAt,
    time_spent_min: p.timeSpentMin,
    notes: p.notes || null,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("Error saving question progress:", extractError(error));
}

/** Save or delete bookmarks */
export async function saveBookmark(userId: string, questionId: string, isBookmarked: boolean) {
  if (!hasSupabaseConfig) return;
  if (isBookmarked) {
    const { error } = await supabase.from("bookmarks").upsert({
      user_id: userId,
      question_id: questionId,
      created_at: new Date().toISOString(),
    });
    if (error) console.error("Error adding bookmark:", extractError(error));
  } else {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("question_id", questionId);
    if (error) console.error("Error deleting bookmark:", extractError(error));
  }
}

/** Save Mock Test record */
export async function saveMockTest(userId: string, m: MockTestRecord) {
  if (!hasSupabaseConfig) return;

  // Validate required fields before attempting insert
  if (!userId) { console.warn("saveMockTest: userId is required"); return; }
  if (!m.id)   { console.warn("saveMockTest: MockTestRecord.id is required"); return; }

  const payload = {
    id: m.id,
    user_id: userId,
    title: m.title || "Mock Test",
    score: m.score ?? 0,
    total_questions: m.totalQuestions ?? m.questionIds?.length ?? 0,
    attempted: m.attempted ?? m.questionIds?.length ?? 0,
    correct_answers: m.correctAnswers ?? 0,
    wrong_answers: m.wrongAnswers ?? 0,
    duration: m.durationMin ?? 0,
    question_ids: m.questionIds ?? [],
    completed_at: m.completedAt || new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("mock_tests").upsert(payload, {
    onConflict: "user_id,id",
  });

  if (error) {
    console.error("Error saving mock test:", extractError(error));
  }
}

/** Save Aptitude Attempt record */
export async function saveAptitudeAttempt(userId: string, a: AptitudeAttempt) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.from("aptitude_attempts").upsert({
    id: a.id,
    user_id: userId,
    test_type: a.testType,
    category: a.category || null,
    score: a.score,
    total_questions: a.totalQuestions,
    correct_answers: a.correctAnswers,
    wrong_answers: a.wrongAnswers,
    skipped_answers: a.skippedAnswers,
    time_spent_sec: a.timeSpentSec,
    completed_at: a.completedAt || new Date().toISOString(),
    answers: a.answers || {},
  });
  if (error) console.error("Error saving aptitude attempt:", extractError(error));
}

/** Save Project task (Kanban) */
export async function saveProjectTask(userId: string, p: ProjectTask) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.from("projects").upsert({
    id: p.id,
    user_id: userId,
    name: p.name,
    description: p.description || null,
    stack: p.stack || null,
    status: p.status,
    readiness: p.readiness,
    tags: p.tags || [],
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("Error saving project task:", extractError(error));
}

/** Delete Project task */
export async function deleteProjectTask(userId: string, id: string) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
  if (error) console.error("Error deleting project task:", extractError(error));
}

/** Save CS Subject checkbox tracking state */
export async function saveCsSubject(userId: string, subjectId: string, sub: CsSubjectState) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.from("cs_subjects").upsert({
    user_id: userId,
    subject_id: subjectId,
    status: sub.status,
    score: sub.score ?? null,
    checked_items: sub.checkedItems || [],
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("Error saving CS subject:", extractError(error));
}

/** Save Target Company status */
export async function saveCompanyTarget(userId: string, slug: string, status: string) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.from("company_targets").upsert({
    user_id: userId,
    company_slug: slug,
    status: status,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("Error saving company target:", extractError(error));
}

/** Save Daily Log (analytics) charts data */
export async function saveDailyLog(userId: string, l: DailyLog) {
  if (!hasSupabaseConfig) return;
  const { error } = await supabase.from("analytics").upsert({
    user_id: userId,
    date: l.date,
    questions_solved: l.questionsSolved,
    revisions_done: l.revisionsDone,
    xp_earned: l.xpEarned,
    focus_minutes: l.focusMinutes,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("Error saving daily log:", extractError(error));
}

/** Add Revision Log entry */
export async function saveRevisionLog(userId: string, r: RevisionEntry) {
  if (!hasSupabaseConfig) return;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const isValidUuid = r.id && uuidRegex.test(r.id);

  const payload: any = {
    user_id: userId,
    question_id: r.questionId,
    reviewed_at: r.reviewedAt || new Date().toISOString(),
  };

  if (isValidUuid) {
    payload.id = r.id;
  }

  const { error } = await supabase.from("revision_history").insert(payload);
  if (error) console.error("Error adding revision log:", extractError(error));
}
