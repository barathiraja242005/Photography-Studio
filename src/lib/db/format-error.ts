/**
 * Unwrap a libsql/drizzle error to surface the *real* reason. libsql throws
 * a wrapper "Failed query" error whose underlying cause carries the actual
 * message (auth, network, schema, etc.) — useful for debugging when a
 * deploy doesn't behave.
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
