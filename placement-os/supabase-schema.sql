-- ==========================================
-- PLACEMENT OS — SUPABASE POSTGRESQL SCHEMA
-- ==========================================
-- Copy and execute this SQL script in the Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS PROFILE TABLE
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  name text,
  level integer default 1,
  xp integer default 0,
  streak integer default 0,
  last_active_date date default current_date,
  energy_mode text default 'normal',
  llm_api_key text,
  shortcuts_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on users
alter table public.users enable row level security;

-- Create policy for users
create policy "Users can view and update their own profile" 
  on public.users for all 
  to authenticated 
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Trigger to automatically create a user profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, level, xp, streak, last_active_date, energy_mode, shortcuts_enabled)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    1,
    0,
    0,
    current_date,
    'normal',
    true
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. USER PROGRESS (DSA QUESTIONS)
create table if not exists public.user_progress (
  user_id uuid not null references public.users(id) on delete cascade,
  question_id text not null,
  status text not null default 'not_started',
  attempts integer not null default 0,
  last_attempt_at timestamp with time zone,
  solved_at timestamp with time zone,
  revised_at timestamp with time zone,
  mastered_at timestamp with time zone,
  next_revision_at timestamp with time zone,
  time_spent_min integer not null default 0,
  notes text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, question_id)
);

alter table public.user_progress enable row level security;
create policy "Users can manage their own question progress"
  on public.user_progress for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_user_progress_status on public.user_progress(user_id, status);


-- 3. REVISION HISTORY
create table if not exists public.revision_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  question_id text not null,
  reviewed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.revision_history enable row level security;
create policy "Users can manage their own revision history"
  on public.revision_history for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_revision_history_user on public.revision_history(user_id);


-- 4. BOOKMARKS
create table if not exists public.bookmarks (
  user_id uuid not null references public.users(id) on delete cascade,
  question_id text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, question_id)
);

alter table public.bookmarks enable row level security;
create policy "Users can manage their own bookmarks"
  on public.bookmarks for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 5. XP LOGS
create table if not exists public.xp_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  amount integer not null,
  reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.xp_logs enable row level security;
create policy "Users can view their own XP logs"
  on public.xp_logs for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 6. ANALYTICS (DAILY LOGS)
create table if not exists public.analytics (
  user_id uuid not null references public.users(id) on delete cascade,
  date date not null default current_date,
  questions_solved integer not null default 0,
  revisions_done integer not null default 0,
  xp_earned integer not null default 0,
  focus_minutes integer not null default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, date)
);

alter table public.analytics enable row level security;
create policy "Users can manage their own daily analytics"
  on public.analytics for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 7. MOCK TESTS completions
create table if not exists public.mock_tests (
  id text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  duration_min integer not null default 60,
  question_ids text[] not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  score numeric not null default 0,
  primary key (user_id, id)
);

alter table public.mock_tests enable row level security;
create policy "Users can manage their own mock test records"
  on public.mock_tests for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 8. COMPANY TARGET PREPARATION
create table if not exists public.company_targets (
  user_id uuid not null references public.users(id) on delete cascade,
  company_slug text not null,
  status text not null default 'not-started',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, company_slug)
);

alter table public.company_targets enable row level security;
create policy "Users can manage their own company targets"
  on public.company_targets for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 9. APTITUDE ATTEMPTS
create table if not exists public.aptitude_attempts (
  id text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  test_type text not null,
  category text,
  score numeric not null,
  total_questions integer not null,
  correct_answers integer not null,
  wrong_answers integer not null,
  skipped_answers integer not null,
  time_spent_sec integer not null,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  answers jsonb not null default '{}'::jsonb,
  primary key (user_id, id)
);

alter table public.aptitude_attempts enable row level security;
create policy "Users can manage their own aptitude attempts"
  on public.aptitude_attempts for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 10. PROJECTS milstone cards
create table if not exists public.projects (
  id text not null,
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text,
  stack text,
  status text not null default 'todo',
  readiness integer not null default 0,
  tags text[] not null default '{}'::text[],
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, id)
);

alter table public.projects enable row level security;
create policy "Users can manage their own projects"
  on public.projects for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- 11. CS CORE SUBJECT TRACKING
create table if not exists public.cs_subjects (
  user_id uuid not null references public.users(id) on delete cascade,
  subject_id text not null,
  status text not null default 'not-started',
  score numeric,
  checked_items text[] not null default '{}'::text[],
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, subject_id)
);

alter table public.cs_subjects enable row level security;
create policy "Users can manage their own CS subject trackers"
  on public.cs_subjects for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
