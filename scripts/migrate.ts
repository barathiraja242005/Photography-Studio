/**
 * One-shot migration: seeds Turso + R2 from the existing site.ts + images.ts
 * + /public/images files.
 *
 * Usage:
 *   1) Sign up at https://turso.tech and create a database. Copy URL + auth token to .env.local.
 *   2) Sign up at https://dash.cloudflare.com, create an R2 bucket, create
 *      an API token with Object Read & Write scope. Enable r2.dev public URL.
 *      Set R2_* env vars in .env.local.
 *   3) `npm run db:push` to create tables.
 *   4) `npm run db:migrate-content` (this script).
 *
 * Idempotent: clears tables before inserting so re-running gives a clean state.
 */

import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env", override: false });

import { readFileSync, existsSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomBytes } from "node:crypto";

import { site } from "../src/config/site";
import {
  ABOUT_IMAGE,
  CTA_IMAGE,
  FILM_POSTER,
  GALLERY,
  HERO_IMAGES,
  IG_POSTS,
} from "../src/lib/images";
import {
  galleryPhotos,
  instagramPosts,
  testimonials,
  films,
  siteSettings,
} from "../src/lib/db/schema";

// ─── Verify env ────────────────────────────────────────────────
const need = [
  "TURSO_DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET",
  "R2_PUBLIC_URL",
];
for (const k of need) {
  if (!process.env[k]) {
    console.error(`Missing env var: ${k}`);
    process.exit(1);
  }
}

const PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
const BUCKET = process.env.R2_BUCKET!;

// ─── DB + R2 clients ───────────────────────────────────────────
const db = drizzle(
  createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  }),
);

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// ─── Helpers ───────────────────────────────────────────────────
const publicDir = resolve(process.cwd(), "public");
const cache = new Map<string, string>(); // local path -> R2 url

function contentTypeFor(filename: string): string {
  const lc = filename.toLowerCase();
  if (lc.endsWith(".jpg") || lc.endsWith(".jpeg")) return "image/jpeg";
  if (lc.endsWith(".png")) return "image/png";
  if (lc.endsWith(".webp")) return "image/webp";
  if (lc.endsWith(".mp4")) return "video/mp4";
  if (lc.endsWith(".webm")) return "video/webm";
  return "application/octet-stream";
}

async function uploadLocal(publicPath: string, prefix: string): Promise<string> {
  if (cache.has(publicPath)) return cache.get(publicPath)!;
  const filePath = join(publicDir, publicPath.replace(/^\//, ""));
  if (!existsSync(filePath)) {
    console.warn(`  ! missing ${publicPath} — keeping original path as URL`);
    cache.set(publicPath, publicPath);
    return publicPath;
  }
  const buf = readFileSync(filePath);
  const name = basename(filePath).replace(/[^a-zA-Z0-9._-]/g, "-");
  const key = `${prefix}${randomBytes(4).toString("hex")}-${name}`;
  await r2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buf,
      ContentType: contentTypeFor(name),
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  const url = `${PUBLIC_URL}/${key}`;
  cache.set(publicPath, url);
  console.log(`  ✓ ${publicPath} → ${url}`);
  return url;
}

// ─── Migration steps ───────────────────────────────────────────
async function migrateGallery() {
  console.log(`\n→ Uploading ${GALLERY.length} gallery photos...`);
  await db.delete(galleryPhotos);
  let order = 0;
  for (const p of GALLERY) {
    order += 10;
    const url = await uploadLocal(p.src, "images/gallery/");
    await db.insert(galleryPhotos).values({
      imageUrl: url,
      alt: p.alt,
      tag: p.tag,
      height: p.h,
      sortOrder: order,
    });
  }
}

async function migrateInstagram() {
  console.log(`\n→ Uploading ${IG_POSTS.length} Instagram posts...`);
  await db.delete(instagramPosts);
  let order = 0;
  for (const p of IG_POSTS) {
    order += 10;
    const url = await uploadLocal(p.src, "images/instagram/");
    await db.insert(instagramPosts).values({
      imageUrl: url,
      caption: p.caption,
      likes: p.likes,
      comments: p.comments,
      plays: p.plays ?? null,
      kind: p.kind,
      sortOrder: order,
    });
  }
}

async function migrateTestimonials() {
  console.log(`\n→ Importing ${site.voices.reviews.length} testimonials...`);
  await db.delete(testimonials);
  let order = 0;
  for (const r of site.voices.reviews) {
    order += 10;
    await db.insert(testimonials).values({
      quote: r.quote,
      couple: r.couple,
      place: r.place,
      date: r.date,
      accent: r.accent,
      sortOrder: order,
    });
  }
}

async function migrateFilms() {
  const data = [
    { title: "Tara & Vihaan", location: "Udaipur · Mar 2024", duration: "3:42", poster: "/images/pre-wedding/window-light.jpg", video: "/videos/films.mp4", kind: "feature" as const },
    { title: "Anaya & Ishaan", location: "Jaipur · Dec 2023", duration: "4:18", poster: "/images/wedding/bridal-portrait.jpg", video: "/videos/films.mp4", kind: "feature" as const },
    { title: "Riya & Karthik", location: "Coorg · Feb 2024", duration: "3:01", poster: "/images/pre-wedding/window-light.jpg", video: "/videos/films.mp4", kind: "feature" as const },
    { title: "Meera & Aditya", location: "Udaipur · Nov 2023", duration: "4:45", poster: "/images/wedding/couple-at-mandap.jpg", video: "/videos/films.mp4", kind: "feature" as const },
    { title: "Sneha & Rohan", location: "Goa · Jan 2024", duration: "3:22", poster: "/images/pre-wedding/golden-hour.jpg", video: "/videos/films.mp4", kind: "feature" as const },
    { title: "Sofia & Henri", location: "Goa · Dec 2023", duration: "2:58", poster: "/images/wedding/bride-crimson-gold.jpg", video: "/videos/films.mp4", kind: "feature" as const },
    { title: "Baraat dance", location: "Sneha & Rohan", duration: "0:30", poster: "/images/baraat/horseback.jpg", video: "/videos/films.mp4", kind: "reel" as const },
    { title: "Bridal entry", location: "Tara & Vihaan", duration: "0:45", poster: "/images/wedding/bride-crimson-gold.jpg", video: "/videos/films.mp4", kind: "reel" as const },
    { title: "Haldi laughter", location: "Anaya & Ishaan", duration: "0:30", poster: "/images/haldi/turmeric-splash.jpg", video: "/videos/films.mp4", kind: "reel" as const },
    { title: "Mehndi hands", location: "Riya & Karthik", duration: "0:45", poster: "/images/mehndi/bride-hands.jpg", video: "/videos/films.mp4", kind: "reel" as const },
    { title: "Sangeet number", location: "Meera & Aditya", duration: "0:30", poster: "/images/sangeet/sisters-singing.jpg", video: "/videos/films.mp4", kind: "reel" as const },
    { title: "Pre-wedding kiss", location: "Sofia & Henri", duration: "0:30", poster: "/images/pre-wedding/golden-hour.jpg", video: "/videos/films.mp4", kind: "reel" as const },
  ];
  console.log(`\n→ Uploading ${data.length} films/reels (1 shared video file)...`);
  await db.delete(films);
  let order = 0;
  for (const f of data) {
    order += 10;
    const posterUrl = await uploadLocal(f.poster, "images/films/");
    const videoUrl = await uploadLocal(f.video, "videos/");
    await db.insert(films).values({
      title: f.title,
      location: f.location,
      duration: f.duration,
      posterUrl,
      videoUrl,
      kind: f.kind,
      sortOrder: order,
    });
  }
}

async function migrateSiteSettings() {
  console.log("\n→ Uploading hero/about/cta/film-poster images...");
  // Pre-upload featured media so URLs in the JSON blob are R2 URLs.
  const heroImageUrls = await Promise.all(
    HERO_IMAGES.map((p) => uploadLocal(p, "images/hero/")),
  );
  const heroVideoUrl = await uploadLocal("/videos/hero.mp4", "videos/");
  const aboutImage = await uploadLocal(ABOUT_IMAGE, "images/about/");
  const ctaImage = await uploadLocal(CTA_IMAGE, "images/cta/");
  const filmPoster = await uploadLocal(FILM_POSTER, "images/films/");
  const filmsVideoUrl = await uploadLocal(
    site.films.featuredFilm.videoSrc,
    "videos/",
  );

  const data = {
    ...site,
    // Inject the new R2 URLs at the convenience-field paths used by SiteData.
    heroImages: heroImageUrls,
    heroVideoSrc: heroVideoUrl,
    aboutImage,
    ctaImage,
    filmPoster,
    filmVideoSrc: filmsVideoUrl,
    // Patch the original site.films.featuredFilm.videoSrc field too.
    films: {
      ...site.films,
      featuredFilm: {
        ...site.films.featuredFilm,
        videoSrc: filmsVideoUrl,
      },
    },
  };

  await db.delete(siteSettings);
  await db.insert(siteSettings).values({ data: JSON.stringify(data) });
  console.log("  ✓ siteSettings saved");
}

async function main() {
  console.log(`Migrating to ${process.env.TURSO_DATABASE_URL}`);
  await migrateGallery();
  await migrateInstagram();
  await migrateTestimonials();
  await migrateFilms();
  await migrateSiteSettings();
  console.log("\n✓ Migration complete. Open /admin to review.\n");
}

main().catch((err) => {
  console.error("\nMigration failed:", err);
  process.exit(1);
});
