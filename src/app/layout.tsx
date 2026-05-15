import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
  Tangerine,
} from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { getSiteData } from "@/lib/get-site-data";

// Font weights pared down to only those used by the site (verified via audit).
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["italic", "normal"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const tangerine = Tangerine({
  variable: "--font-tangerine",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Pull the R2 public origin from env so we can preconnect to it for images.
const R2_ORIGIN = (() => {
  const url = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
  try {
    return url ? new URL(url).origin : null;
  } catch {
    return null;
  }
})();

export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData();
  return {
    title: data.seo.title,
    description: data.seo.description,
    openGraph: {
      title: data.seo.ogTitle,
      description: data.seo.ogDescription,
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jakarta.variable} ${tangerine.variable} h-full antialiased`}
    >
      <head>
        {R2_ORIGIN && (
          <>
            <link rel="preconnect" href={R2_ORIGIN} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={R2_ORIGIN} />
          </>
        )}
      </head>
      <body className="min-h-full bg-bg text-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
