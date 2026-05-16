import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Chatbot } from "./_components/Chatbot";

export const metadata: Metadata = {
  title: "Admin · A S Photography",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/films", label: "Films" },
  { href: "/admin/instagram", label: "Instagram" },
  { href: "/admin/testimonials", label: "Testimonials" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-invoke-path") || h.get("x-pathname") || "";
  const isLogin = pathname.endsWith("/admin/login");

  if (isLogin) return <main className="min-h-screen bg-neutral-50">{children}</main>;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r border-neutral-200 bg-white p-5 md:flex">
        <Link
          href="/admin"
          className="mb-8 block font-semibold tracking-tight text-neutral-900"
        >
          A · S Admin
        </Link>
        <nav className="flex flex-col gap-1 text-sm">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded px-3 py-2 text-neutral-700 hover:bg-neutral-100"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <form action="/api/admin/logout" method="post" className="mt-auto">
          <button
            type="submit"
            formMethod="POST"
            className="w-full rounded border border-neutral-200 px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100"
          >
            Sign out
          </button>
        </form>
        <Link
          href="/"
          target="_blank"
          className="mt-3 rounded px-3 py-2 text-center text-xs text-neutral-500 hover:bg-neutral-100"
        >
          View site ↗
        </Link>
      </aside>
      <main className="md:pl-60">
        <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
      </main>
      <Chatbot />
    </div>
  );
}
