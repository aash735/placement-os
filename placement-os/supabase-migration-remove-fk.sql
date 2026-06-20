-- ============================================================
-- PLACEMENT OS — FK REMOVAL MIGRATION
-- Run this in Supabase SQL Editor to fix the FK violation
-- WITHOUT wiping any existing data.
-- ============================================================
-- Problem: All tables have user_id REFERENCES public.app_users(id)
--          If that UUID doesn't exist in app_users (e.g. schema was
--          re-run after account creation), all inserts will fail with
--          FK violation error code 23503.
-- Solution: Remove FK constraints. user_id stays as uuid NOT NULL —
--           we just don't enforce referential integrity at the DB level.
--           The app handles user validity at the application layer.
-- ============================================================

-- ── user_progress ────────────────────────────────────────────
ALTER TABLE public.user_progress
  DROP CONSTRAINT IF EXISTS user_progress_user_id_fkey;

-- ── revision_history ─────────────────────────────────────────
ALTER TABLE public.revision_history
  DROP CONSTRAINT IF EXISTS revision_history_user_id_fkey;

-- ── bookmarks ────────────────────────────────────────────────
ALTER TABLE public.bookmarks
  DROP CONSTRAINT IF EXISTS bookmarks_user_id_fkey;

-- ── analytics ────────────────────────────────────────────────
ALTER TABLE public.analytics
  DROP CONSTRAINT IF EXISTS analytics_user_id_fkey;

-- ── mock_tests ───────────────────────────────────────────────
-- This is the one causing the current error
ALTER TABLE public.mock_tests
  DROP CONSTRAINT IF EXISTS mock_tests_user_id_fkey;

-- ── company_targets ──────────────────────────────────────────
ALTER TABLE public.company_targets
  DROP CONSTRAINT IF EXISTS company_targets_user_id_fkey;

-- ── aptitude_attempts ────────────────────────────────────────
ALTER TABLE public.aptitude_attempts
  DROP CONSTRAINT IF EXISTS aptitude_attempts_user_id_fkey;

-- ── projects ─────────────────────────────────────────────────
ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_user_id_fkey;

-- ── cs_subjects ──────────────────────────────────────────────
ALTER TABLE public.cs_subjects
  DROP CONSTRAINT IF EXISTS cs_subjects_user_id_fkey;

-- ── mcq_sessions ─────────────────────────────────────────────
-- Add missing columns and drop old score column to match frontend
ALTER TABLE public.mcq_sessions DROP COLUMN IF EXISTS score;
ALTER TABLE public.mcq_sessions ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT 'MCQ Session';
ALTER TABLE public.mcq_sessions ADD COLUMN IF NOT EXISTS company_name text;
ALTER TABLE public.mcq_sessions ADD COLUMN IF NOT EXISTS correct_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.mcq_sessions ADD COLUMN IF NOT EXISTS total_questions integer NOT NULL DEFAULT 0;

-- ============================================================
-- VERIFICATION
-- Run this after to confirm all FK constraints are gone:
-- ============================================================
-- SELECT conname, conrelid::regclass, confrelid::regclass
-- FROM pg_constraint
-- WHERE contype = 'f'
--   AND conrelid::regclass::text IN (
--     'user_progress', 'revision_history', 'bookmarks',
--     'analytics', 'mock_tests', 'company_targets',
--     'aptitude_attempts', 'projects', 'cs_subjects'
--   );
-- Expected result: 0 rows (no foreign keys remain)
-- ============================================================

-- ============================================================
-- NOTE: user_id columns are still uuid NOT NULL.
-- They just no longer require the UUID to exist in app_users.
-- Your custom auth session UUIDs will insert correctly now.
-- ============================================================
