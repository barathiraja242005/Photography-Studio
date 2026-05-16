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
  const rawUrl = process.env.TURSO_DATABASE_URL || "";
  const rawTok = process.env.TURSO_AUTH_TOKEN || "";

  // Hostname (non-secret) is the most useful piece for spotting a
  // local-vs-Vercel DB mismatch without leaking the full URL.
  let urlHost = "";
  try {
    urlHost = new URL(rawUrl.trim().replace(/^['"]|['"]$/g, "")).host;
  } catch {
    /* invalid URL — left blank */
  }

  // JWT preview: header + signature length lets us spot stale/wrong tokens
  // without exposing the payload. Tokens have format header.payload.signature.
  const tokParts = rawTok.trim().split(".");
  const tokInfo = {
    parts: tokParts.length,
    header_first8: tokParts[0]?.slice(0, 8) ?? "",
    sig_length: tokParts[2]?.length ?? 0,
  };

  const out: Record<string, unknown> = {
    env: {
      TURSO_DATABASE_URL_present: rawUrl.length > 0,
      TURSO_DATABASE_URL_length: rawUrl.length,
      TURSO_DATABASE_URL_first8: rawUrl.slice(0, 8),
      TURSO_DATABASE_URL_host: urlHost,
      TURSO_AUTH_TOKEN_present: rawTok.length > 0,
      TURSO_AUTH_TOKEN_length: rawTok.length,
      TURSO_AUTH_TOKEN_jwt: tokInfo,
      R2_BUCKET: bucket,
      R2_PUBLIC_URL_present: publicUrlBase.length > 0,
      R2_configured: isR2Configured,
      DB_configured: isDbConfigured,
    },
  };

  if (!isDbConfigured) {
    return NextResponse.json({ ...out, ok: false, why: "DB not configured" });
  }

  // Direct HTTP probe — bypass libsql client to see the raw Turso response
  // (status + body), which reveals e.g. "Unauthorized" vs "DB not found".
  try {
    const url = rawUrl.trim().replace(/^['"]|['"]$/g, "");
    const authToken = rawTok.trim().replace(/^['"]|['"]$/g, "");
    // libsql:// is just https:// over Turso's HTTP API.
    const httpUrl = url.replace(/^libsql:\/\//, "https://") + "/v2/pipeline";
    const res = await fetch(httpUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        requests: [
          { type: "execute", stmt: { sql: "SELECT 1 as ping" } },
          { type: "close" },
        ],
      }),
    });
    const text = await res.text();
    out.httpProbe = {
      status: res.status,
      ok: res.ok,
      body: text.slice(0, 500),
    };
  } catch (err) {
    out.httpProbe = {
      error: err instanceof Error ? err.message : String(err),
    };
  }

  try {
    // Make a *fresh* client here so we see raw errors (not wrapped by drizzle).
    const url = rawUrl.trim().replace(/^['"]|['"]$/g, "");
    const authToken = rawTok.trim().replace(/^['"]|['"]$/g, "");

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
