import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/guard";
import { isDbConfigured } from "@/lib/db/client";
import { isR2Configured, bucket, publicUrlBase } from "@/lib/blob/r2";
import { createClient } from "@libsql/client";

/**
 * Read-only diagnostic — checks the DB connection independently of drizzle's
 * generated SQL. Returns env-var presence (NOT values), a table listing,
 * and the row count for site_settings + films + galleryPhotos. Useful when
 * one route fails and we don't know why.
 */
async function handler() {
  const out: Record<string, unknown> = {
    env: {
      TURSO_DATABASE_URL_present: !!process.env.TURSO_DATABASE_URL,
      TURSO_DATABASE_URL_length: (process.env.TURSO_DATABASE_URL || "").length,
      TURSO_DATABASE_URL_first8: (process.env.TURSO_DATABASE_URL || "").slice(0, 8),
      TURSO_AUTH_TOKEN_present: !!process.env.TURSO_AUTH_TOKEN,
      TURSO_AUTH_TOKEN_length: (process.env.TURSO_AUTH_TOKEN || "").length,
      R2_BUCKET: bucket,
      R2_PUBLIC_URL_present: publicUrlBase.length > 0,
      R2_configured: isR2Configured,
      DB_configured: isDbConfigured,
    },
  };

  if (!isDbConfigured) {
    return NextResponse.json({ ...out, ok: false, why: "DB not configured" });
  }

  try {
    // Make a *fresh* client here so we see raw errors (not wrapped by drizzle).
    const url = (process.env.TURSO_DATABASE_URL || "")
      .trim()
      .replace(/^['"]|['"]$/g, "");
    const authToken = (process.env.TURSO_AUTH_TOKEN || "")
      .trim()
      .replace(/^['"]|['"]$/g, "");

    const client = createClient({ url, authToken });

    // Basic connectivity
    const ping = await client.execute("SELECT 1 as ping");
    out.ping = ping.rows[0];

    // List all tables
    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
    );
    out.tables = tables.rows.map((r) => r.name);

    // Row counts per expected table
    const counts: Record<string, number | string> = {};
    for (const t of [
      "site_settings",
      "gallery_photos",
      "instagram_posts",
      "testimonials",
      "films",
    ]) {
      try {
        const r = await client.execute(`SELECT COUNT(*) as n FROM "${t}"`);
        counts[t] = Number(r.rows[0]?.n ?? 0);
      } catch (err) {
        counts[t] = `ERROR: ${err instanceof Error ? err.message : String(err)}`;
      }
    }
    out.rowCounts = counts;

    // Try the exact column list we use for films
    try {
      const filmCols = await client.execute('SELECT * FROM "films" LIMIT 1');
      out.films_first_row_columns = filmCols.columns;
    } catch (err) {
      out.films_first_row_error = err instanceof Error ? err.message : String(err);
    }

    return NextResponse.json({ ...out, ok: true });
  } catch (err) {
    const e = err as Error & { code?: string; cause?: unknown };
    return NextResponse.json(
      {
        ...out,
        ok: false,
        error: {
          name: e?.name,
          code: e?.code,
          message: e?.message,
          cause: e?.cause ? String(e.cause) : undefined,
        },
      },
      { status: 500 },
    );
  }
}

export const GET = withAdmin(handler);
