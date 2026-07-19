-- Run this once in the Supabase SQL Editor for this project.

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  currency text not null,
  total_income numeric not null,
  total_spend numeric not null,
  net numeric not null,
  savings_rate numeric not null,
  month_labels text[] not null,
  report_data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "select own reports" on public.reports
  for select using (auth.uid() = user_id);

create policy "insert own reports" on public.reports
  for insert with check (auth.uid() = user_id);

create policy "delete own reports" on public.reports
  for delete using (auth.uid() = user_id);

create index reports_user_id_created_at_idx
  on public.reports (user_id, created_at desc);
