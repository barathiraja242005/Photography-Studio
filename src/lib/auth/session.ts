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
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
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
