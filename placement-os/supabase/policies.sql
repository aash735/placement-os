-- ============================================================
-- PLACEMENT OS — ROW-LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
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

-- ============================================================
-- POLICIES FOR profiles
-- ============================================================

create policy "Allow public read access to profiles for checks"
  on public.profiles for select
  using (true);

create policy "Allow authenticated users to insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id or auth.uid() is null);

create policy "Allow authenticated users to update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ============================================================
-- POLICIES FOR ALL OTHER USER-SPECIFIC TABLES
-- ============================================================

-- user_progress
create policy "Users can manage their own user_progress"
  on public.user_progress for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- bookmarks
create policy "Users can manage their own bookmarks"
  on public.bookmarks for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- revision_history
create policy "Users can manage their own revision_history"
  on public.revision_history for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- analytics
create policy "Users can manage their own analytics"
  on public.analytics for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- mock_tests
create policy "Users can manage their own mock_tests"
  on public.mock_tests for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- company_targets
create policy "Users can manage their own company_targets"
  on public.company_targets for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- aptitude_attempts
create policy "Users can manage their own aptitude_attempts"
  on public.aptitude_attempts for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- projects
create policy "Users can manage their own projects"
  on public.projects for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- cs_subjects
create policy "Users can manage their own cs_subjects"
  on public.cs_subjects for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- achievements
create policy "Users can manage their own achievements"
  on public.achievements for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- countdown_goals
create policy "Users can manage their own countdown_goals"
  on public.countdown_goals for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- mock_interviews
create policy "Users can manage their own mock_interviews"
  on public.mock_interviews for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- daily_planner
create policy "Users can manage their own daily_planner"
  on public.daily_planner for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- streaks
create policy "Users can manage their own streaks"
  on public.streaks for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- planner_tasks
create policy "Users can manage their own planner_tasks"
  on public.planner_tasks for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- roadmap_goals
create policy "Users can manage their own roadmap_goals"
  on public.roadmap_goals for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- focus_sessions
create policy "Users can manage their own focus_sessions"
  on public.focus_sessions for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
