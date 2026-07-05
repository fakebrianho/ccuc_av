# Slice 08 — Admin Dashboard

## Contract unlocked
`/admin` — triage the `new` queue and manage every ticket's status, priority,
assignee, and schedule. Protected by slice 07.

## API seam
- Route: `src/app/admin/page.js` (rendered only past the proxy guard).
- **Guard the mutations:** add `PATCH` and `DELETE` to
  `src/app/api/tickets/[id]/route.js`, and TIGHTEN the plain `GET /api/tickets`
  from slice 04 so full/admin listing + all mutations require a valid session
  (`verifySession` from `src/lib/auth.js`). This closes the temporary seam noted
  in slice 04. Public `POST` and `?scope=public GET` stay open.
- UI: triage queue (promote `new` → `triaged`, or delete), and an editor per
  ticket to set status/priority/assignee/`scheduledFor`. Uses
  `src/lib/tickets/queries.js` via the API; imports option constants from
  `schema.js`.
- Optimistic UI + motion.dev feedback; reduced-motion safe.

## Human can run/see
Log in → see `new` tickets → approve one → it appears on `/tracker`. Edit
priority/schedule/assignee → reflected on tracker. Delete works.

## Verify
- Unauthenticated `PATCH/DELETE/admin GET` → 401/redirect (proxy + route check).
- Promoting `new`→`triaged` makes it show on public tracker.
- All edits persist to Atlas; `updatedAt` bumps.
- **Screenshot-critique** the dashboard.

## Stays green
Build; slice-04 temporary open `GET` is now guarded (invariant restored).

## Feedback that would change this
Bulk actions, keyboard shortcuts, or a kanban drag interface (later).
