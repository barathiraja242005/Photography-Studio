import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/guard";
import { db, isDbConfigured } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { safeDbError } from "@/lib/db/format-error";
import { revalidateSiteData } from "@/lib/get-site-data";
import { SettingsSchema } from "@/lib/db/settings-schema";

async function getHandler() {
  if (!isDbConfigured || !db) {
    return NextResponse.json(
      { error: "Database not configured." },
      { status: 503 },
    );
  }
  try {
    const rows = await db
      .select()
      .from(siteSettings)
      .orderBy(desc(siteSettings.id))
      .limit(1);
    const data = rows[0] ? JSON.parse(rows[0].data) : null;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: safeDbError(err) }, { status: 500 });
  }
}

async function putHandler(req: Request) {
  if (!isDbConfigured || !db) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // Reject payloads that don't roughly match the SiteData shape. The
  // schema is permissive (passthrough on every object) — the goal is to
  // catch type confusion and oversized fields, not to enforce business
  // rules.
  const parsed = SettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid settings payload.", issues: parsed.error.issues.slice(0, 5) },
      { status: 400 },
    );
  }

  const json = JSON.stringify(parsed.data);
  if (json.length > 200_000) {
    return NextResponse.json({ error: "Payload too large." }, { status: 400 });
  }

  // Single-row table: wrap the delete+insert in a transaction so a crash
  // between them can't leave us with zero settings rows. libsql supports
  // immediate transactions via drizzle's transaction API.
  try {
    await db.transaction(async (tx) => {
      await tx.delete(siteSettings);
      await tx.insert(siteSettings).values({ data: json });
    });
  } catch (err) {
    return NextResponse.json({ error: safeDbError(err) }, { status: 500 });
  }

  revalidateSiteData();
  return NextResponse.json({ ok: true });
}

export const GET = withAdmin(getHandler);
export const PUT = withAdmin(putHandler);
