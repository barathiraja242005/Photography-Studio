import { NextResponse } from "next/server";
import { asc } from "drizzle-orm";
import { z } from "zod";
import { withAdmin } from "@/lib/auth/guard";
import { db, isDbConfigured } from "@/lib/db/client";
import { instagramPosts } from "@/lib/db/schema";
import { revalidateSiteData } from "@/lib/get-site-data";

const Body = z.object({
  imageUrl: z.string().url(),
  caption: z.string().min(1).max(500),
  likes: z.number().int().min(0).default(0),
  comments: z.number().int().min(0).default(0),
  plays: z.number().int().nullable().optional(),
  kind: z.enum(["post", "reel"]).default("post"),
  sortOrder: z.number().int().optional(),
});

async function getHandler() {
  if (!isDbConfigured || !db) return NextResponse.json({ items: [] });
  const items = await db
    .select()
    .from(instagramPosts)
    .orderBy(asc(instagramPosts.sortOrder), asc(instagramPosts.id));
  return NextResponse.json({ items });
}

async function postHandler(req: Request) {
  if (!isDbConfigured || !db)
    return NextResponse.json({ error: "DB not configured." }, { status: 503 });
  const body = Body.safeParse(await req.json().catch(() => null));
  if (!body.success)
    return NextResponse.json({ error: body.error.message }, { status: 400 });
  const sortOrder = body.data.sortOrder ?? Date.now() / 1000;
  const inserted = await db
    .insert(instagramPosts)
    .values({ ...body.data, sortOrder })
    .returning();
  revalidateSiteData();
  return NextResponse.json({ item: inserted[0] });
}

export const GET = withAdmin(getHandler);
export const POST = withAdmin(postHandler);
