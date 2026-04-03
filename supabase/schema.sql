create table if not exists public.app_state (
  id text primary key,
  payload jsonb not null,
  version integer not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.uploads (
  id text primary key,
  file_name text not null,
  original_name text not null,
  content_type text not null,
  size integer not null,
  base64 text not null,
  created_at timestamptz not null default timezone('utc', now())
);
