import type { NextConfig } from "next";

/**
 * Content-Security-Policy.
 *  - 'unsafe-inline' on script-src: Next.js inlines small hydration scripts
 *    and a flight payload. Nonces are the proper fix but require wiring
 *    through next.config + middleware; for now this stays permissive on
 *    script but tight everywhere else.
 *  - 'unsafe-inline' on style-src: framer-motion sets inline transform styles
 *    every animation frame; Tailwind ships static stylesheets but next/image
 *    emits inline width/height/aspect-ratio styles.
 *  - img-src: R2 public host + R2 S3 host + Unsplash (used for some
 *    placeholder content). data: for tiny inline blur placeholders.
 *  - media-src: R2 hosts for the hero/cta/films videos.
 *  - connect-src: 'self' for API + formspree.io for the contact form
 *    (formspree posts go directly from the browser).
 *  - frame-ancestors: 'none' is redundant with X-Frame-Options DENY but
 *    closes the gap in browsers that ignore the legacy header.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.r2.dev https://*.r2.cloudflarestorage.com https://images.unsplash.com https://plus.unsplash.com",
  "media-src 'self' https://*.r2.dev https://*.r2.cloudflarestorage.com",
  "font-src 'self' data:",
  "connect-src 'self' https://formspree.io",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://formspree.io",
  "object-src 'none'",
].join("; ");

/**
 * Security headers applied to every route.
 * Standards: OWASP secure-headers + web.dev recommendations.
 */
const securityHeaders = [
  // Don't allow the site to be framed by other origins (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // Don't sniff MIME types — trust the Content-Type response header.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send only the origin (not the full URL) when navigating to external sites.
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Deny browser APIs the site doesn't need.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Force HTTPS for 2 years (production only — has no effect on http://localhost).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Disable legacy XSS auditor (0 = off; modern CSP is the recommended replacement).
  { key: "X-XSS-Protection", value: "0" },
  // Defence-in-depth against rendered XSS, mixed-content, and clickjacking.
  { key: "Content-Security-Policy", value: CSP },
  // Cross-origin isolation: prevent other windows from interacting with ours.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Prevent other origins from embedding our resources.
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Restrict which remote image hosts <Image> may proxy from.
  images: {
    // Serve AVIF first (much smaller than JPEG/WebP), fall back to WebP.
    formats: ["image/avif", "image/webp"],
    // Cache transformed images at the edge for a year — they're immutable.
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Apply security headers to every response.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
