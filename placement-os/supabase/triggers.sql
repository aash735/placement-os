-- ============================================================
-- PLACEMENT OS — AUTOMATIC PROFILE CREATION TRIGGER
-- ============================================================

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  candidate_username text;
  final_username text;
  suffix integer := 1;
begin
  candidate_username := coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1));
  final_username := candidate_username;
  
  -- Resolve username conflicts by appending a numeric suffix if needed
  while exists (select 1 from public.profiles where username = final_username) loop
    final_username := candidate_username || suffix::text;
    suffix := suffix + 1;
  end loop;

  insert into public.profiles (
    id,
    email,
    username,
    full_name,
    semester,
    xp,
    level,
    streak,
    energy_mode,
    shortcuts_enabled
  )
  values (
    new.id,
    new.email,
    final_username,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User'),
    coalesce(new.raw_user_meta_data->>'semester', '7th Semester — Placement Season'),
    0,
    1,
    0,
    'normal',
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to hook into auth.users insertion
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
