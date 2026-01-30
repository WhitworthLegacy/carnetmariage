create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  location text,
  price numeric(12,2) default 0,
  capacity integer default 0,
  status text not null default 'visit',
  contact_name text,
  contact_email text,
  contact_phone text,
  visit_date date,
  notes text,
  photos text[] default '{}'
);

create index idx_venues_wedding on venues(wedding_id);
alter table venues enable row level security;

create policy "Users can manage own venues" on venues
  for all using (
    wedding_id in (select id from weddings where owner_id = auth.uid())
  );

create trigger venues_updated_at before update on venues
  for each row execute function update_updated_at();
