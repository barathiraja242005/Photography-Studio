import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/guard";
import { safeDbError } from "@/lib/db/format-error";
import { revalidateSiteData } from "@/lib/get-site-data";
import { readSettings, saveSettings } from "@/lib/services/settings";
import { actorFromRequest } from "@/lib/audit";

async function getHandler() {
  try {
    const result = await readSettings();
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ data: result.data, version: result.version });
  } catch (err) {
    return NextResponse.json({ error: safeDbError(err) }, { status: 500 });
  }
}

async function putHandler(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  // expectedVersion may come as a top-level field on the PUT body OR via
  // the If-Match header. Both are supported so a future client lib can
  // choose either pattern.
  let expectedVersion: number | null = null;
  if (typeof body === "object" && body !== null && "expectedVersion" in body) {
    const v = (body as { expectedVersion?: unknown }).expectedVersion;
    if (typeof v === "number") expectedVersion = v;
    delete (body as Record<string, unknown>).expectedVersion;
  }
  if (expectedVersion === null) {
    const ifMatch = req.headers.get("if-match");
    if (ifMatch) {
      const n = Number(ifMatch);
      if (Number.isFinite(n)) expectedVersion = n;
    }
  }

  try {
    const result = await saveSettings({
      body,
      expectedVersion,
      actor: actorFromRequest(req),
    });
    if (!result.ok) {
      return NextResponse.json(
        result.issues ? { error: result.error, issues: result.issues } : { error: result.error },
        { status: result.status },
      );
    }
    revalidateSiteData();
    return NextResponse.json({ ok: true, version: result.version });
  } catch (err) {
    return NextResponse.json({ error: safeDbError(err) }, { status: 500 });
  }
}

export const GET = withAdmin(getHandler);
export const PUT = withAdmin(putHandler);
