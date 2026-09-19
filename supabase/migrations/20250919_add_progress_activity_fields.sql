alter table public.user_progress
  add column if not exists started_at timestamptz,
  add column if not exists last_activity_at timestamptz,
  add column if not exists learning_time_seconds integer not null default 0;

update public.user_progress
set started_at = coalesce(started_at, created_at),
    last_activity_at = coalesce(last_activity_at, updated_at),
    learning_time_seconds = coalesce(learning_time_seconds, 0)
where started_at is null or last_activity_at is null;

create index if not exists idx_user_progress_last_activity
  on public.user_progress(last_activity_at);