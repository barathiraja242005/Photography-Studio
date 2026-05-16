/**
 * Unwrap a libsql/drizzle error to surface the *real* reason. libsql throws
 * a wrapper "Failed query" error whose underlying cause carries the actual
 * message (auth, network, schema, etc.) — useful when a deploy misbehaves.
 *
 * Reserved for server logs only — never include the result in an HTTP
 * response body, even an admin-only one. Use `safeDbError` for client-facing
 * responses, which redacts to a generic string in production.
 */
export function formatDbError(err: unknown): string {
  const parts: string[] = [];
  let e: unknown = err;
  while (e) {
    if (e instanceof Error) {
      const code = (e as { code?: string }).code;
      parts.push(`${e.name}${code ? ` [${code}]` : ""}: ${e.message}`);
      e = (e as { cause?: unknown }).cause;
    } else {
      parts.push(String(e));
      break;
    }
  }
  return parts.join("  ↳  ");
}

/**
 * Client-safe error message. In production this collapses to a generic
 * string regardless of the underlying error — internal DB topology,
 * driver versions, and error codes must not reach the browser.
 *
 * The full chain is logged server-side via `console.error` so Vercel
 * function logs retain the detail for debugging.
 */
export function safeDbError(err: unknown, label = "Database error."): string {
  const full = formatDbError(err);
  console.error(`[db] ${label} ${full}`);
  if (process.env.NODE_ENV === "production") {
    return label;
  }
  return full;
}
