create table if not exists subscription_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  stripe_event_id text unique,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb
);

create index idx_sub_events_wedding on subscription_events(wedding_id);

-- Helper function to check admin role (SECURITY DEFINER bypasses RLS to avoid recursion)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('admin', 'super_admin')
  );
end;
$$ language plpgsql security definer;

-- Admin RLS policies (use is_admin() to avoid infinite recursion on profiles)
create policy "Admin can view all profiles" on profiles
  for select using (public.is_admin());

create policy "Admin can view all weddings" on weddings
  for select using (public.is_admin());
