-- One Stripe subscription per user. Written only by the Stripe webhook (through Drizzle, which
-- connects as postgres and bypasses RLS), never by the browser.

create type public.subscription_status as enum (
  'active',
  'trialing',
  'past_due',
  'canceled',
  'incomplete',
  'incomplete_expired',
  'unpaid',
  'paused'
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  stripe_subscription_id text not null unique,
  status public.subscription_status not null,
  current_period_end timestamp,
  cancel_at_period_end boolean not null default false,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Users can read their own subscription through the Supabase API. No write policies on purpose,
-- so a user cannot grant themselves access.
alter table public.subscriptions enable row level security;

create policy "Users can read their own subscription"
  on public.subscriptions
  for select
  to authenticated
  using (
    user_id in (
      select id from public.users where auth_id = (select auth.uid())
    )
  );
