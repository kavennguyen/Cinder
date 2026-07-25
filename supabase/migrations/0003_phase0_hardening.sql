-- Cinder — Phase 0 hardening
-- Run after 0002_onboarding.sql (SQL Editor -> paste -> Run). Safe to re-run.
--
-- 1) Competitor limit enforced in the database (was client-side only)
-- 2) Prompt limit: close the reactivate-via-UPDATE loophole
-- 3) create_organization: one org per user + non-empty name + capped
--    competitor inserts

-- ============================================================
-- 1) Competitor limit (mirrors enforce_prompt_limit from 0002)
-- ============================================================

create or replace function public.enforce_competitor_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  limit_val integer;
  cnt       integer;
begin
  -- Only competitor rows count toward the limit; the org's own brand(s)
  -- always pass.
  if not new.is_competitor then
    return new;
  end if;

  select p.competitor_limit into limit_val
  from subscriptions s
  join plans p on p.id = s.plan_id
  where s.org_id = new.org_id;

  limit_val := coalesce(limit_val, 3);

  select count(*) into cnt
  from brands
  where org_id = new.org_id
    and is_competitor
    and id is distinct from new.id;  -- exclude the row being updated

  if cnt >= limit_val then
    raise exception 'Competitor limit reached for your plan (max %). Upgrade to track more competitors.', limit_val;
  end if;

  return new;
end;
$$;

drop trigger if exists brands_competitor_limit_insert on public.brands;
create trigger brands_competitor_limit_insert
  before insert on public.brands
  for each row execute function public.enforce_competitor_limit();

-- Also fire when an existing brand is flipped into a competitor.
drop trigger if exists brands_competitor_limit_update on public.brands;
create trigger brands_competitor_limit_update
  before update of is_competitor on public.brands
  for each row
  when (new.is_competitor and not old.is_competitor)
  execute function public.enforce_competitor_limit();

-- ============================================================
-- 2) Prompt limit: block reactivation past the limit
-- ============================================================
-- enforce_prompt_limit (0002) counts only active rows, so a row being
-- flipped back to active is correctly blocked when the org is at its limit.

drop trigger if exists tracked_prompts_limit_update on public.tracked_prompts;
create trigger tracked_prompts_limit_update
  before update of is_active on public.tracked_prompts
  for each row
  when (new.is_active and not old.is_active)
  execute function public.enforce_prompt_limit();

-- ============================================================
-- 3) Harden create_organization
-- ============================================================
-- Changes vs 0002:
--   * rejects empty org names
--   * one org per user — a second call raises instead of creating a free
--     duplicate org + trial (Cinder admins create extra orgs via SQL)
--   * subscription is inserted BEFORE brands so the competitor-limit
--     trigger sees the org's real plan
--   * competitor inserts stop at the plan limit (extras are ignored rather
--     than failing the whole onboarding)

create or replace function public.create_organization(
  org_name         text,
  brand_name       text,
  brand_domains    text[] default '{}',
  competitor_names text[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org    uuid;
  comp       text;
  comp_limit integer;
  comp_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if length(trim(coalesce(org_name, ''))) = 0 then
    raise exception 'Organization name is required.';
  end if;

  if exists (select 1 from memberships where user_id = auth.uid()) then
    raise exception 'You already belong to an organization.';
  end if;

  insert into organizations (name) values (trim(org_name)) returning id into new_org;

  insert into memberships (org_id, user_id, role)
  values (new_org, auth.uid(), 'owner');

  insert into subscriptions (org_id, plan_id, status)
  values (new_org, 'starter', 'trialing');

  select p.competitor_limit into comp_limit
  from subscriptions s
  join plans p on p.id = s.plan_id
  where s.org_id = new_org;
  comp_limit := coalesce(comp_limit, 3);

  insert into brands (org_id, name, domains, is_competitor)
  values (
    new_org,
    coalesce(nullif(trim(coalesce(brand_name, '')), ''), trim(org_name)),
    coalesce(brand_domains, '{}'),
    false
  );

  foreach comp in array coalesce(competitor_names, '{}'::text[]) loop
    exit when comp_count >= comp_limit;
    if length(trim(comp)) > 0 then
      insert into brands (org_id, name, is_competitor)
      values (new_org, trim(comp), true);
      comp_count := comp_count + 1;
    end if;
  end loop;

  return new_org;
end;
$$;
