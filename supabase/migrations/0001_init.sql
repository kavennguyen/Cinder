-- Cinder — Phase 1 schema
-- Multi-tenant AEO/SEO platform: orgs → sites/brands → tracked prompts →
-- prompt runs → mentions, plus SEO metrics, the change log, and baselines.
-- Run in the Supabase SQL editor, or via `supabase db push`.

-- ============================================================
-- Tenancy
-- ============================================================

create table public.organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);

-- Which users belong to which org. Roles: 'admin' (Cinder team) can be
-- granted on any org; 'owner'/'member' are the client's own people.
create table public.memberships (
  org_id      uuid not null references public.organizations (id) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  role        text not null default 'member' check (role in ('owner', 'member', 'admin')),
  created_at  timestamptz not null default now(),
  primary key (org_id, user_id)
);

-- Helper: is the current user a member of this org?
-- security definer so RLS policies can call it without recursion.
create or replace function public.is_org_member(org uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.memberships
    where org_id = org and user_id = auth.uid()
  );
$$;

-- Helper: is the current user a Cinder internal admin (any admin role)?
create or replace function public.is_cinder_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.memberships
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- Plans & subscriptions (tiered, volume per tier)
-- ============================================================

create table public.plans (
  id                text primary key,                -- 'starter' | 'pro' | 'managed'
  name              text not null,
  monthly_price_cad integer not null,                -- cents
  prompt_limit      integer not null,                -- tracked prompts per org
  competitor_limit  integer not null,                -- competitor brands per org
  platforms         text[] not null,                 -- e.g. '{chatgpt,perplexity,gemini}'
  run_cadence       text not null default 'daily',   -- 'daily' | '3x_week' | 'weekly'
  created_at        timestamptz not null default now()
);

create table public.subscriptions (
  org_id                 uuid primary key references public.organizations (id) on delete cascade,
  plan_id                text not null references public.plans (id),
  status                 text not null default 'trialing'
                         check (status in ('trialing', 'active', 'past_due', 'canceled')),
  stripe_customer_id     text,
  stripe_subscription_id text,
  current_period_end     timestamptz,
  created_at             timestamptz not null default now()
);

-- Seed the three launch tiers (prices in CAD cents; adjust freely — it's data).
insert into public.plans (id, name, monthly_price_cad, prompt_limit, competitor_limit, platforms, run_cadence) values
  ('starter', 'Dashboard Starter', 80000,  25,  3, '{chatgpt,perplexity,gemini}', '3x_week'),
  ('pro',     'Dashboard Pro',     150000, 100, 10, '{chatgpt,perplexity,gemini,ai_overviews}', 'daily'),
  ('managed', 'Managed Service',   200000, 100, 10, '{chatgpt,perplexity,gemini,ai_overviews}', 'daily');

-- ============================================================
-- Brands & sites
-- ============================================================

-- Client's own brand AND its competitors live here; mentions reference this
-- table so share-of-voice falls out of the same data.
create table public.brands (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid not null references public.organizations (id) on delete cascade,
  name          text not null,
  aliases       text[] not null default '{}',   -- alternate names/products to match
  domains       text[] not null default '{}',   -- for citation matching
  is_competitor boolean not null default false,
  created_at    timestamptz not null default now()
);

create table public.sites (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  brand_id    uuid references public.brands (id) on delete set null,
  url         text not null,
  gsc_connected boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- AEO tracking: prompts → runs → mentions
-- ============================================================

create table public.tracked_prompts (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  text        text not null,
  platforms   text[] not null default '{chatgpt,perplexity,gemini}',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table public.prompt_runs (
  id           uuid primary key default gen_random_uuid(),
  prompt_id    uuid not null references public.tracked_prompts (id) on delete cascade,
  org_id       uuid not null references public.organizations (id) on delete cascade,
  platform     text not null,             -- 'chatgpt' | 'perplexity' | 'gemini' | 'ai_overviews' | ...
  ran_at       timestamptz not null default now(),
  raw_response text,                      -- keep raw text so extraction can be re-run later
  status       text not null default 'ok' check (status in ('ok', 'error')),
  error        text
);

create index prompt_runs_org_time on public.prompt_runs (org_id, ran_at desc);
create index prompt_runs_prompt_time on public.prompt_runs (prompt_id, ran_at desc);

-- One row per brand detected in a run's answer (client brand or competitor).
create table public.mentions (
  id          uuid primary key default gen_random_uuid(),
  run_id      uuid not null references public.prompt_runs (id) on delete cascade,
  org_id      uuid not null references public.organizations (id) on delete cascade,
  brand_id    uuid not null references public.brands (id) on delete cascade,
  mentioned   boolean not null default true,
  position    integer,                    -- rank among brands in the answer, 1 = first
  sentiment   text check (sentiment in ('positive', 'neutral', 'negative')),
  cited_urls  text[] not null default '{}',
  created_at  timestamptz not null default now()
);

create index mentions_org_brand_time on public.mentions (org_id, brand_id, created_at desc);

-- ============================================================
-- SEO data
-- ============================================================

create table public.gsc_metrics (
  site_id     uuid not null references public.sites (id) on delete cascade,
  org_id      uuid not null references public.organizations (id) on delete cascade,
  date        date not null,
  query       text not null,
  page        text not null,
  clicks      integer not null default 0,
  impressions integer not null default 0,
  position    numeric(6,2),
  primary key (site_id, date, query, page)
);

create index gsc_metrics_org_date on public.gsc_metrics (org_id, date desc);

create table public.serp_rankings (
  site_id     uuid not null references public.sites (id) on delete cascade,
  org_id      uuid not null references public.organizations (id) on delete cascade,
  keyword     text not null,
  date        date not null,
  rank        integer,
  primary key (site_id, keyword, date)
);

-- ============================================================
-- The differentiator: changes & baselines
-- ============================================================

create table public.changes (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid not null references public.organizations (id) on delete cascade,
  site_id     uuid references public.sites (id) on delete set null,
  changed_at  timestamptz not null default now(),
  change_type text not null,              -- 'schema_markup' | 'content' | 'metadata' | 'technical' | ...
  title       text not null,
  description text,
  urls        text[] not null default '{}',
  author_id   uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

create index changes_org_time on public.changes (org_id, changed_at desc);

create table public.baselines (
  id           uuid primary key default gen_random_uuid(),
  org_id       uuid not null references public.organizations (id) on delete cascade,
  metric       text not null,             -- 'ai_visibility_score' | 'gsc_clicks' | 'avg_position' | ...
  window_start date not null,
  window_end   date not null,
  value        numeric not null,
  created_at   timestamptz not null default now(),
  unique (org_id, metric, window_start)
);

-- ============================================================
-- Leads from the marketing contact form (written via anon key)
-- ============================================================

create table public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- Row-Level Security
-- ============================================================

alter table public.organizations  enable row level security;
alter table public.memberships    enable row level security;
alter table public.plans          enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.brands         enable row level security;
alter table public.sites          enable row level security;
alter table public.tracked_prompts enable row level security;
alter table public.prompt_runs    enable row level security;
alter table public.mentions       enable row level security;
alter table public.gsc_metrics    enable row level security;
alter table public.serp_rankings  enable row level security;
alter table public.changes        enable row level security;
alter table public.baselines      enable row level security;
alter table public.leads          enable row level security;

-- Members see their own orgs; Cinder admins see all.
create policy org_select on public.organizations for select
  using (public.is_org_member(id) or public.is_cinder_admin());

create policy membership_select on public.memberships for select
  using (user_id = auth.uid() or public.is_cinder_admin());

-- Plans are public catalog data.
create policy plans_select on public.plans for select using (true);

create policy subscription_select on public.subscriptions for select
  using (public.is_org_member(org_id) or public.is_cinder_admin());

-- Generic tenant-read policies. Writes for pipeline tables (prompt_runs,
-- mentions, gsc_metrics, serp_rankings) happen via the service-role key in
-- backend jobs, which bypasses RLS — so no insert policies needed for those.
create policy brands_rw on public.brands for all
  using (public.is_org_member(org_id) or public.is_cinder_admin())
  with check (public.is_org_member(org_id) or public.is_cinder_admin());

create policy sites_rw on public.sites for all
  using (public.is_org_member(org_id) or public.is_cinder_admin())
  with check (public.is_org_member(org_id) or public.is_cinder_admin());

create policy prompts_rw on public.tracked_prompts for all
  using (public.is_org_member(org_id) or public.is_cinder_admin())
  with check (public.is_org_member(org_id) or public.is_cinder_admin());

create policy runs_select on public.prompt_runs for select
  using (public.is_org_member(org_id) or public.is_cinder_admin());

create policy mentions_select on public.mentions for select
  using (public.is_org_member(org_id) or public.is_cinder_admin());

create policy gsc_select on public.gsc_metrics for select
  using (public.is_org_member(org_id) or public.is_cinder_admin());

create policy serp_select on public.serp_rankings for select
  using (public.is_org_member(org_id) or public.is_cinder_admin());

-- Changes: clients read; only Cinder admins write (you make the changes).
create policy changes_select on public.changes for select
  using (public.is_org_member(org_id) or public.is_cinder_admin());
create policy changes_write on public.changes for insert
  with check (public.is_cinder_admin());
create policy changes_update on public.changes for update
  using (public.is_cinder_admin());

create policy baselines_select on public.baselines for select
  using (public.is_org_member(org_id) or public.is_cinder_admin());

-- Leads: anyone (including anonymous visitors) may submit; only admins read.
create policy leads_insert on public.leads for insert
  with check (true);
create policy leads_select on public.leads for select
  using (public.is_cinder_admin());
