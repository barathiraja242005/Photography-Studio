import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { withAdmin } from "@/lib/auth/guard";
import { db, isDbConfigured } from "@/lib/db/client";
import { galleryPhotos } from "@/lib/db/schema";
import { revalidateSiteData } from "@/lib/get-site-data";
import { deleteBlob } from "@/lib/blob/r2";
import { actorFromRequest, audit } from "@/lib/audit";

const Patch = z.object({
  imageUrl: z.string().url().optional(),
  alt: z.string().min(1).max(200).optional(),
  tag: z
    .enum([
      "Wedding",
      "Pre-Wedding",
      "Haldi",
      "Mehndi",
      "Sangeet",
      "Baraat",
      "Maternity",
    ])
    .optional(),
  height: z.number().int().min(4).max(10).optional(),
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
  await db.update(galleryPhotos).set(parsed.data).where(eq(galleryPhotos.id, id));
  await audit("gallery.update", `gallery#${id}`, actorFromRequest(req), { fields: Object.keys(parsed.data) });
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
    .from(galleryPhotos)
    .where(eq(galleryPhotos.id, id));
  if (rows[0]) await deleteBlob(rows[0].imageUrl);
  await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));
  await audit("gallery.delete", `gallery#${id}`, actorFromRequest(req));
  revalidateSiteData();
  return NextResponse.json({ ok: true });
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
