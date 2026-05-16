/**
 * Specialised content suggesters for the admin chatbot:
 *  - SEO title + meta description (length-aware, location-aware)
 *  - Open Graph (share-preview) title + description
 *  - JSON-LD ProfessionalService schema generated from live settings
 *  - Instagram caption + hashtag bundles by ceremony
 *  - Inquiry response template (three voices)
 *  - Paste-a-title analyser (length, keyword check, suggested rewrite)
 *  - Site readiness checklist that reads current settings and flags gaps
 *
 * All rule handlers receive the same Ctx as in chatbot-rules.ts. The
 * suggesterRules export is appended to the main rule list there.
 */

import type { BotPart, Rule, SiteData } from "./chatbot-rules";
import { capitalizeWord, includes } from "./chatbot-rules";
import {
  COMMON_CITIES,
  detectCeremony as detectCeremonyShared,
  detectStyle as detectStyleShared,
} from "./chatbot-knowledge";

// ─── SEO context ────────────────────────────────────────────────

const SEO_TITLE_IDEAL = { min: 50, max: 60, hardMax: 65 };
const SEO_DESC_IDEAL = { min: 140, max: 160, hardMax: 165 };

function titleStatus(len: number): { tag: string; sweet: boolean } {
  if (len < 30) return { tag: `${len} chars — too short`, sweet: false };
  if (len < SEO_TITLE_IDEAL.min) return { tag: `${len} chars — short, OK`, sweet: false };
  if (len <= SEO_TITLE_IDEAL.max) return { tag: `${len} chars — ideal`, sweet: true };
  if (len <= SEO_TITLE_IDEAL.hardMax) return { tag: `${len} chars — at the edge`, sweet: false };
  return { tag: `${len} chars — Google will truncate`, sweet: false };
}

function descStatus(len: number): { tag: string; sweet: boolean } {
  if (len < 100) return { tag: `${len} chars — too short`, sweet: false };
  if (len < SEO_DESC_IDEAL.min) return { tag: `${len} chars — short, OK`, sweet: false };
  if (len <= SEO_DESC_IDEAL.max) return { tag: `${len} chars — ideal`, sweet: true };
  if (len <= SEO_DESC_IDEAL.hardMax) return { tag: `${len} chars — at the edge`, sweet: false };
  return { tag: `${len} chars — Google will truncate`, sweet: false };
}

// Local re-exports — STYLE_KEYWORDS + COMMON_CITIES + the detect* helpers
// live in chatbot-knowledge.ts (single source of truth).

type SeoCtx = {
  studio: string;
  tagline: string;
  primaryCity: string;
  cities: string[];
  established: string;
  bio: string;
  email: string;
  phoneDisplay: string;
  phoneTel: string;
  responseTime: string;
  socialUrls: string[];
  address: { line1: string; city: string; pincode: string };
  hours: string;
  seoTitle: string;
  seoDescription: string;
};

function readSeoCtx(site: SiteData | null): SeoCtx {
  const studioObj = (site?.studio as Record<string, unknown>) ?? {};
  const contactObj = (site?.contact as Record<string, unknown>) ?? {};
  const seoObj = (site?.seo as Record<string, unknown>) ?? {};
  const socialObj = (site?.social as Record<string, Record<string, unknown>>) ?? {};
  const addr = (contactObj.address as Record<string, unknown>) ?? {};
  const cities = (contactObj.locations as string[] | undefined)?.filter((c) => typeof c === "string" && c.length > 0) ?? [];
  const socialUrls = Object.values(socialObj)
    .map((s) => s?.url)
    .filter((u): u is string => typeof u === "string" && u.startsWith("http"));
  return {
    studio: (studioObj.name as string) || "A S Photography",
    tagline: (studioObj.tagline as string) || "Wedding Photography",
    primaryCity: cities[0] || "India",
    cities,
    established: studioObj.established ? String(studioObj.established) : "",
    bio: (studioObj.bio as string) || "",
    email: (contactObj.email as string) || "",
    phoneDisplay: (contactObj.phoneDisplay as string) || "",
    phoneTel: (contactObj.phoneTel as string) || "",
    responseTime: (contactObj.responseTime as string) || "Replies in 48h",
    socialUrls,
    address: {
      line1: (addr.line1 as string) || "",
      city: (addr.city as string) || "",
      pincode: (addr.pincode as string) || "",
    },
    hours: (contactObj.hours as string) || "",
    seoTitle: (seoObj.title as string) || "",
    seoDescription: (seoObj.description as string) || "",
  };
}

function detectCity(q: string, ctx: SeoCtx): string {
  const fromList = ctx.cities.find((c) => q.includes(c.toLowerCase()));
  if (fromList) return fromList;
  const hit = COMMON_CITIES.find((c) => q.includes(c));
  if (hit) return capitalizeWord(hit);
  return ctx.primaryCity;
}

const detectStyle = detectStyleShared;
const detectCeremony = detectCeremonyShared;

// ─── SEO title variants ──────────────────────────────────────────

function seoTitleVariants(q: string, ctx: SeoCtx): string[] {
  const city = detectCity(q, ctx);
  const style = detectStyle(q);
  const adj = style ? capitalizeWord(style) : "Candid";
  const yr = ctx.established ? ` · Since ${ctx.established}` : "";
  return Array.from(
    new Set<string>([
      `Wedding Photographer in ${city} | ${ctx.studio}`,
      `${adj} Wedding Photography in ${city} — ${ctx.studio}`,
      `${ctx.studio} · ${adj} Indian Wedding Photography`,
      `Best Wedding Photographers in ${city}${yr} — ${ctx.studio}`,
      `Destination Wedding Photographers in India · ${ctx.studio}`,
      `${ctx.studio} | ${ctx.tagline} in ${city}`,
    ]),
  );
}

function seoDescriptionVariants(q: string, ctx: SeoCtx): string[] {
  const city = detectCity(q, ctx);
  const style = detectStyle(q) ?? "candid";
  const since = ctx.established ? ` since ${ctx.established}` : "";
  return [
    `${capitalizeWord(style)} wedding photography studio in ${city}. Indian weddings told slowly — haldi, mehndi, sangeet, baraat, and the vows. Available across India and worldwide.`,
    `${ctx.studio} — ${style} wedding photographers in ${city}${since}. Pre-weddings, ceremonies, and editorial albums kept as heirloom. Enquire for a custom quote.`,
    `Looking for a wedding photographer in ${city}? ${ctx.studio} captures candid, editorial Indian weddings — every ritual, every quiet moment. Booking 2026–2027.`,
    `${ctx.studio} is a ${city}-based wedding photography studio working across India and abroad. Cinematic films, editorial albums, two photographers on every wedding.`,
  ];
}

const titleRationales = [
  "Location-led — leads with the keyword Google uses for local searches.",
  "Style + location — captures long-tail queries like 'candid wedding photographer Mumbai'.",
  "Brand-first — best when you have direct/brand traffic and want recognition.",
  "Social proof — 'Best' + year reinforces credibility (only use if it's actually true).",
  "Destination angle — for couples in city A planning a wedding in city B.",
  "Tagline-anchored — most personal; use when your tagline is a strong differentiator.",
];

const descRationales = [
  "Front-loads keywords + lists ceremony types — strong long-tail coverage.",
  "Brand-led with credibility ('since X') + clear call-to-action.",
  "Conversational ('Looking for…?') — matches voice-search intent.",
  "Highlights deliverables (films, albums) and team — useful for service-page descriptions.",
];

// ─── Open Graph (share preview) ─────────────────────────────────

function ogTitleVariants(q: string, ctx: SeoCtx): string[] {
  const city = detectCity(q, ctx);
  return [
    `${ctx.studio} — Indian Wedding Photography`,
    `Stories from Indian Weddings · ${ctx.studio}`,
    `${ctx.tagline}, told slowly · ${ctx.studio}`,
    `${ctx.studio} | ${city} & Beyond`,
  ];
}

function ogDescriptionVariants(q: string, ctx: SeoCtx): string[] {
  const since = ctx.established ? ` Since ${ctx.established}.` : "";
  return [
    `Candid, editorial Indian weddings — every haldi, every vow, every quiet moment kept as a heirloom.${since}`,
    `${ctx.studio} photographs Indian weddings across India and worldwide. Two photographers, editorial albums, no awkward poses.`,
    `Booking 2026–2027. We take a small number of weddings each season so each one stays personal. DM to enquire.`,
  ];
}

// ─── Instagram caption + hashtag generator ───────────────────────

type Captions = { short: string[]; medium: string[]; long: string[] };

const IG_CAPTIONS: Record<string, Captions> = {
  wedding: {
    short: ["The kind of day you don't want to end.", "Vows kept, joy kept too.", "Where two families became one."],
    medium: [
      "A wedding is hours of preparation for minutes of magic — and we live for those minutes.\nTara & Vihaan, the quiet moment before the pheras.",
      "The pheras, the laughter, the second glance — every chapter held its breath, and we held the frame.",
    ],
    long: [
      "There's a stillness right before the pheras — the priest pauses, the families lean in, and even the cameras stop clicking. We waited for that breath, then pressed the shutter. This is what an Indian wedding looks like when you let it unfold instead of staging it.",
    ],
  },
  haldi: {
    short: ["Sunlight, turmeric, and zero seriousness.", "The warmest morning of the year."],
    medium: [
      "Haldi mornings are pure light — yellow on yellow, laughter on laughter. Anaya didn't stop smiling for two hours.",
      "Turmeric, sunlight, and the people who've loved you the longest. Nothing else gets a shot like this.",
    ],
    long: [
      "Haldi is the ritual no one rehearses. The aunties come armed with intention, the cousins with strategy. By the end the bride looks like a sunrise and everyone smells like the kitchen. We just kept the camera rolling.",
    ],
  },
  mehndi: {
    short: ["Hours of stillness, lifetimes in ink.", "Quiet, considered, intricate."],
    medium: [
      "Mehndi is the slowest ritual of the wedding — and the most patient. Riya sat for four hours and barely moved. The henna kept moving for her.",
    ],
    long: [
      "Look closely and you'll find the groom's name hidden in the bride's palm — it's tradition, and it's also a tiny puzzle for the camera. We love mehndi for the long, unstaged quiet of it. The afternoon stretches, the songs get softer, the henna gets darker.",
    ],
  },
  sangeet: {
    short: ["Choreographed numbers, unchoreographed nani-dancing.", "Pure noise. Pure joy."],
    medium: [
      "By the time the sangeet ends, three generations of one family have danced together. We don't know any other event that does that.",
    ],
    long: [
      "The cousins rehearsed for weeks. The nani didn't rehearse at all. She also stole the show. Sangeet is what happens when an Indian family decides joy is a competitive sport.",
    ],
  },
  baraat: {
    short: ["He's here.", "Dhol, friends, and one very patient horse."],
    medium: [
      "The groom's arrival is half ceremony, half stadium entrance. We try to be everywhere at once — we mostly succeed.",
    ],
    long: [
      "Baraats are unphotographable, technically — too much movement, too much music, too many uncles. So we stop trying to compose anything and just let the chaos write itself onto the frame. This is one of those frames.",
    ],
  },
  "pre-wedding": {
    short: ["Before everything. Just the two of you.", "The story before the story."],
    medium: [
      "We photographed Sneha & Rohan in Goa, six months before their wedding. No mandap, no aunties, just the version of them that exists when no one else is watching.",
    ],
    long: [
      "Pre-weddings are our favourite secret — the rare hour in the run-up where the couple isn't worrying about a guest list. We pick a place that matters to them, we walk, we talk, we take pictures. That's the whole shoot.",
    ],
  },
  maternity: {
    short: ["A quiet portrait, between then and now.", "The pause before everything changes."],
    medium: [
      "Maternity sessions are mostly slow — soft fabric, soft light, fewer words than usual. The photos don't need to do much; the moment already does it.",
    ],
    long: [
      "We've started photographing more maternity sessions this year. They're shorter than a wedding and quieter than a pre-wedding. The thing we keep noticing is how present the couple is — there's nothing to perform, only something to anticipate.",
    ],
  },
};

const HASHTAGS = {
  // ~30 hashtags max per post (Instagram's effective limit).
  // Layer by reach so you can mix high-traffic with discoverable niche.
  mega: ["#weddingphotography", "#indianwedding", "#bridetobe", "#weddinginspiration"],
  high: ["#candidphotography", "#indianbride", "#weddingphotographer", "#indianweddingphotography", "#weddingdiaries"],
  niche: ["#southasianwedding", "#desibride", "#bigfatindianwedding", "#weddingsutra", "#wedmegood", "#shaadisaga", "#brideandgroom"],
  editorial: ["#editorialwedding", "#filmweddings", "#vogueindia", "#bridestoday"],
  ceremonyPrefix: {
    wedding: ["#hindubride", "#hinduwedding", "#weddingvows", "#mandap"],
    haldi: ["#haldiceremony", "#haldifunction", "#turmericceremony"],
    mehndi: ["#mehendiceremony", "#bridalmehndi", "#henna", "#henneddesign"],
    sangeet: ["#sangeetceremony", "#sangeetnight", "#bollywood"],
    baraat: ["#baraatdance", "#groomentry", "#dulhaaaya"],
    "pre-wedding": ["#preweddingshoot", "#prewedding", "#couplephotography"],
    maternity: ["#maternityshoot", "#maternityportrait"],
  } as Record<string, string[]>,
};

function hashtagsFor(ceremony: string | null, city: string): string[] {
  const base = [...HASHTAGS.mega, ...HASHTAGS.high, ...HASHTAGS.niche, ...HASHTAGS.editorial];
  const ceremonyTags = ceremony ? HASHTAGS.ceremonyPrefix[ceremony] ?? [] : [];
  const cityClean = city.toLowerCase().replace(/[^a-z]/g, "");
  const localTags = cityClean
    ? [`#${cityClean}wedding`, `#${cityClean}weddingphotographer`, `#${cityClean}bride`]
    : [];
  // 30 total, dedup, leading with the most relevant (ceremony + local), then niche, then mega.
  const combined: string[] = [];
  const seen = new Set<string>();
  for (const t of [...ceremonyTags, ...localTags, ...HASHTAGS.niche, ...HASHTAGS.editorial, ...HASHTAGS.high, ...HASHTAGS.mega, ...base]) {
    if (seen.has(t)) continue;
    seen.add(t);
    combined.push(t);
    if (combined.length >= 30) break;
  }
  return combined;
}

// ─── Inquiry response templates ──────────────────────────────────

function inquiryTemplates(ctx: SeoCtx): { label: string; body: string }[] {
  return [
    {
      label: "Warm — for a couple who shared their story",
      body:
        `Hi {couple-name},\n\n` +
        `Thank you for writing in — and congratulations! I loved reading about your plans for {venue/season}; ` +
        `it sounds like the kind of day we'd love to be part of.\n\n` +
        `A few quick questions so we can put together a thoughtful quote:\n` +
        `  1. What's the wedding date (or window)?\n` +
        `  2. Approximate guest count and venues for each function?\n` +
        `  3. Which ceremonies would you like covered (haldi / mehndi / sangeet / wedding / reception)?\n` +
        `  4. Is video coverage on the table, or photo only?\n\n` +
        `Our portfolio is at our site (link in signature) and we usually reply with a full quote within ${ctx.responseTime.toLowerCase()}.\n\n` +
        `Warmly,\n${ctx.studio}`,
    },
    {
      label: "Professional — clear, structured, lead-qualifying",
      body:
        `Hello {couple-name},\n\n` +
        `Thank you for the enquiry. ${ctx.studio} works with around 18–24 couples per season, ` +
        `so each enquiry gets a personalised quote.\n\n` +
        `To prepare yours, could you share:\n` +
        `  • Wedding date(s) and city\n` +
        `  • Venues per function\n` +
        `  • Ceremonies to be covered\n` +
        `  • Expected guest count\n` +
        `  • Any specific deliverables (album, films, drone, social-media reels)\n\n` +
        `We'll respond within ${ctx.responseTime.toLowerCase()} with a tailored package and sample work from a similar wedding.\n\n` +
        `Regards,\n${ctx.studio}\n${ctx.phoneDisplay}\n${ctx.email}`,
    },
    {
      label: "Quick acknowledgement — for inbox triage",
      body:
        `Hi {couple-name} — thanks for reaching out! We've got your message and will reply with a full quote within ${ctx.responseTime.toLowerCase()}. In the meantime, our portfolio is at our website (link in signature). — ${ctx.studio}`,
    },
  ];
}

// ─── Title analyser ──────────────────────────────────────────────

function analyseTitle(title: string, ctx: SeoCtx): { score: number; checks: string[]; rewrite: string | null } {
  const t = title.trim();
  const checks: string[] = [];
  let score = 0;
  const max = 6;

  const len = t.length;
  if (len >= SEO_TITLE_IDEAL.min && len <= SEO_TITLE_IDEAL.max) {
    checks.push(`✓ Length ${len} chars — in the 50–60 sweet spot.`);
    score++;
  } else if (len > SEO_TITLE_IDEAL.hardMax) {
    checks.push(`✗ Length ${len} chars — Google will truncate (cap is ~60).`);
  } else {
    checks.push(`· Length ${len} chars — outside ideal 50–60.`);
  }

  const lc = t.toLowerCase();
  if (/wedding/.test(lc)) {
    checks.push("✓ Contains 'wedding' — the primary keyword.");
    score++;
  } else {
    checks.push("✗ Missing 'wedding' — strongest single keyword for this niche.");
  }

  if (/(photographer|photography)/.test(lc)) {
    checks.push("✓ Contains 'photographer' or 'photography'.");
    score++;
  } else {
    checks.push("✗ Missing 'photographer' / 'photography' — both Google and people search for this exact word.");
  }

  const citiesHit = [...ctx.cities, ...COMMON_CITIES].some((c) => lc.includes(c.toLowerCase()));
  if (citiesHit) {
    checks.push("✓ Contains a city — strong for local SEO.");
    score++;
  } else {
    checks.push("✗ No city mentioned — add one for local-search ranking.");
  }

  if (lc.includes(ctx.studio.toLowerCase())) {
    checks.push("✓ Contains your studio name — strong for brand searches.");
    score++;
  } else {
    checks.push("· Missing studio name — usually worth including at the end.");
  }

  if (!/[A-Z]{4,}/.test(t.replace(/\b(SEO|UK|US|UAE|EU|IN|CA|AU)\b/g, ""))) {
    checks.push("✓ No all-caps phrases — Google deprioritises shouting.");
    score++;
  } else {
    checks.push("✗ Has an all-caps phrase — usually penalised.");
  }

  // Suggested rewrite (only if score < max, blends a "best practice" title)
  const rewrite = score < max
    ? `Wedding Photographer in ${ctx.primaryCity} | ${ctx.studio}`
    : null;
  return { score: Math.round((score / max) * 10), checks, rewrite };
}

// ─── Site checklist ──────────────────────────────────────────────

type CheckItem = { ok: "🟢" | "🟡" | "🔴"; text: string };

function siteChecklist(ctx: SeoCtx, site: SiteData | null): CheckItem[] {
  const items: CheckItem[] = [];

  const studio = (site?.studio as Record<string, unknown>) ?? {};
  items.push({
    ok: studio.name ? "🟢" : "🔴",
    text: studio.name ? `Studio name set: "${studio.name}".` : "Studio name is empty — set it in Settings → Studio.",
  });
  const bioLen = (studio.bio as string)?.length ?? 0;
  items.push({
    ok: bioLen > 80 ? "🟢" : bioLen > 0 ? "🟡" : "🔴",
    text: bioLen > 80 ? `Studio bio is ${bioLen} chars (good).` : bioLen > 0 ? `Studio bio is only ${bioLen} chars — aim for 80+.` : "Studio bio is empty.",
  });

  items.push({
    ok: ctx.email.includes("@") ? "🟢" : "🔴",
    text: ctx.email ? `Contact email set.` : "Contact email is empty.",
  });
  items.push({
    ok: ctx.phoneDisplay ? "🟢" : "🔴",
    text: ctx.phoneDisplay ? "Contact phone set." : "Contact phone is empty.",
  });
  items.push({
    ok: ctx.cities.length > 0 ? "🟢" : "🔴",
    text: ctx.cities.length > 0 ? `Cities covered: ${ctx.cities.join(", ")}.` : "No cities covered set — needed for local SEO.",
  });

  const titleLen = ctx.seoTitle.length;
  items.push({
    ok: titleLen >= 50 && titleLen <= 60 ? "🟢" : titleLen > 0 ? "🟡" : "🔴",
    text: titleLen === 0 ? "SEO title is empty." : titleLen > 60 ? `SEO title is ${titleLen} chars — Google will truncate.` : titleLen < 30 ? `SEO title is only ${titleLen} chars — too short.` : `SEO title length: ${titleLen} chars.`,
  });
  const descLen = ctx.seoDescription.length;
  items.push({
    ok: descLen >= 140 && descLen <= 160 ? "🟢" : descLen > 0 ? "🟡" : "🔴",
    text: descLen === 0 ? "Meta description is empty." : descLen > 165 ? `Meta description is ${descLen} chars — will truncate.` : descLen < 100 ? `Meta description is only ${descLen} chars — too short.` : `Meta description length: ${descLen} chars.`,
  });

  const services = ((site?.services as { items?: unknown[] })?.items) ?? [];
  items.push({
    ok: services.length >= 4 ? "🟢" : services.length > 0 ? "🟡" : "🔴",
    text: services.length === 0 ? "No services listed." : `${services.length} services listed${services.length < 4 ? " (consider adding more)" : ""}.`,
  });

  const publications = (site?.publications as string[] | undefined) ?? [];
  items.push({
    ok: publications.length >= 4 ? "🟢" : publications.length > 0 ? "🟡" : "🔴",
    text: publications.length === 0 ? "No publications listed in the marquee." : `${publications.length} publications listed.`,
  });

  const footer = (site?.footer as Record<string, unknown>) ?? {};
  const legalLinks = (footer.legalLinks as { label?: string; href?: string }[]) ?? [];
  const realLegal = legalLinks.filter((l) => l.href && l.href !== "#" && l.href.length > 1);
  items.push({
    ok: realLegal.length >= 1 ? "🟢" : "🔴",
    text: realLegal.length === 0 ? "Privacy / Terms links are still '#' placeholders — replace before public launch." : `${realLegal.length} legal link(s) configured.`,
  });

  items.push({
    ok: ctx.socialUrls.length >= 2 ? "🟢" : ctx.socialUrls.length === 1 ? "🟡" : "🔴",
    text: ctx.socialUrls.length === 0 ? "No social URLs set." : `${ctx.socialUrls.length} social URL(s) set.`,
  });

  return items;
}

// ─── Rules ──────────────────────────────────────────────────────

export const suggesterRules: Rule[] = [
  // SEO title
  {
    id: "seo-title",
    score: (q) => {
      if (includes(q, ["seo title", "page title", "meta title", "browser title", "google title", "search title", "title tag", "<title>"])) return 7;
      if (includes(q, ["suggest title", "title suggestion", "title for seo"])) return 6;
      if (/^seo\b/.test(q) && !q.includes("description") && !q.includes("schema") && !q.includes("analyse") && !q.includes("analyze")) return 4;
      return 0;
    },
    handler: (q, ctx) => {
      const sctx = readSeoCtx(ctx.site);
      const variants = seoTitleVariants(q, sctx);
      const city = detectCity(q, sctx);
      const style = detectStyle(q);
      const ranked = variants.map((t, originalIdx) => ({
        title: t,
        len: t.length,
        status: titleStatus(t.length),
        originalIdx,
      })).sort((a, b) => {
        if (a.status.sweet !== b.status.sweet) return a.status.sweet ? -1 : 1;
        return Math.abs(57 - a.len) - Math.abs(57 - b.len);
      });

      const parts: BotPart[] = [{
        kind: "text",
        text: `${ranked.length} title variants, ranked by closeness to Google's 50–60 char window. Targeted ${city}${style ? ` and a "${style}" angle` : ""}.`,
      }];
      for (let i = 0; i < ranked.length; i++) {
        const r = ranked[i];
        parts.push({ kind: "text", text: `${i + 1}. ${r.status.sweet ? "✓" : "·"} ${r.status.tag} — ${titleRationales[r.originalIdx]}` });
        parts.push({ kind: "code", text: r.title });
      }
      parts.push({ kind: "text", text: "Best practice: keyword in first ~30 chars, mention your city, end with studio name. Avoid all-caps, emoji, and clickbait." });

      return {
        parts,
        suggestions: ["Suggest a meta description", "Suggest an OG title", "Analyse my current title", "Site readiness check"],
      };
    },
  },

  // Meta description
  {
    id: "seo-description",
    score: (q) => {
      if (includes(q, ["meta description", "page description", "seo description", "search description", "google description"])) return 7;
      if (includes(q, ["suggest description", "description for seo"])) return 6;
      return 0;
    },
    handler: (q, ctx) => {
      const sctx = readSeoCtx(ctx.site);
      const variants = seoDescriptionVariants(q, sctx);
      const ranked = variants.map((d, originalIdx) => ({
        desc: d,
        len: d.length,
        status: descStatus(d.length),
        originalIdx,
      })).sort((a, b) => {
        if (a.status.sweet !== b.status.sweet) return a.status.sweet ? -1 : 1;
        return Math.abs(150 - a.len) - Math.abs(150 - b.len);
      });
      const parts: BotPart[] = [{ kind: "text", text: `Meta description variants. Target window: 140–160 characters.` }];
      for (let i = 0; i < ranked.length; i++) {
        const r = ranked[i];
        parts.push({ kind: "text", text: `${i + 1}. ${r.status.sweet ? "✓" : "·"} ${r.status.tag} — ${descRationales[r.originalIdx]}` });
        parts.push({ kind: "code", text: r.desc });
      }
      parts.push({ kind: "text", text: "Tip: doesn't directly affect ranking, but it drives click-through. Active voice, name the city, soft CTA at the end." });
      return { parts, suggestions: ["Suggest an SEO title", "Suggest an OG title", "Site readiness check"] };
    },
  },

  // Open Graph (share preview)
  {
    id: "og-share",
    score: (q) => {
      if (includes(q, ["og title", "og description", "open graph", "share preview", "whatsapp preview", "social preview", "link preview"])) return 7;
      return 0;
    },
    handler: (q, ctx) => {
      const sctx = readSeoCtx(ctx.site);
      const titles = ogTitleVariants(q, sctx);
      const descs = ogDescriptionVariants(q, sctx);
      const parts: BotPart[] = [
        { kind: "text", text: "Open Graph is what shows when your link is pasted into WhatsApp / Instagram DM / LinkedIn / Twitter. It can be more emotional and brand-led than the SEO title." },
        { kind: "text", text: "OG titles (target: under ~90 chars so it doesn't wrap):" },
      ];
      for (let i = 0; i < titles.length; i++) {
        parts.push({ kind: "text", text: `${i + 1}. ${titles[i].length} chars` });
        parts.push({ kind: "code", text: titles[i] });
      }
      parts.push({ kind: "text", text: "OG descriptions (target: 90–120 chars so chat apps don't truncate):" });
      for (let i = 0; i < descs.length; i++) {
        parts.push({ kind: "text", text: `${i + 1}. ${descs[i].length} chars` });
        parts.push({ kind: "code", text: descs[i] });
      }
      parts.push({ kind: "text", text: "Paste into Settings → SEO → Open Graph title / description. After saving, re-share the URL in a fresh WhatsApp chat — old chats keep their cached preview for ~24h." });
      return { parts, suggestions: ["Suggest an SEO title", "JSON-LD schema", "Site readiness check"] };
    },
  },

  // JSON-LD schema
  {
    id: "json-ld",
    score: (q) => {
      if (includes(q, ["json-ld", "jsonld", "schema.org", "structured data", "local business schema", "rich results", "google business schema"])) return 7;
      if (q.includes("schema") && q.includes("seo")) return 6;
      return 0;
    },
    handler: (_q, ctx) => {
      const sctx = readSeoCtx(ctx.site);
      const schema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: sctx.studio,
        description: sctx.bio || sctx.seoDescription || sctx.tagline,
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://as.photography",
        ...(sctx.email && { email: sctx.email }),
        ...(sctx.phoneTel && { telephone: sctx.phoneTel }),
        ...((sctx.address.line1 || sctx.address.city) && {
          address: {
            "@type": "PostalAddress",
            ...(sctx.address.line1 && { streetAddress: sctx.address.line1 }),
            ...(sctx.address.city && { addressLocality: sctx.address.city }),
            ...(sctx.address.pincode && { postalCode: sctx.address.pincode }),
            addressCountry: "IN",
          },
        }),
        ...(sctx.cities.length > 0 && {
          areaServed: sctx.cities.map((c) => ({ "@type": "City", name: c })),
        }),
        ...(sctx.socialUrls.length > 0 && { sameAs: sctx.socialUrls }),
        priceRange: "₹₹₹",
        serviceType: "Wedding Photography",
      };
      const block = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
      return {
        parts: [
          { kind: "text", text: "Paste this inside the <head> of your root layout. Google reads it to populate the right-rail business card in search results." },
          { kind: "code", text: block },
          { kind: "text", text: "Verify after deploy: https://search.google.com/test/rich-results?url=<your-site>. Update sameAs and priceRange to match reality." },
        ],
        suggestions: ["Suggest an SEO title", "Site readiness check", "Suggest an OG title"],
      };
    },
  },

  // Instagram caption
  {
    id: "ig-caption",
    score: (q) => {
      if (includes(q, ["instagram caption", "ig caption", "caption for instagram", "post caption", "reel caption"])) return 8;
      // Beat the alt-text rule (which also matches "caption for") when the
      // user names a specific ceremony.
      if (q.includes("caption for") && detectCeremony(q)) return 8;
      return 0;
    },
    handler: (q) => {
      const ceremony = detectCeremony(q) ?? "wedding";
      const c = IG_CAPTIONS[ceremony];
      if (!c) {
        return {
          parts: [
            { kind: "text", text: "Which kind of post? Try:" },
            { kind: "bullets", items: Object.keys(IG_CAPTIONS).map((k) => `'caption for ${k}'`) },
          ],
        };
      }
      const parts: BotPart[] = [
        { kind: "text", text: `${capitalizeWord(ceremony)} caption variants — short / medium / long. Match the format to the post's energy (Reel = short, carousel = medium, single = long).` },
        { kind: "text", text: "Short" },
        ...c.short.map((s) => ({ kind: "code" as const, text: s })),
        { kind: "text", text: "Medium" },
        ...c.medium.map((s) => ({ kind: "code" as const, text: s })),
        { kind: "text", text: "Long (single hero photo)" },
        ...c.long.map((s) => ({ kind: "code" as const, text: s })),
        { kind: "text", text: "End with a soft CTA: 'DM to enquire' or 'Booking 2026'. Avoid hashtags inside the caption — put them in the first comment so the caption stays clean." },
      ];
      return {
        parts,
        suggestions: [`Hashtags for ${ceremony}`, "Suggest an SEO title", `Suggest alt text for ${ceremony}`],
      };
    },
  },

  // Instagram hashtags
  {
    id: "ig-hashtags",
    score: (q) => {
      if (includes(q, ["hashtag", "#tag", "hash tag"])) return 7;
      return 0;
    },
    handler: (q, ctx) => {
      const sctx = readSeoCtx(ctx.site);
      const ceremony = detectCeremony(q);
      const city = detectCity(q, sctx);
      const tags = hashtagsFor(ceremony, city);
      const parts: BotPart[] = [
        { kind: "text", text: `30 hashtags blended across mega / niche / ceremony-specific / local for a ${ceremony ?? "wedding"} post in ${city}.` },
        { kind: "code", text: tags.join(" ") },
        { kind: "text", text: "Drop these into the FIRST COMMENT, not the caption. Mix changes weekly — IG penalises identical hashtag sets across many posts. Swap out 5–10 each post." },
      ];
      return {
        parts,
        suggestions: [`Caption for ${ceremony ?? "wedding"}`, "Different city", "Suggest an SEO title"],
      };
    },
  },

  // Inquiry response template
  {
    id: "inquiry-reply",
    score: (q) => {
      if (includes(q, ["respond to inquiry", "respond to enquiry", "reply to couple", "reply to inquiry", "reply template", "quote email", "inquiry response", "enquiry response", "lead reply"])) return 7;
      if (q.includes("inquiry") || q.includes("enquiry")) return 5;
      return 0;
    },
    handler: (_q, ctx) => {
      const sctx = readSeoCtx(ctx.site);
      const templates = inquiryTemplates(sctx);
      const parts: BotPart[] = [
        { kind: "text", text: "Three reply templates. Replace {couple-name}, {venue/season} with the real details — keeping those placeholders looks worse than no reply." },
      ];
      for (const t of templates) {
        parts.push({ kind: "text", text: t.label });
        parts.push({ kind: "code", text: t.body });
      }
      parts.push({
        kind: "text",
        text: `Send within ${sctx.responseTime.toLowerCase()} — that's what your site promises. Fast replies are the single biggest predictor of booking conversion.`,
      });
      return {
        parts,
        suggestions: ["Suggest a meta description", "Site readiness check", "Caption for wedding"],
      };
    },
  },

  // Title analyser
  {
    id: "title-analyse",
    score: (q) => {
      if (/(analy[sz]e|score|grade|check) (my )?title/.test(q)) return 8;
      if (q.startsWith("title:") || q.startsWith("analyse:") || q.startsWith("analyze:")) return 8;
      return 0;
    },
    handler: (q, ctx) => {
      const sctx = readSeoCtx(ctx.site);
      // Extract the title — accept "analyse title: X" / "score my title: X" / "title: X".
      const m = q.match(/(?:title|analy[sz]e|score|grade|check)[^:]*:\s*(.+)$/i);
      const title = m?.[1]?.trim() ?? "";
      if (!title) {
        return {
          parts: [
            { kind: "text", text: "Paste a title to analyse, e.g.:" },
            { kind: "code", text: "analyse title: Wedding Photographer in Mumbai" },
            { kind: "text", text: "I'll score it on length, keyword coverage, locality, brand, and case." },
          ],
        };
      }
      const a = analyseTitle(title, sctx);
      const parts: BotPart[] = [
        { kind: "text", text: `Analysed: "${title}"` },
        { kind: "text", text: `Overall score: ${a.score}/10` },
        { kind: "bullets", items: a.checks },
      ];
      if (a.rewrite) {
        parts.push({ kind: "text", text: "Suggested rewrite (using your studio + primary city):" });
        parts.push({ kind: "code", text: a.rewrite });
      }
      return {
        parts,
        suggestions: ["Suggest an SEO title", "Suggest a meta description", "Site readiness check"],
      };
    },
  },

  // Site readiness check
  {
    id: "site-check",
    score: (q) => {
      if (includes(q, ["site review", "what's missing", "what is missing", "readiness check", "site check", "audit my site", "pre-launch check", "ready to launch", "what should i fix"])) return 7;
      return 0;
    },
    handler: (_q, ctx) => {
      const sctx = readSeoCtx(ctx.site);
      const items = siteChecklist(sctx, ctx.site);
      const greens = items.filter((i) => i.ok === "🟢").length;
      const reds = items.filter((i) => i.ok === "🔴").length;
      const yellows = items.filter((i) => i.ok === "🟡").length;
      const parts: BotPart[] = [
        { kind: "text", text: `Readiness: 🟢 ${greens}  ·  🟡 ${yellows}  ·  🔴 ${reds}` },
        { kind: "bullets", items: items.map((i) => `${i.ok}  ${i.text}`) },
      ];
      if (reds > 0) {
        parts.push({ kind: "text", text: "Fix the 🔴 items before any commercial launch — empty SEO/Legal/Contact fields hurt both ranking and trust." });
      } else if (yellows > 0) {
        parts.push({ kind: "text", text: "🟡 items are 'works but not optimal'. Address when you have spare time." });
      } else {
        parts.push({ kind: "text", text: "Everything green — you're ready to launch." });
      }
      return {
        parts,
        suggestions: ["Suggest an SEO title", "Suggest a meta description", "JSON-LD schema"],
      };
    },
  },

  // Glossary additions for SEO/OG
  {
    id: "seo-glossary",
    score: (q) => {
      if (!/what (is|does|are) /.test(q)) return 0;
      if (q.includes("seo") || q.includes("meta description") || q.includes("og ") || q.includes("open graph") || q.includes("json-ld") || q.includes("schema")) return 5;
      return 0;
    },
    handler: (q) => {
      if (q.includes("meta description")) {
        return {
          parts: [
            { kind: "text", text: "The 1–2 sentence summary Google shows below your title in search. 140–160 chars is the sweet spot." },
            { kind: "text", text: "Doesn't directly affect ranking, but heavily affects click-through. Active voice, mention your city, soft CTA at the end." },
          ],
          suggestions: ["Suggest a meta description", "What is an SEO title?"],
        };
      }
      if (q.includes("og") || q.includes("open graph")) {
        return {
          parts: [
            { kind: "text", text: "Open Graph title is what shows when your URL is pasted into WhatsApp / Instagram DM / LinkedIn / Twitter. Punchier and more branded than the SEO title." },
            { kind: "text", text: "OG description = the 1-line preview below. Aim for ~90–120 chars so chat apps don't truncate." },
          ],
          suggestions: ["Suggest an OG title", "Suggest an SEO title"],
        };
      }
      if (q.includes("json-ld") || q.includes("schema")) {
        return {
          parts: [
            { kind: "text", text: "JSON-LD is a structured blob in your <head> that tells Google 'I am a photography studio at this address, hours, phone'. Powers the right-side business card in search results." },
            { kind: "text", text: "Ask 'JSON-LD schema' and I'll generate the block from your current settings." },
          ],
          suggestions: ["JSON-LD schema", "Site readiness check"],
        };
      }
      return {
        parts: [
          { kind: "text", text: "SEO = Search Engine Optimisation — making your site rank higher and look more clickable in Google." },
          { kind: "text", text: "Levers you control from this admin: page title, meta description, headings, alt text, image sizes, JSON-LD. Try 'suggest an SEO title' or 'site readiness check'." },
        ],
        suggestions: ["Suggest an SEO title", "Suggest a meta description", "JSON-LD schema", "Site readiness check"],
      };
    },
  },
];
