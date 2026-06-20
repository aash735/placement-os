-- =============================================
-- PLACEMENT OS — MCQ PRACTICE ADDITIVE SCHEMA
-- =============================================
-- Additive tables and RLS policies for MCQ tracking.
-- Run this in the Supabase SQL editor if not already executed.

-- 1. MCQ ATTEMPTS TABLE
create table if not exists public.mcq_attempts (
  id text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  question_id text not null,
  selected_option text not null,
  is_correct boolean not null,
  time_spent_sec integer not null,
  attempt_type text not null,
  session_id text,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, id)
);

-- Enable RLS and set policies
alter table public.mcq_attempts enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'mcq_attempts' and policyname = 'Users can manage their own MCQ attempts'
  ) then
    create policy "Users can manage their own MCQ attempts"
      on public.mcq_attempts for all to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end
$$;

-- 2. MCQ BOOKMARKS TABLE
create table if not exists public.mcq_bookmarks (
  user_id uuid not null references public.users(id) on delete cascade,
  question_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, question_id)
);

-- Enable RLS and set policies
alter table public.mcq_bookmarks enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'mcq_bookmarks' and policyname = 'Users can manage their own MCQ bookmarks'
  ) then
    create policy "Users can manage their own MCQ bookmarks"
      on public.mcq_bookmarks for all to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end
$$;

-- 3. MCQ SESSIONS TABLE
create table if not exists public.mcq_sessions (
  id text not null,
  user_id uuid not null references public.users(id) on delete cascade,
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

-- Enable RLS and set policies
alter table public.mcq_sessions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'mcq_sessions' and policyname = 'Users can manage their own MCQ sessions'
  ) then
    create policy "Users can manage their own MCQ sessions"
      on public.mcq_sessions for all to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end
$$;
