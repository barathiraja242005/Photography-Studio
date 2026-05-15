/**
 * Compress every JPEG under /public/images recursively.
 *  - Strip EXIF
 *  - Re-encode with mozjpeg at quality 85
 *  - Resize down to 2400px max width (keeps aspect ratio)
 *  - Overwrite originals (safe: tracked in git, R2 has copies)
 *
 * Usage: npx tsx scripts/compress-images.ts
 */

import sharp from "sharp";
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const ROOT = resolve(process.cwd(), "public/images");
const MAX_WIDTH = 2400;
const QUALITY = 85;

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(jpe?g)$/i.test(e.name)) out.push(p);
  }
  return out;
}

function fmt(bytes: number): string {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function main() {
  const files = await walk(ROOT);
  console.log(`Compressing ${files.length} JPEG files...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const before = (await stat(file)).size;
    totalBefore += before;
    const buf = await readFile(file);
    const pipeline = sharp(buf, { failOn: "none" })
      .rotate() // honor EXIF orientation, then strip it
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true });

    const output = await pipeline.toBuffer();
    await writeFile(file, output);
    const after = output.length;
    totalAfter += after;

    const saved = before - after;
    const pct = ((saved / before) * 100).toFixed(0);
    const rel = file.replace(ROOT + "/", "");
    console.log(
      `  ${rel.padEnd(48)} ${fmt(before).padStart(8)} → ${fmt(after).padStart(8)}  (-${pct}%)`,
    );
  }

  const savedTotal = totalBefore - totalAfter;
  const pctTotal = ((savedTotal / totalBefore) * 100).toFixed(0);
  console.log(
    `\n✓ ${files.length} images: ${fmt(totalBefore)} → ${fmt(totalAfter)} (saved ${fmt(savedTotal)}, -${pctTotal}%)`,
  );
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
