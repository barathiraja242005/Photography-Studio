import type { MetadataRoute } from "next";

/**
 * Served at /robots.txt at build time.
 * Update the host URL when you deploy to a real domain.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://as.photography";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Don't index API routes if/when added
        disallow: ["/api/", "/admin", "/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
