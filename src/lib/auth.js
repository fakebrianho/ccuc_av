// Single owner of admin session logic. Uses Web Crypto (not node:crypto) so
// the same code runs in both the node runtime (Server Actions) and the
// proxy runtime.

export const SESSION_COOKIE = "ccuc_admin_session";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET environment variable is not set. Add it to .env.local (and Vercel project settings)."
    );
  }
  return secret;
}

async function hmacHex(secret, message) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function createSessionToken() {
  const expiresAtMs = Date.now() + SESSION_DURATION_MS;
  const signature = await hmacHex(getSecret(), String(expiresAtMs));
  return `${expiresAtMs}.${signature}`;
}

export async function verifySessionToken(token) {
  if (typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [expiresPart, signature] = parts;
  const expiresAtMs = Number(expiresPart);
  if (!Number.isFinite(expiresAtMs)) return false;
  const expected = await hmacHex(getSecret(), expiresPart);
  if (!timingSafeEqual(signature, expected)) return false;
  return Date.now() < expiresAtMs;
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  };
}
