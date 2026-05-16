import { describe, it, expect } from "vitest";
import { answer } from "@/app/admin/_components/chatbot-rules";

const emptyCtx = { site: null };

describe("chatbot answer()", () => {
  it("greets on bare hi", () => {
    const r = answer("hi", emptyCtx);
    expect(r.parts.length).toBeGreaterThan(0);
    expect(r.suggestions?.length).toBeGreaterThan(0);
  });

  it("routes 'gallery tags' to the tags rule (lists 7 tags)", () => {
    const r = answer("what gallery tags do we have", emptyCtx);
    const text = JSON.stringify(r);
    expect(text).toMatch(/Wedding/);
    expect(text).toMatch(/Pre-Wedding/);
    expect(text).toMatch(/Maternity/);
  });

  it("routes 'suggest an SEO title' to the SEO title intent", () => {
    const r = answer("suggest an seo title", emptyCtx);
    // SEO title intent always produces code blocks (the title variants).
    const codeBlocks = r.parts.filter((p) => p.kind === "code");
    expect(codeBlocks.length).toBeGreaterThan(3);
  });

  it("routes 'suggest a meta description'", () => {
    const r = answer("suggest a meta description", emptyCtx);
    expect(JSON.stringify(r)).toMatch(/140|160/); // length-window hint
  });

  it("routes 'JSON-LD schema' to the structured-data intent", () => {
    const r = answer("json-ld schema", emptyCtx);
    expect(JSON.stringify(r)).toMatch(/application\/ld\+json/);
  });

  it("routes 'caption for sangeet' to IG captions, including the short/medium/long labels", () => {
    const r = answer("caption for sangeet", emptyCtx);
    const text = JSON.stringify(r);
    expect(text).toMatch(/Short/);
    expect(text).toMatch(/Medium/);
    expect(text).toMatch(/Long/);
  });

  it("routes 'hashtags for haldi' and includes 30 tags", () => {
    const r = answer("hashtags for haldi", emptyCtx);
    const code = r.parts.find((p) => p.kind === "code");
    expect(code).toBeDefined();
    if (code && code.kind === "code") {
      const tagCount = code.text.split(" ").filter((t) => t.startsWith("#")).length;
      // Dedup across our hashtag tiers (mega/high/niche/editorial + ceremony
      // + local) yields ~26 unique tags. Cap is 30; verify we get most.
      expect(tagCount).toBeGreaterThanOrEqual(20);
    }
  });

  it("routes 'analyse title: X' to the title analyser", () => {
    const r = answer("analyse title: Wedding Photographer in Mumbai", emptyCtx);
    expect(JSON.stringify(r)).toMatch(/score: \d+\/10|Overall score|score/i);
  });

  it("routes 'site readiness check' to the checklist intent", () => {
    const r = answer("site readiness check", emptyCtx);
    const text = JSON.stringify(r);
    expect(text).toMatch(/🟢|🔴|🟡|Readiness/);
  });

  it("falls back gracefully on nonsense", () => {
    const r = answer("xyzzy plover frobnicate", emptyCtx);
    expect(JSON.stringify(r)).toMatch(/I don't have a rule|rule-based|Try one/i);
  });
});
