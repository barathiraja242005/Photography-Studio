import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { z } from "zod";
import { withAdmin } from "@/lib/auth/guard";
import { db, isDbConfigured } from "@/lib/db/client";
import { galleryPhotos } from "@/lib/db/schema";
import { safeDbError } from "@/lib/db/format-error";
import { revalidateSiteData } from "@/lib/get-site-data";

const Body = z.object({
  imageUrl: z.string().url(),
  alt: z.string().min(1).max(200),
  tag: z.enum([
    "Wedding",
    "Pre-Wedding",
    "Haldi",
    "Mehndi",
    "Sangeet",
    "Baraat",
    "Maternity",
  ]),
  height: z.number().int().min(4).max(10).default(6),
  sortOrder: z.number().int().optional(),
});

async function getHandler() {
  if (!isDbConfigured || !db) {
    return NextResponse.json(
      { error: "Database not configured (set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel env vars)." },
      { status: 503 },
    );
  }
  try {
    const items = await db
      .select()
      .from(galleryPhotos)
      .orderBy(asc(galleryPhotos.sortOrder), asc(galleryPhotos.id));
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
    .insert(galleryPhotos)
    .values({ ...body.data, sortOrder })
    .returning();
  revalidateSiteData();
  return NextResponse.json({ item: inserted[0] });
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
