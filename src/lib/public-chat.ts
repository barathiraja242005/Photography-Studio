/**
 * Rule-based chat for the public site. Different scope from the admin
 * helper: this one is for visitors (couples enquiring about a wedding),
 * not the studio owner. Tone matches the site copy — slow, candid,
 * editorial. No LLM, no API calls.
 *
 * Data comes from the same SiteData passed via SiteProvider — services,
 * contact info, availability, location list, social links, response
 * time. Where settings are empty we fall back to defaults that match
 * the studio's voice.
 */

import type { SiteData } from "@/lib/types";

export type BotPart =
  | { kind: "text"; text: string }
  | { kind: "bullets"; items: string[] }
  | { kind: "link"; href: string; label: string };

export type BotResponse = {
  parts: BotPart[];
  suggestions?: string[];
};

type Ctx = { site: SiteData };

type Rule = {
  id: string;
  score: (q: string) => number;
  handler: (q: string, ctx: Ctx) => BotResponse;
};

function lc(s: string): string {
  return s.toLowerCase();
}
function includesAny(q: string, needles: string[]): boolean {
  return needles.some((n) => q.includes(n));
}

const CEREMONIES = ["wedding", "haldi", "mehndi", "sangeet", "baraat", "pre-wedding", "maternity"] as const;
function detectCeremony(q: string): string | null {
  return CEREMONIES.find((c) => q.includes(c)) ?? null;
}

// ─── Rules ──────────────────────────────────────────────────────

const rules: Rule[] = [
  {
    id: "greeting",
    score: (q) =>
      /^(hi|hello|hey|hola|namaste|good (morning|afternoon|evening))\b/.test(q) ? 5 : 0,
    handler: (_q, ctx) => ({
      parts: [
        {
          kind: "text",
          text: `Hi! I'm here to answer quick questions about ${ctx.site.studio.name}. Ask about our work, what's covered, how to book, or what dates we have left.`,
        },
      ],
      suggestions: ["What do you cover?", "Pricing?", "Are you available in Goa?", "How do I book?"],
    }),
  },

  // Services / coverage
  {
    id: "services",
    score: (q) =>
      includesAny(q, ["service", "package", "plan", "offering", "cover", "collection", "what do you do"]) ? 5 : 0,
    handler: (_q, ctx) => {
      const items = ctx.site.services?.items ?? [];
      if (items.length === 0) {
        return { parts: [{ kind: "text", text: "We cover the full Indian wedding — haldi, mehndi, sangeet, baraat, wedding, and pre-weddings. Two photographers, editorial albums." }] };
      }
      return {
        parts: [
          { kind: "text", text: "Here's what each of our collections covers:" },
          { kind: "bullets", items: items.map((s) => `${s.name} — ${s.blurb}`) },
          { kind: "text", text: "Every collection includes two photographers, a sneak peek the same week, and a hand-bound editorial album." },
        ],
        suggestions: ["Pricing?", "Do you travel?", "How do I book?"],
      };
    },
  },

  // Pricing
  {
    id: "pricing",
    score: (q) =>
      includesAny(q, ["price", "pricing", "cost", "how much", "quote", "rate", "package start"]) ? 5 : 0,
    handler: (_q, ctx) => ({
      parts: [
        { kind: "text", text: "Every wedding is priced custom — venue, days of coverage, team size, and album choices all matter. We send a tailored quote within 24 hours of receiving your enquiry." },
        { kind: "text", text: `Reach us at ${ctx.site.contact.email} or fill out the contact form below.` },
        { kind: "link", href: "#contact", label: "Open the contact form" },
      ],
      suggestions: ["Are you free in [my city]?", "What's included?", "How do I book?"],
    }),
  },

  // Locations / travel
  {
    id: "travel",
    score: (q) =>
      includesAny(q, ["travel", "destination", "where do you", "where are you", "your city", "available in", "do you cover", "outside", "abroad", "international"]) ? 5 : 0,
    handler: (q, ctx) => {
      const cities = ctx.site.contact.locations ?? [];
      const ceremony = detectCeremony(q);
      const mention = cities.find((c) => q.includes(c.toLowerCase()));
      const parts: BotPart[] = [];
      if (mention) {
        parts.push({ kind: "text", text: `Yes — ${mention} is one of our base cities, so there's no travel surcharge for weddings there.` });
      } else {
        parts.push({ kind: "text", text: `${ctx.site.contact.coverage ?? "We work across India and worldwide."} Our base cities are: ${cities.join(", ") || "Mumbai, Delhi, Bengaluru"}.` });
        parts.push({ kind: "text", text: "For destination weddings elsewhere, we factor travel + accommodation into the quote." });
      }
      if (ceremony) {
        parts.push({ kind: "text", text: `We've shot ${ceremony}s across small towns and big cities — happy to share examples from a similar venue.` });
      }
      return { parts, suggestions: ["How much for a destination wedding?", "How do I book?", "What's covered?"] };
    },
  },

  // Booking flow
  {
    id: "booking",
    score: (q) =>
      includesAny(q, ["how do i book", "how to book", "book you", "reserve", "secure the date", "lock the date", "process", "next step"]) ? 5 : 0,
    handler: (_q, ctx) => ({
      parts: [
        { kind: "text", text: "Three steps:" },
        {
          kind: "bullets",
          items: [
            "Fill out the contact form below with your wedding date, city, and a short note about your plans.",
            `We'll reply within ${ctx.site.contact.responseTime ?? "48 hours"} with a tailored quote + sample work from a similar wedding.`,
            "If we're a fit, a signed agreement + 30% retainer locks the date.",
          ],
        },
        { kind: "link", href: "#contact", label: "Start an enquiry" },
      ],
      suggestions: ["Pricing?", "Are you free in [city]?", "What's included?"],
    }),
  },

  // Availability
  {
    id: "availability",
    score: (q) =>
      includesAny(q, ["available", "availability", "free on", "free for", "open date", "dates left", "still taking"]) ? 5 : 0,
    handler: (_q, ctx) => {
      const cs = ctx.site.contactSection;
      const remaining = cs?.bookingStatus?.remaining;
      const year = cs?.bookingStatus?.year;
      const dates = cs?.availability ?? [];
      const parts: BotPart[] = [];
      if (year && remaining !== undefined) {
        parts.push({ kind: "text", text: `${remaining} dates left in ${year}. ${cs?.bookingStatus?.next ?? ""}` });
      } else {
        parts.push({ kind: "text", text: "We take 18–24 weddings per season to keep each one personal. Tell us your date and we'll confirm." });
      }
      const open = dates.filter((d) => d.status === "open");
      if (open.length > 0) {
        parts.push({ kind: "text", text: "Upcoming Saturdays still open:" });
        parts.push({ kind: "bullets", items: open.map((d) => `${d.day} ${d.date}`) });
      }
      return { parts, suggestions: ["How do I book?", "Pricing?", "What about Sundays?"] };
    },
  },

  // Deliverables
  {
    id: "deliverables",
    score: (q) =>
      includesAny(q, ["deliverable", "what do i get", "edit", "edited photo", "raw", "raw file", "album", "video", "film", "drone", "sneak peek", "turnaround", "how long until", "when will i get"]) ? 5 : 0,
    handler: () => ({
      parts: [
        { kind: "text", text: "Standard deliverables for every wedding:" },
        {
          kind: "bullets",
          items: [
            "Two photographers (lead + second shooter) on the day",
            "~600 fully-retouched photos per wedding day",
            "Sneak-peek gallery within the same week",
            "Hand-bound editorial album, archival paper",
            "A 3-minute wedding film if film coverage is added",
            "Drone coverage where permitted",
          ],
        },
        { kind: "text", text: "Full gallery delivery: 6–10 weeks from the wedding date. We don't share raw files (we colour-grade everything for consistency)." },
      ],
      suggestions: ["Pricing?", "How do I book?", "Do you do videos?"],
    }),
  },

  // Contact info
  {
    id: "contact",
    score: (q) =>
      includesAny(q, ["email", "phone", "call", "whatsapp", "contact", "reach you", "talk to"]) ? 5 : 0,
    handler: (_q, ctx) => ({
      parts: [
        { kind: "text", text: "Easiest ways to reach us:" },
        {
          kind: "bullets",
          items: [
            `📧 ${ctx.site.contact.email}`,
            `📞 ${ctx.site.contact.phoneDisplay}`,
            `💬 WhatsApp: ${ctx.site.contact.whatsappDisplay}`,
            `Reply time: ${ctx.site.contact.responseTime ?? "48 hours"}`,
          ],
        },
        { kind: "link", href: "#contact", label: "Open the contact form" },
      ],
      suggestions: ["How do I book?", "Where are you based?", "Pricing?"],
    }),
  },

  // Studio / about
  {
    id: "about",
    score: (q) =>
      includesAny(q, ["who are you", "about you", "your story", "the team", "the studio", "tell me about", "how long have you", "experience"]) ? 5 : 0,
    handler: (_q, ctx) => {
      const est = ctx.site.studio.established;
      const founders = ctx.site.about?.founders ?? [];
      const parts: BotPart[] = [
        { kind: "text", text: ctx.site.studio.bio || "A candid wedding photography studio. Indian weddings told slowly and beautifully." },
      ];
      if (est) parts.push({ kind: "text", text: `Working together since ${est}.` });
      if (founders.length > 0) {
        parts.push({ kind: "text", text: "The team behind the camera:" });
        parts.push({ kind: "bullets", items: founders.map((f) => `${f.name} — ${f.role}`) });
      }
      return { parts, suggestions: ["See your work", "Pricing?", "How do I book?"] };
    },
  },

  // Portfolio
  {
    id: "portfolio",
    score: (q) =>
      includesAny(q, ["portfolio", "see your work", "examples", "samples", "previous", "past wedding", "past work", "show me"]) ? 5 : 0,
    handler: () => ({
      parts: [
        { kind: "text", text: "Our recent work lives in three places on this page:" },
        { kind: "link", href: "#portfolio", label: "Portfolio — selected photos by ceremony" },
        { kind: "link", href: "#films", label: "Wedding films — short documentaries" },
        { kind: "link", href: "#voices", label: "Reviews — what couples have said" },
      ],
      suggestions: ["Pricing?", "How do I book?", "Tell me about you"],
    }),
  },

  // Reviews
  {
    id: "reviews",
    score: (q) =>
      includesAny(q, ["review", "testimonial", "past couple", "what do couples", "happy with", "5 star", "rating"]) ? 5 : 0,
    handler: (_q, ctx) => {
      const reviews = ctx.site.voices?.reviews ?? [];
      const rating = ctx.site.voices?.aggregate?.rating ?? "5.0";
      const count = ctx.site.voices?.aggregate?.count ?? "many";
      const parts: BotPart[] = [
        { kind: "text", text: `${rating} stars across ${count} couples. A few words from past clients:` },
      ];
      if (reviews.length > 0) {
        const sample = reviews.slice(0, 2);
        parts.push({
          kind: "bullets",
          items: sample.map((r) => `"${(r.quote ?? "").slice(0, 140)}…" — ${r.couple}, ${r.place}`),
        });
      }
      parts.push({ kind: "link", href: "#voices", label: "Read all reviews" });
      return { parts, suggestions: ["See more work", "How do I book?", "Pricing?"] };
    },
  },

  // Specific ceremony shorthand — beat the generic "about" rule (5) when
  // the user explicitly names a ceremony, because "tell me about mehndi"
  // should answer about *mehndi*, not the studio.
  {
    id: "ceremony",
    score: (q) => (detectCeremony(q) ? 6 : 0),
    handler: (q) => {
      const c = detectCeremony(q) ?? "wedding";
      const blurbs: Record<string, string> = {
        wedding: "Full-day candid coverage — pheras, vidaai, the speeches and the silences. Two photographers, ~600 edits per day.",
        haldi: "Turmeric, laughter, sunlight on skin. We shoot the haldi in soft, close, hand-held frames.",
        mehndi: "Hands curling with henna. Songs. Intimate, slow — we move quietly through the room.",
        sangeet: "Choreographed numbers, unchoreographed nani-dancing. Both kept.",
        baraat: "Dhol, horse, friends carrying you in. The arrival deserves its own film.",
        "pre-wedding": "A travelling portrait session — at home, on a hill, anywhere your story already lives.",
        maternity: "A quiet, slow portrait session — soft fabric, soft light, the pause before everything changes.",
      };
      return {
        parts: [
          { kind: "text", text: blurbs[c] },
          { kind: "link", href: "#portfolio", label: `See our ${c} work` },
        ],
        suggestions: ["Pricing?", "How do I book?", "What about the rest?"],
      };
    },
  },

  // Instagram
  {
    id: "instagram",
    score: (q) => (includesAny(q, ["instagram", "insta", "ig", "social media", "follow you"]) ? 4 : 0),
    handler: (_q, ctx) => {
      const ig = ctx.site.social.instagram;
      const parts: BotPart[] = [
        { kind: "text", text: `Follow our day-to-day at ${ig?.handle ?? "@as.photography"}.` },
      ];
      if (ig?.url) parts.push({ kind: "link", href: ig.url, label: "Open Instagram" });
      return { parts, suggestions: ["See work", "How do I book?", "Pricing?"] };
    },
  },

  // Common couples' FAQs
  {
    id: "faq-rain",
    score: (q) => (includesAny(q, ["rain", "monsoon", "bad weather", "backup plan", "indoor backup"]) ? 6 : 0),
    handler: () => ({
      parts: [
        { kind: "text", text: "Rain plan — we always scout the venue for covered alternates ahead of the day and carry sealed rain covers for the cameras. Outdoor monsoon weddings can actually be some of our favourite work." },
      ],
      suggestions: ["What about the backup gear?", "Pricing?", "How do I book?"],
    }),
  },

  {
    id: "faq-backup-gear",
    score: (q) => (includesAny(q, ["backup gear", "backup camera", "spare", "what if your camera"]) ? 6 : 0),
    handler: () => ({
      parts: [
        { kind: "text", text: "We carry two camera bodies per photographer (so four total on a wedding day), backup lenses, spare batteries, and dual memory cards in every camera so we never lose a frame to a card failure." },
      ],
      suggestions: ["Rain plan?", "How do I book?", "What's included?"],
    }),
  },

  {
    id: "faq-second-shooter",
    score: (q) => (includesAny(q, ["second photographer", "second shooter", "how many photographer", "team size"]) ? 6 : 0),
    handler: () => ({
      parts: [
        { kind: "text", text: "Every wedding gets a lead photographer + a second shooter. With Indian weddings happening across two locations at once (groom getting ready / bride getting ready), one person isn't enough." },
      ],
      suggestions: ["What's included?", "Pricing?", "How do I book?"],
    }),
  },

  {
    id: "faq-album",
    score: (q) => (includesAny(q, ["album", "print", "physical", "book"]) ? 5 : 0),
    handler: () => ({
      parts: [
        { kind: "text", text: "Every full-day wedding collection includes a hand-bound editorial album — archival paper, museum-grade printing, sized for a coffee table. We design every spread by hand based on the story of your day." },
      ],
      suggestions: ["What else is included?", "Pricing?", "How do I book?"],
    }),
  },

  // Fallback / nudge to contact
  {
    id: "fallback",
    score: () => 0.5,
    handler: (_q, ctx) => ({
      parts: [
        { kind: "text", text: "I'm a simple helper, not a real person. For anything specific, the fastest answer is from us directly:" },
        { kind: "bullets", items: [`📧 ${ctx.site.contact.email}`, `💬 WhatsApp: ${ctx.site.contact.whatsappDisplay}`] },
        { kind: "link", href: "#contact", label: "Or fill out the contact form" },
      ],
      suggestions: ["What do you cover?", "Pricing?", "How do I book?", "Where are you based?"],
    }),
  },
];

export function answer(query: string, ctx: Ctx): BotResponse {
  const q = lc(query.trim());
  if (!q) {
    return rules.find((r) => r.id === "greeting")!.handler(q, ctx);
  }
  let best = { score: 0, rule: rules.find((r) => r.id === "fallback")! };
  for (const r of rules) {
    const s = r.score(q);
    if (s > best.score) best = { score: s, rule: r };
  }
  return best.rule.handler(q, ctx);
}

export const WELCOME_SUGGESTIONS = [
  "What do you cover?",
  "Pricing?",
  "Are you free in Goa?",
  "How do I book?",
];
