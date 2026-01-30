create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text,
  phone text,
  adults integer not null default 1,
  kids integer not null default 0,
  status text not null default 'pending',
  group_name text,
  dietary_notes text,
  table_number integer,
  plus_one boolean default false,
  notes text
);

create index idx_guests_wedding on guests(wedding_id);
create index idx_guests_status on guests(wedding_id, status);
alter table guests enable row level security;

create policy "Users can manage own guests" on guests
  for all using (
    wedding_id in (select id from weddings where owner_id = auth.uid())
  );

create trigger guests_updated_at before update on guests
  for each row execute function update_updated_at();
