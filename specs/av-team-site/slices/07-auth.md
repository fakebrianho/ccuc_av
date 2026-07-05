# Slice 07 — Admin Auth

## Contract unlocked
A single-password login that gates everything under `/admin` via a signed,
httpOnly session cookie.

## API seam
- **Auth (single owner):** `src/lib/auth.js` — `createSession()` (sign a token
  with `SESSION_SECRET`, e.g. HMAC), `verifySession(token)`, cookie name/opts
  (httpOnly, secure, sameSite=lax, maxAge). No other file signs/verifies.
- **Login:** `src/app/login/page.js` + a **Server Action** that compares input to
  `ADMIN_PASSWORD` (constant-time), sets the cookie via `next/headers` cookies,
  redirects to `/admin`. Read
  `node_modules/next/dist/docs/01-app/02-guides/authentication.md`.
- **Guard (single owner):** `src/proxy.js` (Next 16 renamed middleware → proxy)
  with `config.matcher: ['/admin/:path*']` — verify cookie, else redirect to
  `/login`. Read
  `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- **Logout:** Server Action clearing the cookie.

## Human can run/see
Visiting `/admin` unauthenticated → redirect to `/login`. Correct password →
lands on a placeholder `/admin` page. Logout → guarded again.

## Verify
- Wrong password rejected; right password sets cookie and grants access.
- Cookie is httpOnly + secure; tampered cookie fails `verifySession`.
- `/admin/*` fully gated by proxy; unrelated routes/assets unaffected (matcher).

## Stays green
Build; auth flow works locally with `.env.local`.

## Feedback that would change this
Session length / "remember me" behavior.
