-- ============================================================
-- PLACEMENT OS — MCQ PRACTICE FIXED ADDITIVE SCHEMA
-- ============================================================
-- Additive tables, permissive RLS policies, and grants for MCQ tracking.
-- Run this in the Supabase SQL editor.
-- ============================================================

-- 1. MCQ ATTEMPTS TABLE
create table if not exists public.mcq_attempts (
  id text not null,
  user_id uuid not null,
  question_id text not null,
  selected_option text not null,
  is_correct boolean not null,
  time_spent_sec integer not null,
  attempt_type text not null,
  session_id text,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, id)
);

-- Enable RLS and set permissive policies for custom auth
alter table public.mcq_attempts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'mcq_attempts' and policyname = 'Allow all operations for mcq_attempts'
  ) then
    create policy "Allow all operations for mcq_attempts"
      on public.mcq_attempts for all using (true) with check (true);
  end if;
end
$$;

-- Grant privileges to anon, authenticated, and service_role
grant all on public.mcq_attempts to anon, authenticated, service_role;


-- 2. MCQ BOOKMARKS TABLE
create table if not exists public.mcq_bookmarks (
  user_id uuid not null,
  question_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, question_id)
);

-- Enable RLS and set permissive policies for custom auth
alter table public.mcq_bookmarks enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'mcq_bookmarks' and policyname = 'Allow all operations for mcq_bookmarks'
  ) then
    create policy "Allow all operations for mcq_bookmarks"
      on public.mcq_bookmarks for all using (true) with check (true);
  end if;
end
$$;

-- Grant privileges to anon, authenticated, and service_role
grant all on public.mcq_bookmarks to anon, authenticated, service_role;


-- 3. MCQ SESSIONS TABLE
create table if not exists public.mcq_sessions (
  id text not null,
  user_id uuid not null,
  type text not null,
  title text not null default 'MCQ Session',
  company_name text,
  question_ids text[] not null default '{}',
  answers jsonb not null default '{}'::jsonb,
  correct_count integer not null default 0,
  total_questions integer not null default 0,
  time_spent_sec integer not null default 0,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, id)
);

-- Enable RLS and set permissive policies for custom auth
alter table public.mcq_sessions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'mcq_sessions' and policyname = 'Allow all operations for mcq_sessions'
  ) then
    create policy "Allow all operations for mcq_sessions"
      on public.mcq_sessions for all using (true) with check (true);
  end if;
end
$$;

-- Grant privileges to anon, authenticated, and service_role
grant all on public.mcq_sessions to anon, authenticated, service_role;
