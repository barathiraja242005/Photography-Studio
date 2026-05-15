import "server-only";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "node:crypto";

const accountId = process.env.R2_ACCOUNT_ID ?? "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID ?? "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? "";
export const bucket = process.env.R2_BUCKET ?? "";
export const publicUrlBase = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");

export const isR2Configured =
  accountId.length > 0 &&
  accessKeyId.length > 0 &&
  secretAccessKey.length > 0 &&
  bucket.length > 0;

export const r2 = isR2Configured
  ? new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    })
  : null;

/**
 * Upload a Buffer to R2 and return the public URL.
 * `keyPrefix` lets you group files (e.g. "gallery/", "videos/").
 */
export async function uploadBlob({
  data,
  contentType,
  filename,
  keyPrefix = "",
}: {
  data: Buffer | Uint8Array;
  contentType: string;
  filename: string;
  keyPrefix?: string;
}): Promise<string> {
  if (!r2 || !isR2Configured) {
    throw new Error("R2 is not configured — set R2_* env vars in .env.local.");
  }
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-");
  const random = randomBytes(4).toString("hex");
  const key = `${keyPrefix}${random}-${safeName}`;
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: data,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${publicUrlBase}/${key}`;
}

/**
 * Delete a previously-uploaded asset given its public URL. Best-effort —
 * does not throw if the file is already gone.
 */
export async function deleteBlob(publicUrl: string): Promise<void> {
  if (!r2 || !isR2Configured) return;
  if (!publicUrl.startsWith(publicUrlBase)) return; // not ours
  const key = publicUrl.slice(publicUrlBase.length + 1);
  try {
    await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  } catch {
    // ignore
  }
}
