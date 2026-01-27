create table if not exists budget_lines (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  label text not null,
  category text,
  estimated numeric(12,2) not null default 0,
  paid numeric(12,2) not null default 0,
  status text not null default 'planned',
  notes text,
  vendor_id uuid references vendors(id) on delete set null
);

create index idx_budget_wedding on budget_lines(wedding_id);
alter table budget_lines enable row level security;

create policy "Users can manage own budget" on budget_lines
  for all using (
    wedding_id in (select id from weddings where owner_id = auth.uid())
  );

create trigger budget_lines_updated_at before update on budget_lines
  for each row execute function update_updated_at();
