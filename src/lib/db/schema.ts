import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";

/**
 * Site settings — single row. All of site.ts's "text content" lives here as
 * a JSON blob so we can evolve fields without DB migrations.
 *
 * `version` is bumped on every successful write and is used for optimistic
 * locking: clients GET the row, hold onto the version, send it back on PUT,
 * and the server rejects with 409 if it doesn't match. This is the minimum
 * mechanism that prevents two concurrent admin sessions from silently
 * overwriting each other.
 */
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // JSON-stringified snapshot of the entire site config.
  data: text("data").notNull(),
  // Bumped by 1 on every successful PUT. Compared by clients to detect
  // stale-edit conflicts.
  version: integer("version").notNull().default(1),
  updatedAt: text("updated_at")
    .notNull()
    .$defaultFn(() => new Date().toISOString()),
  updatedBy: text("updated_by"),
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

/**
 * Login attempts — used to rate-limit /api/admin/login. The rate-limit
 * handler reads recent rows for an IP, so the composite index makes that
 * lookup an index seek instead of a table scan.
 */
export const loginAttempts = sqliteTable(
  "login_attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ip: text("ip").notNull(),
    success: integer("success", { mode: "boolean" }).notNull().default(false),
    attemptedAt: integer("attempted_at").notNull().$defaultFn(() => Date.now()),
  },
  (t) => [index("login_attempts_ip_time_idx").on(t.ip, t.attemptedAt)],
);

/**
 * Audit log — append-only record of every admin mutation. Used to answer
 * "who changed what when" and to detect anomalous edit storms.
 *
 *   - action: short verb-noun string ("update.settings", "create.gallery",
 *     "delete.film", "login.success", "login.failure")
 *   - target: identifier of the affected resource ("settings", "gallery#42")
 *   - actor: IP for now; will become a user id once we have per-user accounts
 *   - meta: small JSON blob with extra context (e.g. version transitioning
 *     from→to, fields changed). Kept under a hard cap by callers.
 */
export const auditLog = sqliteTable(
  "audit_log",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    action: text("action").notNull(),
    target: text("target").notNull(),
    actor: text("actor").notNull(),
    meta: text("meta"),
    occurredAt: integer("occurred_at").notNull().$defaultFn(() => Date.now()),
  },
  (t) => [
    index("audit_log_occurred_idx").on(t.occurredAt),
    index("audit_log_target_idx").on(t.target),
  ],
);

export type GalleryPhotoRow = typeof galleryPhotos.$inferSelect;
export type InstagramPostRow = typeof instagramPosts.$inferSelect;
export type TestimonialRow = typeof testimonials.$inferSelect;
export type FilmRow = typeof films.$inferSelect;
export type SiteSettingsRow = typeof siteSettings.$inferSelect;
export type LoginAttemptRow = typeof loginAttempts.$inferSelect;
export type AuditLogRow = typeof auditLog.$inferSelect;

// `real` is exported just to keep drizzle-kit happy if we add float columns later.
void real;
