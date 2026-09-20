create table public.support_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('question', 'contact')),
  category text,
  subject text not null check (char_length(trim(subject)) > 0),
  message text not null check (char_length(trim(message)) > 0),
  requester_email text,
  requester_name text,
  course_id uuid references public.courses(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index idx_support_requests_user_id on public.support_requests(user_id);
create index idx_support_requests_status on public.support_requests(status);

alter table public.support_requests enable row level security;

create policy "Users can create their own support requests"
on public.support_requests
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can view their own support requests"
on public.support_requests
for select
to authenticated
using (auth.uid() = user_id);

create trigger set_support_requests_updated_at
before update on public.support_requests
for each row execute function public.handle_updated_at();