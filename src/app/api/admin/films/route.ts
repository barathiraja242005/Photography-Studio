import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { z } from "zod";
import { withAdmin } from "@/lib/auth/guard";
import { db, isDbConfigured } from "@/lib/db/client";
import { films } from "@/lib/db/schema";
import { safeDbError } from "@/lib/db/format-error";
import { revalidateSiteData } from "@/lib/get-site-data";
import { actorFromRequest, audit } from "@/lib/audit";

const Body = z.object({
  title: z.string().min(1).max(120),
  location: z.string().max(120).default(""),
  duration: z.string().max(20).default(""),
  posterUrl: z.string().url(),
  videoUrl: z.string().url(),
  kind: z.enum(["feature", "reel"]).default("feature"),
  sortOrder: z.number().int().optional(),
});

async function getHandler() {
  if (!isDbConfigured || !db) {
    return NextResponse.json(
      { error: "Database not configured." },
      { status: 503 },
    );
  }
  try {
    const items = await db
      .select()
      .from(films)
      .orderBy(asc(films.sortOrder), asc(films.id));
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json({ error: safeDbError(err) }, { status: 500 });
  }
}

async function postHandler(req: Request) {
  if (!isDbConfigured || !db)
    return NextResponse.json({ error: "DB not configured." }, { status: 503 });
  const body = Body.safeParse(await req.json().catch(() => null));
  if (!body.success)
    return NextResponse.json({ error: body.error.message }, { status: 400 });
  const sortOrder = body.data.sortOrder ?? Date.now() / 1000;
  const inserted = await db
    .insert(films)
    .values({ ...body.data, sortOrder })
    .returning();
  await audit("film.create", `film#${inserted[0]?.id ?? "?"}`, actorFromRequest(req), { kind: body.data.kind });
  revalidateSiteData();
  return NextResponse.json({ item: inserted[0] });
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
