-- ============================================================
-- PLACEMENT OS — COMPLETE UNIFIED DATABASE MIGRATION SCRIPT
-- Custom Database-only Auth System (NO Supabase Auth)
-- ============================================================
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard -> SQL Editor
-- 2. Create a new query block (+)
-- 3. Paste this ENTIRE file and click "Run"
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- STEP 1: DROP OLD TRIGGERS & TABLES (Clean slate)
-- ============================================================
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;

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
drop table if exists public.profiles cascade;
drop table if exists public.users cascade;
drop table if exists public.achievements cascade;
drop table if exists public.countdown_goals cascade;
drop table if exists public.mock_interviews cascade;
drop table if exists public.daily_planner cascade;
drop table if exists public.streaks cascade;
drop table if exists public.planner_tasks cascade;
drop table if exists public.roadmap_goals cascade;
drop table if exists public.focus_sessions cascade;

-- ============================================================
-- STEP 2: CREATE public.users TABLE (Custom DB Auth)
-- ============================================================
create table public.users (
  id             uuid    primary key default gen_random_uuid(),
  username       text    not null unique,
  password_hash  text    not null,
  full_name      text    not null default '',
  semester       text    not null default '7th Semester — Placement Season',
  xp             integer not null default 0,
  level          integer not null default 1,
  streak         integer not null default 0,
  last_active_date date  default current_date,
  energy_mode    text    not null default 'normal',
  llm_api_key    text,
  shortcuts_enabled boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ============================================================
-- STEP 3: CREATE APPLICATION TABLES
-- ============================================================

-- 1. USER PROGRESS (DSA QUESTIONS)
create table public.user_progress (
  user_id uuid not null references public.users(id) on delete cascade,
  question_id text not null,
  status text not null default 'not_started',
  attempts integer not null default 0,
  last_attempt_at timestamptz,
  solved_at timestamptz,
  revised_at timestamptz,
  mastered_at timestamptz,
  next_revision_at timestamptz,
  time_spent_min integer not null default 0,
  notes text,
  updated_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

-- 2. BOOKMARKS
create table public.bookmarks (
  user_id uuid not null references public.users(id) on delete cascade,
  question_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

-- 3. REVISION HISTORY
create table public.revision_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  question_id text not null,
  reviewed_at timestamptz not null default now()
);

-- 4. ANALYTICS (DAILY LOGS)
create table public.analytics (
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null default current_date,
  questions_solved integer not null default 0,
  revisions_done integer not null default 0,
  xp_earned integer not null default 0,
  focus_minutes integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, date)
);

-- 5. MOCK TESTS
create table public.mock_tests (
  id text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null default 'Mock Test',
  score numeric not null default 0,
  total_questions integer not null default 0,
  attempted integer not null default 0,
  correct_answers integer not null default 0,
  wrong_answers integer not null default 0,
  duration integer not null default 0,
  question_ids text[] not null default '{}',
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- 6. COMPANY TARGET PREPARATION
create table public.company_targets (
  user_id uuid not null references public.users(id) on delete cascade,
  company_slug text not null,
  status text not null default 'not-started',
  updated_at timestamptz not null default now(),
  primary key (user_id, company_slug)
);

-- 7. APTITUDE ATTEMPTS
create table public.aptitude_attempts (
  id text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  test_type text not null,
  category text,
  score numeric not null default 0,
  total_questions integer not null default 0,
  correct_answers integer not null default 0,
  wrong_answers integer not null default 0,
  skipped_answers integer not null default 0,
  time_spent_sec integer not null default 0,
  completed_at timestamptz not null default now(),
  answers jsonb not null default '{}'::jsonb,
  primary key (user_id, id)
);

-- 8. PROJECTS (KANBAN CARDS)
create table public.projects (
  id text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text,
  stack text,
  status text not null default 'todo',
  readiness integer not null default 0,
  tags text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- 9. CS CORE SUBJECT TRACKING
create table public.cs_subjects (
  user_id uuid not null references public.users(id) on delete cascade,
  subject_id text not null,
  status text not null default 'not-started',
  score numeric,
  checked_items text[] not null default '{}',
  updated_at    timestamptz not null default now(),
  primary key (user_id, subject_id)
);

-- 10. CS ACHIEVEMENTS
create table public.achievements (
  user_id uuid not null references public.users(id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

-- 11. COUNTDOWN GOALS
create table public.countdown_goals (
  id text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  target_date date not null,
  milestones jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- 12. MOCK INTERVIEWS
create table public.mock_interviews (
  id text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  status text not null default 'completed',
  score numeric not null default 0,
  questions jsonb not null default '[]'::jsonb,
  answers jsonb not null default '{}'::jsonb,
  feedback text,
  completed_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- 13. DAILY PLANNER (SCHEDULE BLOCKS)
create table public.daily_planner (
  id text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  time text not null,
  task text not null,
  energy text not null default 'normal',
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- 14. STREAKS HISTORY
create table public.streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active date not null default current_date,
  created_at timestamptz not null default now()
);

-- 15. PLANNER TASKS
create table public.planner_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  due_date date,
  created_at timestamptz not null default now()
);

-- 16. ROADMAP GOALS
create table public.roadmap_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text,
  target_date date,
  progress integer not null default 0,
  created_at timestamptz not null default now()
);

-- 17. FOCUS SESSIONS
create table public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  duration integer not null,
  questions_completed integer not null default 0,
  completed_at timestamptz not null default now()
);

-- ============================================================
-- STEP 4: CREATE DATABASE INDEXES
-- ============================================================
create index if not exists idx_users_username on public.users (lower(username));
create index if not exists idx_user_progress_user_status on public.user_progress (user_id, status);
create index if not exists idx_revision_history_user on public.revision_history (user_id);
create index if not exists idx_mock_tests_user on public.mock_tests (user_id, completed_at desc);

-- ============================================================
-- STEP 5: ENABLE ROW LEVEL SECURITY (RLS) & SET PERMISSIONS
-- ============================================================
-- Because we do not use Supabase Auth, client-side queries run 
-- under the 'anon' role. To ensure data updates succeed, we 
-- allow open access to the 'anon' and 'authenticated' roles.
-- ============================================================

alter table public.users enable row level security;
alter table public.user_progress enable row level security;
alter table public.bookmarks enable row level security;
alter table public.revision_history enable row level security;
alter table public.analytics enable row level security;
alter table public.mock_tests enable row level security;
alter table public.company_targets enable row level security;
alter table public.aptitude_attempts enable row level security;
alter table public.projects enable row level security;
alter table public.cs_subjects enable row level security;
alter table public.achievements enable row level security;
alter table public.countdown_goals enable row level security;
alter table public.mock_interviews enable row level security;
alter table public.daily_planner enable row level security;
alter table public.streaks enable row level security;
alter table public.planner_tasks enable row level security;
alter table public.roadmap_goals enable row level security;
alter table public.focus_sessions enable row level security;

-- Policies for public.users
create policy "Allow all operations for users" on public.users for all using (true) with check (true);

-- Policies for other tables
create policy "Allow all operations for user_progress" on public.user_progress for all using (true) with check (true);
create policy "Allow all operations for bookmarks" on public.bookmarks for all using (true) with check (true);
create policy "Allow all operations for revision_history" on public.revision_history for all using (true) with check (true);
create policy "Allow all operations for analytics" on public.analytics for all using (true) with check (true);
create policy "Allow all operations for mock_tests" on public.mock_tests for all using (true) with check (true);
create policy "Allow all operations for company_targets" on public.company_targets for all using (true) with check (true);
create policy "Allow all operations for aptitude_attempts" on public.aptitude_attempts for all using (true) with check (true);
create policy "Allow all operations for projects" on public.projects for all using (true) with check (true);
create policy "Allow all operations for cs_subjects" on public.cs_subjects for all using (true) with check (true);
create policy "Allow all operations for achievements" on public.achievements for all using (true) with check (true);
create policy "Allow all operations for countdown_goals" on public.countdown_goals for all using (true) with check (true);
create policy "Allow all operations for mock_interviews" on public.mock_interviews for all using (true) with check (true);
create policy "Allow all operations for daily_planner" on public.daily_planner for all using (true) with check (true);
create policy "Allow all operations for streaks" on public.streaks for all using (true) with check (true);
create policy "Allow all operations for planner_tasks" on public.planner_tasks for all using (true) with check (true);
create policy "Allow all operations for roadmap_goals" on public.roadmap_goals for all using (true) with check (true);
create policy "Allow all operations for focus_sessions" on public.focus_sessions for all using (true) with check (true);

-- Grant privileges to anon client role
-- Revoke all table-level access on public.users for anon/authenticated to prevent arbitrary password hashes exposure or edits
revoke all on public.users from anon, authenticated;

-- Grant selective select privilege on safe columns of users table
grant select (id, username, full_name, semester, xp, level, streak, last_active_date, energy_mode, shortcuts_enabled, created_at, updated_at)
  on public.users to anon, authenticated;

-- Grant selective update privilege on progress columns of users table
grant update (full_name, semester, xp, level, streak, last_active_date, energy_mode, shortcuts_enabled, updated_at)
  on public.users to anon, authenticated;

grant all on public.users to service_role;

-- ============================================================
-- STEP 6: SECURE AUTHENTICATION RPC FUNCTIONS
-- ============================================================

-- Custom secure registration RPC
create or replace function public.register_user(
  p_username text,
  p_password text,
  p_full_name text,
  p_semester text
) returns jsonb as $$
declare
  v_user_id uuid;
  v_password_hash text;
  v_exists boolean;
begin
  -- Check if username exists
  select exists(select 1 from public.users where lower(username) = lower(trim(p_username))) into v_exists;
  if v_exists then
    return jsonb_build_object('error', 'Username is already taken.');
  end if;

  -- Hash password using pgcrypto (bcrypt)
  v_password_hash := crypt(p_password, gen_salt('bf', 10));

  -- Insert user
  insert into public.users (username, password_hash, full_name, semester)
  values (lower(trim(p_username)), v_password_hash, trim(p_full_name), p_semester)
  returning id into v_user_id;

  return jsonb_build_object(
    'user', jsonb_build_object(
      'id', v_user_id,
      'username', lower(trim(p_username)),
      'name', trim(p_full_name),
      'semester', p_semester
    ),
    'error', null
  );
end;
$$ language plpgsql security definer;

-- Custom secure login RPC
create or replace function public.login_user(
  p_username text,
  p_password text
) returns jsonb as $$
declare
  v_user record;
begin
  select id, username, password_hash, full_name, semester
  into v_user
  from public.users
  where lower(username) = lower(trim(p_username));

  if v_user.id is null then
    return jsonb_build_object('error', 'No account found with that username.');
  end if;

  -- Verify password using pgcrypto comparison
  if v_user.password_hash = crypt(p_password, v_user.password_hash) then
    return jsonb_build_object(
      'user', jsonb_build_object(
        'id', v_user.id,
        'username', v_user.username,
        'name', v_user.full_name,
        'semester', v_user.semester
      ),
      'error', null
    );
  else
    return jsonb_build_object('error', 'Incorrect password. Please try again.');
  end if;
end;
$$ language plpgsql security definer;

-- Grant execution permissions for the RPC functions to anon & authenticated clients
grant execute on function public.register_user(text, text, text, text) to anon, authenticated;
grant execute on function public.login_user(text, text) to anon, authenticated;
grant all on public.user_progress to anon, authenticated, service_role;
grant all on public.bookmarks to anon, authenticated, service_role;
grant all on public.revision_history to anon, authenticated, service_role;
grant all on public.analytics to anon, authenticated, service_role;
grant all on public.mock_tests to anon, authenticated, service_role;
grant all on public.company_targets to anon, authenticated, service_role;
grant all on public.aptitude_attempts to anon, authenticated, service_role;
grant all on public.projects to anon, authenticated, service_role;
grant all on public.cs_subjects to anon, authenticated, service_role;
grant all on public.achievements to anon, authenticated, service_role;
grant all on public.countdown_goals to anon, authenticated, service_role;
grant all on public.mock_interviews to anon, authenticated, service_role;
grant all on public.daily_planner to anon, authenticated, service_role;
grant all on public.streaks to anon, authenticated, service_role;
grant all on public.planner_tasks to anon, authenticated, service_role;
grant all on public.roadmap_goals to anon, authenticated, service_role;
grant all on public.focus_sessions to anon, authenticated, service_role;
