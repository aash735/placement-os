-- Migration: Add weekly planner table and set up policies & permissions.
-- This script is completely additive, does not drop any existing tables, and is safe for production.

create table if not exists public.weekly_planner (
  user_id uuid not null references public.users(id) on delete cascade,
  week integer not null,
  focus text not null,
  hours text not null,
  days text[] not null default '{}',
  updated_at timestamptz not null default now(),
  primary key (user_id, week)
);

-- Enable Row Level Security (RLS)
alter table public.weekly_planner enable row level security;

-- Policies for public.weekly_planner (allow all operations since client runs under anon/authenticated roles)
create policy "Allow all operations for weekly_planner" on public.weekly_planner for all using (true) with check (true);

-- Grant privileges to client roles
grant all on public.weekly_planner to anon, authenticated, service_role;
