-- Lounge 8 — service menu
--
-- Run once in the Supabase dashboard: SQL Editor → New query → paste → Run.
--
-- The website reads this table through its own /api/services route and writes
-- to it through /api/admin/services, both of which use the service-role key
-- server-side. Nothing here is reachable from the browser, so row level
-- security stays on with no policies: the service-role key bypasses RLS, and
-- the anon key — which is the only one a browser could ever hold — sees
-- nothing at all.

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  source_id   text unique,                      -- the Salon Central service it
                                                -- was imported from, so a later
                                                -- import knows it is already in
  name        text        not null,
  category    text        not null,
  price       integer     not null default 0,   -- whole rupees
  duration_min integer    not null default 60,
  summary     text,                             -- overrides the category blurb
  from_price  boolean     not null default false, -- shows as "from PKR x"
  is_active   boolean     not null default true,  -- off = hidden from the site
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- the public menu always reads active rows in display order
create index if not exists services_menu_idx
  on public.services (category, sort_order, price desc);

-- already-run this file? add the import column on its own:
--   alter table public.services add column if not exists source_id text unique;

alter table public.services enable row level security;

-- keep updated_at honest without the API having to remember to send it
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists services_touch_updated_at on public.services;
create trigger services_touch_updated_at
  before update on public.services
  for each row execute function public.touch_updated_at();
