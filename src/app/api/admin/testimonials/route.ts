import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { z } from "zod";
import { withAdmin } from "@/lib/auth/guard";
import { db, isDbConfigured } from "@/lib/db/client";
import { testimonials } from "@/lib/db/schema";
import { revalidateSiteData } from "@/lib/get-site-data";

const Body = z.object({
  quote: z.string().min(10).max(2000),
  couple: z.string().min(1).max(120),
  place: z.string().max(120).default(""),
  date: z.string().max(40).default(""),
  accent: z.enum(["plum", "terracotta", "jade", "ruby"]).default("plum"),
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
      .from(testimonials)
      .orderBy(asc(testimonials.sortOrder), asc(testimonials.id));
    return NextResponse.json({ items });
  } catch (err) {
    return NextResponse.json(
      { error: `DB query failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    );
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
    .insert(testimonials)
    .values({ ...body.data, sortOrder })
    .returning();
  revalidateSiteData();
  return NextResponse.json({ item: inserted[0] });
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
