import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { withAdmin } from "@/lib/auth/guard";
import { db, isDbConfigured } from "@/lib/db/client";
import { films } from "@/lib/db/schema";
import { revalidateSiteData } from "@/lib/get-site-data";
import { deleteBlob } from "@/lib/blob/r2";
import { actorFromRequest, audit } from "@/lib/audit";

const Patch = z.object({
  title: z.string().min(1).max(120).optional(),
  location: z.string().max(120).optional(),
  duration: z.string().max(20).optional(),
  posterUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  kind: z.enum(["feature", "reel"]).optional(),
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
  await db.update(films).set(parsed.data).where(eq(films.id, id));
  await audit("film.update", `film#${id}`, actorFromRequest(req), { fields: Object.keys(parsed.data) });
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
  const rows = await db.select().from(films).where(eq(films.id, id));
  if (rows[0]) {
    await deleteBlob(rows[0].posterUrl);
    await deleteBlob(rows[0].videoUrl);
  }
  await db.delete(films).where(eq(films.id, id));
  await audit("film.delete", `film#${id}`, actorFromRequest(req));
  revalidateSiteData();
  return NextResponse.json({ ok: true });
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
