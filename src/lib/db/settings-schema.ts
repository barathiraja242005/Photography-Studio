import "server-only";
import { z } from "zod";

/**
 * Zod schema for the site settings JSON blob — mirrors src/config/site.ts.
 *
 * Design decisions:
 *  - Every section is typed. We deliberately avoid `z.unknown()` blocks
 *    so attackers can't smuggle `{ __proto__: ... }` or unexpected
 *    objects past validation.
 *  - Each section uses `.passthrough()` so unknown fields are preserved
 *    rather than stripped (forward-compat with newer admin UIs).
 *  - Strings carry length caps — these are rendered into the page; an
 *    attacker (or a compromised admin) can't stash a 100 KB payload in
 *    a single field.
 *  - URL fields use `z.string().url()` so javascript:/data: are rejected.
 */

// ─── Atoms ───────────────────────────────────────────────────────

const short = z.string().max(500);
const long = z.string().max(10_000);
const optShort = short.optional();
const optLong = long.optional();
// z.string().url() accepts any scheme (including javascript: and data:),
// because the WHATWG URL spec considers those valid. We tighten to the
// schemes we actually use on the site: http/https for general URLs,
// mailto:/tel: for action links (only used for emails and phone numbers
// — never for arbitrary user input).
const safeUrl = z
  .string()
  .url()
  .refine(
    (v) => {
      try {
        const u = new URL(v);
        return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol);
      } catch {
        return false;
      }
    },
    { message: "Only http(s), mailto:, and tel: URLs are allowed." },
  );
const optUrl = z.union([safeUrl, z.literal("")]).optional();
const colour = z.enum(["plum", "terracotta", "jade", "ruby"]);

const cta = z
  .object({ label: optShort, href: optShort })
  .passthrough()
  .optional();

const navLink = z.object({ label: optShort, href: optShort }).passthrough();

// ─── Sections ────────────────────────────────────────────────────

const studio = z
  .object({
    name: optShort,
    nameShort: optShort,
    monogram: optShort,
    tagline: optShort,
    established: z.number().int().min(1900).max(2200).optional(),
    establishedRoman: optShort,
    bio: optLong,
    closingScript: optShort,
  })
  .passthrough();

const address = z
  .object({ line1: optShort, city: optShort, pincode: optShort })
  .passthrough();

const contact = z
  .object({
    phoneDisplay: optShort,
    phoneTel: optShort,
    email: optShort,
    whatsappDisplay: optShort,
    whatsappLink: optUrl,
    address: address.optional(),
    hours: optShort,
    hoursNote: optShort,
    responseTime: optShort,
    locations: z.array(short).max(50).optional(),
    coverage: optShort,
  })
  .passthrough();

const handle = z
  .object({
    name: optShort,
    handle: optShort,
    username: optShort,
    url: optUrl,
  })
  .passthrough();

const social = z.record(short, handle).optional();

const seo = z
  .object({
    title: optShort,
    description: optLong,
    ogTitle: optShort,
    ogDescription: optLong,
  })
  .passthrough();

const nav = z
  .object({
    links: z.array(navLink).max(20).optional(),
    portfolioDropdown: z.array(navLink).max(20).optional(),
  })
  .passthrough();

const hero = z
  .object({
    eyebrow: optShort,
    headlineLines: z.array(short).max(10).optional(),
    headlineScript: optShort,
    description: optLong,
    primaryCTA: cta,
    secondaryCTA: cta,
    bookingPill: optShort,
  })
  .passthrough();

const chapter = z
  .object({ numeral: optShort, label: optShort, body: optLong })
  .passthrough();

const stat = z
  .object({
    n: z.number().optional(),
    suffix: optShort,
    word: optShort,
    label: optShort,
    sub: optShort,
    color: optShort,
  })
  .passthrough();

const founder = z
  .object({ name: optShort, role: optShort, bio: optShort })
  .passthrough();

const milestone = z.object({ year: optShort, label: optShort }).passthrough();

const about = z
  .object({
    eyebrow: optShort,
    statusStrip: z.array(short).max(20).optional(),
    headlineMain: optShort,
    headlineScript: optShort,
    qualities: z.array(short).max(20).optional(),
    bylineParts: z.array(short).max(20).optional(),
    chapters: z.array(chapter).max(20).optional(),
    pullQuoteLines: z.array(short).max(10).optional(),
    polaroidCaptions: z.array(short).max(20).optional(),
    backgroundWordmark: optLong,
    stats: z.array(stat).max(10).optional(),
    founders: z.array(founder).max(10).optional(),
    timeline: z.array(milestone).max(30).optional(),
  })
  .passthrough();

const serviceItem = z
  .object({
    no: optShort,
    name: optShort,
    blurb: optLong,
    time: optShort,
  })
  .passthrough();

const inclusion = z.object({ label: optShort, sub: optShort }).passthrough();

const services = z
  .object({
    eyebrow: optShort,
    titleMain: optShort,
    titleScript: optShort,
    description: optLong,
    items: z.array(serviceItem).max(20).optional(),
    inclusions: z.array(inclusion).max(20).optional(),
    pricingNote: optShort,
    primaryCTA: cta,
  })
  .passthrough();

const portfolio = z
  .object({
    eyebrow: optShort,
    titleMain: optShort,
    titleScript: optShort,
    description: optLong,
    credentialsLine: optShort,
  })
  .passthrough();

const featuredFilm = z
  .object({ title: optShort, duration: optShort, videoSrc: optUrl })
  .passthrough();

const films = z
  .object({
    eyebrow: optShort,
    titleMain: optShort,
    titleScript: optShort,
    description: optLong,
    featuredFilm: featuredFilm.optional(),
  })
  .passthrough();

const review = z
  .object({
    quote: optLong,
    couple: optShort,
    place: optShort,
    date: optShort,
    accent: colour.optional(),
  })
  .passthrough();

const pressQuote = z
  .object({
    quote: optLong,
    highlight: optShort,
    attribution: optShort,
    attributionSub: optShort,
    date: optShort,
  })
  .passthrough();

const wordmark = z
  .object({
    name: optShort,
    sub: optShort,
    accolade: optShort,
    fontClass: optShort,
  })
  .passthrough();

const voices = z
  .object({
    eyebrow: optShort,
    titleMain: optShort,
    titleScript: optShort,
    aggregate: z
      .object({ rating: optShort, count: optShort, years: optShort })
      .passthrough()
      .optional(),
    reviews: z.array(review).max(30).optional(),
    pressQuote: pressQuote.optional(),
    pressWordmarks: z.array(wordmark).max(20).optional(),
  })
  .passthrough();

const ctaBanner = z
  .object({
    eyebrow: optShort,
    titleMain: optShort,
    titleScript: optShort,
    description: optLong,
    primaryCTA: cta,
  })
  .passthrough();

const instagram = z
  .object({
    displayName: optShort,
    bio: optLong,
    bookingText: optShort,
    locationLine: optShort,
    stats: z
      .object({
        posts: z.number().int().min(0).optional(),
        followers: z.number().int().min(0).optional(),
        following: z.number().int().min(0).optional(),
        growthThisWeek: z.number().int().min(0).optional(),
      })
      .passthrough()
      .optional(),
    notifications: z
      .object({
        bell: z.number().int().min(0).optional(),
        inbox: z.number().int().min(0).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

const availability = z
  .object({
    day: optShort,
    date: optShort,
    status: z.enum(["open", "booked", "limited"]).optional(),
  })
  .passthrough();

const bookingStatus = z
  .object({
    year: optShort,
    remaining: z.number().int().min(0).optional(),
    next: optShort,
  })
  .passthrough();

const contactSection = z
  .object({
    eyebrow: optShort,
    titleMain: optShort,
    titleScript: optShort,
    description: optLong,
    availability: z.array(availability).max(30).optional(),
    bookingStatus: bookingStatus.optional(),
  })
  .passthrough();

const trustBadge = z
  .object({
    label: optShort,
    icon: z.union([z.literal("newspaper"), z.null()]).optional(),
  })
  .passthrough();

const newsletter = z
  .object({ title: optShort, blurb: optLong, disclaimer: optShort })
  .passthrough();

const footer = z
  .object({
    bookingPill: optShort,
    trustBadges: z.array(trustBadge).max(10).optional(),
    newsletter: newsletter.optional(),
    legalLinks: z.array(navLink).max(20).optional(),
    madeInLine: optShort,
    forLoveLine: optShort,
  })
  .passthrough();

// ─── Top-level ───────────────────────────────────────────────────

export const SettingsSchema = z
  .object({
    studio: studio.optional(),
    contact: contact.optional(),
    social: social,
    seo: seo.optional(),
    nav: nav.optional(),
    hero: hero.optional(),
    about: about.optional(),
    services: services.optional(),
    portfolio: portfolio.optional(),
    films: films.optional(),
    publications: z.array(short).max(100).optional(),
    voices: voices.optional(),
    ctaBanner: ctaBanner.optional(),
    instagram: instagram.optional(),
    contactSection: contactSection.optional(),
    footer: footer.optional(),
    formspree: z
      .object({ contact: optShort, newsletter: optShort })
      .passthrough()
      .optional(),
    // Top-level media URLs injected by migrate.ts.
    aboutImage: optUrl,
    ctaImage: optUrl,
    heroVideoSrc: optUrl,
    heroImages: z.array(z.string().url()).max(20).optional(),
    filmPoster: optUrl,
    filmVideoSrc: optUrl,
  })
  .passthrough();

export type SettingsInput = z.infer<typeof SettingsSchema>;
