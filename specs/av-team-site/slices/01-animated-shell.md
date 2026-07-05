# Slice 01 — Animated Shell (first playable)

## Contract unlocked
The site's motion foundation: Lenis smooth scroll, motion.dev page transitions,
GSAP-driven hero, and shared nav/footer — the "feel" of the whole site with
placeholder content.

## API seam
- **Smooth scroll (single owner):** `src/components/motion/SmoothScroll.jsx`
  (`"use client"`) — initializes **one** Lenis instance, drives it via `raf`,
  cleans up on unmount. Wrap `{children}` in `layout.js`. No page re-inits Lenis.
- **Page transitions (single owner):** use motion.dev. In App Router, wrap route
  content in a `template.js` (re-mounts per navigation) or a client
  `PageTransition` using `AnimatePresence`/`motion` from `motion/react`. Read
  `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/template.md`
  first. Seamless fade/slide on enter/exit.
- **Chrome:** `src/components/Nav.jsx`, `src/components/Footer.jsx` — minimal
  Apple-style nav (Home, Team, Responsibilities, Submit Ticket, Tracker), links
  via `next/link`.
- **Hero:** `src/app/page.js` + `src/components/Hero.jsx` — GSAP scroll-triggered
  reveal (register `ScrollTrigger`), large kinetic type, coordinated with Lenis
  (`lenis.on('scroll', ScrollTrigger.update)`).

## Human can run/see
Landing page with smooth momentum scroll, animated hero on load/scroll, and a
seamless transition when navigating between placeholder routes.

## Verify
- Navigate Home ↔ another placeholder route: transition animates, no fl: no white flash.
- Smooth scroll active; only ONE Lenis instance (assert in code review).
- `prefers-reduced-motion: reduce` → animations disabled/instant.
- **Screenshot-critique** the hero (load + mid-scroll) as final check.

## Stays green
Build passes; no hydration warnings in console.

## Feedback that would change this
Human taste review on the shell feel (motion speed, easing, hero density).
