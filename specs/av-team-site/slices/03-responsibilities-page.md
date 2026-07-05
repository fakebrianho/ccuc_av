# Slice 03 — Responsibilities Page

## Contract unlocked
`/responsibilities` clearly communicates what the AV team does and does NOT do.

## API seam
- Route: `src/app/responsibilities/page.js`, reads
  `src/data/responsibilities.js` (`{ does: [], doesNot: [] }`).
- Component: two contrasting columns/lists ("We handle" vs "Out of scope"),
  Apple-clean with clear iconography (check / minus), scroll reveal via motion.dev.

## Human can run/see
`/responsibilities` with two legible lists and a link to submit a ticket for
in-scope needs.

## Verify
- Both lists render from config; responsive stack on mobile.
- Reduced-motion respected.
- **Screenshot-critique** the page.

## Stays green
Build.

## Feedback that would change this
Wording / categorization of scope items (human owns the actual content).
