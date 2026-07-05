# Slice 05 — Public Ticket Form

## Contract unlocked
`/submit` lets anyone file a bug or AV request; it lands in the `new` triage
queue (not yet on the public tracker).

## API seam
- Route: `src/app/submit/page.js` + `src/components/TicketForm.jsx` (`"use client"`).
- Fields: title, description, type (bug/request), priority, optional submitter
  name. Client validation mirrors `validateNewTicket` (import constants from
  `src/lib/tickets/schema.js` — do not re-list options).
- Submit via `POST /api/tickets` (slice 04). On success: success state / reset;
  on 400: show field errors.
- Motion.dev micro-interactions on submit; respect reduced-motion.

## Human can run/see
Fill the form → success confirmation → new doc appears in Atlas with `status:"new"`.

## Verify
- Required-field validation blocks empty submit; server errors surface.
- New ticket has `status:"new"` and is absent from `GET ?scope=public`.
- **Screenshot-critique** the form (empty, error, success states).

## Stays green
Build; submit round-trips to Atlas.

## Feedback that would change this
Which fields are public-facing vs admin-only.
