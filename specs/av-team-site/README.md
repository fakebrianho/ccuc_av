# AV Team Site

A minimal, Apple-style website for the CCUC AV team: who we are, how to reach us,
what we do (and don't) do, a public ticket intake form, and a live ticket
tracker — plus a password-protected admin area to triage and schedule tickets.

## Next Agent Prompt

**Status:** Slice 00 complete, 2026-07-05. Deps installed (gsap, lenis, motion,
mongodb), design tokens in `globals.css`, content configs in `src/data/`,
placeholder headshots in `public/team/`, `.env.example` added, build green.
**Next pickup:** Slice `01-animated-shell`. Slices 02/03 depend on 01; slice 04
is independent and can run in parallel with 01.
**Blockers/warnings:**
- This is **Next.js 16.2.10** — it differs from older Next.js. Read the relevant
  guide in `node_modules/next/dist/docs/` before writing framework code. Notably:
  `middleware` is renamed to **`proxy.js`**; auth uses **Server Actions + cookies**;
  view transitions use React's **`<ViewTransition>`** behind
  `experimental.viewTransition`.
- MongoDB Atlas + Vercel is the target. Never write to the local filesystem for
  persistence — Vercel is serverless. All ticket state lives in Atlas.
- `MONGODB_URI` and `ADMIN_PASSWORD` / `SESSION_SECRET` are secrets — read from
  env, never commit. Add them to `.env.local` and Vercel project settings.

**Global TODO:**
- [x] `00-foundation` — deps, design tokens, layout, content config
- [ ] `01-animated-shell` — Lenis + motion.dev transitions + GSAP hero (first playable)
- [ ] `02-team-page` — roster + contact cards
- [ ] `03-responsibilities-page` — do / don't scope
- [ ] `04-ticket-data-layer` — Atlas connection + ticket model + API
- [ ] `05-ticket-form` — public submission → triage queue
- [ ] `06-ticket-tracker` — public read-only board
- [ ] `07-auth` — env password, cookie session, proxy guard
- [ ] `08-admin-dashboard` — triage, schedule, edit, delete
- [ ] `09-polish-integration` — seamless transitions everywhere, a11y, deploy

> Next agent: update this section (status, pickup point, checklist) before ending
> your pass.

## Goal & Non-Goals

**Goal:** A fast, elegant, single-admin site with real shared ticketing.

**Non-goals (explicitly out of scope):**
- No multi-user accounts / roles. One admin (you), one password.
- No real database of users. Team/responsibilities content is **hardcoded in a
  config file**, edited in code — not editable from the admin UI.
- No email/notification pipeline (can be a later feature).
- No comment threads on tickets (title/description/status only).

## Decisions (from interview)

| Decision | Choice |
| --- | --- |
| Hosting | Vercel (serverless) |
| Persistence | MongoDB Atlas (tickets only) |
| Content (team/responsibilities) | Hardcoded config/data file |
| Ticket flow | Public submits → `new` queue → admin triages → shows on tracker |
| Auth | Single `ADMIN_PASSWORD` env → signed httpOnly session cookie → `proxy.js` guards `/admin` |
| Assets | Generated placeholders + documented replacement path |
| First checkpoint | Animated shell (landing + Lenis + page transitions) |
| Animation stack | GSAP (scroll/scene), Lenis (smooth scroll), motion.dev (page/element transitions) |

## Ticket Contract (single owner)

The ticket shape has **one owner**: `src/lib/tickets/schema.js`. Every layer
(API, form, tracker, admin) imports types/validators from there — no re-declared
shapes.

```
Ticket {
  _id,
  title: string,
  description: string,
  type: "bug" | "request",
  priority: "low" | "medium" | "high" | "urgent",
  status: "new" | "triaged" | "in-progress" | "blocked" | "done",
  assignee: string | null,
  scheduledFor: ISO date string | null,
  submitterName: string | null,
  createdAt, updatedAt
}
```

- Public **tracker** shows tickets whose status is NOT `new` (i.e. triaged+).
- `new` tickets live only in the admin triage queue until promoted.

## Architecture & Single-Owner Invariants

Run [refactor-clean](../../.agents/skills/refactor-clean/SKILL.md) against this
plan before/while building. Enforce these owners so nothing is bolted on:

- **DB connection:** `src/lib/db.js` — one cached Mongo client (serverless-safe
  singleton via `globalThis`). Nothing else opens a connection.
- **Ticket domain:** `src/lib/tickets/` — schema/validators + query functions.
  API routes are thin; they call these.
- **Auth/session:** `src/lib/auth.js` — sign/verify session cookie; `proxy.js`
  and the login action both use it. No duplicate crypto.
- **Content:** `src/data/team.js` and `src/data/responsibilities.js` — the only
  source of team/scope content.
- **Motion providers:** `src/components/motion/` — one `SmoothScroll` (Lenis)
  provider and one page-transition wrapper. Pages never re-init Lenis.
- **Design tokens:** `src/app/globals.css` CSS variables — one palette/type scale.

No slice may introduce a parallel ticket shape, a second DB connector, or a
second smooth-scroll instance. Any transitional scaffold must name its removal
condition in the slice file.

## Verification Gates (standing)

- Every **visual** slice ends with an unprimed
  [screenshot-critique](../../.agents/skills/screenshot-critique/SKILL.md) of its
  shot before acceptance.
- When a slice changes a prior look or has a reference/inspiration image, use
  [compare-screenshots](../../.agents/skills/compare-screenshots/SKILL.md) to
  judge candidate-vs-target (telemetry + less-wrong verdict).
- Respect `prefers-reduced-motion` everywhere animations run.
- `npm run build` stays green from slice `00` onward.

## Review Map

- Human wants taste review at: `01` (shell feel), `02` (team cards), `06`
  (tracker board), `09` (transitions across the whole site).
- Human review checkpoints are **non-blocking**: open shots with
  [preview-shots](../../.agents/skills/preview-shots/SKILL.md), wait ~5 min, then
  decide on evidence, record the decision, close shots, and proceed.

## Slice Graph

```
00-foundation
   ├─ 01-animated-shell ──► 02-team-page
   │                        03-responsibilities-page
   └─ 04-ticket-data-layer ─► 05-ticket-form
                              06-ticket-tracker
                              07-auth ──► 08-admin-dashboard
All roads ──► 09-polish-integration
```
