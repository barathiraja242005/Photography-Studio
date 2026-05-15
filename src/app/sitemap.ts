import type { MetadataRoute } from "next";

/**
 * Served at /sitemap.xml at build time.
 * Single-page site — one canonical URL.
 * Update SITE_URL via .env.local for production:
 *   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://as.photography";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
