import Link from "next/link";
import { isDbConfigured } from "@/lib/db/client";
import { isR2Configured } from "@/lib/blob/r2";
import { isAuthConfigured } from "@/lib/auth/session";

export default function AdminDashboard() {
  const checks = [
    { label: "Database (Turso)", ok: isDbConfigured, env: "TURSO_DATABASE_URL / TURSO_AUTH_TOKEN" },
    { label: "Image storage (Cloudflare R2)", ok: isR2Configured, env: "R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY / R2_BUCKET / R2_PUBLIC_URL" },
    { label: "Session encryption", ok: isAuthConfigured(), env: "SESSION_SECRET (≥32 chars)" },
    { label: "Admin password", ok: !!process.env.ADMIN_PASSWORD, env: "ADMIN_PASSWORD" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Edit anything below — changes go live within ~60 seconds.
        </p>
      </header>

      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
          System status
        </h2>
        <ul className="space-y-2">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-3">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    c.ok ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-neutral-900">{c.label}</span>
              </span>
              {!c.ok && (
                <code className="rounded bg-red-50 px-2 py-0.5 text-xs text-red-700">
                  Set {c.env}
                </code>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { href: "/admin/settings", label: "Site Settings", sub: "All text content — hero, about, services, contact, footer, SEO." },
          { href: "/admin/gallery", label: "Gallery Photos", sub: "Upload, retag, reorder, delete." },
          { href: "/admin/films", label: "Films & Reels", sub: "Featured films and short reels." },
          { href: "/admin/instagram", label: "Instagram Posts", sub: "12 mock IG tiles." },
          { href: "/admin/testimonials", label: "Testimonials", sub: "Couple reviews in the Voices carousel." },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm"
          >
            <div className="text-base font-medium text-neutral-900">{card.label}</div>
            <p className="mt-1 text-sm text-neutral-500">{card.sub}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
