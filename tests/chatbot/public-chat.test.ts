import { describe, it, expect } from "vitest";
import { answer } from "@/lib/public-chat";
import type { SiteData } from "@/lib/types";

// Minimal SiteData shape — only the fields the chatbot reads.
const ctx = {
  site: {
    studio: {
      name: "Test Studio",
      monogram: "T·S",
      bio: "A studio.",
      established: 2012,
    },
    contact: {
      email: "hello@test.com",
      phoneDisplay: "+91 99999 99999",
      whatsappDisplay: "+91 99999 99999",
      whatsappLink: "https://wa.me/919999999999",
      locations: ["Mumbai", "Goa"],
      coverage: "Across India.",
      responseTime: "48 hours",
    },
    services: {
      items: [
        { no: "01", name: "Wedding", blurb: "Full day.", time: "12 hrs" },
        { no: "02", name: "Haldi", blurb: "Morning ritual.", time: "Morning" },
      ],
    },
    social: {
      instagram: { handle: "@test", url: "https://instagram.com/test" },
    },
    voices: {
      reviews: [{ quote: "Loved it", couple: "A & B", place: "Goa", date: "2024", accent: "plum" }],
      aggregate: { rating: "5.0", count: "100+" },
    },
    contactSection: {
      availability: [{ day: "Sat", date: "Mar 14", status: "open" }],
      bookingStatus: { year: "2026", remaining: 4, next: "2027 opens in March." },
    },
    about: { founders: [{ name: "Arjun", role: "Lead", bio: "" }] },
  } as unknown as SiteData,
};

describe("public chatbot answer()", () => {
  it("greets", () => {
    const r = answer("hi", ctx);
    expect(JSON.stringify(r)).toMatch(/Test Studio/);
  });

  it("answers 'what do you cover' from live services", () => {
    const r = answer("what do you cover", ctx);
    const text = JSON.stringify(r);
    expect(text).toMatch(/Wedding/);
    expect(text).toMatch(/Haldi/);
  });

  it("routes 'pricing' and links to #contact", () => {
    const r = answer("pricing", ctx);
    const text = JSON.stringify(r);
    expect(text).toMatch(/custom/i);
    expect(text).toMatch(/#contact/);
  });

  it("recognises a city the studio covers", () => {
    const r = answer("are you available in goa", ctx);
    expect(JSON.stringify(r)).toMatch(/Goa/);
  });

  it("explains booking flow with the configured response time", () => {
    const r = answer("how do i book", ctx);
    const text = JSON.stringify(r);
    expect(text).toMatch(/48 hours/);
    expect(text).toMatch(/#contact/);
  });

  it("answers availability with remaining count from settings", () => {
    const r = answer("dates left", ctx);
    expect(JSON.stringify(r)).toMatch(/4 dates/);
  });

  it("falls back to contact info on nonsense", () => {
    const r = answer("xyzzy plover", ctx);
    expect(JSON.stringify(r)).toMatch(/hello@test\.com/);
  });

  it("recognises ceremony names", () => {
    const r = answer("tell me about mehndi", ctx);
    expect(JSON.stringify(r)).toMatch(/henna|mehndi/i);
  });

  it("answers rain plan", () => {
    const r = answer("what's your rain plan", ctx);
    expect(JSON.stringify(r)).toMatch(/rain/i);
  });
});
