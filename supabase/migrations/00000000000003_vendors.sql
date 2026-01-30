create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  category text not null,
  status text not null default 'contact',
  price numeric(12,2) default 0,
  email text,
  phone text,
  website text,
  address text,
  notes text,
  rating integer
);

create index idx_vendors_wedding on vendors(wedding_id);
alter table vendors enable row level security;

create policy "Users can manage own vendors" on vendors
  for all using (
    wedding_id in (select id from weddings where owner_id = auth.uid())
  );

create trigger vendors_updated_at before update on vendors
  for each row execute function update_updated_at();
