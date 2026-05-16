import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatDbError, safeDbError } from "@/lib/db/format-error";

describe("formatDbError()", () => {
  it("unwraps a chained cause", () => {
    const inner = new Error("real reason: SQLITE_AUTH");
    const wrapped = new Error("Failed query: select ...", { cause: inner });
    const out = formatDbError(wrapped);
    expect(out).toMatch(/Failed query/);
    expect(out).toMatch(/real reason: SQLITE_AUTH/);
  });

  it("handles non-Error causes", () => {
    const err = new Error("outer");
    (err as { cause?: unknown }).cause = "string-cause";
    expect(formatDbError(err)).toMatch(/string-cause/);
  });
});

describe("safeDbError()", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns generic label in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    const err = new Error("LibsqlError SERVER_ERROR: leak details");
    expect(safeDbError(err)).toBe("Database error.");
  });

  it("returns full chain in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const err = new Error("inner detail");
    expect(safeDbError(err)).toMatch(/inner detail/);
  });

  it("always logs to console.error so server logs retain the detail", () => {
    const spy = vi.spyOn(console, "error");
    safeDbError(new Error("trace this"));
    expect(spy).toHaveBeenCalled();
    const arg = String(spy.mock.calls[0]?.[0] ?? "");
    expect(arg).toMatch(/trace this/);
  });
});
