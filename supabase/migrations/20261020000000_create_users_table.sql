-- Users table backed by Supabase Auth.
-- public.users is the app-level profile; auth.users owns credentials and sessions.

create type public.user_role as enum ('client', 'developer', 'admin', 'super_admin');

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid not null unique references auth.users (id) on delete cascade,
  email varchar(255) not null unique,
  first_name varchar(100),
  last_name varchar(100),
  avatar_url text,
  role public.user_role not null default 'client',
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Keep updated_at fresh on every write, including writes outside the app
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- Mirror new auth users into public.users (replaces the Clerk user.created webhook)
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  full_name text := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    ''
  );
begin
  insert into public.users (auth_id, email, first_name, last_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'first_name',
      nullif(split_part(full_name, ' ', 1), '')
    ),
    coalesce(
      new.raw_user_meta_data ->> 'last_name',
      nullif(substr(full_name, length(split_part(full_name, ' ', 1)) + 2), '')
    ),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep the email in sync when it changes (replaces the Clerk user.updated webhook).
-- Deletes are handled by the on delete cascade on auth_id.
create function public.handle_auth_user_updated()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.users set email = new.email where auth_id = new.id;
  return new;
end;
$$;

create trigger on_auth_user_updated
  after update of email on auth.users
  for each row
  when (old.email is distinct from new.email)
  execute function public.handle_auth_user_updated();

-- Row level security.
-- The app writes through GraphQL (Drizzle connects as postgres and bypasses RLS).
-- Browser clients and Realtime only ever read their own row; no write policies on purpose,
-- so users cannot change their own role through the Supabase API.
alter table public.users enable row level security;

create policy "Users can read their own row"
  on public.users
  for select
  to authenticated
  using ((select auth.uid()) = auth_id);
