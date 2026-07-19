-- Cinder — Phase 1b: org onboarding RPC + plan limit enforcement
-- Run after 0001_init.sql (SQL Editor -> paste -> Run).

-- Creates an organization plus its first membership, brand, competitors,
-- and a trial subscription — atomically, as the signed-in user.
-- security definer so it can insert rows RLS would otherwise block.
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
  new_org uuid;
  comp    text;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into organizations (name) values (org_name) returning id into new_org;

  insert into memberships (org_id, user_id, role)
  values (new_org, auth.uid(), 'owner');

  insert into brands (org_id, name, domains, is_competitor)
  values (new_org, brand_name, coalesce(brand_domains, '{}'), false);

  foreach comp in array coalesce(competitor_names, '{}'::text[]) loop
    if length(trim(comp)) > 0 then
      insert into brands (org_id, name, is_competitor)
      values (new_org, trim(comp), true);
    end if;
  end loop;

  insert into subscriptions (org_id, plan_id, status)
  values (new_org, 'starter', 'trialing');

  return new_org;
end;
$$;

-- Enforce the plan's tracked-prompt limit at the database level, so it can't
-- be bypassed regardless of what the app sends.
create or replace function public.enforce_prompt_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  limit_val integer;
  cnt       integer;
begin
  select p.prompt_limit into limit_val
  from subscriptions s
  join plans p on p.id = s.plan_id
  where s.org_id = new.org_id;

  limit_val := coalesce(limit_val, 25);

  select count(*) into cnt
  from tracked_prompts
  where org_id = new.org_id and is_active;

  if cnt >= limit_val then
    raise exception 'Prompt limit reached for your plan (max %). Upgrade to track more prompts.', limit_val;
  end if;

  return new;
end;
$$;

drop trigger if exists tracked_prompts_limit on public.tracked_prompts;
create trigger tracked_prompts_limit
  before insert on public.tracked_prompts
  for each row execute function public.enforce_prompt_limit();
