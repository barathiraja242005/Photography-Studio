import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSession = {
  isAdmin?: boolean;
  loginAt?: number;
};

// Used by both the API routes and the middleware (via cookie name lookup).
export const SESSION_COOKIE = "as_admin_session";

const password = process.env.SESSION_SECRET ?? "";

export const sessionOptions: SessionOptions = {
  password,
  cookieName: SESSION_COOKIE,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // "strict" — never send the cookie on cross-origin top-level nav.
    // Admin UI is only ever reached by typing the URL or via in-app links,
    // so we don't lose anything by tightening this.
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days — short enough that a stolen cookie expires soon, long enough for a single workweek.
    // Path stays "/" — the admin API routes are under /api/admin/*, which is
    // NOT a child of /admin in cookie-path terms (path matching is purely
    // prefix-based on the URL path). Scoping to /admin would break the API.
    // httpOnly + secure + sameSite=strict + AEAD encryption make the "cookie
    // echoed on public requests" exposure negligible.
    path: "/",
  },
};

export function isAuthConfigured(): boolean {
  return password.length >= 32;
}

export async function getSession() {
  if (!isAuthConfigured()) {
    throw new Error(
      "SESSION_SECRET must be at least 32 characters. Generate one with `openssl rand -hex 32`.",
    );
  }
  return getIronSession<AdminSession>(await cookies(), sessionOptions);
}
