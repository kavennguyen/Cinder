# Cinder

AI visibility (AEO/SEO) platform for Canadian brands and agencies: marketing site + client dashboard in one Next.js app.

Ported from the original Vite landing page so every page is **server-rendered** — AI crawlers (GPTBot, PerplexityBot, ClaudeBot) don't execute JavaScript, so SSR is what makes the site readable by the engines Cinder optimizes for.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS 4
- Supabase (auth + Postgres) via `@supabase/ssr`
- motion (animations), lucide-react (icons)

## Structure

```
app/
  (marketing)/   Landing pages: /, /services, /case-studies, /pricing, /about, /contact
  (auth)/        /login, /signup (Supabase email+password)
  (app)/         /dashboard — auth-protected (proxy.ts)
  robots.ts      AI-crawler-friendly robots.txt
  sitemap.ts     Sitemap
components/      Shared UI (Navbar, sections, page content)
lib/supabase/    Browser + server Supabase clients
proxy.ts    Session refresh + /dashboard protection
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

The marketing site works with no configuration. To enable auth + dashboard:

1. Create a free project at supabase.com
2. `cp .env.example .env.local` and fill in the URL + anon key from Project Settings → API
3. Restart `npm run dev`, then sign up at /signup

## Production build

```bash
npm run build && npm run start
```

## Notes

- Stock media is hotlinked from Pexels/Unsplash (see STOCK-MEDIA.md) — replace with owned assets before launch.
- The contact form is a placeholder (no backend yet); wiring it to a Supabase `leads` table is a TODO in `components/pages/ContactContent.tsx`.
