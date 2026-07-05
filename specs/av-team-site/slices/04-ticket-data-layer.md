# Slice 04 — Ticket Data Layer

## Contract unlocked
A serverless-safe MongoDB Atlas connection, the single ticket schema, and API
route handlers to create and list tickets. No UI yet.

## API seam
- **DB (single owner):** `src/lib/db.js` — cached Mongo client using a
  `globalThis` singleton so hot-reload/serverless don't leak connections. Reads
  `MONGODB_URI`. Exports `getDb()` / `getTicketsCollection()`.
- **Schema (single owner):** `src/lib/tickets/schema.js` — field constants
  (`STATUSES`, `PRIORITIES`, `TYPES`), a `validateNewTicket(input)` returning
  `{ valid, errors, value }`, and a `normalize()` for API output (stringify
  `_id`). This is the ONLY place the ticket shape is defined.
- **Queries:** `src/lib/tickets/queries.js` — `createTicket`, `listTickets({ statuses })`,
  `updateTicket(id, patch)`, `deleteTicket(id)`. Sets `createdAt/updatedAt`,
  defaults `status:"new"`.
- **Routes:** `src/app/api/tickets/route.js` — `POST` (create, public, validated)
  and `GET` (list; supports `?scope=public` → excludes `new`). Read
  `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`
  first. Admin-only mutations come in slice 08 (guarded by proxy).

## Human can run/see
`curl -XPOST /api/tickets` creates a doc in Atlas; `GET /api/tickets?scope=public`
returns triaged tickets only. Verify docs in the Atlas dashboard.

## Verify
- Invalid POST → 400 with field errors. Valid → 201 with normalized ticket.
- `GET ?scope=public` excludes `new`; plain `GET` (temporary, tighten in 08)
  returns all — note this as a seam to guard in slice 08.
- Only one Mongo client is created (log/inspect).

## Stays green
Build; POST/GET manual checks pass against Atlas.

## Feedback that would change this
Extra fields beyond the agreed contract (would update `schema.js` only).
