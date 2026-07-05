# Slice 06 — Public Ticket Tracker

## Contract unlocked
`/tracker` — a live, read-only board visualizing triaged tickets by status,
priority, and schedule.

## API seam
- Route: `src/app/tracker/page.js`. Fetch `GET /api/tickets?scope=public`
  (excludes `new`). Prefer server-render + revalidate; read
  `node_modules/next/dist/docs/01-app/01-getting-started/06-fetching-data.md`.
- Component: `src/components/TrackerBoard.jsx` — columns by status
  (`triaged → in-progress → blocked → done`), each card shows title, type,
  priority badge (color-coded), assignee, `scheduledFor` date.
- Cards animate in / reflow via motion.dev; reduced-motion safe.

## Human can run/see
`/tracker` shows triaged tickets grouped in columns with priority colors and
scheduled dates; `new` tickets never appear.

## Verify
- Only non-`new` tickets show; columns/badges correct; empty columns handled.
- Responsive (columns → stacked on mobile).
- **Screenshot-critique** the board.
- **compare-screenshots** vs the shell/team look for token consistency.

## Stays green
Build; board reflects Atlas state.

## Feedback that would change this
Grouping axis (by status vs by priority) and whether `done` is hidden/collapsed.
