import "server-only";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Trim defensively — Vercel env var pastes sometimes include trailing
// newlines or surrounding quotes that break the libsql client silently.
const url = (process.env.TURSO_DATABASE_URL ?? "").trim().replace(/^['"]|['"]$/g, "");
const authToken = (process.env.TURSO_AUTH_TOKEN ?? "").trim().replace(/^['"]|['"]$/g, "");

export const isDbConfigured = url.length > 0;

const libsql = isDbConfigured
  ? createClient({ url, authToken })
  : // Stub client so module-load doesn't throw before user configures env.
    // All callers should check `isDbConfigured` before issuing queries.
    (null as unknown as ReturnType<typeof createClient>);

export const db = libsql ? drizzle(libsql, { schema }) : null;
