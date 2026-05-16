import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { withAdmin } from "@/lib/auth/guard";
import { db, isDbConfigured } from "@/lib/db/client";
import { instagramPosts } from "@/lib/db/schema";
import { revalidateSiteData } from "@/lib/get-site-data";
import { deleteBlob } from "@/lib/blob/r2";
import { actorFromRequest, audit } from "@/lib/audit";

const Patch = z.object({
  imageUrl: z.string().url().optional(),
  caption: z.string().min(1).max(500).optional(),
  likes: z.number().int().min(0).optional(),
  comments: z.number().int().min(0).optional(),
  plays: z.number().int().nullable().optional(),
  kind: z.enum(["post", "reel"]).optional(),
  sortOrder: z.number().int().optional(),
});

async function putHandler(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isDbConfigured || !db)
    return NextResponse.json({ error: "DB not configured." }, { status: 503 });
  const { id: idStr } = await params;
  const id = Number(idStr);
  const parsed = Patch.safeParse(await req.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  await db.update(instagramPosts).set(parsed.data).where(eq(instagramPosts.id, id));
  await audit("instagram.update", `instagram#${id}`, actorFromRequest(req), { fields: Object.keys(parsed.data) });
  revalidateSiteData();
  return NextResponse.json({ ok: true });
}

async function deleteHandler(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isDbConfigured || !db)
    return NextResponse.json({ error: "DB not configured." }, { status: 503 });
  const { id: idStr } = await params;
  const id = Number(idStr);
  const rows = await db
    .select()
    .from(instagramPosts)
    .where(eq(instagramPosts.id, id));
  if (rows[0]) await deleteBlob(rows[0].imageUrl);
  await db.delete(instagramPosts).where(eq(instagramPosts.id, id));
  await audit("instagram.delete", `instagram#${id}`, actorFromRequest(req));
  revalidateSiteData();
  return NextResponse.json({ ok: true });
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
