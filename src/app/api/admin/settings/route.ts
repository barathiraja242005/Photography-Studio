import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { withAdmin } from "@/lib/auth/guard";
import { db, isDbConfigured } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { formatDbError } from "@/lib/db/format-error";
import { revalidateSiteData } from "@/lib/get-site-data";

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
    return NextResponse.json({ error: formatDbError(err) }, { status: 500 });
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
  const json = JSON.stringify(body);
  if (json.length > 200_000) {
    return NextResponse.json({ error: "Payload too large." }, { status: 400 });
  }

  // Upsert: keep only the latest row.
  await db.delete(siteSettings);
  await db.insert(siteSettings).values({ data: json });

  revalidateSiteData();
  return NextResponse.json({ ok: true });
}

export const GET = withAdmin(getHandler);
export const PUT = withAdmin(putHandler);
