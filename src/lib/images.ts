/**
 * ╔════════════════════════════════════════════════════════════╗
 * ║  Image library — every photo URL the site uses.           ║
 * ║  All files live in /public/images/, organised by category. ║
 * ║                                                            ║
 * ║  To replace a photo:                                       ║
 * ║   1. Drop the new JPG into the matching folder              ║
 * ║   2. Either keep the filename or update the path below      ║
 * ╚════════════════════════════════════════════════════════════╝
 */

// Hero rotation — first one shown as the poster behind the video
export const HERO_IMAGES = [
  "/images/wedding/bridal-portrait.jpg",
  "/images/baraat/horseback.jpg",
  "/images/wedding/couple-at-mandap.jpg",
];

// About section — atmospheric image used behind the headline
export const ABOUT_IMAGE = "/images/haldi/turmeric-splash.jpg";

// CTA banner — full-bleed image for "Begin your inquiry"
export const CTA_IMAGE = "/images/baraat/elephant.jpg";

// Featured film poster (Films section)
export const FILM_POSTER = "/images/pre-wedding/window-light.jpg";

// ─────────────────────────────────────────────────────────────
// PORTFOLIO GALLERY — filterable by tag
// ─────────────────────────────────────────────────────────────
export type GalleryTag =
  | "Wedding"
  | "Pre-Wedding"
  | "Haldi"
  | "Mehndi"
  | "Sangeet"
  | "Baraat"
  | "Maternity";

export const GALLERY: {
  src: string;
  alt: string;
  tag: GalleryTag;
  h: number;
}[] = [
  // ═══ Wedding (6) ═══
  { src: "/images/wedding/bride-crimson-gold.jpg",   alt: "Bride in crimson and gold",   tag: "Wedding",     h: 7 },
  { src: "/images/wedding/bridal-portrait.jpg",      alt: "Bridal portrait",             tag: "Wedding",     h: 8 },
  { src: "/images/wedding/couple-at-mandap.jpg",     alt: "Couple at the mandap",        tag: "Wedding",     h: 5 },
  { src: "/images/wedding/mandap-candlelight.jpg",   alt: "Mandap candlelight",          tag: "Wedding",     h: 6 },
  { src: "/images/wedding/quiet-moment.jpg",         alt: "A quiet moment before",       tag: "Wedding",     h: 7 },
  { src: "/images/wedding/traditional-couple.jpg",   alt: "Bride and groom together",    tag: "Wedding",     h: 6 },

  // ═══ Baraat (4) ═══
  { src: "/images/baraat/horseback.jpg",             alt: "Baraat — groom on horseback", tag: "Baraat",      h: 7 },
  { src: "/images/baraat/groom-arrives.jpg",         alt: "The groom arrives",           tag: "Baraat",      h: 6 },
  { src: "/images/baraat/adorning-horse.jpg",        alt: "Adorning the horse",          tag: "Baraat",      h: 5 },
  { src: "/images/baraat/elephant.jpg",              alt: "Baraat on a decorated elephant", tag: "Baraat",   h: 8 },

  // ═══ Pre-Wedding (4) ═══
  { src: "/images/pre-wedding/window-light.jpg",     alt: "Pre-wedding in window light", tag: "Pre-Wedding", h: 8 },
  { src: "/images/pre-wedding/first-look.jpg",       alt: "The first look",              tag: "Pre-Wedding", h: 5 },
  { src: "/images/pre-wedding/golden-hour.jpg",      alt: "Golden hour together",        tag: "Pre-Wedding", h: 6 },
  { src: "/images/pre-wedding/engaged-stillness.jpg", alt: "Engaged, in stillness",      tag: "Pre-Wedding", h: 7 },

  // ═══ Haldi (4) ═══
  { src: "/images/haldi/turmeric-splash.jpg",        alt: "Haldi — turmeric splash",     tag: "Haldi",       h: 6 },
  { src: "/images/haldi/face-anointing.jpg",         alt: "Haldi face anointing",        tag: "Haldi",       h: 7 },
  { src: "/images/haldi/morning-yellow.jpg",         alt: "A morning of yellow",         tag: "Haldi",       h: 5 },
  { src: "/images/haldi/aunties.jpg",                alt: "Aunties at haldi",            tag: "Haldi",       h: 6 },

  // ═══ Mehndi (4) ═══
  { src: "/images/mehndi/bride-hands.jpg",           alt: "Mehndi — the bride's hands",  tag: "Mehndi",      h: 7 },
  { src: "/images/mehndi/henna-detail.jpg",          alt: "Henna detail",                tag: "Mehndi",      h: 5 },
  { src: "/images/mehndi/green-dress.jpg",           alt: "Hands of the wedding",        tag: "Mehndi",      h: 6 },
  { src: "/images/mehndi/close-up.jpg",              alt: "Mehndi close-up",             tag: "Mehndi",      h: 5 },

  // ═══ Sangeet (3) ═══
  { src: "/images/sangeet/sisters-singing.jpg",      alt: "Sangeet — sisters singing",   tag: "Sangeet",     h: 6 },
  { src: "/images/sangeet/cousins-performance.jpg",  alt: "The cousins' performance",    tag: "Sangeet",     h: 7 },
  { src: "/images/sangeet/red-gold-evening.jpg",     alt: "An evening of red and gold",  tag: "Sangeet",     h: 5 },

  // ═══ Maternity (1) ═══
  { src: "/images/maternity/golden-hour.jpg",        alt: "Maternity in golden hour",    tag: "Maternity",   h: 7 },
];

// ─────────────────────────────────────────────────────────────
// INSTAGRAM — handle / post grid / story highlights
// ─────────────────────────────────────────────────────────────
export const INSTAGRAM = [
  "/images/wedding/bride-crimson-gold.jpg",
  "/images/baraat/horseback.jpg",
  "/images/haldi/turmeric-splash.jpg",
  "/images/mehndi/bride-hands.jpg",
  "/images/sangeet/sisters-singing.jpg",
  "/images/baraat/elephant.jpg",
];

export const IG_POSTS = [
  { src: "/images/wedding/bridal-portrait.jpg",       caption: "Tara — the morning of, Udaipur palace",        likes: 3421, comments: 142, plays: undefined, kind: "post" as const },
  { src: "/images/baraat/elephant.jpg",               caption: "The elephant arrives. Baraat for Rohan & Sneha 🐘", likes: 5872, comments: 318, plays: 142800,   kind: "reel" as const },
  { src: "/images/mehndi/bride-hands.jpg",            caption: "Henna hands · Anaya's mehndi night",            likes: 2104, comments: 87,  plays: undefined, kind: "post" as const },
  { src: "/images/wedding/bride-crimson-gold.jpg",    caption: "Crimson & saffron · a study in light",          likes: 4193, comments: 211, plays: undefined, kind: "post" as const },
  { src: "/images/haldi/turmeric-splash.jpg",         caption: "Yellow morning — Riya's haldi",                 likes: 2987, comments: 156, plays: undefined, kind: "post" as const },
  { src: "/images/sangeet/sisters-singing.jpg",       caption: "Sangeet · sisters singing for the bride",       likes: 3641, comments: 198, plays: 89400,    kind: "reel" as const },
  { src: "/images/pre-wedding/window-light.jpg",      caption: "Window light · Priya & Karthik",                likes: 2718, comments: 104, plays: undefined, kind: "post" as const },
  { src: "/images/wedding/couple-at-mandap.jpg",      caption: "At the mandap · Meera & Aditya",                likes: 4502, comments: 287, plays: undefined, kind: "post" as const },
  { src: "/images/baraat/horseback.jpg",              caption: "Baraat & blue hour",                            likes: 3128, comments: 142, plays: undefined, kind: "post" as const },
  { src: "/images/wedding/mandap-candlelight.jpg",    caption: "Mandap candlelight, slow shutter",              likes: 3892, comments: 168, plays: undefined, kind: "post" as const },
  { src: "/images/haldi/face-anointing.jpg",          caption: "First touch of haldi · the auntie chorus",      likes: 2456, comments: 119, plays: 56200,    kind: "reel" as const },
  { src: "/images/wedding/quiet-moment.jpg",          caption: "Before vidaai · a quiet held breath",           likes: 6204, comments: 412, plays: undefined, kind: "post" as const },
];

export const IG_STORIES = [
  { label: "Weddings", img: "/images/wedding/bride-crimson-gold.jpg",  full: "/images/wedding/bride-crimson-gold.jpg",  caption: "When she stops, even the lehenga listens." },
  { label: "Baraat",   img: "/images/baraat/horseback.jpg",            full: "/images/baraat/horseback.jpg",            caption: "The arrival · Udaipur, December." },
  { label: "Haldi",    img: "/images/haldi/turmeric-splash.jpg",       full: "/images/haldi/turmeric-splash.jpg",       caption: "A morning of yellow." },
  { label: "Mehndi",   img: "/images/mehndi/bride-hands.jpg",          full: "/images/mehndi/bride-hands.jpg",          caption: "Hands of the wedding." },
  { label: "Sangeet",  img: "/images/sangeet/sisters-singing.jpg",     full: "/images/sangeet/sisters-singing.jpg",     caption: "Sisters singing for the bride." },
  { label: "Reels",    img: "/images/baraat/elephant.jpg",             full: "/images/baraat/elephant.jpg",             caption: "Baraat on an elephant · watch the full reel." },
  { label: "BTS",      img: "/images/haldi/yellow-sari.jpg",           full: "/images/haldi/yellow-sari.jpg",           caption: "Setting up · the 4am of every wedding." },
];

// Testimonial / founder portraits — bride headshots
export const TESTIMONIAL_AVATARS = [
  "/images/wedding/quiet-moment.jpg",
  "/images/portraits/woman-gold-crown.jpg",
  "/images/portraits/red-white-sari.jpg",
  "/images/portraits/red-gold-bride.jpg",
];
