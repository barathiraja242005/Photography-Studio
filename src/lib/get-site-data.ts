import "server-only";
import { revalidatePath } from "next/cache";

import { db, isDbConfigured } from "@/lib/db/client";
import {
  galleryPhotos,
  instagramPosts,
  testimonials as testimonialsTable,
  films as filmsTable,
  siteSettings,
} from "@/lib/db/schema";
import { asc, desc } from "drizzle-orm";

import { site as fallbackSite } from "@/config/site";
import {
  ABOUT_IMAGE,
  CTA_IMAGE,
  FILM_POSTER,
  GALLERY as FALLBACK_GALLERY,
  HERO_IMAGES,
  IG_POSTS as FALLBACK_IG_POSTS,
  IG_STORIES as FALLBACK_IG_STORIES,
  INSTAGRAM as FALLBACK_INSTAGRAM_GRID,
  TESTIMONIAL_AVATARS,
  type GalleryTag,
} from "@/lib/images";

import type { SiteData } from "@/lib/types";

// ── Static fallback (matches Films.tsx FILMS+REELS arrays) ────────
const FALLBACK_FILMS: SiteData["filmList"] = [
  { title: "Tara & Vihaan", location: "Udaipur · Mar 2024", duration: "3:42", poster: FILM_POSTER, videoSrc: "/videos/films.mp4", kind: "feature" },
  { title: "Anaya & Ishaan", location: "Jaipur · Dec 2023", duration: "4:18", poster: "/images/wedding/bridal-portrait.jpg", videoSrc: "/videos/films.mp4", kind: "feature" },
  { title: "Riya & Karthik", location: "Coorg · Feb 2024", duration: "3:01", poster: "/images/pre-wedding/window-light.jpg", videoSrc: "/videos/films.mp4", kind: "feature" },
  { title: "Meera & Aditya", location: "Udaipur · Nov 2023", duration: "4:45", poster: "/images/wedding/couple-at-mandap.jpg", videoSrc: "/videos/films.mp4", kind: "feature" },
  { title: "Sneha & Rohan", location: "Goa · Jan 2024", duration: "3:22", poster: "/images/pre-wedding/golden-hour.jpg", videoSrc: "/videos/films.mp4", kind: "feature" },
  { title: "Sofia & Henri", location: "Goa · Dec 2023", duration: "2:58", poster: "/images/wedding/bride-crimson-gold.jpg", videoSrc: "/videos/films.mp4", kind: "feature" },
  { title: "Baraat dance", location: "Sneha & Rohan", duration: "0:30", poster: "/images/baraat/horseback.jpg", videoSrc: "/videos/films.mp4", kind: "reel" },
  { title: "Bridal entry", location: "Tara & Vihaan", duration: "0:45", poster: "/images/wedding/bride-crimson-gold.jpg", videoSrc: "/videos/films.mp4", kind: "reel" },
  { title: "Haldi laughter", location: "Anaya & Ishaan", duration: "0:30", poster: "/images/haldi/turmeric-splash.jpg", videoSrc: "/videos/films.mp4", kind: "reel" },
  { title: "Mehndi hands", location: "Riya & Karthik", duration: "0:45", poster: "/images/mehndi/bride-hands.jpg", videoSrc: "/videos/films.mp4", kind: "reel" },
  { title: "Sangeet number", location: "Meera & Aditya", duration: "0:30", poster: "/images/sangeet/sisters-singing.jpg", videoSrc: "/videos/films.mp4", kind: "reel" },
  { title: "Pre-wedding kiss", location: "Sofia & Henri", duration: "0:30", poster: "/images/pre-wedding/golden-hour.jpg", videoSrc: "/videos/films.mp4", kind: "reel" },
];

function buildFallback(): SiteData {
  return {
    ...fallbackSite,
    heroImages: [...HERO_IMAGES],
    heroVideoSrc: "/videos/hero.mp4",
    aboutImage: ABOUT_IMAGE,
    ctaImage: CTA_IMAGE,
    filmPoster: FILM_POSTER,
    filmVideoSrc: fallbackSite.films.featuredFilm.videoSrc,
    gallery: FALLBACK_GALLERY.map((g) => ({
      src: g.src,
      alt: g.alt,
      tag: g.tag,
      h: g.h,
    })),
    instagramGrid: [...FALLBACK_INSTAGRAM_GRID],
    igPosts: [...FALLBACK_IG_POSTS],
    igStories: [...FALLBACK_IG_STORIES],
    testimonialAvatars: [...TESTIMONIAL_AVATARS],
    filmList: FALLBACK_FILMS,
  };
}

export async function getSiteData(): Promise<SiteData> {
  if (!isDbConfigured || !db) return buildFallback();

  try {
    const [settingsRows, galleryRows, igRows, testimonialRows, filmRows] =
      await Promise.all([
        db
          .select()
          .from(siteSettings)
          .orderBy(desc(siteSettings.id))
          .limit(1),
        db.select().from(galleryPhotos).orderBy(asc(galleryPhotos.sortOrder), asc(galleryPhotos.id)),
        db.select().from(instagramPosts).orderBy(asc(instagramPosts.sortOrder), asc(instagramPosts.id)),
        db.select().from(testimonialsTable).orderBy(asc(testimonialsTable.sortOrder), asc(testimonialsTable.id)),
        db.select().from(filmsTable).orderBy(asc(filmsTable.sortOrder), asc(filmsTable.id)),
      ]);

    const base = buildFallback();

    // Settings JSON blob — merged over the fallback so missing fields keep
    // their default values.
    let parsed: Partial<typeof fallbackSite> = {};
    if (settingsRows[0]) {
      try {
        parsed = JSON.parse(settingsRows[0].data);
      } catch {
        parsed = {};
      }
    }

    return {
      ...base,
      ...parsed,
      gallery:
        galleryRows.length > 0
          ? galleryRows.map((r) => ({
              src: r.imageUrl,
              alt: r.alt,
              tag: r.tag as GalleryTag,
              h: r.height,
            }))
          : base.gallery,
      igPosts:
        igRows.length > 0
          ? igRows.map((r) => ({
              src: r.imageUrl,
              caption: r.caption,
              likes: r.likes,
              comments: r.comments,
              plays: r.plays ?? undefined,
              kind: (r.kind === "reel" ? "reel" : "post") as "post" | "reel",
            }))
          : base.igPosts,
      instagramGrid:
        igRows.length > 0
          ? igRows.slice(0, 6).map((r) => r.imageUrl)
          : base.instagramGrid,
      voices:
        testimonialRows.length > 0
          ? {
              ...base.voices,
              reviews: testimonialRows.map((r) => ({
                quote: r.quote,
                couple: r.couple,
                place: r.place,
                date: r.date,
                accent: r.accent as "plum" | "terracotta" | "jade" | "ruby",
              })),
            }
          : base.voices,
      filmList:
        filmRows.length > 0
          ? filmRows.map((r) => ({
              title: r.title,
              location: r.location,
              duration: r.duration,
              poster: r.posterUrl,
              videoSrc: r.videoUrl,
              kind: (r.kind === "reel" ? "reel" : "feature") as "feature" | "reel",
            }))
          : base.filmList,
    };
  } catch (err) {
    // Log message only, not the full Error chain — libsql causes contain
    // host/transport details that don't belong in Vercel function logs.
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[db] getSiteData failed, using fallback:", message);
    return buildFallback();
  }
}

/**
 * Call after an admin write to push fresh data to all visitors.
 * Invalidates the homepage's static cache so the next request re-fetches.
 */
export function revalidateSiteData() {
  revalidatePath("/");
}
