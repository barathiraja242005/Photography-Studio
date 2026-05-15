import "server-only";
import { NextResponse } from "next/server";
import { getSession } from "./session";

/**
 * Wrap an API route handler so it only runs if a valid admin session exists.
 * Returns 401 JSON otherwise.
 */
export function withAdmin<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response> | Response,
) {
  return async (...args: Args): Promise<Response> => {
    const session = await getSession();
    if (!session.isAdmin) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
    }
    return handler(...args);
  };
}
