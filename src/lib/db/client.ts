import "server-only";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const url = process.env.TURSO_DATABASE_URL ?? "";
const authToken = process.env.TURSO_AUTH_TOKEN ?? "";

export const isDbConfigured = url.length > 0;

const libsql = isDbConfigured
  ? createClient({ url, authToken })
  : // Stub client so module-load doesn't throw before user configures env.
    // All callers should check `isDbConfigured` before issuing queries.
    (null as unknown as ReturnType<typeof createClient>);

export const db = libsql ? drizzle(libsql, { schema }) : null;
