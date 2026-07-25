# Cinder — Codebase Review & Roadmap

*Reviewed 2026-07-24, at commit `f2ed374` (admin org switcher).*

## Where things stand

The foundation is in better shape than most pre-launch SaaS. Working today:

- **Marketing site** — 6 SSR pages (home, services, case studies, pricing, about, contact), AI-crawler-friendly robots/sitemap, JSON-LD, contact form writing to `leads`.
- **Auth & tenancy** — Supabase email+password, session-refresh proxy, multi-tenant schema with RLS on every table, org onboarding RPC (`create_organization`), admin role with cross-org read + org switcher.
- **Core loop (Gemini only)** — tracked prompts CRUD → manual "Run prompts now" + daily Vercel cron → Gemini answer + second-pass mention extraction → visibility score, 30-day trend chart, share of voice, per-prompt run history with raw answers.
- **Plans** — three tiers seeded in DB with prompt/competitor limits; prompt limit enforced by DB trigger; change log gated to admin role.
- **Deploy** — Vercel + cron documented in DEPLOY.md.

The rest of this doc is what stands between this and a product you can charge for.

---

## Review findings

### A. Security & correctness (fix before real clients)

1. **Open redirect after login** — `AuthForm.tsx` does `router.push(searchParams.get("next") ?? "/dashboard")`. A crafted link `/login?next=https://evil.com` sends a user to an attacker's site after a successful sign-in. Fix: only follow `next` when it starts with `/`.
2. **Competitor limit is client-side only** — `BrandsManager` checks `atLimit` in React, but there's no DB trigger on `brands`. Anyone can bypass the plan limit with a direct Supabase call. Mirror the `enforce_prompt_limit` trigger for brands.
3. **Prompt limit trigger has an UPDATE loophole** — `enforce_prompt_limit` fires only on INSERT and counts `is_active` rows. Insert 25, deactivate them, insert 25 more, reactivate → 50 active. Add the trigger on UPDATE of `is_active` too.
4. **`create_organization` RPC is unthrottled** — any authenticated user can call it repeatedly, creating unlimited orgs each with a perpetual trialing subscription that the daily cron then runs (Gemini quota burn). Guard it: refuse if the caller already has a membership (matches current one-org UX), and validate `org_name` is non-empty.
5. **`/api/run-prompts` has no rate limit** — any member can hammer the button; each click is up to 25 prompts × 2 Gemini calls. Add a simple cooldown (e.g., refuse if a run for the org happened in the last N minutes — query `prompt_runs` for a recent `ran_at`).
6. **Trials never end** — `subscriptions.status` starts at `'trialing'` and nothing ever transitions it; there's no `trial_ends_at` column. Combined with (4), the cron works for free forever. Add `trial_ends_at`, exclude expired trials in the cron query, and surface trial state in the dashboard.
7. **Leads form is spammable** — `leads_insert` policy is `with check (true)` with no captcha/rate limit. Acceptable for now; add Turnstile or a honeypot before driving traffic.
8. **`getUserOrg` picks `myMemberships[0]` without ordering** — arbitrary "home org" if a user ever has two memberships. Add `.order("created_at")` or an explicit default-org concept.

### B. Product gaps vs. what the site promises

The pricing page currently sells things the product doesn't do. Either build these or soften the copy before taking money:

| Promise (pricing page) | Reality |
|---|---|
| "Coverage across major AI engines" | Only Gemini runs. ChatGPT/Perplexity/AI Overviews are selectable in the UI but never executed (`runner.ts` filters `.contains platforms ['gemini']`); a prompt with only ChatGPT selected silently never runs |
| "Monthly visibility reports" | No reporting/email of any kind |
| Pro: "Unlimited clients and workspaces" | One org per user; no way to create a second org after onboarding, no team invites (no `memberships` insert policy or UI) |
| Pro: "White label reporting" | Doesn't exist |
| Yearly billing toggle with prices | No yearly plans in DB, no billing at all |
| Starter cadence `3x_week` (DB) | Cron runs everyone daily — plan `run_cadence` is ignored (you're over-delivering at your own cost) |

Also: schema tables `sites`, `gsc_metrics`, `serp_rankings`, `baselines` exist but no code reads or writes them — the SEO half of the product is schema-only. And `ChangesManager`'s empty-state copy promises changes appear "on your visibility timeline," but `VisibilityChart` doesn't overlay them.

### C. Payments (the biggest missing piece)

There is no Stripe integration: no dependency, no checkout, no webhooks. `subscriptions` has the right columns (`stripe_customer_id`, `stripe_subscription_id`, `current_period_end`) — they're just never populated. Nothing on the pricing page leads to payment.

### D. Scaling & ops

1. **Cron won't scale past a few orgs** — `api/cron/run-prompts` loops every live org sequentially in one invocation. Each prompt is ~2 Gemini calls + 1.5s sleep; 3 orgs × 25 prompts already risks the function timeout (your own comment notes >60s needs Vercel Pro). Plan: fan out (one invocation per org via a queue — Inngest, QStash, or Supabase cron hitting per-org URLs) before client #3.
2. **Vercel Hobby is non-commercial** — per Vercel's fair-use policy, charging clients requires Pro. Budget for it; it also raises the function-duration ceiling the runner needs.
3. **Gemini free tier won't survive clients** — free-tier daily caps will be hit quickly at 2 calls/prompt/day/org. Move to a paid key and track per-org token spend.
4. **No observability** — no Sentry, no alert when the nightly cron fails; you'd find out from a client. Add error tracking + a simple "cron ran, N orgs, M errors" notification (email/Slack) to yourself.
5. **No tests, no CI** — nothing protects the visibility math or RLS policies. Highest-value tests: `getVisibilitySnapshot`/`getShareOfVoice` math on fixture data, and RLS probes (member A cannot read org B).

### E. Launch hygiene (small but user-visible)

- Contact page ships literal placeholder text: "Placeholder contact details. Replace with real information." — and `hello@cinder.ca` needs to be real.
- Stock media is hotlinked from Pexels/Unsplash (see STOCK-MEDIA.md) — replace with owned assets.
- Case-studies page is placeholder content — remove or mark as illustrative until real ones exist.
- Prompt delete is a hard delete cascading runs/mentions — history vanishes. Prefer deactivate (the `is_active` column exists but has no UI toggle).
- No password reset flow (no "Forgot password" link, no reset route) — first locked-out client is a support email.
- Add `.claude/` to `.gitignore` (currently untracked).
- Accent colors diverge: marketing uses `#FF6E00`, dashboard `#8A3220` — unify if unintentional.

---

## Roadmap

Phases ordered so each unlocks the next. Effort: S = hours, M = ~a day or two, L = a week+.

### Phase 0 — Hygiene & security patch (S–M total)

- [ ] Fix open redirect in `AuthForm` (S)
- [ ] Brands limit trigger + prompt-limit trigger on UPDATE (S)
- [ ] Guard `create_organization` against repeat calls (S)
- [ ] Cooldown on `/api/run-prompts` (S)
- [ ] Password reset flow (Supabase `resetPasswordForEmail` + `/reset` page) (M)
- [ ] Real contact details; remove placeholder text; `.claude/` in gitignore (S)
- [ ] Replace hotlinked stock media with owned/licensed assets (M)

### Phase 1 — Chargeable: billing + honest packaging (L)

- [ ] Stripe Checkout for the two self-serve tiers + customer portal (M–L)
- [ ] Webhooks → `subscriptions` (status, `current_period_end`, ids) (M)
- [ ] `trial_ends_at` + enforcement in cron and dashboard banner (S)
- [ ] Pricing page: wire CTAs to checkout; align feature bullets with what exists today (S)
- [ ] Vercel Pro + paid Gemini key (S)
- [ ] Decide Starter cadence: honor `run_cadence` in cron or change the plan copy (S)

**Exit criteria: a stranger can sign up, pay, and get daily Gemini tracking without you touching anything.**

### Phase 2 — Multi-engine coverage (the core promise) (L)

- [ ] Refactor `runner.ts` into per-platform adapters behind one interface (M)
- [ ] ChatGPT adapter (OpenAI API) (M)
- [ ] Perplexity adapter (has a public API; citations come free) (M)
- [ ] AI Overviews adapter via a SERP API (SerpApi / DataForSEO); gate to Pro+ — per-query costs are real (L)
- [ ] Fan out the cron: one job per org (Inngest / QStash / per-org invocations) (M)
- [ ] Per-platform breakdown in UI: score by platform, platform badge already exists on runs (M)
- [ ] Only run prompts on platforms the org's plan includes (S)

### Phase 3 — The differentiator: changes ↔ results (M–L)

- [ ] Overlay change-log markers on `VisibilityChart` (the pitch your own empty-state copy makes) (M)
- [ ] Compute `baselines` (pre/post visibility around each change) and show "what moved after we did X" (M)
- [ ] Weekly/monthly email report per org (visibility delta, share of voice, changes made) — this is the "monthly visibility reports" bullet (L)
- [ ] Google Search Console OAuth → populate `gsc_metrics` → SEO panel alongside AEO (L)

### Phase 4 — Agency features (only when a real agency asks) (L)

- [ ] Multiple orgs per owner + org creation from the dashboard (reuse the admin org-switcher pattern for owners) (M)
- [ ] Team invites: memberships management UI + invite RPC (L)
- [ ] Exportable / white-label PDF reports (L)

### Phase 5 — Quality & ops backbone (M, ongoing)

- [ ] Sentry + cron failure alerting (S)
- [ ] Tests: visibility math on fixtures; RLS probes (member A ✗ org B); limit triggers (M)
- [ ] GitHub Actions: lint + typecheck + tests on PR (S)
- [ ] Seed script for local dev / staging Supabase project (M)

---

## Suggested immediate sequence (next ~2 weeks)

1. Phase 0 in one sitting — it's mostly small patches.
2. Stripe (Phase 1) — nothing else matters commercially until someone can pay.
3. ChatGPT + Perplexity adapters (start of Phase 2) — closes the biggest promise/reality gap; AI Overviews can wait a cycle.
4. Sentry + cron alert (from Phase 5) the same day you onboard your first paying client.

The strategic read: your moat is the change log ↔ visibility correlation (Phase 3) — competitors like Profound/Peec track visibility, but tying it to "here's what we changed and here's what moved" is the managed-service story. Get billing and multi-engine done fast, then invest there.
