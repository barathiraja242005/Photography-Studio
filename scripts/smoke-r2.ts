import { config } from "dotenv";
config({ path: ".env.local" });

import { S3Client, PutObjectCommand, HeadBucketCommand } from "@aws-sdk/client-s3";

const accountId = process.env.R2_ACCOUNT_ID!;
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const bucket = process.env.R2_BUCKET!;
const publicBase = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");

async function main() {
  console.log(`Endpoint: https://${accountId}.r2.cloudflarestorage.com`);
  console.log(`Bucket:   ${bucket}`);
  console.log(`Public:   ${publicBase}\n`);

  console.log("→ HeadBucket...");
  await r2.send(new HeadBucketCommand({ Bucket: bucket }));
  console.log("  ✓ bucket reachable");

  console.log("→ PutObject (1-byte test file)...");
  const key = "smoke/hello.txt";
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: "ok",
      ContentType: "text/plain",
      CacheControl: "no-store",
    }),
  );
  console.log(`  ✓ wrote ${key}`);

  const url = `${publicBase}/${key}`;
  console.log(`\nFetching public URL: ${url}`);
  const res = await fetch(url);
  console.log(`  → ${res.status} ${res.statusText}`);
  const body = await res.text();
  console.log(`  body: ${body.slice(0, 40)}`);

  if (res.ok && body === "ok") {
    console.log("\n✓ R2 is fully wired (write + public read both work).");
  } else {
    console.log(
      "\n! Upload worked but public URL returned a non-OK response. Check that R2.dev subdomain is enabled in bucket Settings.",
    );
  }
}

main().catch((err) => {
  console.error("R2 smoke test failed:");
  console.error(err);
  process.exit(1);
});
