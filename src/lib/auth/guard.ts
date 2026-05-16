import "server-only";
import { NextResponse } from "next/server";
import { getSession, isAuthConfigured } from "./session";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Same-origin check for mutating requests. Defends against CSRF: even with
 * sameSite=strict on the session cookie, multipart/form-data uploads are
 * CORS-simple, so browsers may attach the cookie on top-level form posts.
 * Rejecting cross-origin Origin/Referer closes that path.
 *
 * Allows the request if:
 *  - The method is GET/HEAD/OPTIONS (no body mutation), OR
 *  - Origin matches the request host, OR
 *  - Origin is missing AND Referer matches host, OR
 *  - Neither header is present (some same-origin programmatic requests).
 *    Combined with the session cookie requirement this is acceptable —
 *    a cross-origin attack page cannot strip Origin from the browser.
 */
function isSameOrigin(req: Request): boolean {
  if (!MUTATING_METHODS.has(req.method)) return true;

  const host = req.headers.get("host");
  if (!host) return true; // local dev / direct invocation; let it through.

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }
  // Neither Origin nor Referer — browsers always send at least one on
  // cross-origin form submissions, so absence is consistent with same-origin
  // programmatic calls (e.g. fetch from same-origin client code).
  return true;
}

/**
 * Wrap an API route handler so it only runs if:
 *  1. SESSION_SECRET is configured (returns 503 otherwise).
 *  2. A valid admin session cookie is present (returns 401 otherwise).
 *  3. The request is same-origin for mutating methods (returns 403 otherwise).
 *
 * For Next.js App Router route handlers, the first arg is always the Request.
 */
export function withAdmin<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response> | Response,
) {
  return async (...args: Args): Promise<Response> => {
    if (!isAuthConfigured()) {
      return NextResponse.json(
        { error: "SESSION_SECRET not configured." },
        { status: 503 },
      );
    }

    const req = args[0] as unknown;
    if (req instanceof Request && !isSameOrigin(req)) {
      return NextResponse.json(
        { error: "Cross-origin request rejected." },
        { status: 403 },
      );
    }

    const session = await getSession();
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
    }
    return handler(...args);
  };
}
