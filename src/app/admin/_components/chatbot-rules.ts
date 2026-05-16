/**
 * Rule-based assistant for the admin. No LLM — every response is canned
 * or assembled from live site settings. Each rule defines a `match`
 * function that scores a user query; the highest-scoring rule wins.
 *
 * Live data is fetched once from /api/admin/settings on first use and
 * cached on the rule context so subsequent intents can read services,
 * social handles, contact details, etc.
 */

export type BotPart =
  | { kind: "text"; text: string }
  | { kind: "bullets"; title?: string; items: string[] }
  | { kind: "code"; text: string };

export type BotResponse = {
  parts: BotPart[];
  suggestions?: string[];
};

export type SiteData = Record<string, unknown>;

type Ctx = {
  site: SiteData | null;
};

type Rule = {
  id: string;
  /** Returns 0 for no match, higher = better match. */
  score: (query: string) => number;
  handler: (query: string, ctx: Ctx) => BotResponse;
};

// ─── Helpers ────────────────────────────────────────────────────

const GALLERY_TAGS = [
  "Wedding",
  "Pre-Wedding",
  "Haldi",
  "Mehndi",
  "Sangeet",
  "Baraat",
  "Maternity",
] as const;

const FIELD_GLOSSARY: Record<string, string> = {
  eyebrow:
    "The small uppercase line above a section's big headline. Usually 2–4 words like 'Selected work' or 'The coverage'. Keep it short.",
  monogram: "The brand initials, e.g. 'A·S'. Used in the navbar logo and footer.",
  bio: "One paragraph about the studio — appears in the footer and as the meta description fallback.",
  "closing script":
    "The italic single line at the very bottom of the footer. Usually a small sign-off like 'Made with love, since 2012.'",
  "booking pill":
    "Small rounded label near the hero — 'Booking 2026–2027 dates' or similar. Use it to signal current availability.",
  "headline lines":
    "The big serif headline is built from these lines, one per line. The last line is the italic script ending you set separately.",
  "headline script":
    "The italic flourish line at the end of the hero or section headline. Keep it 1–3 words.",
  qualities:
    "Short single-word descriptors under the headline (Film · Editorial · Candid · Worldwide). Add or reorder freely.",
  "byline parts":
    "Joined with · in the rendered byline. Use them for short factual tags ('Wedding Photography', 'est. MMXII', 'India · Worldwide').",
  chapters:
    "Editorial body paragraphs under the headline. Each gets a Roman numeral and a one-word label ('Origin', 'Method').",
  stats:
    "The three big numbers in About. Each has a number, suffix ('+'), a word form ('Twelve'), a label, and an accent colour.",
  founders:
    "Cards in the about section showing the people behind the studio. Add Name, Role, and a one-line bio.",
  timeline:
    "Year + label entries shown on the milestones strip. Keep labels under ~7 words.",
  inclusions:
    "Bullet list under the services tiles — what's included with every collection (Two Photographers, Aerial Coverage, etc).",
  accent:
    "Each testimonial has an accent colour (plum / terracotta / jade / ruby) that tints its card. Rotate them so the carousel feels varied.",
  "press quote":
    "The big editorial press quote shown in the Voices section. The 'highlight' substring is the part rendered in colour.",
  "press wordmarks":
    "Row of publication logos rendered as styled text. Each has its own Tailwind font class.",
  availability:
    "List of upcoming Saturday slots shown in the Contact sidebar. Mark each as open / booked / limited.",
  "trust badges":
    "Pills above the newsletter form (e.g. 'Vogue 2024', '★★★★★ 5.0'). Optional icon name.",
  "made-in line": "The 'Made in India' line at the very bottom of the footer.",
};

const SECTION_HOWTO: Record<string, string[]> = {
  gallery: [
    "Open Admin → Gallery.",
    "Click '+ Add photo' (or edit an existing row).",
    "Upload the image OR paste a URL in the picker.",
    "Set alt text, pick a tag (Wedding/Pre-Wedding/…), pick height (4–10 controls how tall it is in the bento grid).",
    "Save. The homepage updates within ~60 seconds.",
  ],
  films: [
    "Open Admin → Films.",
    "Click '+ Add film'.",
    "Title, location, duration line ('3:42 — feature film'), poster image, video file URL, and pick 'feature' or 'reel'.",
    "Save.",
  ],
  instagram: [
    "Open Admin → Instagram.",
    "Click '+ Add post'.",
    "Image URL, caption, likes/comments/plays, and kind (post or reel).",
    "Save — the IG-mockup section updates within ~60 seconds.",
  ],
  testimonials: [
    "Open Admin → Testimonials.",
    "Click '+ Add testimonial'.",
    "Quote, couple name, place, date, and an accent colour (plum/jade/terracotta/ruby).",
    "Save.",
  ],
  settings: [
    "Open Admin → Site Settings.",
    "Pick a section from the left sidebar (Studio, Hero, About, Services, etc).",
    "Edit fields, add/remove rows in list editors.",
    "Save in the sticky bar at the bottom. Public site updates within ~60 seconds.",
  ],
};

const ALT_TEMPLATES: Record<string, string[]> = {
  wedding: [
    "Bride and groom at the mandap, candid moment during pheras",
    "Couple shares a quiet look during the wedding ceremony",
    "Bridal portrait in heirloom red and gold",
    "Groom places the mangalsutra on the bride",
  ],
  "pre-wedding": [
    "Couple in golden-hour light, hands intertwined",
    "Pre-wedding portrait by a window, soft natural light",
    "Engaged couple walking through old streets, candid",
  ],
  haldi: [
    "Bride laughing as turmeric is applied during haldi",
    "Family playfully smearing haldi on the groom",
    "Close-up of haldi on hands, sunlight streaming",
  ],
  mehndi: [
    "Bride's hands resting after the mehndi sitting, intricate detail",
    "Close-up of fresh mehndi being applied to the bride's palm",
    "Bride in a green outfit during the mehndi ceremony",
  ],
  sangeet: [
    "Family performing a choreographed number on stage at the sangeet",
    "Cousins dancing under stage lights, candid mid-spin",
    "Bride and groom share a dance during the sangeet",
  ],
  baraat: [
    "Groom arrives on horseback surrounded by dancing friends",
    "Dhol players lead the baraat down the street",
    "Friends carry the groom shoulder-high during the baraat",
  ],
  maternity: [
    "Soft golden-hour maternity portrait outdoors",
    "Mother-to-be in flowing fabric against a quiet backdrop",
  ],
};

const BLURB_TEMPLATES: Record<string, string> = {
  wedding:
    "Full-day candid coverage — pheras, vidaai, the speeches and the silences. Two photographers, six hundred edits, one heirloom album.",
  "pre-wedding":
    "A travelling portrait session — at home, on a hill, anywhere your story already lives.",
  haldi:
    "Turmeric, laughter, sunlight on skin. The small warm ritual told in close, gentle frames.",
  mehndi:
    "Hands curling with henna. Songs. Intimate, slow, hand-held — we move quietly through the room.",
  sangeet:
    "Choreographed numbers, unchoreographed nani-dancing — both kept, both honoured.",
  baraat:
    "Dhol, horse, friends carrying you in — the arrival deserves its own short film.",
  maternity:
    "A patient, quiet portrait session — soft light, slow frames, the story before the story.",
};

function lower(s: string): string {
  return s.toLowerCase();
}

function includesAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n));
}

function pick<T>(arr: T[], n = 3): T[] {
  return arr.slice(0, Math.min(n, arr.length));
}

// ─── Rules ──────────────────────────────────────────────────────

const rules: Rule[] = [
  // Greetings / chitchat
  {
    id: "greeting",
    score: (q) => (/^(hi|hello|hey|hola|namaste|good (morning|afternoon|evening))\b/.test(q) ? 5 : 0),
    handler: () => ({
      parts: [
        {
          kind: "text",
          text: "Hi! I'm your admin helper. I can answer questions about your site fields, show your services and tags, and suggest alt text or blurbs for new content.",
        },
      ],
      suggestions: ["What services do we offer?", "Gallery tags?", "How do I add a photo?", "Suggest alt text for a haldi shot"],
    }),
  },

  // Help
  {
    id: "help",
    score: (q) =>
      includesAny(q, ["help", "what can you do", "capabilities", "commands"]) ? 5 : 0,
    handler: () => ({
      parts: [
        { kind: "text", text: "I can help with:" },
        {
          kind: "bullets",
          items: [
            "Looking up your services / packages / pricing line",
            "Listing valid gallery tags and field options",
            "Explaining any admin field (just ask 'what is X')",
            "Suggesting alt text for a photo by tag (try: 'alt text for sangeet')",
            "Suggesting a blurb for a service tile (try: 'blurb for haldi')",
            "Step-by-step how to add a photo / film / IG post / testimonial",
            "Reading back current contact info, social handles, address",
          ],
        },
      ],
      suggestions: ["What services do we offer?", "Gallery tags?", "Suggest alt text for wedding"],
    }),
  },

  // Services / plans / packages
  {
    id: "services",
    score: (q) =>
      includesAny(q, ["service", "package", "plan", "offering", "coverage", "collection"]) ? 4 : 0,
    handler: (_q, ctx) => {
      const services = ((ctx.site?.services as { items?: { no?: string; name?: string; time?: string; blurb?: string }[] })?.items) ?? [];
      if (services.length === 0) {
        return {
          parts: [{ kind: "text", text: "I don't have services loaded yet. Open Admin → Site Settings → Services to add them, then ask again." }],
        };
      }
      return {
        parts: [
          { kind: "text", text: "Here's what the site currently lists:" },
          {
            kind: "bullets",
            items: services.map((s) => `${s.no ?? "??"} — ${s.name ?? "(no name)"} · ${s.time ?? ""} — ${s.blurb ?? ""}`),
          },
        ],
        suggestions: ["What's the pricing line?", "Suggest a blurb for wedding", "What's in the inclusions?"],
      };
    },
  },

  // Pricing
  {
    id: "pricing",
    score: (q) => (includesAny(q, ["price", "pricing", "cost", "how much", "quote", "rate"]) ? 4 : 0),
    handler: (_q, ctx) => {
      const note = (ctx.site?.services as { pricingNote?: string })?.pricingNote
        ?? "Each wedding is priced custom · Quote in 24 hours";
      return {
        parts: [
          { kind: "text", text: `The current pricing line on the site reads:` },
          { kind: "code", text: note },
          { kind: "text", text: "We don't publish numeric prices — each enquiry gets a custom quote. Edit this in Settings → Services → 'Pricing note'." },
        ],
      };
    },
  },

  // Gallery tags
  {
    id: "gallery-tags",
    score: (q) =>
      includesAny(q, ["gallery tag", "tags", "categories", "what tag", "which tag", "category"]) ? 4 : 0,
    handler: () => ({
      parts: [
        { kind: "text", text: "Valid gallery tags (these are the only values the gallery form accepts):" },
        { kind: "bullets", items: GALLERY_TAGS as readonly string[] as string[] },
        { kind: "text", text: "Tip: pick the tag that matches the ceremony. 'Pre-Wedding' covers couple shoots before the wedding day. 'Maternity' is a separate category." },
      ],
      suggestions: ["Suggest alt text for haldi", "How do I add a photo?", "How tall should a gallery photo be?"],
    }),
  },

  // Alt text suggestion
  {
    id: "alt-suggest",
    score: (q) =>
      (includesAny(q, ["alt text", "alt for", "describe", "caption for"]) ? 5 : 0)
      + (Object.keys(ALT_TEMPLATES).some((k) => q.includes(k)) ? 2 : 0),
    handler: (q) => {
      const tag = Object.keys(ALT_TEMPLATES).find((k) => q.includes(k));
      if (!tag) {
        return {
          parts: [
            { kind: "text", text: "Sure — which kind of shot? Try one of:" },
            { kind: "bullets", items: Object.keys(ALT_TEMPLATES).map((t) => `'alt text for ${t}'`) },
          ],
        };
      }
      return {
        parts: [
          { kind: "text", text: `Here are a few starting alt-text ideas for a ${tag} shot:` },
          { kind: "bullets", items: pick(ALT_TEMPLATES[tag], 4) },
          { kind: "text", text: "Pick one and tweak it for the specific frame — alt text is for screen readers, so describe what's in the photo, not the mood." },
        ],
      };
    },
  },

  // Blurb suggestion (service)
  {
    id: "blurb-suggest",
    score: (q) => (includesAny(q, ["blurb for", "description for", "copy for", "write a blurb", "write a description"]) ? 5 : 0),
    handler: (q) => {
      const tag = Object.keys(BLURB_TEMPLATES).find((k) => q.includes(k));
      if (!tag) {
        return {
          parts: [
            { kind: "text", text: "Which service? Try:" },
            { kind: "bullets", items: Object.keys(BLURB_TEMPLATES).map((t) => `'blurb for ${t}'`) },
          ],
        };
      }
      return {
        parts: [
          { kind: "text", text: `Draft blurb for ${tag} (edit to taste):` },
          { kind: "code", text: BLURB_TEMPLATES[tag] },
          { kind: "text", text: "Aim for 1–2 sentences, sensory language, no superlatives. Keep it under ~25 words." },
        ],
      };
    },
  },

  // How-to
  {
    id: "howto",
    score: (q) => (/(how (do i|to)|where (do i|to)) (add|upload|edit|create|delete|remove)/.test(q) ? 5 : 0),
    handler: (q) => {
      const section = Object.keys(SECTION_HOWTO).find((s) => q.includes(s));
      if (!section) {
        return {
          parts: [
            { kind: "text", text: "Which section? Try one of:" },
            { kind: "bullets", items: Object.keys(SECTION_HOWTO).map((s) => `'how to add a ${s}'`) },
          ],
        };
      }
      return {
        parts: [
          { kind: "text", text: `Steps for ${section}:` },
          { kind: "bullets", items: SECTION_HOWTO[section] },
        ],
      };
    },
  },

  // Field glossary — "what is X"
  {
    id: "glossary",
    score: (q) => {
      if (!/what (is|does|are) /.test(q)) return 0;
      const hit = Object.keys(FIELD_GLOSSARY).some((k) => q.includes(k));
      return hit ? 6 : 1; // Still try if no exact hit, but with low confidence
    },
    handler: (q) => {
      const key = Object.keys(FIELD_GLOSSARY).find((k) => q.includes(k));
      if (key) {
        return { parts: [{ kind: "text", text: FIELD_GLOSSARY[key] }] };
      }
      return {
        parts: [
          { kind: "text", text: "Not sure which field you mean. Some I know about:" },
          { kind: "bullets", items: Object.keys(FIELD_GLOSSARY).slice(0, 8) },
          { kind: "text", text: "Try 'what is <field-name>'." },
        ],
      };
    },
  },

  // Contact info
  {
    id: "contact",
    score: (q) => (includesAny(q, ["our email", "studio email", "our phone", "our address", "whatsapp", "contact info", "studio contact"]) ? 4 : 0),
    handler: (_q, ctx) => {
      const c = (ctx.site?.contact as Record<string, unknown>) ?? {};
      const a = (c.address as Record<string, unknown>) ?? {};
      return {
        parts: [
          { kind: "text", text: "Current public contact info:" },
          {
            kind: "bullets",
            items: [
              `Email: ${c.email ?? "(not set)"}`,
              `Phone: ${c.phoneDisplay ?? "(not set)"}`,
              `WhatsApp: ${c.whatsappDisplay ?? "(not set)"}`,
              `Address: ${[a.line1, a.city, a.pincode].filter(Boolean).join(", ") || "(not set)"}`,
              `Hours: ${c.hours ?? "(not set)"}`,
              `Response: ${c.responseTime ?? "(not set)"}`,
            ],
          },
          { kind: "text", text: "Edit any of these in Settings → Contact." },
        ],
      };
    },
  },

  // Social
  {
    id: "social",
    score: (q) => (includesAny(q, ["instagram handle", "pinterest", "youtube", "social handle", "our handle"]) ? 4 : 0),
    handler: (_q, ctx) => {
      const s = (ctx.site?.social as Record<string, Record<string, string>>) ?? {};
      const platforms = Object.keys(s);
      if (platforms.length === 0) {
        return { parts: [{ kind: "text", text: "No social handles set yet. Add them in Settings → Social." }] };
      }
      return {
        parts: [
          { kind: "text", text: "Current social handles:" },
          {
            kind: "bullets",
            items: platforms.map((p) => `${p}: ${s[p]?.handle ?? "(no handle)"} — ${s[p]?.url ?? ""}`),
          },
        ],
      };
    },
  },

  // Save / publish
  {
    id: "save",
    score: (q) => (includesAny(q, ["how long", "when does", "publish", "go live", "did it save", "is it saved"]) ? 4 : 0),
    handler: () => ({
      parts: [
        { kind: "text", text: "After saving, the public homepage updates within ~60 seconds (it's cached for one minute and revalidated on the next request)." },
        { kind: "text", text: "If you don't see changes after a minute: hard-refresh the homepage (Cmd/Ctrl+Shift+R). If still missing, check the Save bar said 'Saved' (green) — a red error means the write didn't go through." },
      ],
    }),
  },

  // Image sizes / dimensions
  {
    id: "image-size",
    score: (q) => (includesAny(q, ["image size", "photo size", "dimensions", "what resolution", "what aspect", "how big"]) ? 4 : 0),
    handler: () => ({
      parts: [
        { kind: "text", text: "Guidelines for uploads:" },
        {
          kind: "bullets",
          items: [
            "Gallery: 1600–2400 px wide JPEGs. Tall (portrait) or square work best in the bento grid.",
            "Films posters: 1920×1080 JPEG.",
            "Instagram tiles: 1080×1080 square.",
            "Hero video: ≤ 1280×720, MP4, ideally < 2 MB (it autoplays).",
            "Max upload size: 80 MB per file.",
            "Accepted types: JPEG, PNG, WebP, AVIF, MP4, WebM. (SVG and HTML are blocked.)",
          ],
        },
      ],
    }),
  },

  // Fallback
  {
    id: "fallback",
    score: () => 0.5,
    handler: () => ({
      parts: [
        { kind: "text", text: "Hmm, I don't have a rule for that yet. I'm a simple rule-based helper, not a real AI." },
        { kind: "text", text: "Try one of these instead:" },
      ],
      suggestions: ["What services do we offer?", "Gallery tags?", "Suggest alt text for sangeet", "How do I add a photo?", "Help"],
    }),
  },
];

// ─── Public API ──────────────────────────────────────────────────

export function answer(query: string, ctx: Ctx): BotResponse {
  const q = lower(query.trim());
  if (!q) {
    return rules.find((r) => r.id === "greeting")!.handler(q, ctx);
  }
  let best: { score: number; rule: Rule } = { score: 0, rule: rules.find((r) => r.id === "fallback")! };
  for (const rule of rules) {
    const s = rule.score(q);
    if (s > best.score) best = { score: s, rule };
  }
  return best.rule.handler(q, ctx);
}

export const WELCOME_SUGGESTIONS = [
  "What services do we offer?",
  "Gallery tags?",
  "Suggest alt text for haldi",
  "How do I add a photo?",
  "Help",
];
