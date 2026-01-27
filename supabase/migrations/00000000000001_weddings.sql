create table if not exists weddings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  owner_id uuid not null references profiles(id) on delete cascade,
  partner1_name text not null default '',
  partner2_name text not null default '',
  wedding_date date,
  total_budget numeric(12,2) default 0,
  currency text not null default 'EUR',
  locale text not null default 'fr',
  timezone text not null default 'Europe/Paris',
  plan text not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  settings jsonb not null default '{}'::jsonb
);

create index idx_weddings_owner on weddings(owner_id);
alter table weddings enable row level security;

create policy "Users can view own weddings" on weddings
  for select using (owner_id = auth.uid());
create policy "Users can insert own weddings" on weddings
  for insert with check (owner_id = auth.uid());
create policy "Users can update own weddings" on weddings
  for update using (owner_id = auth.uid());
create policy "Users can delete own weddings" on weddings
  for delete using (owner_id = auth.uid());

create trigger weddings_updated_at before update on weddings
  for each row execute function update_updated_at();
