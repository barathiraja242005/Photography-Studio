/**
 * Compress the three background videos using ffmpeg.
 *
 *  hero.mp4  — 720p, no audio, CRF 26 (it's a silent looped background)
 *  cta.mp4   — 720p, no audio, CRF 26 (also silent background)
 *  films.mp4 — 1080p kept, CRF 23 + AAC audio (the featured film, has sound)
 *
 * Originals are saved to /public/videos/.orig/ as a safety net.
 *
 * Usage: npx tsx scripts/compress-videos.ts
 */

import ffmpegPath from "ffmpeg-static";
import { spawn } from "node:child_process";
import { mkdir, rename, stat, readdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const VIDEOS = resolve(process.cwd(), "public/videos");
const BACKUP = join(VIDEOS, ".orig");

type Job = {
  file: string;
  scale: string;
  crf: number;
  audio: boolean;
};

const JOBS: Job[] = [
  { file: "hero.mp4", scale: "1280:-2", crf: 26, audio: false },
  { file: "cta.mp4", scale: "1280:-2", crf: 26, audio: false },
  { file: "films.mp4", scale: "1920:-2", crf: 23, audio: true },
];

function fmt(bytes: number): string {
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}

async function run(args: string[]): Promise<void> {
  return new Promise((resolveP, reject) => {
    if (!ffmpegPath) return reject(new Error("ffmpeg-static binary missing"));
    const proc = spawn(ffmpegPath, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (b) => {
      stderr += b.toString();
    });
    proc.on("error", reject);
    proc.on("close", (code) =>
      code === 0
        ? resolveP()
        : reject(new Error(`ffmpeg exited ${code}\n${stderr.slice(-500)}`)),
    );
  });
}

async function main() {
  if (!ffmpegPath) {
    console.error("ffmpeg-static binary not available — run `npm install -D ffmpeg-static`");
    process.exit(1);
  }

  await mkdir(BACKUP, { recursive: true });

  let totalBefore = 0;
  let totalAfter = 0;

  for (const job of JOBS) {
    const input = join(VIDEOS, job.file);
    if (!existsSync(input)) {
      console.warn(`  ! ${job.file} not found, skipping`);
      continue;
    }

    const before = (await stat(input)).size;
    totalBefore += before;

    // Back up the original (only if not already backed up).
    const backup = join(BACKUP, job.file);
    if (!existsSync(backup)) await copyFile(input, backup);

    const tmpOut = join(VIDEOS, `.${job.file}.tmp`);

    console.log(`→ Compressing ${job.file} (${fmt(before)})...`);
    const args = [
      "-y",
      "-i",
      backup, // encode from the backup so it's lossless source
      "-vf",
      `scale=${job.scale}`,
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      String(job.crf),
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      ...(job.audio
        ? ["-c:a", "aac", "-b:a", "96k"]
        : ["-an"]),
      "-f",
      "mp4",
      tmpOut,
    ];

    await run(args);

    const after = (await stat(tmpOut)).size;
    totalAfter += after;

    await rename(tmpOut, input);

    const saved = before - after;
    const pct = ((saved / before) * 100).toFixed(0);
    console.log(
      `  ✓ ${fmt(before).padStart(10)} → ${fmt(after).padStart(10)}  (-${pct}%)`,
    );
  }

  const savedTotal = totalBefore - totalAfter;
  const pctTotal = ((savedTotal / totalBefore) * 100).toFixed(0);
  console.log(
    `\n✓ ${JOBS.length} videos: ${fmt(totalBefore)} → ${fmt(totalAfter)} (saved ${fmt(savedTotal)}, -${pctTotal}%)`,
  );
  console.log(`  Originals backed up to public/videos/.orig/`);

  // Suppress unused-import lint
  void readdir;
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
