# Cinder — Roadmap v2

*Written 2026-07-29. Supersedes the 2026-07-24 review (preserved in git history at `96a5358`). Basis: full code read at `52d6bdb` + the uncommitted prompt-suggestions feature; production is live on Vercel (Hobby) with OpenAI, Perplexity, and Gemini keys set; migration `0003` applied.*

**The directive this roadmap serves:** build everything and make the UX excellent *before* billing. Stripe, AI Overviews, team invites, and white-label are deliberately parked in the last section.

---

## 1. What the daily cron costs per tracked prompt

Per prompt per day the runner makes **6 API calls**: 3 answer calls (ChatGPT `chat-latest`, Perplexity `sonar`, Gemini `3.5-flash`) + 3 Gemini extraction calls (one per answer). Current list prices (July 2026): Gemini 3.5 Flash **$1.50 in / $9.00 out** per 1M tokens; `chat-latest` (gpt-5.5 non-reasoning) **$5 in / $30 out**; Perplexity sonar **$1 in / $1 out + ~$5 per 1,000 requests**.

| Scenario | $/prompt/day | $/prompt/month | 25-prompt org /mo | 100-prompt org /mo |
|---|---|---|---|---|
| Short answers (~300 tok) | $0.024 | $0.70 | ~$18 | ~$70 |
| **Typical (~600 tok)** | **$0.038** | **$1.13** | **~$28** | **~$113** |
| Verbose (~1,000 tok, extraction near 12k-char cap) | $0.065 | $1.95 | ~$49 | ~$195 |

Where the money goes (typical case): **ChatGPT ≈ 48%** (its $30/1M output tokens dominate), extraction ≈ 23%, Gemini answer ≈ 14%, Perplexity ≈ 14% (mostly its per-request search fee, not tokens).

Rules of thumb:

- **≈ 4¢/prompt/day, ≈ $1.10/prompt/month** ungrounded, all three engines.
- Against current plan pricing, COGS is tiny: Starter ($800/mo, 25 prompts) ≈ $28 API cost ≈ 3.5% of revenue; Pro ($1,500/mo, 100 prompts) ≈ $113 ≈ 7.5%. Cost is not the constraint — *measurement quality* is (see finding A1: grounded answers roughly double this to ~$2.75/prompt/mo, still <10% of plan price).
- Caveats: if the Gemini key is still a **free AI Studio key**, the Gemini lines are $0 today but rate-limited daily — a 25-prompt run makes ~100 Gemini calls (1 answer + 3 extractions per prompt) and can hit free-tier daily caps mid-run; free-tier prompts may also be used by Google for product improvement. A paid key is a Phase A item. Perplexity's fee assumes the default (low) search context; medium is $8/1k.
- The suggestions feature costs ~$0.01 per generation — negligible, but see B3 for the abuse cap.

---

## 2. Where we stand (delta since the last review)

Shipped since `f2ed374`: multi-engine runs (ChatGPT + Perplexity + Gemini behind an adapter registry, parallel per prompt, plan-gated), all Phase 0 security patches (open redirect, DB-level competitor + prompt-reactivation limits, one-org-per-user RPC guard, 10-min run cooldown), password reset, contact cleanup, per-engine dashboard scores. In flight (uncommitted): AI prompt suggestions with SSRF-guarded homepage fetch and category guardrails.

Still schema-only: `sites`, `gsc_metrics`, `serp_rankings`, `baselines`. Still missing: change↔chart overlay, citations analytics, reports/email, tests, error tracking, billing.

---

## 3. Findings — gaps and pitfalls, with solutions (each one challenged)

Format: the problem → the fix → **Reality check**, where I argue against my own fix and state what survives.

### A. Measurement integrity (the product is a number — the number must be defensible)

**A1. API answers are not what real users see.** Real ChatGPT and Gemini ground answers with live web search; our API calls are parametric-only (`chat-latest` with no tools, Gemini without grounding). For exactly the queries Cinder targets — "best X in Toronto" — a real assistant searches the web, and which brands appear depends heavily on retrieved pages, not just training data. Today's score can be systematically wrong in either direction, and a client comparing the dashboard against their own phone will catch it.
*Fix:* turn on grounding. Gemini: add the `google_search` tool to `generateContent` — one-line change, **5,000 grounded prompts/month free**, then $14/1k. OpenAI: `web_search` isn't supported on `chat-latest`; use `gpt-5-search-api` on Chat Completions (drop-in model swap in `openai.ts`, built to replicate ChatGPT-with-search) or the Responses API with gpt-5.5. Both return **URL citations** — which feeds finding C2 for free. Perplexity is already grounded natively.
*Reality check:* grounded ChatGPT adds ~$0.01/call + retrieved content billed as input tokens (~+$0.04/prompt/day; community reports billing surprises here — measure on day one). Grounded answers also vary by locale and session, so we still can't claim to replicate any individual user — the honest posture is "measured daily from a clean, consistent context," documented in the UI. And parametric-only answers do have signal (they show what the model *believes*). Verdict: grounding survives as the **default**, because the pitch is AEO and answer engines search; keep the ungrounded mode as a config flag, not a product promise. Roll out behind `GROUNDED=true` env first, compare a week of both on our own org, then flip.

**A2. One sample per (prompt × engine) per day = noise sold as signal.** LLM answers are non-deterministic; a 25-prompt org's daily score moving 52% → 44% → 56% is mostly sampling variance, but the chart presents it as trend. First skeptical agency client will ask why the score "dropped" on a day nothing changed.
*Fix:* present a **7-day rolling average** as the headline trend with faint daily dots behind it; show run counts; add a one-line "how this is measured" tooltip on every metric.
*Reality check:* the *statistical* fix is n=3 samples/day (what Evertune sells: "1M+ prompts/brand/month, statistical rigor") — but that triples cost and, at our scale, smoothing over time achieves most of the stability for $0. Verdict: rolling average now; per-day multi-sampling later as a paid-tier differentiator once someone pays. This is a display-layer change — cheap, high trust.

**A3. The trend query breaks at exactly the scale we're selling.** `getVisibilityHistory` fetches runs `ascending` with `limit(2000)` and aggregates in TypeScript. A 100-prompt org generates 300 ok-runs/day → 2,000 rows ≈ the **first ~7 days of the 30-day window**, so the chart silently freezes in the past as data grows. Snapshot's `limit(600)` has cousin issues, and both fire dozens of chunked `.in()` queries per page load.
*Fix:* move aggregation into Postgres — one RPC (or view) returning per-day totals/mentions, one returning latest-run-per-(prompt×platform). Kills the truncation bug and most of the dashboard's query fan-out at once.
*Reality check:* none needed — this is a straight bug at target scale. Only caution: keep the raw-rows path for the per-prompt detail page, where reading actual answers is the feature.

**A4. We only see brands we were told about.** Extraction checks the org's listed brands; if AI answers consistently recommend a competitor the client didn't list, Cinder is blind to the most important fact in the account.
*Fix:* extraction already reads the full answer — add an `other_brands` array to the extraction prompt's output, store name+count, and surface "Also appearing in your answers" with a one-click "track as competitor" (which respects the plan limit trigger).
*Reality check:* free-text brand names are messy ("McDonald's" / "McDonalds" / "McD's") — don't auto-create brands; keep it a suggestion list with counts and let a human confirm. Slightly larger extraction outputs (~+$0.001/prompt/day). Survives easily: this is the cheapest genuinely differentiating feature on this list for the SMB audience, who often *don't know* their AI-era competitors.

**A5. Local-intent queries have no location.** API calls run from US datacenters with no user location; "best dentist near me" can't be replicated. Partially inherent to the category.
*Fix now:* keep city names inside prompt text (the suggestions feature already enforces this) and say so in the methodology tooltip. *Later:* locale parameters where engines support them. No build item beyond honesty — trying to fake geo replication would be claiming precision we can't deliver.

### B. Cost, abuse, and the bleed

**B1. Trials never end and now burn real money.** `status='trialing'` forever + cron runs every trialing org + three paid API keys = every signup costs ~$28–113/month, indefinitely, unattended. Before real keys this was theoretical; as of this week it's a standing cost leak — and it compounds with every curious signup.
*Fix:* `trial_ends_at` (14 days) on subscriptions; cron excludes expired trials; dashboard banner "Trial ended — book a call" (mailto/Calendly, **no Stripe needed**); admins flip design partners to `active` via SQL.
*Reality check:* "isn't this billing work we said we'd defer?" No — it's cost control that happens to live on the same table. The deferred thing is *collecting money*; turning off free compute for strangers is just not paying for strangers. Survives, Phase A, first item.

**B2. The cron will time out — with even one real org.** Runner wall-time per prompt ≈ slowest engine + extraction + 1.2s sleep ≈ 10–25s; 25 prompts ≈ **4–8 minutes**; the cron loops **all orgs sequentially in one invocation** capped at 300s on Hobby (Fluid). Two active orgs guarantee partial runs that die silently mid-loop — later orgs never run, no error surfaces anywhere, and the dashboard just quietly shows stale data. Also: `MAX_PROMPTS_PER_RUN = 25` silently truncates Pro's promised 100 prompts.
*Fix:* fan out — cron becomes an enqueuer (one message per org, chunks of ~10 prompts) via **Upstash QStash** (free tier 500 msgs/day covers dozens of orgs) hitting a worker route; workers are idempotent per (prompt, platform, day). Manual "Run now" enqueues the same way. Remove the 25-prompt truncation once chunked.
*Reality check:* alternatives — Inngest (nicer DX, another vendor+SDK), Supabase pg_cron→Edge Functions (no new vendor, but a second runtime for the same code), Vercel Pro's 800s (delays the cliff, doesn't remove it; still one lost org run per crash). QStash is one HTTP call and one env var, and Vercel Pro is coming anyway for commercial fair-use compliance. Survives: QStash + chunked workers, with Vercel Pro as the companion line item.

**B3. `POST /api/suggest-prompts` is unmetered.** Every "Regenerate" click = homepage fetch + Gemini call; nothing stops 500 clicks. Cheap per click, but it's an authenticated cost faucet with no valve.
*Fix:* per-org daily cap (e.g. 20) + 30s cooldown; log generations to a tiny table (also gives us data on which suggestions get accepted — useful for D2).
*Reality check:* low-severity today (auth required, ~1¢/click); it's two hours of insurance and the acceptance-rate telemetry alone justifies the table. Survives as a small Phase A item.

**B4. SSRF guard is hostname-only.** `fetchSiteContext` blocks IP literals and internal-looking suffixes but doesn't resolve DNS — a domain A-recorded to a private IP passes, and `redirect: "follow"` follows wherever. On Vercel's isolated runtime the blast radius is small, but it's cheap to tighten.
*Fix:* resolve the hostname and reject private/reserved ranges before fetching; cap redirects.
*Reality check:* genuinely low risk in this runtime; do it when touching the file anyway, don't schedule it as its own work.

### C. The product story (what justifies premium pricing)

**C1. The moat is still unbuilt: changes ↔ results.** ChangesManager's own empty-state promises changes appear "on your visibility timeline" — they don't. Competitors track visibility; nobody in the SMB bracket ties "here's what we changed" to "here's what moved." This was the strategic read last review and it's still true — everything in section D makes the dashboard *pleasant*; this is what makes it *worth $2k/month managed*.
*Fix:* (1) overlay change markers on VisibilityChart (data's all there; the chart is hand-rolled SVG we control); (2) compute per-change before/after deltas into the `baselines` table (7-day pre vs post visibility, per platform) and show "what moved after we did X" on each change entry.
*Reality check:* correlation ≠ causation, and with A2's noise a naive "+9% after this change" will sometimes be sampling luck — show deltas with run counts and a "based on N runs" qualifier, and never auto-claim causation in copy ("visibility moved from 44% → 53% in the week after" — descriptive, defensible). Survives as the flagship build of this roadmap.

**C2. We collect citations and show them nowhere.** Perplexity returns its sources every run (and grounded ChatGPT/Gemini will too, per A1); they're stored inside `raw_response` and `mentions.cited_urls`, unaggregated. "Which sites do AI engines trust in your category" is *the* actionable output for a managed service — it's literally the work queue: get the client mentioned on those domains.
*Fix:* a Sources page — top cited domains across the org's runs (last 30d), split by engine, flagged: cites you / cites competitors / cites neither. Store citations in a proper `citations` table at ingest (stop parsing them back out of raw text).
*Reality check:* with only Perplexity grounded today the page would be one-engine-deep — which is why A1 ships first. Depends-on ordering, not a flaw. Survives, sequenced after A1.

**C3. The dashboard reports; it doesn't recommend.** Peec ships inline "action recommendations"; Otterly ships alerts. Cinder shows numbers and leaves "so what?" to the client — but our clients are non-technical; the managed tier's humans close that gap, the self-serve tiers have nothing.
*Fix (scoped deliberately small):* a weekly digest email (see D5) with 2–3 rule-based callouts — "You lost the #1 spot on ChatGPT for prompt X," "competitor Y appeared in 4 new answers this week," "3 prompts have never mentioned you — here's the cited-sources list for them." Rule-based, from data we already have; no LLM-generated advice engine.
*Reality check:* full recommendations are a product in themselves and LLM-generated advice risks generic slop that erodes trust. Rules on real deltas are honest and cheap. Survives in digest form only — resist building an "insights engine" pre-revenue.

### D. First-touch UX (the audience is a non-technical owner or a small agency)

**D1. The dashboard is desktop-only.** The sidebar is a fixed 240px `<aside>` with no responsive handling — on a phone the app is broken, and this audience lives on phones. The marketing site already got the mobile treatment; the app didn't.
*Fix:* collapse to a top bar + slide-over (reuse the marketing Navbar's mobile pattern) — one layout file, one afternoon.
*Reality check:* none. This is table stakes; nothing to challenge.

**D2. The suggestions feature (your open question — how to shape it for the audience).** It's functionally solid; the gaps are input quality and moment-of-delivery:
- *Input:* it infers what the business does from a homepage scrape that quietly returns thin text on JS-heavy sites (Squarespace/Wix — i.e., our exact audience), degrading suggestions with no signal to the user. **Add two optional onboarding fields — "what do you sell" + "city/region"** — and feed them into the generation prompt; scrape stays as enrichment, not foundation.
- *Presentation:* group chips under plain-English headers ("When people ask for the best…", "When people ask for alternatives to a competitor…") instead of jargon tags; **pre-select the best ~5**; allow inline editing of a suggestion before adding; keep selections when regenerating (currently wiped); one-line explainer of why these prompts ("these are questions where an AI answer could send you a customer").
- *The dead end after:* adding prompts lands the user on… a button they must click, then a blank wait. See D3/D4.
*Reality check:* every onboarding field costs completion — but these two are questions any owner answers instantly, they're optional, and they fix the single biggest quality lever (garbage context → garbage suggestions). The chip-picker itself is already the right pattern; don't redesign it, refine it. Survives.

**D3. "Run prompts now" is a synchronous prayer.** The button holds an open fetch for what is now 4–8 minutes at 25×3; the copy says "can take a minute"; browser/proxy timeouts or a closed laptop kill it silently mid-run. Users will conclude it's broken.
*Fix:* runs go through the B2 queue; the button becomes "Start a run" → instant "Running in the background" state; results stream in as rows land (badges already render per-engine as data appears — a light poll/refresh every ~20s while a run is active finishes the illusion). 
*Reality check:* a full job-status system (progress bars, per-engine states) is more than we need pre-revenue; enqueue + optimistic banner + poll is 90% of the felt quality at 20% of the build. Survives in the light form.

**D4. Nothing runs automatically at the moment of highest intent.** After onboarding + adding suggested prompts, the new org sees dashes everywhere until someone manually runs. That first session is the one chance to show the product working.
*Fix:* auto-enqueue the org's first run when its first prompts are added; banner "Your first visibility check is running — results in a few minutes."
*Reality check:* costs ~$1 per signup at 25 prompts, only fires once per org, bounded by trial gating (B1). Unambiguously survives — this is the single best conversion lever on the list.

**D5. Results arrive when nobody's looking.** The cron runs at ~4–6 a.m. Toronto; nothing tells anyone anything, ever. For a daily-data product, email is the retention surface, and it's also the "monthly visibility reports" the pricing page already promises.
*Fix:* Resend (free tier 3k emails/mo) + two emails: "first results are ready" (post-D4) and a weekly digest (score trend, share-of-voice moves, C3's rule-based callouts, changes logged that week). Per-org toggle.
*Reality check:* email infra is new scope, but it's one vendor, one template file, and it double-serves C3 and the roadmap's old "reports" promise. Monthly white-label PDF stays deferred with the agency features. Survives.

**D6. Delete is destruction.** Deleting a prompt cascades away its entire run/mention history; `is_active` exists in the schema with no UI. Clients will delete a stale prompt and lose the history that proved the service worked.
*Fix:* Pause/resume toggle as the primary action (limit triggers already handle reactivation correctly — that loophole was closed in `0003`); delete demoted behind a confirm that says history will be lost.
*Reality check:* trivial; the DB was already built for this. Survives.

**D7. Static copy that ignores state.** The overview's "Next up: run your prompts" card and "Add the prompts your customers ask AI" intro render identically for a fresh org and one with 60 days of data. Small, but it reads as template, not product.
*Fix:* a 4-step checklist card (add brand ✓ → add prompts → first run → invite us to log changes) that completes itself and then becomes the C3-style "this week" summary.
*Reality check:* pure polish — do it inside other Phase D work, don't schedule it standalone.

### E. Positioning & trust (before any demo, not before any code)

**E1. The pricing page is 7–10× the self-serve market with fewer features.** Reality outside: Peec **€75/mo for 25 prompts / €169 for 100**; Otterly from **$29**; Rankscale €20; Scrunch $299; AthenaHQ $295; Profound starts ~$499 and sells to Fortune 500; Evertune $3k sells statistical depth. Cinder's *Dashboard* Starter is **$800 for 25 prompts** — a price the dashboard alone cannot defend against Peec, and prospects will check.
*Fix (not Stripe — copy and seed data):* reposition the public page around the **managed service** ($2k, humans make the changes, the C1 change-log accountability is the proof mechanism) with the dashboard as the included instrument; either reprice self-serve tiers into market range (~$99–$249) or remove them from the public page until after billing exists. Align every feature bullet with what's live (drop "AI Overviews", "white label", yearly toggle until real).
*Reality check:* counter-argument — "premium pricing signals premium service; Peec doesn't make changes for you." True, and that's exactly why the *managed* tier is the page's hero and can hold $2k; but a self-serve dashboard tier at $800 with no human labor attached is the one line item a comparison shopper falsifies in five minutes. Final pricing is a founder decision (flagged as an open question) — but "don't advertise the indefensible tier" survives regardless.

**E2. Trust surface gaps for a premium pitch:** case-studies page is fiction until marked illustrative or removed; hero media is hotlinked from Pexels (a takedown or URL change breaks the homepage silently); leads form has no honeypot (roadmap-known). All small; all the kind of thing a $2k/mo prospect's marketer notices.

**E3. Flying blind in prod:** no Sentry, no cron outcome notification. With B2's queue, add a per-run summary ping (email or Slack webhook: "orgs: 3, runs: 210, errors: 4") and Sentry's free tier on both the app and workers. First paying client and silent 3-day data gap must never coexist.

---

## 4. The build order

Phases are dependency-ordered. Effort: S = hours, M = a day or two, L = a week+.

### Phase A — Stop the bleed, unbreak scale *(the platform others build on)*
- [ ] `trial_ends_at` + cron exclusion + trial banner with book-a-call CTA (B1) — S
- [ ] QStash fan-out: cron→enqueuer, per-org chunked workers, idempotency; remove 25-prompt truncation; manual runs enqueue too (B2, D3 backend) — M
- [ ] Vercel Pro + paid Gemini key (B2, §1 caveat, commercial fair-use) — S
- [ ] Rate-cap + log suggest-prompts (B3) — S
- [ ] Sentry + cron summary notification (E3) — S
- **Exit: 5 orgs × 100 prompts complete daily without timeouts; a stranger's signup stops costing money after day 14; you hear about failures before clients do.**

### Phase B — Make the number defensible *(measurement layer)*
- [ ] Gemini grounding on (free ≤5k/mo); ChatGPT → `gpt-5-search-api` (or Responses API) behind a `GROUNDED` flag; A/B a week on our own org, then default on (A1) — M
- [ ] Persist citations to a `citations` table at ingest, all engines (feeds C2) (A1/C2) — S
- [ ] SQL aggregation RPCs for history + snapshot; fix the 2,000-row truncation (A3) — M
- [ ] 7-day rolling average as headline trend + daily dots + methodology tooltips on every metric (A2, A5) — S–M
- **Exit: a skeptical agency can read the tooltip, check a raw answer, and not catch us overclaiming.**

### Phase C — The story that sells the managed tier
- [ ] Change markers overlaid on VisibilityChart (C1) — M
- [ ] Per-change before/after deltas into `baselines` + "what moved" on each change entry, with run-count qualifiers (C1) — M
- [ ] Sources page: top cited domains, by engine, cites-you vs cites-competitors (C2) — M
- [ ] `other_brands` extraction + "Also appearing in your answers" with confirm-to-track (A4) — S–M
- **Exit: the demo is "we changed X on the 12th — watch the line" and "here's the exact list of sites to get you cited on."**

### Phase D — First-touch and daily-touch UX
- [ ] Responsive dashboard nav (D1) — S–M
- [ ] Onboarding: optional "what you sell" + "city" fields feeding suggestions (D2) — S
- [ ] Suggestion picker polish: plain-English groups, pre-select 5, inline edit, sticky selections on regenerate (D2) — S–M
- [ ] Auto first run on first prompts + "results in a few minutes" banner (D4) — S
- [ ] Async run UX: start-run button, background state, light poll while active (D3) — S–M
- [ ] Pause/resume prompts; delete demoted + confirm (D6) — S
- [ ] Resend: first-results email + weekly digest with 2–3 rule-based callouts (D5, C3) — M
- [ ] Stateful overview checklist → weekly summary card (D7, inside other D work) — S
- **Exit: a non-technical owner goes signup → suggested prompts → first real scores with zero instructions, on a phone, and gets an email that brings them back next week.**

### Phase E — Trust surface (before any demo you care about)
- [ ] Pricing page repositioned around managed service; self-serve either repriced or unlisted; every bullet true (E1) — S (copy) after the pricing decision
- [ ] Case studies marked illustrative or removed; media self-hosted; leads honeypot (E2) — S–M
- [ ] Tests where lying hurts most: visibility math on fixtures, RLS probes (A cannot read B), limit triggers; GitHub Actions lint+type+test (E3-adjacent) — M
- **Exit: nothing a prospect can falsify in five minutes.**

### Phase F — Deliberately after all of the above
Stripe checkout + webhooks + portal · AI Overviews engine (SERP API, real per-query costs) · per-day multi-sampling (n=3) as a paid differentiator · team invites & multi-org owners · white-label PDF reports · GSC OAuth → the SEO panel (`sites`/`gsc_metrics`/`serp_rankings` finally earn their keep) · locale-targeted runs.

---

## 5. Open decisions (need a founder call, not code)

1. **Pricing posture** (E1): managed-service-hero with self-serve unlisted, or reprice self-serve into the $99–$249 band? Affects only copy/seed data now, but shapes every demo.
2. **Grounded-by-default** (A1): recommended yes after the A/B week — accept ~2× API cost (~$2.75/prompt/mo, still <10% of plan price) for a defensible number?
3. **Trial length** (B1): 14 days suggested; managed-service prospects may deserve a manual "extended pilot" flag instead.
4. **Suggestions telemetry** (B3/D2): log accepted vs rejected suggestions to tune the prompt over time — fine with that data being kept?

---

*Sources for §1 pricing and limits: Google Gemini API pricing docs; OpenAI pricing (gpt-5.5 / chat-latest $5/$30, web-search tool $10/1k + content tokens); Perplexity sonar pricing ($1/$1 + $5–12/1k by context size); Vercel docs (Fluid 300s Hobby / 800s Pro; Hobby crons daily-only, ±59 min). Competitor pricing: Surmado "Best AI Visibility Tools 2026" roundup (Profound, Peec, Otterly, Scrunch, Evertune, AthenaHQ, Rankscale). All checked 2026-07-29 — API prices move; re-verify before committing to unit economics in sales copy.*
