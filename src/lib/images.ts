const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const HERO_IMAGES = [
  u("photo-1654764746225-e63f5e90facd", 2400),
  u("photo-1632340904083-7308c4ea7e2d", 2400),
  u("photo-1604017011826-d3b4c23f8914", 2400),
];

export const ABOUT_IMAGE = u("photo-1681717166573-f71589207785", 1600);

export const CTA_IMAGE = u("photo-1715347240072-69c73b0ba3ab", 2400);

export const FILM_POSTER = u("photo-1606800052052-a08af7148866", 2200);

export type GalleryTag =
  | "Wedding"
  | "Pre-Wedding"
  | "Haldi"
  | "Mehndi"
  | "Sangeet"
  | "Baraat"
  | "Maternity";

export const GALLERY: { src: string; alt: string; tag: GalleryTag; h: number }[] = [
  // ===== WEDDING (6) =====
  {
    src: u("photo-1610173826014-d131b02d69ca"),
    alt: "Bride in crimson and gold",
    tag: "Wedding",
    h: 7,
  },
  {
    src: u("photo-1654764746225-e63f5e90facd"),
    alt: "Bridal portrait",
    tag: "Wedding",
    h: 8,
  },
  {
    src: u("photo-1604017011826-d3b4c23f8914"),
    alt: "Couple at the mandap",
    tag: "Wedding",
    h: 5,
  },
  {
    src: u("photo-1591604466107-ec97de577aff"),
    alt: "Mandap candlelight",
    tag: "Wedding",
    h: 6,
  },
  {
    src: u("photo-1570212773364-e30cd076539e"),
    alt: "A quiet moment before",
    tag: "Wedding",
    h: 7,
  },
  {
    src: u("photo-1728221052130-810b42a6130e"),
    alt: "Bride and groom together",
    tag: "Wedding",
    h: 6,
  },

  // ===== BARAAT (4) — new =====
  {
    src: u("photo-1632340904083-7308c4ea7e2d"),
    alt: "Baraat — the groom on horseback",
    tag: "Baraat",
    h: 7,
  },
  {
    src: u("photo-1574496026439-0781c4cad842"),
    alt: "The groom arrives",
    tag: "Baraat",
    h: 6,
  },
  {
    src: u("photo-1639575668825-713895939825"),
    alt: "Adorning the horse",
    tag: "Baraat",
    h: 5,
  },
  {
    src: u("photo-1715347240072-69c73b0ba3ab"),
    alt: "Baraat on a decorated elephant",
    tag: "Baraat",
    h: 8,
  },

  // ===== PRE-WEDDING (4) =====
  {
    src: u("photo-1606800052052-a08af7148866"),
    alt: "Pre-wedding in window light",
    tag: "Pre-Wedding",
    h: 8,
  },
  {
    src: u("photo-1525258946800-98cfd641d0de"),
    alt: "The first look",
    tag: "Pre-Wedding",
    h: 5,
  },
  {
    src: u("photo-1606216794074-735e91aa2c92"),
    alt: "Golden hour together",
    tag: "Pre-Wedding",
    h: 6,
  },
  {
    src: u("photo-1623091410901-00e2d268901f"),
    alt: "Engaged, in stillness",
    tag: "Pre-Wedding",
    h: 7,
  },

  // ===== HALDI (4) =====
  {
    src: u("photo-1681717166573-f71589207785"),
    alt: "Haldi — turmeric splash",
    tag: "Haldi",
    h: 6,
  },
  {
    src: u("photo-1697347816275-83728d258959"),
    alt: "Haldi face anointing",
    tag: "Haldi",
    h: 7,
  },
  {
    src: u("photo-1607861716497-e65ab29fc7ac"),
    alt: "A morning of yellow",
    tag: "Haldi",
    h: 5,
  },
  {
    src: u("photo-1634693343333-9b6013c30d57"),
    alt: "Aunties at haldi",
    tag: "Haldi",
    h: 6,
  },

  // ===== MEHNDI (4) =====
  {
    src: u("photo-1702378154233-9b870ff8f1b3"),
    alt: "Mehndi — the bride's hands",
    tag: "Mehndi",
    h: 7,
  },
  {
    src: u("photo-1730003873829-09b4b16444c1"),
    alt: "Henna detail",
    tag: "Mehndi",
    h: 5,
  },
  {
    src: u("photo-1684814070823-97e0b9e99c69"),
    alt: "Hands of the wedding",
    tag: "Mehndi",
    h: 6,
  },
  {
    src: u("photo-1525135850648-b42365991054"),
    alt: "Mehndi close-up",
    tag: "Mehndi",
    h: 5,
  },

  // ===== SANGEET (3) =====
  {
    src: u("photo-1764176269321-6d14f4af09c7"),
    alt: "Sangeet — sisters singing",
    tag: "Sangeet",
    h: 6,
  },
  {
    src: u("photo-1728415503221-204760ce157f"),
    alt: "The cousins' performance",
    tag: "Sangeet",
    h: 7,
  },
  {
    src: u("photo-1587012521796-6359d3678f2a"),
    alt: "An evening of red and gold",
    tag: "Sangeet",
    h: 5,
  },

  // ===== MATERNITY (1) =====
  {
    src: u("photo-1604004555489-723a93d6ce74"),
    alt: "Maternity in golden hour",
    tag: "Maternity",
    h: 7,
  },
];

export const INSTAGRAM = [
  u("photo-1610173826014-d131b02d69ca", 900),
  u("photo-1632340904083-7308c4ea7e2d", 900),
  u("photo-1681717166573-f71589207785", 900),
  u("photo-1702378154233-9b870ff8f1b3", 900),
  u("photo-1764176269321-6d14f4af09c7", 900),
  u("photo-1715347240072-69c73b0ba3ab", 900),
];

export const IG_POSTS = [
  {
    src: u("photo-1654764746225-e63f5e90facd", 900),
    caption: "Tara — the morning of, Udaipur palace",
    likes: 3421,
    comments: 142,
    plays: undefined,
    kind: "post" as const,
  },
  {
    src: u("photo-1715347240072-69c73b0ba3ab", 900),
    caption: "The elephant arrives. Baraat for Rohan & Sneha 🐘",
    likes: 5872,
    comments: 318,
    plays: 142800,
    kind: "reel" as const,
  },
  {
    src: u("photo-1702378154233-9b870ff8f1b3", 900),
    caption: "Henna hands · Anaya's mehndi night",
    likes: 2104,
    comments: 87,
    plays: undefined,
    kind: "post" as const,
  },
  {
    src: u("photo-1610173826014-d131b02d69ca", 900),
    caption: "Crimson & saffron · a study in light",
    likes: 4193,
    comments: 211,
    plays: undefined,
    kind: "post" as const,
  },
  {
    src: u("photo-1681717166573-f71589207785", 900),
    caption: "Yellow morning — Riya's haldi",
    likes: 2987,
    comments: 156,
    plays: undefined,
    kind: "post" as const,
  },
  {
    src: u("photo-1764176269321-6d14f4af09c7", 900),
    caption: "Sangeet · sisters singing for the bride",
    likes: 3641,
    comments: 198,
    plays: 89400,
    kind: "reel" as const,
  },
  {
    src: u("photo-1606800052052-a08af7148866", 900),
    caption: "Window light · Priya & Karthik",
    likes: 2718,
    comments: 104,
    plays: undefined,
    kind: "post" as const,
  },
  {
    src: u("photo-1604017011826-d3b4c23f8914", 900),
    caption: "At the mandap · Meera & Aditya",
    likes: 4502,
    comments: 287,
    plays: undefined,
    kind: "post" as const,
  },
  {
    src: u("photo-1632340904083-7308c4ea7e2d", 900),
    caption: "Baraat & blue hour",
    likes: 3128,
    comments: 142,
    plays: undefined,
    kind: "post" as const,
  },
  {
    src: u("photo-1591604466107-ec97de577aff", 900),
    caption: "Mandap candlelight, slow shutter",
    likes: 3892,
    comments: 168,
    plays: undefined,
    kind: "post" as const,
  },
  {
    src: u("photo-1697347816275-83728d258959", 900),
    caption: "First touch of haldi · the auntie chorus",
    likes: 2456,
    comments: 119,
    plays: 56200,
    kind: "reel" as const,
  },
  {
    src: u("photo-1570212773364-e30cd076539e", 900),
    caption: "Before vidaai · a quiet held breath",
    likes: 6204,
    comments: 412,
    plays: undefined,
    kind: "post" as const,
  },
];

export const IG_STORIES = [
  {
    label: "Weddings",
    img: u("photo-1610173826014-d131b02d69ca", 240),
    full: u("photo-1610173826014-d131b02d69ca", 1200),
    caption: "When she stops, even the lehenga listens.",
  },
  {
    label: "Baraat",
    img: u("photo-1632340904083-7308c4ea7e2d", 240),
    full: u("photo-1632340904083-7308c4ea7e2d", 1200),
    caption: "The arrival · Udaipur, December.",
  },
  {
    label: "Haldi",
    img: u("photo-1681717166573-f71589207785", 240),
    full: u("photo-1681717166573-f71589207785", 1200),
    caption: "A morning of yellow.",
  },
  {
    label: "Mehndi",
    img: u("photo-1702378154233-9b870ff8f1b3", 240),
    full: u("photo-1702378154233-9b870ff8f1b3", 1200),
    caption: "Hands of the wedding.",
  },
  {
    label: "Sangeet",
    img: u("photo-1764176269321-6d14f4af09c7", 240),
    full: u("photo-1764176269321-6d14f4af09c7", 1200),
    caption: "Sisters singing for the bride.",
  },
  {
    label: "Reels",
    img: u("photo-1715347240072-69c73b0ba3ab", 240),
    full: u("photo-1715347240072-69c73b0ba3ab", 1200),
    caption: "Baraat on an elephant · watch the full reel.",
  },
  {
    label: "BTS",
    img: u("photo-1681717075175-19feb7a6f664", 240),
    full: u("photo-1681717075175-19feb7a6f664", 1200),
    caption: "Setting up · the 4am of every wedding.",
  },
];

export const TESTIMONIAL_AVATARS = [
  u("photo-1570212773364-e30cd076539e", 240),
  u("photo-1600685890506-593fdf55949b", 240),
  u("photo-1619516388835-2b60acc4049e", 240),
  u("photo-1617633150878-7df1d12a9a57", 240),
];
