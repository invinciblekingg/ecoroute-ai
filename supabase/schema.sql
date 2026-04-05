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

create table if not exists public.auth_users (
  id text primary key,
  name text not null,
  email text not null unique,
  role text not null default 'operator',
  status text not null default 'active',
  auth_provider text not null default 'local',
  provider_account_id text,
  avatar_url text,
  password_salt text,
  password_hash text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists auth_users_email_idx on public.auth_users (email);
create index if not exists auth_users_provider_idx on public.auth_users (auth_provider, provider_account_id);

create table if not exists public.auth_sessions (
  id text primary key,
  user_id text not null references public.auth_users(id) on delete cascade,
  user_agent text,
  ip_address text,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists auth_sessions_user_id_idx on public.auth_sessions (user_id);
create index if not exists auth_sessions_expires_at_idx on public.auth_sessions (expires_at);
