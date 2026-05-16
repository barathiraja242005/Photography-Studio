import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/auth/guard";
import { uploadBlob, isR2Configured } from "@/lib/blob/r2";
import { actorFromRequest, audit } from "@/lib/audit";

const MAX_BYTES = 80 * 1024 * 1024; // 80 MB hard cap (covers most short videos)

// Allowlist by (kind, MIME). The MIME is then re-asserted from the file's
// magic bytes; never trust the browser-supplied Content-Type alone.
const IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const VIDEO_MIMES = new Set(["video/mp4", "video/webm"]);

type Detected = { mime: string; ext: string };

/**
 * Sniff the file's actual type from its first bytes. Returns null if the
 * file is none of the formats we accept. Deliberately conservative — we'd
 * rather reject an obscure-but-legitimate format than admit an SVG with
 * embedded script.
 */
function sniff(buf: Buffer): Detected | null {
  if (buf.length < 12) return null;
  const b = buf;
  // JPEG: FF D8 FF
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return { mime: "image/png", ext: "png" };
  // WebP: "RIFF"...."WEBP"
  if (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return { mime: "image/webp", ext: "webp" };
  // AVIF: ISO-BMFF with "ftyp" "avif" or "avis" at offset 4..12
  if (b.subarray(4, 8).toString() === "ftyp") {
    const brand = b.subarray(8, 12).toString();
    if (brand === "avif" || brand === "avis") return { mime: "image/avif", ext: "avif" };
    if (brand === "mp42" || brand === "isom" || brand === "iso2" || brand === "mp41") return { mime: "video/mp4", ext: "mp4" };
  }
  // WebM / Matroska: 1A 45 DF A3
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return { mime: "video/webm", ext: "webm" };
  return null;
}

async function handler(req: Request) {
  if (!isR2Configured) {
    return NextResponse.json(
      { error: "Cloudflare R2 not configured." },
      { status: 503 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  const kindRaw = form.get("kind");
  const kind = kindRaw === "video" ? "video" : kindRaw === "image" ? "image" : null;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  if (kind === null) {
    return NextResponse.json({ error: "Invalid 'kind' field." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB; max 80 MB).` },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Reject SVG/HTML/anything else outright, regardless of what the client claims.
  const detected = sniff(buffer);
  if (!detected) {
    return NextResponse.json(
      { error: "Unsupported file format. Allowed: JPEG, PNG, WebP, AVIF, MP4, WebM." },
      { status: 415 },
    );
  }

  // Reconcile detected MIME with the declared kind. Don't let video-MIMEd
  // files land in the images/ prefix or vice versa.
  const declaredOK =
    (kind === "image" && IMAGE_MIMES.has(detected.mime)) ||
    (kind === "video" && VIDEO_MIMES.has(detected.mime));
  if (!declaredOK) {
    return NextResponse.json(
      { error: `Declared kind "${kind}" doesn't match detected type "${detected.mime}".` },
      { status: 400 },
    );
  }

  // Rewrite filename to a safe form and always use the sniffed extension —
  // ignore whatever the client put after the dot.
  const safeBase = (file.name || "upload")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 80) || "upload";
  const finalName = `${safeBase}.${detected.ext}`;

  const keyPrefix = kind === "video" ? "videos/" : "images/";
  const url = await uploadBlob({
    data: buffer,
    // Sniffed MIME, not user-supplied — closes the "lie about Content-Type" attack.
    contentType: detected.mime,
    filename: finalName,
    keyPrefix,
  });

  await audit("upload.create", `upload:${detected.mime}`, actorFromRequest(req), {
    bytes: file.size,
    url,
  });

  return NextResponse.json({ url });
}

export const POST = withAdmin(handler);
