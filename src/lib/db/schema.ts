import {
  sqliteTable,
  text,
  integer,
  real,
} from "drizzle-orm/sqlite-core";

/**
 * Site settings — single row. All of site.ts's "text content" lives here as
 * a JSON blob so we can evolve fields without DB migrations. The TypeScript
 * type for `data` is `Site` (from src/config/site.ts).
 */
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // JSON-stringified snapshot of the entire site config.
  data: text("data").notNull(),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/**
 * Gallery photos — the portfolio bento grid.
 */
export const galleryPhotos = sqliteTable("gallery_photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  alt: text("alt").notNull(),
  tag: text("tag").notNull(),
  height: integer("height").notNull().default(6),
  sortOrder: integer("sort_order").notNull().default(100),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/**
 * Instagram posts shown in the mock IG section.
 */
export const instagramPosts = sqliteTable("instagram_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageUrl: text("image_url").notNull(),
  caption: text("caption").notNull(),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  plays: integer("plays"),
  kind: text("kind").notNull().default("post"), // "post" | "reel"
  sortOrder: integer("sort_order").notNull().default(100),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/**
 * Testimonials shown in the Voices carousel.
 */
export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quote: text("quote").notNull(),
  couple: text("couple").notNull(),
  place: text("place").notNull().default(""),
  date: text("date").notNull().default(""),
  accent: text("accent").notNull().default("plum"), // plum|terracotta|jade|ruby
  sortOrder: integer("sort_order").notNull().default(100),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

/**
 * Films & reels.
 */
export const films = sqliteTable("films", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  location: text("location").notNull().default(""),
  duration: text("duration").notNull().default(""),
  posterUrl: text("poster_url").notNull(),
  videoUrl: text("video_url").notNull(),
  kind: text("kind").notNull().default("feature"), // "feature" | "reel"
  sortOrder: integer("sort_order").notNull().default(100),
  createdAt: text("created_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
});

export type GalleryPhotoRow = typeof galleryPhotos.$inferSelect;
export type InstagramPostRow = typeof instagramPosts.$inferSelect;
export type TestimonialRow = typeof testimonials.$inferSelect;
export type FilmRow = typeof films.$inferSelect;
export type SiteSettingsRow = typeof siteSettings.$inferSelect;

// `real` is exported just to keep drizzle-kit happy if we add float columns later.
void real;
