-- ============================================================
-- PLACEMENT OS — FULL PRODUCTION SQL SCHEMA v3
-- Custom Auth System (NO Supabase Auth dependency)
-- NO Foreign Key Constraints (custom auth — app-level validation)
-- ============================================================
-- INSTRUCTIONS:
-- Use this file for a FRESH deployment (wipes all data).
-- For an EXISTING database, use supabase-migration-remove-fk.sql instead.
--
-- 1. Open your Supabase project at https://supabase.com
-- 2. Go to SQL Editor
-- 3. Paste this ENTIRE file and click "Run"
-- 4. You should see: "Success. No rows returned."
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- STEP 1: DROP OLD SCHEMA (Clean slate)
-- ============================================================
drop table if exists public.cs_subjects cascade;
drop table if exists public.projects cascade;
drop table if exists public.aptitude_attempts cascade;
drop table if exists public.company_targets cascade;
drop table if exists public.mock_tests cascade;
drop table if exists public.analytics cascade;
drop table if exists public.bookmarks cascade;
drop table if exists public.revision_history cascade;
drop table if exists public.xp_logs cascade;
drop table if exists public.user_progress cascade;
drop table if exists public.app_users cascade;
drop table if exists public.users cascade;

-- Drop old Supabase Auth triggers if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();


-- ============================================================
-- STEP 2: app_users TABLE
-- Custom auth — stores username/hashed password. No Supabase Auth link.
-- ============================================================
create table public.app_users (
  id             uuid    primary key default gen_random_uuid(),
  username       text    not null,
  email          text,
  password_hash  text    not null,
  name           text    not null default '',
  semester       text    not null default '7th Semester — Placement Season',
  xp             integer not null default 0,
  level          integer not null default 1,
  streak         integer not null default 0,
  last_active_date date  default current_date,
  energy_mode    text    not null default 'normal',
  llm_api_key    text,
  shortcuts_enabled boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint app_users_username_unique unique (username)
);

create index idx_app_users_username_lower on public.app_users (lower(username));
create index idx_app_users_email          on public.app_users (email) where email is not null;

alter table public.app_users disable row level security;
grant all on public.app_users to anon;
grant all on public.app_users to authenticated;
grant all on public.app_users to service_role;


-- ============================================================
-- STEP 3: user_progress TABLE
-- NO FK — user_id is a plain uuid; validated at app layer.
-- ============================================================
create table public.user_progress (
  user_id          uuid  not null,         -- no FK to app_users
  question_id      text  not null,
  status           text  not null default 'not_started',
  attempts         integer not null default 0,
  last_attempt_at  timestamptz,
  solved_at        timestamptz,
  revised_at       timestamptz,
  mastered_at      timestamptz,
  next_revision_at timestamptz,
  time_spent_min   integer not null default 0,
  notes            text,
  updated_at       timestamptz not null default now(),
  primary key (user_id, question_id)
);

create index idx_user_progress_user_status on public.user_progress (user_id, status);

alter table public.user_progress disable row level security;
grant all on public.user_progress to anon;
grant all on public.user_progress to authenticated;
grant all on public.user_progress to service_role;


-- ============================================================
-- STEP 4: revision_history TABLE — NO FK
-- ============================================================
create table public.revision_history (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,               -- no FK to app_users
  question_id text not null,
  reviewed_at timestamptz not null default now()
);

create index idx_revision_history_user on public.revision_history (user_id);

alter table public.revision_history disable row level security;
grant all on public.revision_history to anon;
grant all on public.revision_history to authenticated;
grant all on public.revision_history to service_role;


-- ============================================================
-- STEP 5: bookmarks TABLE — NO FK
-- ============================================================
create table public.bookmarks (
  user_id     uuid not null,               -- no FK to app_users
  question_id text not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, question_id)
);

alter table public.bookmarks disable row level security;
grant all on public.bookmarks to anon;
grant all on public.bookmarks to authenticated;
grant all on public.bookmarks to service_role;


-- ============================================================
-- STEP 6: analytics (daily logs) TABLE — NO FK
-- ============================================================
create table public.analytics (
  user_id          uuid    not null,       -- no FK to app_users
  date             date    not null default current_date,
  questions_solved integer not null default 0,
  revisions_done   integer not null default 0,
  xp_earned        integer not null default 0,
  focus_minutes    integer not null default 0,
  updated_at       timestamptz not null default now(),
  primary key (user_id, date)
);

alter table public.analytics disable row level security;
grant all on public.analytics to anon;
grant all on public.analytics to authenticated;
grant all on public.analytics to service_role;


-- ============================================================
-- STEP 7: mock_tests TABLE — NO FK
-- Full result-tracking schema; user_id is a plain uuid field.
-- ============================================================
create table public.mock_tests (
  id               text    not null,
  user_id          uuid    not null,       -- no FK to app_users
  title            text    not null default 'Mock Test',
  score            numeric not null default 0,
  total_questions  integer not null default 0,
  attempted        integer not null default 0,
  correct_answers  integer not null default 0,
  wrong_answers    integer not null default 0,
  duration         integer not null default 0,  -- minutes
  question_ids     text[]  not null default '{}',
  completed_at     timestamptz not null default now(),
  created_at       timestamptz not null default now(),
  primary key (user_id, id)
);

create index idx_mock_tests_user on public.mock_tests (user_id, completed_at desc);

alter table public.mock_tests disable row level security;
grant all on public.mock_tests to anon;
grant all on public.mock_tests to authenticated;
grant all on public.mock_tests to service_role;


-- ============================================================
-- STEP 8: company_targets TABLE — NO FK
-- ============================================================
create table public.company_targets (
  user_id      uuid not null,              -- no FK to app_users
  company_slug text not null,
  status       text not null default 'not-started',
  updated_at   timestamptz not null default now(),
  primary key (user_id, company_slug)
);

alter table public.company_targets disable row level security;
grant all on public.company_targets to anon;
grant all on public.company_targets to authenticated;
grant all on public.company_targets to service_role;


-- ============================================================
-- STEP 9: aptitude_attempts TABLE — NO FK
-- ============================================================
create table public.aptitude_attempts (
  id               text    not null,
  user_id          uuid    not null,       -- no FK to app_users
  test_type        text    not null,
  category         text,
  score            numeric not null default 0,
  total_questions  integer not null default 0,
  correct_answers  integer not null default 0,
  wrong_answers    integer not null default 0,
  skipped_answers  integer not null default 0,
  time_spent_sec   integer not null default 0,
  completed_at     timestamptz not null default now(),
  answers          jsonb   not null default '{}'::jsonb,
  primary key (user_id, id)
);

alter table public.aptitude_attempts disable row level security;
grant all on public.aptitude_attempts to anon;
grant all on public.aptitude_attempts to authenticated;
grant all on public.aptitude_attempts to service_role;


-- ============================================================
-- STEP 10: projects TABLE — NO FK
-- ============================================================
create table public.projects (
  id          text    not null,
  user_id     uuid    not null,            -- no FK to app_users
  name        text    not null,
  description text,
  stack       text,
  status      text    not null default 'todo',
  readiness   integer not null default 0,
  tags        text[]  not null default '{}',
  updated_at  timestamptz not null default now(),
  primary key (user_id, id)
);

alter table public.projects disable row level security;
grant all on public.projects to anon;
grant all on public.projects to authenticated;
grant all on public.projects to service_role;


-- ============================================================
-- STEP 11: cs_subjects TABLE — NO FK
-- ============================================================
create table public.cs_subjects (
  user_id       uuid not null,             -- no FK to app_users
  subject_id    text not null,
  status        text not null default 'not-started',
  score         numeric,
  checked_items text[] not null default '{}',
  updated_at    timestamptz not null default now(),
  primary key (user_id, subject_id)
);

alter table public.cs_subjects disable row level security;
grant all on public.cs_subjects to anon;
grant all on public.cs_subjects to authenticated;
grant all on public.cs_subjects to service_role;


-- ============================================================
-- VERIFICATION
-- Run this to confirm tables exist and have no FK constraints:
-- ============================================================
-- Tables check:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public' ORDER BY table_name;
--
-- FK check (should return 0 rows):
-- SELECT conname, conrelid::regclass
-- FROM pg_constraint
-- WHERE contype = 'f'
--   AND conrelid::regclass::text IN (
--     'user_progress','revision_history','bookmarks','analytics',
--     'mock_tests','company_targets','aptitude_attempts','projects','cs_subjects'
--   );
-- ============================================================
