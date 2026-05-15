import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, isAuthConfigured } from "@/lib/auth/session";

const Body = z.object({ password: z.string().min(1) });

export async function POST(req: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "SESSION_SECRET not configured (need ≥32 chars)." },
      { status: 503 },
    );
  }
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "ADMIN_PASSWORD not configured." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password required." }, { status: 400 });
  }

  if (parsed.data.password !== process.env.ADMIN_PASSWORD) {
    // Same delay regardless of error to slow brute-force.
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const session = await getSession();
  session.isAdmin = true;
  session.loginAt = Date.now();
  await session.save();

  return NextResponse.json({ ok: true });
}
