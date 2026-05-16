import "server-only";
import { desc, sql } from "drizzle-orm";
import { db, isDbConfigured } from "@/lib/db/client";
import { siteSettings } from "@/lib/db/schema";
import { SettingsSchema, type SettingsInput } from "@/lib/db/settings-schema";
import { audit } from "@/lib/audit";

const SETTINGS_BYTES_LIMIT = 200_000;

export type SettingsResult =
  | { ok: true; data: unknown; version: number }
  | { ok: false; status: number; error: string; issues?: unknown };

/**
 * Read the latest settings row.
 */
export async function readSettings(): Promise<SettingsResult> {
  if (!isDbConfigured || !db) {
    return { ok: false, status: 503, error: "Database not configured." };
  }
  const rows = await db
    .select()
    .from(siteSettings)
    .orderBy(desc(siteSettings.id))
    .limit(1);
  const row = rows[0];
  if (!row) {
    return { ok: true, data: null, version: 0 };
  }
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(row.data);
  } catch {
    parsed = null;
  }
  return { ok: true, data: parsed, version: row.version };
}

export type SaveInput = {
  body: unknown;
  expectedVersion: number | null;
  actor: string;
};

/**
 * Save settings with:
 *  - zod validation
 *  - size cap (200 KB after JSON encode)
 *  - optimistic locking against expectedVersion
 *  - transactional delete+insert so we never blank the row
 *  - audit log entry on success
 *
 * Returns a SettingsResult; the route handler decides the HTTP status.
 */
export async function saveSettings({ body, expectedVersion, actor }: SaveInput): Promise<SettingsResult> {
  if (!isDbConfigured || !db) {
    return { ok: false, status: 503, error: "Database not configured." };
  }

  const parsed = SettingsSchema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      error: "Invalid settings payload.",
      issues: parsed.error.issues.slice(0, 5),
    };
  }

  const json = JSON.stringify(parsed.data as SettingsInput);
  if (json.length > SETTINGS_BYTES_LIMIT) {
    return { ok: false, status: 400, error: "Payload too large." };
  }

  // Read current version inside the transaction; if it doesn't match what
  // the client believes is the latest, reject with 409 so the client can
  // refetch and re-apply their edits. We accept null/0 as "first ever write".
  let nextVersion = 1;
  try {
    await db.transaction(async (tx) => {
      const current = await tx
        .select({ version: siteSettings.version })
        .from(siteSettings)
        .orderBy(desc(siteSettings.id))
        .limit(1);
      const currentVersion = current[0]?.version ?? 0;
      if (expectedVersion !== null && expectedVersion !== currentVersion) {
        throw new ConflictError(currentVersion);
      }
      nextVersion = currentVersion + 1;

      await tx.delete(siteSettings);
      await tx.insert(siteSettings).values({
        data: json,
        version: nextVersion,
        updatedBy: actor,
      });
    });
  } catch (err) {
    if (err instanceof ConflictError) {
      return {
        ok: false,
        status: 409,
        error: `Settings have been modified since you loaded them (current v${err.currentVersion}). Reload and re-apply your edits.`,
      };
    }
    throw err;
  }

  await audit("settings.update", "settings", actor, {
    from: expectedVersion,
    to: nextVersion,
    bytes: json.length,
  });

  return { ok: true, data: parsed.data, version: nextVersion };
}

/**
 * Internal — thrown inside the transaction so we can roll back cleanly
 * and return a 409 to the client. Not exported.
 */
class ConflictError extends Error {
  constructor(public currentVersion: number) {
    super("version conflict");
  }
}

// Silence unused-import warning while keeping sql available for future
// row-counting / optimisation calls.
void sql;
