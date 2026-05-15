import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/guard";
import { uploadBlob, isR2Configured } from "@/lib/blob/r2";

const MAX_BYTES = 80 * 1024 * 1024; // 80 MB hard cap (covers most short videos)

async function handler(req: Request) {
  if (!isR2Configured) {
    return NextResponse.json(
      { error: "Cloudflare R2 not configured." },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  const kind = (form.get("kind") as string) || "image";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB; max 80 MB).` },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const keyPrefix = kind === "video" ? "videos/" : "images/";
  const url = await uploadBlob({
    data: buffer,
    contentType: file.type || "application/octet-stream",
    filename: file.name || "upload.bin",
    keyPrefix,
  });

  return NextResponse.json({ url });
}

export const POST = withAdmin(handler);
