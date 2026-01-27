create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid not null references weddings(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  category text not null default 'Général',
  status text not null default 'todo',
  due_date date,
  position integer not null default 0,
  notes text
);

create index idx_tasks_wedding on tasks(wedding_id);
create index idx_tasks_status on tasks(wedding_id, status);
alter table tasks enable row level security;

create policy "Users can manage own tasks" on tasks
  for all using (
    wedding_id in (select id from weddings where owner_id = auth.uid())
  );

create trigger tasks_updated_at before update on tasks
  for each row execute function update_updated_at();
