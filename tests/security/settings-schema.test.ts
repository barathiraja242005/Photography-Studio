import { describe, it, expect } from "vitest";
import { SettingsSchema } from "@/lib/db/settings-schema";

describe("SettingsSchema", () => {
  it("accepts a minimal valid payload", () => {
    const r = SettingsSchema.safeParse({
      studio: { name: "A·S Photography" },
      seo: { title: "Wedding Photographer", description: "..." },
    });
    expect(r.success).toBe(true);
  });

  it("rejects a non-URL whatsappLink (javascript:)", () => {
    const r = SettingsSchema.safeParse({
      contact: { whatsappLink: "javascript:alert(1)" },
    });
    expect(r.success).toBe(false);
  });

  it("rejects a non-URL whatsappLink (data:)", () => {
    const r = SettingsSchema.safeParse({
      contact: { whatsappLink: "data:text/html,<script>alert(1)</script>" },
    });
    expect(r.success).toBe(false);
  });

  it("accepts an empty whatsappLink", () => {
    const r = SettingsSchema.safeParse({ contact: { whatsappLink: "" } });
    expect(r.success).toBe(true);
  });

  it("rejects oversized string fields", () => {
    const r = SettingsSchema.safeParse({
      studio: { tagline: "x".repeat(600) }, // short cap is 500
    });
    expect(r.success).toBe(false);
  });

  it("rejects too many publications", () => {
    const r = SettingsSchema.safeParse({
      publications: Array.from({ length: 101 }, (_, i) => `Pub${i}`),
    });
    expect(r.success).toBe(false);
  });

  it("rejects invalid hero.headlineLines (not array)", () => {
    const r = SettingsSchema.safeParse({
      hero: { headlineLines: "Wedding" },
    });
    expect(r.success).toBe(false);
  });

  it("rejects invalid testimonial accent colour", () => {
    const r = SettingsSchema.safeParse({
      voices: {
        reviews: [
          { quote: "Loved it", couple: "A&B", accent: "neon-pink" },
        ],
      },
    });
    expect(r.success).toBe(false);
  });

  it("rejects invalid availability status", () => {
    const r = SettingsSchema.safeParse({
      contactSection: {
        availability: [{ day: "Sat", date: "Mar 14", status: "maybe" }],
      },
    });
    expect(r.success).toBe(false);
  });

  it("passes unknown top-level keys through (forward-compat)", () => {
    const r = SettingsSchema.safeParse({
      studio: { name: "S" },
      unknownNewField: "still here",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      // .passthrough() keeps unknown keys.
      expect((r.data as Record<string, unknown>).unknownNewField).toBe("still here");
    }
  });
});
