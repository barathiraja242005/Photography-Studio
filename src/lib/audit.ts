import "server-only";
import { db, isDbConfigured } from "@/lib/db/client";
import { auditLog } from "@/lib/db/schema";

/**
 * Append a record to audit_log. Best-effort — never throws to the caller,
 * because we don't want to fail an admin action because logging failed.
 * Errors are surfaced via console.error so they show up in Vercel logs.
 *
 *   action: short verb-noun, e.g. "settings.update", "gallery.create",
 *           "film.delete", "login.success", "login.failure"
 *   target: identifier of the affected resource ("settings",
 *           "gallery#42", "upload#images/abc-foo.jpg")
 *   actor:  IP for now; user id later
 *   meta:   optional small object — capped at 2 KB after JSON encoding
 */
export async function audit(
  action: string,
  target: string,
  actor: string,
  meta?: Record<string, unknown>,
): Promise<void> {
  if (!isDbConfigured || !db) return;
  try {
    let metaJson: string | null = null;
    if (meta) {
      const s = JSON.stringify(meta);
      metaJson = s.length > 2048 ? s.slice(0, 2048) + "…" : s;
    }
    await db.insert(auditLog).values({ action, target, actor, meta: metaJson });
  } catch (err) {
    console.error("[audit] insert failed:", err instanceof Error ? err.message : err);
  }
}

/**
 * Extract the client IP from a Request. Mirrors the logic in the login
 * route — trusts the first hop of x-forwarded-for (which Vercel sets to
 * the real client IP).
 */
export function actorFromRequest(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
