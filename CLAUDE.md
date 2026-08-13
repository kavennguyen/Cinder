# Cinder — working notes for Claude sessions

Cinder is an AI visibility / answer-engine-optimization (AEO) platform for Canada.
Two business lines: a self-serve dashboard for agencies, and a done-for-you
managed service for small businesses.

## Repo layout and git

- Working dir: `~/Desktop/cinder/cinder-nextjs`. It is a **git worktree** of
  `~/Desktop/cinder/cinder-source` (an older Vite version of the marketing site,
  now superseded — don't edit it).
- **The worktree runs in detached HEAD.** Push with `git push origin HEAD:main`,
  not `git push`. Commits made here are not on a branch, so don't leave work
  sitting on HEAD — push it or park it on a named branch.
- If git errors with `index.lock: File exists`, check `ps aux | grep git` first.
  If nothing is running it's a stale lock (a reclaimed cloud session left one
  behind) and is safe to delete.

### Two people push to `main` directly

Kaven works on the marketing site; **Vince (GitHub `okayvv`) works on the
dashboard, auth, Supabase, and the AI engine adapters.** Both push to `main`.

- **Always `git fetch origin` and compare against `origin/main` before pushing.**
  If origin has moved, check what the new commits touch, then `git rebase
  origin/main`. Never force-push.
- **Confirm with Kaven before pushing.** Every push to `main` auto-deploys to
  production via Vercel (see `DEPLOY.md`), so a push is a release.
- Stay on your side of the split. Marketing work should not touch
  `app/(app)/dashboard/*`, `app/(auth)/*`, `app/api/*`, `lib/supabase/*`,
  `lib/ai/*`, or `supabase/migrations/*`.

## Conventions

- **Plain Tailwind only. Do not install shadcn/ui.** There is no
  `components.json` and no `cn()` helper; an earlier shadcn install was
  explicitly reverted. When given a shadcn component to integrate, port its
  structure and visuals into plain Tailwind matching the surrounding code.
- **Animation is `motion` (`motion/react`), not GSAP.** Don't add GSAP.
  `AnimatePresence` with `mode="wait"` has hung in this codebase — omit `mode`.
- Shared reveal animation variants live in `lib/motion.ts`.
- Brand icons that lucide-react doesn't export are hand-rolled inline SVGs —
  see `components/AiEngineIcons.tsx` for the pattern. Note **this version of
  lucide-react has no `Linkedin` export**; check exports before importing.

## Design system

- Hot orange `#FF6E00`, hover `#FF8A2E`. Black and white otherwise.
  (An older ember `#8A3220` is fully retired — don't reintroduce it.)
- Font: Palatino Linotype, set in `app/globals.css`.
- Marketing content containers: `max-w-[88rem] mx-auto` with `px-6`.

## Marketing layout quirk — read before touching sizing

`app/(marketing)/layout.tsx` sets two things at runtime in a `useEffect`:

```
document.documentElement.style.fontSize = "18px";  // was 16px default
document.body.style.backgroundColor      = "#000";  // kills white overscroll gap under footer
```

The font-size bump scales every rem-based size at once — text, spacing, and the
`max-w-[88rem]` container width — which is how the site's overall zoom is tuned.
It is done in JS rather than CSS **deliberately**: `globals.css` is imported by
the *root* layout, so a CSS rule would also hit Vince's dashboard and auth pages.
Trade-off: a brief flash at 16px before hydration. If you change site-wide
scale, change it here, not in individual components.

## Verifying work

1. `npm run build` — must pass before any push. Stop the dev server first;
   a running dev server contends over `.next` and can hang the build.
2. Check in the browser. **Prefer asserting on the DOM / `getComputedStyle` over
   screenshots** — the screenshot tool has intermittently returned blank or
   black frames in this environment, while DOM reads have been reliable.
3. Dev server: preview config `cinder-nextjs-dev` on port **5185**.

## Known-unfinished (as of 2026-08-13)

- Footer "Privacy Policy" / "Terms of Service" are `href="#"` — dead links, live.
- Footer newsletter input has no submit handler; it's decorative.
- Stock media is still hotlinked from Pexels — see `STOCK-MEDIA.md`.
- `ROADMAP.md` Phase 0/2 checkboxes are stale; much of that work has shipped.

## Repo is public

`github.com/kavennguyen/Cinder` is public. Don't commit internal docs that spell
out unfixed vulnerabilities or incomplete hardening. Conventions and
architecture (this file) are fine.
