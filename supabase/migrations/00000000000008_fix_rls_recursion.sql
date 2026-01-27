-- 1. Create the helper function
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

-- 2. Drop the recursive policies
drop policy if exists "Admin can view all profiles" on profiles;
drop policy if exists "Admin can view all weddings" on weddings;

-- 3. Recreate with is_admin()
create policy "Admin can view all profiles" on profiles
  for select using (public.is_admin());

create policy "Admin can view all weddings" on weddings
  for select using (public.is_admin());
