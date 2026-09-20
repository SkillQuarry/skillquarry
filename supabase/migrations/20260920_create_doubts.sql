create table public.doubts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete set null,
  topic_id uuid references public.topics(id) on delete set null,
  category text not null,
  subject text not null check (char_length(trim(subject)) > 0),
  message text not null check (char_length(trim(message)) > 0),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.doubt_answers (
  id uuid primary key default gen_random_uuid(),
  doubt_id uuid not null references public.doubts(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_name text,
  answer text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.doubt_comments (
  id uuid primary key default gen_random_uuid(),
  doubt_id uuid not null references public.doubts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  comment text not null check (char_length(trim(comment)) > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index idx_doubts_user_id on public.doubts(user_id);
create index idx_doubt_answers_doubt_id on public.doubt_answers(doubt_id);
create index idx_doubt_comments_doubt_id on public.doubt_comments(doubt_id);

alter table public.doubts enable row level security;
alter table public.doubt_answers enable row level security;
alter table public.doubt_comments enable row level security;

create policy "Users can create their own doubts" on public.doubts for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can view their own doubts" on public.doubts for select to authenticated using (auth.uid() = user_id);
create policy "Users can update their own doubts" on public.doubts for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own doubts" on public.doubts for delete to authenticated using (auth.uid() = user_id);
create policy "Users can view answers to their own doubts" on public.doubt_answers for select to authenticated using (exists (select 1 from public.doubts where doubts.id = doubt_answers.doubt_id and doubts.user_id = auth.uid()));
create policy "Users can view comments on their own doubts" on public.doubt_comments for select to authenticated using (exists (select 1 from public.doubts where doubts.id = doubt_comments.doubt_id and doubts.user_id = auth.uid()));

create trigger set_doubts_updated_at before update on public.doubts for each row execute function public.handle_updated_at();
create trigger set_doubt_answers_updated_at before update on public.doubt_answers for each row execute function public.handle_updated_at();
create trigger set_doubt_comments_updated_at before update on public.doubt_comments for each row execute function public.handle_updated_at();