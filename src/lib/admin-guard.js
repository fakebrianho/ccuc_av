// Route-handler consumer of the auth owner (src/lib/auth.js). Kept separate
// so auth.js stays importable from the proxy runtime (no next/headers there).
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function isAdminRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return Boolean(token && (await verifySessionToken(token)));
}
