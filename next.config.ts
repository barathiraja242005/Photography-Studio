import type { NextConfig } from "next";

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
