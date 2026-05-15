/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  A S PHOTOGRAPHY — Site Configuration                           ║
 * ║                                                                  ║
 * ║  This is THE FILE TO EDIT to customise the studio website.       ║
 * ║  Everything text/contact/social-related lives here.              ║
 * ║                                                                  ║
 * ║  For images, edit `src/lib/images.ts`                            ║
 * ║  For colours, edit the CSS variables in `src/app/globals.css`    ║
 * ║                                                                  ║
 * ║  See STUDIO-SETUP.md for a full checklist of what to provide.    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

export const site = {
  // ─────────────────────────────────────────────────────────────
  // STUDIO IDENTITY
  // ─────────────────────────────────────────────────────────────
  studio: {
    name: "A S Photography",
    nameShort: "A S",
    monogram: "A·S",
    tagline: "Wedding Photography",
    /** Year established, used in copy as "since 2012" */
    established: 2012,
    /** Roman-numeral year for editorial flourish */
    establishedRoman: "MMXII",
    /** One-line description used in footer + meta */
    bio: "A candid wedding photography studio. Indian weddings, told slowly and beautifully — available across India and worldwide.",
    /** Closing script line in footer */
    closingScript: "Made with love, since 2012.",
  },

  // ─────────────────────────────────────────────────────────────
  // CONTACT
  // ─────────────────────────────────────────────────────────────
  contact: {
    /** Display form (spaces allowed) */
    phoneDisplay: "+91 98765 43210",
    /** Tel: link form (no spaces) */
    phoneTel: "+919876543210",
    email: "hello@as.photography",
    whatsappDisplay: "+91 98765 43210",
    whatsappLink: "https://wa.me/919876543210",
    address: {
      line1: "Studio 04, Bandra West",
      city: "Mumbai",
      pincode: "400050",
    },
    hours: "Mon — Sat · 10am to 7pm",
    hoursNote: "Closed Sundays · By appointment",
    responseTime: "Replies in 48h",
    /** Cities you cover */
    locations: ["Mumbai", "Delhi", "Bengaluru"],
    coverage: "Available across India and worldwide",
  },

  // ─────────────────────────────────────────────────────────────
  // SOCIAL HANDLES (used in Instagram section, footer, contact)
  // ─────────────────────────────────────────────────────────────
  social: {
    instagram: {
      name: "Instagram",
      handle: "@as.photography",
      // Username only (used inside the Instagram-mockup section)
      username: "as.photography",
      url: "https://instagram.com/as.photography",
    },
    pinterest: {
      name: "Pinterest",
      handle: "/asphotography",
      url: "https://pinterest.com/asphotography",
    },
    youtube: {
      name: "YouTube",
      handle: "/asphotography",
      url: "https://youtube.com/@asphotography",
    },
    whatsapp: {
      name: "WhatsApp",
      handle: "+91 98765 43210",
      url: "https://wa.me/919876543210",
    },
  },

  // ─────────────────────────────────────────────────────────────
  // FORM DELIVERY — Formspree IDs
  // Sign up at https://formspree.io, create a form, paste the ID below.
  // The ID is the bit after /f/ in your endpoint URL.
  // Example endpoint:  https://formspree.io/f/xyzabcd1
  //                                          ─────────
  //                                          this is the ID
  // Better: put these in .env.local as NEXT_PUBLIC_FORMSPREE_CONTACT_ID,
  // NEXT_PUBLIC_FORMSPREE_NEWSLETTER_ID — see .env.local.example.
  // ─────────────────────────────────────────────────────────────
  formspree: {
    contact:
      process.env.NEXT_PUBLIC_FORMSPREE_CONTACT_ID ||
      "YOUR_FORMSPREE_CONTACT_ID",
    newsletter:
      process.env.NEXT_PUBLIC_FORMSPREE_NEWSLETTER_ID ||
      "YOUR_FORMSPREE_NEWSLETTER_ID",
  },

  // ─────────────────────────────────────────────────────────────
  // SEO / METADATA
  // ─────────────────────────────────────────────────────────────
  seo: {
    title: "A S Photography — Wedding Photography",
    description:
      "Candid wedding photography studio capturing weddings, pre-weddings, haldi, mehndi & sangeet. Cinematic Indian wedding stories told in light.",
    ogTitle: "A S Photography",
    ogDescription:
      "Candid wedding photography — weddings, pre-weddings, ceremonies told beautifully.",
  },

  // ─────────────────────────────────────────────────────────────
  // NAVBAR
  // ─────────────────────────────────────────────────────────────
  nav: {
    links: [
      { href: "#top", label: "Home" },
      { href: "#story", label: "About" },
      { href: "#services", label: "Services" },
      { href: "#films", label: "Films" },
      { href: "#voices", label: "Reviews" },
      { href: "#contact", label: "Contact" },
    ],
    portfolioDropdown: [
      { href: "#portfolio", label: "Wedding" },
      { href: "#portfolio", label: "Baraat" },
      { href: "#portfolio", label: "Pre-Wedding" },
      { href: "#portfolio", label: "Haldi" },
      { href: "#portfolio", label: "Mehndi" },
      { href: "#portfolio", label: "Sangeet" },
      { href: "#portfolio", label: "Maternity" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // HERO
  // ─────────────────────────────────────────────────────────────
  hero: {
    eyebrow: "Candid Wedding Photography",
    /** Big serif headline — 3 lines */
    headlineLines: ["Wedding", "Photographers"],
    headlineScript: "in India.",
    description:
      "We make wonderful stories — quiet, candid, golden. Every haldi, every mehndi, every vow, kept as if it were a heirloom.",
    primaryCTA: { label: "Weddings", href: "#portfolio" },
    secondaryCTA: { label: "Pre-Wedding", href: "#portfolio" },
    bookingPill: "Booking 2026–2027 dates",
  },

  // ─────────────────────────────────────────────────────────────
  // ABOUT / OUR STORY
  // ─────────────────────────────────────────────────────────────
  about: {
    eyebrow: "01 — Our Story",
    /** Top eyebrow strip: short status items */
    statusStrip: [
      "Est. 2012",
      "Mumbai → Worldwide",
      "Vogue India · WedMeGood",
    ],
    headlineMain: "We don't pose moments.",
    headlineScript: "we honour them.",
    /** Qualities shown in the masthead under the headline */
    qualities: ["Film", "Editorial", "Candid", "Worldwide"],
    /** Byline parts shown under the masthead */
    bylineParts: [
      "A S Photography",
      "Wedding Photography",
      "est. MMXII",
      "India · Worldwide",
    ],
    /** Editorial body — chapters appear as paragraphs with marginalia */
    chapters: [
      {
        numeral: "I",
        label: "Origin",
        body:
          "A S Photography was born from a simple obsession — Indian weddings deserve a way of looking that matches their generosity. The colour, the noise, the held breath before vidaai.",
      },
      {
        numeral: "II",
        label: "Method",
        body:
          "Working in pairs, light and unobtrusive, we move through your day like a memory in real time. No staged kisses. No lining-up of aunties. Just the marriage as it actually happens.",
      },
    ],
    pullQuoteLines: ["We photograph like", "we're listening."],
    polaroidCaptions: [
      "Udaipur · 2023",
      "Mumbai · 2024",
      "On set · This morning",
    ],
    backgroundWordmark:
      "A S · A S · A S · A S · A S · A S · A S · A S · A S · A S ·",
    /** Three big numbers in the stat panel */
    stats: [
      {
        n: 12,
        suffix: "+",
        word: "Twelve",
        label: "Years Working",
        sub: "Since the studio's first wedding · 2012",
        color: "plum",
      },
      {
        n: 340,
        suffix: "+",
        word: "Three forty",
        label: "Weddings Filmed",
        sub: "Across India and abroad · every season",
        color: "jade",
      },
      {
        n: 27,
        suffix: "",
        word: "Twenty-seven",
        label: "Cities Visited",
        sub: "Jaipur · Udaipur · Coorg · Goa · and onward",
        color: "terracotta",
      },
    ],
    /** Founders shown in twin portrait cards */
    founders: [
      {
        name: "Arjun Mehra",
        role: "Lead Photographer",
        bio: "Trained at NID Ahmedabad · Brides Today contributor",
      },
      {
        name: "Priya Mehra",
        role: "Creative Director",
        bio: "Ex–Vogue India · Curates every album by hand",
      },
    ],
    /** Studio milestones shown in the timeline */
    timeline: [
      { year: "2012", label: "Founded in Mumbai" },
      { year: "2016", label: "First destination wedding" },
      { year: "2019", label: "Featured — Vogue India" },
      { year: "2022", label: "100th wedding" },
      { year: "2025", label: "340+ couples · 27 cities" },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // SERVICES — the 6 collections you offer
  // ─────────────────────────────────────────────────────────────
  services: {
    eyebrow: "The Coverage",
    titleMain: "From haldi to",
    titleScript: "vidaai.",
    description:
      "Every Indian wedding is a small civilisation of rituals. We come ready for all of them — six chapters, one devoted lens.",
    /** The 6 service tiles. Order matters; first is the featured big tile. */
    items: [
      {
        no: "01",
        name: "Wedding",
        blurb:
          "Full-day candid coverage — pheras, vidaai, the speeches and the silences. Two photographers, six hundred edits, one heirloom album.",
        time: "All Day · 12 hrs",
      },
      {
        no: "02",
        name: "Baraat",
        blurb:
          "Dhol, horse, friends carrying you in — the arrival deserves its own film.",
        time: "Evening",
      },
      {
        no: "03",
        name: "Mehndi",
        blurb: "Hands curling with henna. Songs. Intimate, slow, hand-held.",
        time: "Day-Before",
      },
      {
        no: "04",
        name: "Haldi",
        blurb: "Turmeric, laughter, sunlight on skin. The small warm ritual.",
        time: "Morning",
      },
      {
        no: "05",
        name: "Sangeet",
        blurb:
          "Choreographed numbers, unchoreographed nani-dancing. Both kept.",
        time: "Night",
      },
      {
        no: "06",
        name: "Pre-Wedding",
        blurb:
          "A travelling portrait session — at home, on a hill, anywhere.",
        time: "Anytime",
      },
    ],
    /** Everything bundled into every collection */
    inclusions: [
      { label: "Two Photographers", sub: "Lead + second shooter" },
      { label: "Aerial Coverage", sub: "Drone where permitted" },
      { label: "Sneak Peek", sub: "Within the same week" },
      { label: "Editorial Album", sub: "Hand-bound · archival" },
      { label: "Travel Included", sub: "Anywhere in India" },
    ],
    /** Pricing footer */
    pricingNote: "Each wedding is priced custom · Quote in 24 hours",
    primaryCTA: { label: "Build my package", href: "#contact" },
  },

  // ─────────────────────────────────────────────────────────────
  // PORTFOLIO / GALLERY
  // ─────────────────────────────────────────────────────────────
  portfolio: {
    eyebrow: "Selected Work",
    titleMain: "Stories in",
    titleScript: "frames.",
    description:
      "A field guide to the small, almost-missed moments — gathered from weddings across the country.",
    /** The credentials line under the CTA */
    credentialsLine: "340+ weddings · 27 cities · 12 years",
  },

  // ─────────────────────────────────────────────────────────────
  // FILMS
  // ─────────────────────────────────────────────────────────────
  films: {
    eyebrow: "Wedding Films",
    titleMain: "Sound, slow motion,",
    titleScript: "& memory.",
    description:
      "A short film of your wedding — three minutes of music, light, and the things you forgot you said.",
    /** Featured film shown in the player */
    featuredFilm: {
      title: "Tara & Vihaan — Udaipur",
      duration: "3:42 — feature film",
      /** Path to the local video file (in /public/videos/) */
      videoSrc: "/videos/films.mp4",
    },
  },

  // ─────────────────────────────────────────────────────────────
  // PUBLICATIONS / PRESS MARQUEE
  // (Featured-in scroll between Films and Testimonials)
  // ─────────────────────────────────────────────────────────────
  publications: [
    "WedMeGood",
    "Vogue India",
    "The Knot",
    "BetterHalf",
    "ShaadiSaga",
    "Brides Today",
    "Femina",
    "Wedding Sutra",
  ],

  // ─────────────────────────────────────────────────────────────
  // TESTIMONIALS / REVIEWS
  // ─────────────────────────────────────────────────────────────
  voices: {
    eyebrow: "Voices",
    titleMain: "From the couples who",
    titleScript: "trusted us.",
    aggregate: {
      rating: "5.0",
      count: "340+",
      years: "12 years",
    },
    /** Reviews shown in the carousel */
    reviews: [
      {
        quote:
          "We had three days of ceremonies in Jaipur and A S Photography was there for every haldi smear, every sangeet performance, every late-night chai. The album feels like the wedding actually felt.",
        couple: "Anaya & Ishaan",
        place: "Jaipur, Rajasthan",
        date: "December 2023",
        accent: "plum",
      },
      {
        quote:
          "They photographed our wedding the way good poetry sounds — quiet at first, then suddenly inevitable. Six months later our parents still call asking which page their photo is on.",
        couple: "Riya & Karthik",
        place: "Coorg, Karnataka",
        date: "February 2024",
        accent: "terracotta",
      },
      {
        quote:
          "Indian weddings are loud. A S Photography is gentle. They moved through the chaos like they had a map only they could see. Every important moment is in our album, and every embarrassing one too.",
        couple: "Meera & Aditya",
        place: "Udaipur, Rajasthan",
        date: "November 2023",
        accent: "jade",
      },
      {
        quote:
          "Booked them for a sangeet only, ended up extending to all four days. Their candid eye is the real deal — no awkward poses, just real people on the best day of their lives.",
        couple: "Sneha & Rohan",
        place: "Goa",
        date: "January 2024",
        accent: "ruby",
      },
    ],
    /** Big editorial pull-quote */
    pressQuote: {
      quote:
        "A S Photography is rewriting Indian wedding photography — patient, painterly, and achingly honest.",
      highlight: "achingly honest",
      attribution: "VOGUE",
      attributionSub: "INDIA",
      date: "January 2024",
    },
    /** The "And more — 2024–2023" wordmarks shown in the row */
    pressWordmarks: [
      {
        name: "VOGUE",
        sub: "INDIA",
        accolade: "Editorial Excellence",
        fontClass: "font-display font-bold tracking-[0.32em]",
      },
      {
        name: "WedMeGood",
        accolade: "Top 50 · 2024",
        fontClass: "font-sans font-extrabold tracking-tight",
      },
      {
        name: "The Knot",
        accolade: "Best of Weddings",
        fontClass: "font-script text-3xl",
      },
      {
        name: "BetterHalf",
        accolade: "Editor's Pick",
        fontClass: "font-sans font-black uppercase tracking-[0.08em]",
      },
      {
        name: "Brides Today",
        accolade: "Cover Feature",
        fontClass: "font-display italic font-medium",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // CTA BANNER (between Voices and Instagram)
  // ─────────────────────────────────────────────────────────────
  ctaBanner: {
    eyebrow: "Let's Make Something Beautiful",
    titleMain: "Your story is",
    titleScript: "waiting.",
    description:
      "We take a small number of weddings each season. Reserve early — we book six months ahead.",
    primaryCTA: { label: "Begin your inquiry", href: "#contact" },
    /** Phone CTA — uses contact.phoneDisplay */
  },

  // ─────────────────────────────────────────────────────────────
  // INSTAGRAM (used inside the IG-mockup section)
  // ─────────────────────────────────────────────────────────────
  instagram: {
    displayName: "A S Photography · Wedding Photography",
    bio: "Indian weddings, told slowly. Candid · Editorial · Worldwide.",
    bookingText: "✨ Booking 2026 — DM to enquire",
    locationLine: "Mumbai · Delhi · Wherever you are",
    stats: {
      posts: 248,
      followers: 48200,
      following: 312,
      /** Shown as the green +N this week chip under Followers */
      growthThisWeek: 147,
    },
    /** Notification + DM badge counts shown in the header */
    notifications: { bell: 12, inbox: 3 },
  },

  // ─────────────────────────────────────────────────────────────
  // CONTACT FORM SECTION
  // ─────────────────────────────────────────────────────────────
  contactSection: {
    eyebrow: "Begin the conversation",
    titleMain: "An invitation to",
    titleScript: "inquire.",
    description:
      "We accept 18–24 weddings per season — so each one stays personal. Tell us about your day, and we'll reply by hand within 48 hours.",
    /** Upcoming Saturdays availability (sidebar) */
    availability: [
      { day: "Sat", date: "Feb 28", status: "booked" as const },
      { day: "Sat", date: "Mar 14", status: "open" as const },
      { day: "Sat", date: "Mar 21", status: "limited" as const },
      { day: "Sat", date: "Apr 4", status: "open" as const },
      { day: "Sat", date: "Apr 18", status: "booked" as const },
      { day: "Sat", date: "May 2", status: "open" as const },
    ],
    bookingStatus: {
      year: "2026",
      remaining: 4,
      next: "2027 calendar opens in March.",
    },
  },

  // ─────────────────────────────────────────────────────────────
  // FOOTER
  // ─────────────────────────────────────────────────────────────
  footer: {
    bookingPill: "Currently booking 2026 — 4 dates left",
    trustBadges: [
      { label: "Vogue 2024", icon: "newspaper" as const },
      { label: "★ ★ ★ ★ ★ 5.0", icon: null },
    ],
    newsletter: {
      title: "The Journal",
      blurb:
        "Once a month — a quiet email with behind-the-scenes from a recent wedding, plus a playlist.",
      disclaimer: "No spam · Unsubscribe anytime",
    },
    legalLinks: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
    madeInLine: "Made in India",
    forLoveLine: "for couples everywhere",
  },
};

/**
 * Convenience helper — flatten the current year for the © line.
 */
export const currentYear = new Date().getFullYear();
