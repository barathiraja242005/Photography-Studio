import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, gt, lt, sql } from "drizzle-orm";
import { getSession, isAuthConfigured } from "@/lib/auth/session";
import { db, isDbConfigured } from "@/lib/db/client";
import { loginAttempts } from "@/lib/db/schema";
import { timingSafeEqual } from "node:crypto";
import { audit } from "@/lib/audit";

const Body = z.object({ password: z.string().min(1).max(500) });

// 5 attempts / 15 minutes / IP — generous for a fat-fingered owner,
// punitive for a brute-force loop.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS_IN_WINDOW = 5;

function clientIp(req: Request): string {
  // Vercel sets x-forwarded-for; trust only the first hop (closest to us).
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/**
 * Constant-time string compare. `===` is fine for typical attackers since
 * the 400 ms artificial delay dominates timing, but the cost of timingSafe
 * is trivial and it eliminates the entire class of concern.
 */
function constantTimeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function POST(req: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "SESSION_SECRET not configured (need ≥32 chars)." },
      { status: 503 },
    );
  }
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured." },
      { status: 503 },
    );
  }

  const ip = clientIp(req);

  // Count recent failed attempts from this IP. If DB is unconfigured we
  // skip the check — failing closed here would lock everyone out during a
  // DB outage, which is a bigger problem than a temporarily-unprotected
  // login while the studio fixes their database.
  if (isDbConfigured && db) {
    try {
      const since = Date.now() - WINDOW_MS;
      const recent = await db
        .select({ n: sql<number>`count(*)` })
        .from(loginAttempts)
        .where(
          and(
            eq(loginAttempts.ip, ip),
            eq(loginAttempts.success, false),
            gt(loginAttempts.attemptedAt, since),
          ),
        );
      const count = Number(recent[0]?.n ?? 0);
      if (count >= MAX_ATTEMPTS_IN_WINDOW) {
        return NextResponse.json(
          { error: "Too many attempts. Try again in 15 minutes." },
          { status: 429 },
        );
      }
      // Opportunistic cleanup: drop rows older than the window.
      await db.delete(loginAttempts).where(lt(loginAttempts.attemptedAt, since));
    } catch {
      // Rate-limit check is best-effort; never block login on its failure.
    }
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password required." }, { status: 400 });
  }

  const ok = constantTimeEq(parsed.data.password, process.env.ADMIN_PASSWORD);

  // Record attempt before responding (so even fire-and-forget brute force
  // tools' attempts count). Best-effort — don't fail the login if recording
  // fails.
  if (isDbConfigured && db) {
    try {
      await db.insert(loginAttempts).values({ ip, success: ok });
    } catch {
      /* swallow */
    }
  }

  if (!ok) {
    await audit("login.failure", "auth", ip);
    // Same delay regardless of error to slow brute-force timing.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const session = await getSession();
  session.isAdmin = true;
  session.loginAt = Date.now();
  await session.save();

  await audit("login.success", "auth", ip);
  return NextResponse.json({ ok: true });
}
