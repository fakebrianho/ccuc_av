# Slice 02 — Team Page

## Contract unlocked
`/team` renders the AV team roster with contact info, styled Apple-clean.

## API seam
- Route: `src/app/team/page.js`, reads `src/data/team.js` (owner from slice 00).
- Component: `src/components/TeamCard.jsx` — photo, name, role, email (`mailto:`),
  phone (`tel:`), short bio. Grid layout, responsive.
- Entrance animation via motion.dev (stagger on scroll into view). Reuse motion
  primitives; do not add a second animation system.

## Human can run/see
`/team` shows placeholder members with working `mailto:`/`tel:` links and a
staggered reveal.

## Verify
- All members from config render; links resolve; layout responsive (1/2/3 cols).
- Reduced-motion respected.
- **Screenshot-critique** the grid (desktop + mobile widths).
- **compare-screenshots** against the slice-01 shell look to confirm consistent
  type/spacing tokens (candidate-vs-target, less-wrong verdict).

## Stays green
Build; no missing-image console errors (placeholders exist).

## Feedback that would change this
Card density / photo shape (circle vs rounded-rect) from human.
