/**
 * Run pending drizzle migrations against Turso, bootstrapping the
 * migration meta table if it doesn't exist yet.
 *
 * Bootstrap logic: when this script first runs on an existing Turso DB
 * that already has the schema applied via `drizzle-kit push`, blindly
 * running migrations would fail with "table already exists". We detect
 * the case by checking whether the production tables exist *and*
 * whether `__drizzle_migrations` is empty — if both are true, we
 * pre-seed `__drizzle_migrations` with the current migration list as
 * already-applied, so the migrator can proceed cleanly from here on.
 *
 * Usage:
 *   npm run db:migrate
 */

import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env", override: false });

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createHash } from "node:crypto";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url || !authToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN.");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function tableExists(name: string): Promise<boolean> {
  const r = await client.execute({
    sql: "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
    args: [name],
  });
  return r.rows.length > 0;
}

async function bootstrap() {
  // Tables created by our baseline migration. If they all exist already
  // (because we used `drizzle-kit push` to ship the schema before
  // adopting migrations) we mark the baseline as applied so the migrator
  // doesn't try to recreate them.
  const baselineTables = [
    "site_settings",
    "gallery_photos",
    "instagram_posts",
    "testimonials",
    "films",
    "login_attempts",
    "audit_log",
  ];

  const existing = await Promise.all(baselineTables.map(tableExists));
  const allPresent = existing.every(Boolean);

  // Ensure the meta table exists.
  await client.execute(
    "CREATE TABLE IF NOT EXISTS __drizzle_migrations (id INTEGER PRIMARY KEY, hash TEXT NOT NULL, created_at INTEGER)",
  );
  const meta = await client.execute("SELECT COUNT(*) as n FROM __drizzle_migrations");
  const metaEmpty = Number((meta.rows[0]?.n as number | string) ?? 0) === 0;

  if (allPresent && metaEmpty) {
    // Pre-seed each migration as already applied. Hash matches what the
    // drizzle migrator computes (SHA-256 of the .sql contents).
    const dir = resolve(process.cwd(), "drizzle");
    const sqlFiles = readdirSync(dir)
      .filter((f) => f.endsWith(".sql"))
      .sort();
    for (const f of sqlFiles) {
      const contents = readFileSync(join(dir, f), "utf8");
      const hash = createHash("sha256").update(contents).digest("hex");
      await client.execute({
        sql: "INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)",
        args: [hash, Date.now()],
      });
      console.log(`  ↳ marked ${f} as already applied (bootstrap).`);
    }
    console.log("Bootstrap complete. Future migrations will run normally.");
    return;
  }
}

async function main() {
  console.log(`Migrating ${new URL(url!).host}...`);
  await bootstrap();

  const db = drizzle(client);
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ Migrations up to date.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
