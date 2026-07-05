# Slice 00 — Foundation

## Contract unlocked
A styled, dependency-complete Next 16 app with design tokens, base layout, and
the content config that later pages read.

## API seam
- **Deps:** `npm i gsap lenis motion mongodb`. Confirm versions land in
  `package.json`. (`motion` is the motion.dev package; import from `motion/react`.)
- **Design tokens:** `src/app/globals.css` — CSS variables for an Apple-style
  system: near-black/white surfaces, one accent, generous spacing scale, SF-like
  system font stack (`-apple-system, "SF Pro", Inter, system-ui`), fluid type
  scale, radius, shadow. One palette, light-first (dark optional later).
- **Layout:** `src/app/layout.js` — sets metadata, fonts, wraps `{children}`.
  No providers yet (added in 01).
- **Content owners (single source):**
  - `src/data/team.js` → `export const team = [{ name, role, email, phone, photo, bio }]`
  - `src/data/responsibilities.js` → `export const responsibilities = { does: [], doesNot: [] }`
  - Seed with placeholder members + placeholder headshots in `public/team/`.
- **Env template:** `.env.example` with `MONGODB_URI=`, `ADMIN_PASSWORD=`,
  `SESSION_SECRET=`. Add `.env.local` to `.gitignore` (verify).

## Human can run/see
`npm run dev` → home page renders with new typography/tokens (content can be a
placeholder heading). `npm run build` passes.

## Verify
- Build green. Tokens visible on a scratch element. Config files export the
  documented shapes. No secrets committed.

## Stays green
`npm run build`.

## Feedback that would change this
Brand palette / font direction from the human (assets slice defers real brand).
