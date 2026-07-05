# Slice 09 — Polish & Integration

## Contract unlocked
Seamless, consistent motion across every route; accessibility; and a clean
Vercel + Atlas deploy.

## API seam
- **Transitions everywhere:** ensure the motion.dev page transition wraps ALL
  routes uniformly; add React `<ViewTransition>` shared-element morphs where it
  helps (e.g. team card → detail, hero → page). Enable
  `experimental.viewTransition` in `next.config.mjs` if used; read
  `node_modules/next/dist/docs/01-app/02-guides/view-transitions.md`.
- **A11y:** global `prefers-reduced-motion` handling in the SmoothScroll +
  transition providers (one place); focus management on route change; color
  contrast on priority badges.
- **Deploy:** document env vars (`MONGODB_URI`, `ADMIN_PASSWORD`, `SESSION_SECRET`)
  in README; set them in Vercel; confirm Atlas network access allows Vercel;
  `npm run build` clean; verify no filesystem writes anywhere.

## Human can run/see
Whole-site walkthrough: every navigation animates seamlessly, no white flashes,
Lenis smooth throughout, tracker/admin live against Atlas on a Vercel preview.

## Verify
- Full click-through of all routes: transitions consistent, single Lenis, no
  hydration warnings.
- Reduced-motion path fully static.
- **Screenshot-critique** the full-site transition sequence (a few key frames).
- **compare-screenshots** each polished page vs its earlier slice shot to confirm
  no regressions.
- Deployed Vercel preview works end-to-end (submit → triage → tracker).

## Stays green
Production build + deploy; all prior slice checks still pass.

## Feedback that would change this
Which specific shared-element morphs feel worth it vs. distracting.
