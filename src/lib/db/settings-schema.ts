import "server-only";
import { z } from "zod";

/**
 * Permissive zod schema for the site settings JSON blob. Mirrors the shape
 * of src/config/site.ts but accepts unknown fields (passthrough) so an older
 * admin UI editing a newer config doesn't strip data on save.
 *
 * The point of this schema is **not** to enforce business correctness — the
 * admin UI handles that. The point is to:
 *
 *  1. Reject obvious garbage (a string where an object should be, an array
 *     where a string should be) before it lands in the DB.
 *  2. Force string fields to be strings, not arbitrary JSON values that
 *     could later be rendered raw into the page.
 *  3. Cap string lengths so a compromised admin session can't store a 199 KB
 *     payload into a single field.
 *
 * Strings carry an upper-bound length, since these are rendered into the
 * page as text. URL fields use z.string().url() so malformed schemes
 * (javascript:, data:) are rejected from the get-go.
 */

const shortText = z.string().max(500);
const longText = z.string().max(10_000);
const optUrl = z.union([z.string().url(), z.literal("")]).optional();
const optStr = shortText.optional();

const cta = z
  .object({
    label: optStr,
    href: optStr,
  })
  .passthrough()
  .optional();

const link = z
  .object({
    label: optStr,
    href: optStr,
  })
  .passthrough();

export const SettingsSchema = z
  .object({
    studio: z
      .object({
        name: optStr,
        nameShort: optStr,
        monogram: optStr,
        tagline: optStr,
        established: z.number().int().min(1900).max(2200).optional(),
        establishedRoman: optStr,
        bio: longText.optional(),
        closingScript: optStr,
      })
      .passthrough()
      .optional(),
    contact: z
      .object({
        phoneDisplay: optStr,
        phoneTel: optStr,
        email: optStr,
        whatsappDisplay: optStr,
        whatsappLink: optUrl,
        address: z
          .object({
            line1: optStr,
            city: optStr,
            pincode: optStr,
          })
          .passthrough()
          .optional(),
        hours: optStr,
        hoursNote: optStr,
        responseTime: optStr,
        locations: z.array(shortText).max(50).optional(),
        coverage: optStr,
      })
      .passthrough()
      .optional(),
    social: z
      .record(
        shortText,
        z
          .object({
            name: optStr,
            handle: optStr,
            username: optStr,
            url: optUrl,
          })
          .passthrough(),
      )
      .optional(),
    seo: z
      .object({
        title: optStr,
        description: longText.optional(),
        ogTitle: optStr,
        ogDescription: longText.optional(),
      })
      .passthrough()
      .optional(),
    nav: z
      .object({
        links: z.array(link).max(20).optional(),
        portfolioDropdown: z.array(link).max(20).optional(),
      })
      .passthrough()
      .optional(),
    hero: z
      .object({
        eyebrow: optStr,
        headlineLines: z.array(shortText).max(10).optional(),
        headlineScript: optStr,
        description: longText.optional(),
        primaryCTA: cta,
        secondaryCTA: cta,
        bookingPill: optStr,
      })
      .passthrough()
      .optional(),
    about: z.unknown().optional(),
    services: z.unknown().optional(),
    portfolio: z.unknown().optional(),
    films: z.unknown().optional(),
    publications: z.array(shortText).max(100).optional(),
    voices: z.unknown().optional(),
    ctaBanner: z.unknown().optional(),
    instagram: z.unknown().optional(),
    contactSection: z.unknown().optional(),
    footer: z.unknown().optional(),
    formspree: z
      .object({
        contact: optStr,
        newsletter: optStr,
      })
      .passthrough()
      .optional(),
    // Top-level media URL fields injected by migrate.ts
    aboutImage: optUrl,
    ctaImage: optUrl,
    heroVideoSrc: optUrl,
    heroImages: z.array(z.string().url()).max(20).optional(),
    filmPoster: optUrl,
    filmVideoSrc: optUrl,
  })
  .passthrough();

export type SettingsInput = z.infer<typeof SettingsSchema>;
