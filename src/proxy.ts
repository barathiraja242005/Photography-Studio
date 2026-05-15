import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SESSION_COOKIE, type AdminSession } from "@/lib/auth/session";

// Protect everything under /admin EXCEPT /admin/login.
export const config = {
  matcher: ["/admin/:path*"],
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  // No SESSION_SECRET configured → block admin entirely with a clear message.
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    return new NextResponse(
      "Admin disabled: set SESSION_SECRET (>=32 chars) in .env.local. Generate one with `openssl rand -hex 32`.",
      { status: 503, headers: { "content-type": "text/plain" } },
    );
  }

  // Use a Response object so iron-session can read/write the cookie.
  const res = NextResponse.next();
  const session = await getIronSession<AdminSession>(req.cookies as never, sessionOptions);
  if (!session.isAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return res;
}

// Suppress unused-import lint when middleware isn't bundled with these tokens.
void SESSION_COOKIE;
