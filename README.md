# CCUC AV Website

The website of the CCUC audio & visual department: team roster and contacts,
scope of responsibilities, public ticket submission, a live ticket tracker,
and a password-protected admin area for triage and scheduling.

Built with Next.js 16 (App Router, JavaScript), GSAP + Lenis + motion.dev for
animation, and MongoDB Atlas for ticket storage. Deploys to Vercel.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string (tickets live in db `ccuc_av`, collection `tickets`) |
| `ADMIN_PASSWORD` | The single admin login password |
| `SESSION_SECRET` | Random secret used to sign the admin session cookie |

Set the same three variables in the Vercel project settings for deploys. In
Atlas, allow network access from Vercel (0.0.0.0/0 or Vercel's IP ranges).

## Architecture invariants

- **Ticket shape** has one owner: `src/lib/tickets/schema.js`. All layers
  import constants/validators from there.
- **DB connection** has one owner: `src/lib/db.js` (cached serverless-safe
  client). Nothing else connects to Mongo.
- **Auth/session** has one owner: `src/lib/auth.js`; `src/proxy.js` guards
  `/admin`, `src/lib/admin-guard.js` guards API mutations.
- **Smooth scroll** has one owner: `src/components/motion/SmoothScroll.jsx`
  (single Lenis instance). Page transitions live in `src/app/template.js`.
- **Site content** (team, responsibilities) is hardcoded in `src/data/` and
  edited in code. Replace placeholder headshots in `public/team/`.
- Never persist to the local filesystem — Vercel is serverless; all ticket
  state lives in Atlas.
- All animation respects `prefers-reduced-motion`.

## Ticket flow

Public form (`/submit`) → ticket lands with status `new` (admin-only triage
queue) → admin approves on `/admin` → ticket appears on the public tracker
(`/tracker`). Full ticket listing and all mutations require the admin session.

## Local verification without Atlas

`specs/av-team-site/assets/memdb.mjs` starts a seeded in-memory MongoDB on
port 27099. Run the dev server with
`MONGODB_URI="mongodb://127.0.0.1:27099/" ADMIN_PASSWORD=testpass SESSION_SECRET=devsecret npm run dev`,
then use `login-check.mjs` and `admin-check.mjs` in the same folder.
