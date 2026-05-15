# A S Photography — Studio Onboarding Checklist

This template can be re-skinned for any wedding photography studio in **a single edit pass** of `src/config/site.ts` + `src/lib/images.ts` + `src/app/globals.css`.

Below is everything we need from the studio owner to ship a customised site.

---

## 1 · Studio identity

| Field | Example | Required? |
|---|---|---|
| Studio name (full) | `A S Photography` | ✔ |
| Studio name (short / monogram) | `A·S` | ✔ |
| Year established | `2012` | ✔ |
| Tagline / what you do | `Wedding Photography` | ✔ |
| One-line studio bio (≤30 words) | *"Indian weddings, told slowly and beautifully…"* | ✔ |
| Closing script line | *"Made with love, since 2012."* | optional |

---

## 2 · Contact

| Field | Example |
|---|---|
| Primary phone (display) | `+91 98765 43210` |
| Email | `hello@as.photography` |
| WhatsApp number | `+91 98765 43210` |
| Studio address line 1 | `Studio 04, Bandra West` |
| City + pincode | `Mumbai · 400050` |
| Hours | `Mon – Sat · 10am to 7pm` |
| Hours note | `Closed Sundays · By appointment` |
| Cities you cover | `Mumbai, Delhi, Bengaluru` |
| Coverage line | `Available across India and worldwide` |
| Response time promise | `48 hours` |

---

## 3 · Social media

| Platform | Handle | Full URL |
|---|---|---|
| Instagram | `@as.photography` | `https://instagram.com/as.photography` |
| Pinterest | `/asphotography` | `https://pinterest.com/asphotography` |
| YouTube | `/asphotography` | `https://youtube.com/@asphotography` |
| WhatsApp | `+91 98765 43210` | `https://wa.me/919876543210` |

---

## 4 · Founders (1 or 2 people)

For each founder:
- Full name
- Role (e.g. *Lead Photographer*, *Creative Director*)
- 1-line bio (e.g. *"Trained at NID Ahmedabad · Brides Today contributor"*)
- A square portrait photo

---

## 5 · Hero section

- 3-word headline split across lines (e.g. `Wedding` / `Photographers` / `in India.`)
- Sub-description (1-2 sentences)
- Primary CTA label (e.g. `Weddings`)
- Secondary CTA label (e.g. `Pre-Wedding`)
- Booking status badge (e.g. `Booking 2026–2027 dates`)
- **Background video** — short MP4 (5-15 sec, muted-friendly). Goes in `/public/videos/hero.mp4`
- **Poster image** — fallback if video fails

---

## 6 · "Our Story" body copy

- Status strip (3 short items, e.g. `Est. 2012` · `Mumbai → Worldwide` · `Vogue India`)
- Main headline (e.g. `We don't pose moments.`)
- Script accent (e.g. `we honour them.`)
- 4 brand qualities (e.g. `Film` `Editorial` `Candid` `Worldwide`)
- **Chapter I (Origin)** — 2-3 sentence paragraph about how the studio began
- **Chapter II (Method)** — 2-3 sentence paragraph about how you shoot
- One **pull-quote** (split across 2 lines, e.g. *"We photograph like / we're listening."*)
- **3 polaroid images** with captions (e.g. `Udaipur · 2023`)
- **About hero image** (single tall portrait of the studio at work)

---

## 7 · Big numbers

3 stats shown in the editorial counter panel:
| n | Word form | Label | Sub-caption |
|---|---|---|---|
| `12+` | `Twelve` | `Years Working` | `Since the studio's first wedding · 2012` |
| `340+` | `Three forty` | `Weddings Filmed` | `Across India and abroad · every season` |
| `27` | `Twenty-seven` | `Cities Visited` | `Jaipur · Udaipur · Coorg · Goa · and onward` |

Each stat needs one **thematic photo** to live behind it.

---

## 8 · Timeline (4-5 milestones)

| Year | Milestone |
|---|---|
| 2012 | Founded in Mumbai |
| 2016 | First destination wedding |
| 2019 | Featured — Vogue India |
| 2022 | 100th wedding |
| 2025 | 340+ couples · 27 cities |

---

## 9 · Services (6 collections)

For each: **Name** · **2-sentence blurb** · **Time of day** (e.g. *Morning*, *Evening*, *All Day*) · **Signature photo**

The starter set: Wedding · Baraat · Mehndi · Haldi · Sangeet · Pre-Wedding.

Plus **5 inclusions** that come with every package (e.g. *Two Photographers*, *Aerial Coverage*, *Sneak Peek*, *Editorial Album*, *Travel Included*).

---

## 10 · Portfolio gallery (21+ images)

Distributed across 7 categories:
- Wedding (5+)
- Baraat (4+)
- Pre-Wedding (4+)
- Haldi (4+)
- Mehndi (4+)
- Sangeet (3+)
- Maternity (1+)

For each photo: image (high-res, ~1400px wide) + 1-line caption + category tag.

---

## 11 · Featured film

- Film title (e.g. *"Tara & Vihaan — Udaipur"*)
- Duration label (e.g. *"3:42 — feature film"*)
- **MP4 video file** (goes in `/public/videos/films.mp4`)
- A poster image that previews the film

---

## 12 · Press / Featured-in

Up to 8 publications to scroll in the marquee.

**One featured press quote** with attribution (e.g. *"… achingly honest." — VOGUE INDIA, January 2024*).

**5 wordmark tiles** with accolade tags (e.g. *Editorial Excellence · Top 50 · 2024 · Best of Weddings · Editor's Pick · Cover Feature*).

---

## 13 · Testimonials (4 reviews)

Each one:
- The quote (≤50 words)
- Couple's names (e.g. *Anaya & Ishaan*)
- Location (e.g. *Jaipur, Rajasthan*)
- Wedding date (e.g. *December 2023*)
- One **wedding photo** of the couple
- One **bride headshot** for the avatar

---

## 14 · Instagram section

- Username (without `@`, e.g. `as.photography`)
- Display name (e.g. *"A S Photography · Wedding Photography"*)
- Bio (2-3 lines, max ~120 chars)
- Booking text (e.g. *"✨ Booking 2026 — DM to enquire"*)
- Stats: **posts count · followers count · following count**
- Growth indicator (e.g. *"+147 this week"*)
- **9-12 Instagram posts**: image + caption + likes + comments. Mark 2-3 as Reels (extra "plays count" field).
- **7 Story Highlights**: image + label + caption (e.g. *"Weddings"*, *"Baraat"*).
- 4-5 simulated comments for the post-detail modal.

---

## 15 · CTA banner

- Eyebrow text (e.g. *"Let's Make Something Beautiful"*)
- Headline (e.g. *"Your story is waiting."*)
- 1-2 sentence body
- CTA label (e.g. *"Begin your inquiry"*)
- **Background video** (MP4 in `/public/videos/cta.mp4`)

---

## 16 · Availability sidebar

6 upcoming Saturdays with status (`open` / `limited` / `booked`).

Plus a booking-status line: *"Currently booking 2026 — 4 dates remaining. 2027 opens in March."*

---

## 17 · Footer

- Trust badges (2): e.g. *"Vogue 2024"* + *"★ 5.0"*
- Newsletter copy (1-2 sentences)
- Legal pages: Privacy · Terms (URLs)
- Made-in line (e.g. *"Made in India · for couples everywhere"*)

---

## 18 · Colour palette (optional)

Defined in `src/app/globals.css` as CSS variables. Change these 5 to re-brand:

```css
--plum: #6b2454;        /* primary brand colour */
--jade: #0d5547;        /* secondary accent (calm) */
--terracotta: #b65c45;  /* warm accent */
--blush: #e8a896;       /* soft pink */
--ruby: #d4365e;        /* pop / CTAs */
```

Plus background:
```css
--bg: #f5ece1;          /* page background */
--bg-soft: #ead6c2;     /* section accent */
--ink: #1f0f29;         /* primary text */
```

---

## 19 · Where to put assets

| Asset | Location |
|---|---|
| Hero video | `/public/videos/hero.mp4` |
| CTA banner video | `/public/videos/cta.mp4` |
| Featured film video | `/public/videos/films.mp4` |
| Logo / favicon | `/public/favicon.ico` + `/public/icon.png` |
| All photos | hosted on Unsplash / your own CDN (URLs in `src/lib/images.ts`) |

---

## TL;DR — the single edit pass

To re-brand this template for a new studio:

1. **Open `src/config/site.ts`** → swap every string for the new studio's info
2. **Open `src/lib/images.ts`** → replace all photo URLs with the new studio's portfolio
3. **Open `src/app/globals.css`** → tweak the 5 brand colours if desired
4. **Drop new videos into `/public/videos/`** with the same filenames
5. `npm run build` and ship

Everything else — animations, layouts, components — needs no changes.
