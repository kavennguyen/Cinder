# Cinder — Vercel Deploy Guide

One-time setup, ~15 minutes. You (the GitHub repo owner) do steps 1–7;
Vince handles the Supabase step at the end. All secret values come from our
shared password vault — nothing gets typed into chat or committed to git.

## Before you start

- [ ] You can log into GitHub and see the `Cinder` repo
- [ ] Vault access: you'll need 6 values (listed in step 5)
- [ ] `main` is up to date (it should contain `vercel.json` and `app/api/cron/`)

## 1. Create the Vercel account

Go to **vercel.com** → **Sign Up** → **Continue with GitHub** (use the account
that owns the Cinder repo). Choose the **Hobby** (free) plan.

## 2. Import the repo

- Dashboard → **Add New…** → **Project**
- Vercel asks to install its GitHub app: **Install**, and grant it access to
  the **Cinder** repository (you can limit it to just this repo)
- Cinder appears in the list → click **Import**

## 3. Build settings — change nothing

Vercel auto-detects Next.js. Framework preset: Next.js, default build
command, default output. Leave it all as-is.

## 4. STOP before deploying — add environment variables first

On the import screen, expand **Environment Variables**. Add all six below,
for the **Production** environment (adding to Preview too is fine — it's the
same Supabase database either way).

## 5. The six variables (values in the vault)

| Name | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (https://…supabase.co) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (eyJ…) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key (eyJ…) — SECRET |
| `GEMINI_API_KEY` | Google AI Studio key (AIza…) |
| `CRON_SECRET` | Random hex string protecting the daily cron endpoint |
| `NEXT_PUBLIC_SITE_URL` | Set to a placeholder for now: `https://example.com` — fixed in step 7 |

Paste values exactly: no quotes, no trailing spaces or newlines.

## 6. Deploy

Click **Deploy** and wait ~1–2 minutes. You'll get a production URL like
`https://cinder-abc123.vercel.app`. Open it — the landing page should render.

## 7. Fix NEXT_PUBLIC_SITE_URL and redeploy

- Project → **Settings → Environment Variables** → edit
  `NEXT_PUBLIC_SITE_URL` to the real production URL from step 6
  (no trailing slash)
- **Deployments** tab → latest deployment → **⋯ → Redeploy**

## 8. Confirm the cron job exists

Project → **Settings → Cron Jobs** (or the Cron Jobs tab). You should see
`/api/cron/run-prompts` scheduled daily at 11:00 UTC. Click **Run** to fire
it once manually — it should return a JSON response with an `orgs` count
(not an "Unauthorized" error).

## 9. Hand off to Vince

Tell Vince the production URL. He will update Supabase:
**Authentication → URL Configuration** → Site URL = production URL, and add
`https://<production-url>/**` to Redirect URLs. (Without this, signup
confirmation emails link to localhost.)

## 10. Verify together

- [ ] Landing page loads at the production URL
- [ ] Sign in works (existing accounts work — it's the same database)
- [ ] Dashboard shows existing data (prompts, brands, chart)
- [ ] "Run prompts now" works from the live site
- [ ] Contact form submission appears in Supabase → Table Editor → `leads`

## Ongoing

- Every push/merge to `main` auto-deploys to production
- Every PR gets its own preview URL, posted on the PR in GitHub
- Env var changes and deploy/cron logs live in this Vercel account — if
  Vince needs something operational, it goes through you (Hobby plan has no
  team members)

## If something fails

- **Build fails:** open the deployment's build logs, copy the error, send it
  to Vince.
- **Site loads but sign-in fails:** almost always a wrong/missing Supabase
  env var, or step 9 not done yet.
- **Cron returns Unauthorized:** `CRON_SECRET` env var missing or was added
  after the last deploy — redeploy.
