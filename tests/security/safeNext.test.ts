import { describe, it, expect } from "vitest";

/**
 * Mirrors the safeNext() in src/app/admin/login/page.tsx — it's defined
 * inside a "use client" file which we can't import here without a JSX
 * runtime, so we duplicate the rule. Keep the regex in sync.
 */
function safeNext(raw: string | null): string {
  if (!raw) return "/admin";
  if (!/^\/[^/\\]/.test(raw)) return "/admin";
  if (!raw.startsWith("/admin")) return "/admin";
  return raw;
}

describe("safeNext()", () => {
  it("accepts a legitimate admin path", () => {
    expect(safeNext("/admin/settings")).toBe("/admin/settings");
    expect(safeNext("/admin/gallery")).toBe("/admin/gallery");
  });

  it("rejects an open-redirect protocol-relative URL", () => {
    expect(safeNext("//evil.tld/admin")).toBe("/admin");
    expect(safeNext("//attacker")).toBe("/admin");
  });

  it("rejects an absolute URL", () => {
    expect(safeNext("https://evil.tld/admin")).toBe("/admin");
    expect(safeNext("http://localhost:3000/admin")).toBe("/admin");
  });

  it("rejects backslash trick", () => {
    expect(safeNext("/\\evil")).toBe("/admin");
  });

  it("rejects paths outside /admin", () => {
    expect(safeNext("/")).toBe("/admin");
    expect(safeNext("/public-page")).toBe("/admin");
  });

  it("returns /admin for null/undefined/empty", () => {
    expect(safeNext(null)).toBe("/admin");
    expect(safeNext("")).toBe("/admin");
  });
});
