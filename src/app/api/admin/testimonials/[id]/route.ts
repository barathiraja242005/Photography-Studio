import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { withAdmin } from "@/lib/auth/guard";
import { db, isDbConfigured } from "@/lib/db/client";
import { testimonials } from "@/lib/db/schema";
import { revalidateSiteData } from "@/lib/get-site-data";
import { actorFromRequest, audit } from "@/lib/audit";

const Patch = z.object({
  quote: z.string().min(10).max(2000).optional(),
  couple: z.string().min(1).max(120).optional(),
  place: z.string().max(120).optional(),
  date: z.string().max(40).optional(),
  accent: z.enum(["plum", "terracotta", "jade", "ruby"]).optional(),
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
  await db.update(testimonials).set(parsed.data).where(eq(testimonials.id, id));
  await audit("testimonial.update", `testimonial#${id}`, actorFromRequest(req), { fields: Object.keys(parsed.data) });
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
  await db.delete(testimonials).where(eq(testimonials.id, id));
  await audit("testimonial.delete", `testimonial#${id}`, actorFromRequest(req));
  revalidateSiteData();
  return NextResponse.json({ ok: true });
}

export const PUT = withAdmin(putHandler);
export const DELETE = withAdmin(deleteHandler);
