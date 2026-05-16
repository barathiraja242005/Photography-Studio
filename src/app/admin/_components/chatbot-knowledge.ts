/**
 * Shared, single-source-of-truth knowledge tables for both the base
 * chatbot rules and the content suggesters. Anything that's a list of
 * canonical values (gallery tags, ceremony names, target cities, style
 * keywords) lives here.
 */

export const GALLERY_TAGS = [
  "Wedding",
  "Pre-Wedding",
  "Haldi",
  "Mehndi",
  "Sangeet",
  "Baraat",
  "Maternity",
] as const;

export type GalleryTag = (typeof GALLERY_TAGS)[number];

/**
 * Ceremonies the chatbot understands as a topic. Used by alt-text,
 * blurb, IG caption, and IG hashtag intents. Lower-case so query
 * matching can use simple string includes.
 */
export const CEREMONIES = [
  "wedding",
  "haldi",
  "mehndi",
  "sangeet",
  "baraat",
  "pre-wedding",
  "maternity",
] as const;

export type Ceremony = (typeof CEREMONIES)[number];

/**
 * Cities the SEO suggester checks against when the user types something
 * like "seo title for goa". Distinct from the studio's own
 * contact.locations — these are common Indian wedding-destination
 * cities the studio probably *could* cover.
 */
export const COMMON_CITIES = [
  "udaipur",
  "jaipur",
  "goa",
  "delhi",
  "bengaluru",
  "mumbai",
  "chennai",
  "kolkata",
  "hyderabad",
  "coorg",
  "kerala",
  "rajasthan",
] as const;

/**
 * Visual / editorial style keywords the SEO suggester can thread into
 * title and description variants.
 */
export const STYLE_KEYWORDS = [
  "candid",
  "editorial",
  "destination",
  "film",
  "luxury",
  "intimate",
  "cinematic",
] as const;

export function detectCeremony(q: string): Ceremony | null {
  return (CEREMONIES.find((c) => q.includes(c)) ?? null) as Ceremony | null;
}

export function detectStyle(q: string): string | null {
  return STYLE_KEYWORDS.find((k) => q.includes(k)) ?? null;
}
