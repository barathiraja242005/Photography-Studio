"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Camera,
  Heart,
  Flower2,
  Sparkles,
  Music,
  Crown,
  ArrowUpRight,
  Sun,
  Moon,
  Clock,
  BookOpen,
  MapPin,
  Plane,
  Users,
  Zap,
} from "lucide-react";
import { Ornament } from "@/components/Ornament";
import { EASE } from "@/lib/motion";
import Tilt3D from "@/components/Tilt3D";

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

type Accent = "plum" | "jade" | "terracotta" | "ruby";

const ACCENT: Record<
  Accent,
  { chip: string; ring: string; iconBg: string; halo: string }
> = {
  plum: {
    chip: "bg-plum text-bg",
    ring: "ring-plum/40",
    iconBg: "bg-plum",
    halo: "bg-plum/30",
  },
  jade: {
    chip: "bg-jade text-bg",
    ring: "ring-jade/40",
    iconBg: "bg-jade",
    halo: "bg-jade/30",
  },
  terracotta: {
    chip: "bg-terracotta text-bg",
    ring: "ring-terracotta/40",
    iconBg: "bg-terracotta",
    halo: "bg-terracotta/30",
  },
  ruby: {
    chip: "bg-ruby text-bg",
    ring: "ring-ruby/40",
    iconBg: "bg-ruby",
    halo: "bg-ruby/30",
  },
};

type Service = {
  no: string;
  name: string;
  blurb: string;
  icon: typeof Heart;
  timeIcon: typeof Sun;
  time: string;
  img: string;
  accent: Accent;
  span: string;
  shape: string;
  featured?: boolean;
};

/* Tight, gap-free 12-col layout:
 *  ┌──────────────────────┬───────────┐
 *  │                      │  Baraat   │  row 1
 *  │     Wedding 8×2      ├───────────┤
 *  │     (featured)       │  Mehndi   │  row 2
 *  ├────────┬────────┬────┴───────────┤
 *  │ Haldi  │Sangeet │   Pre-Wedding  │  row 3
 *  └────────┴────────┴────────────────┘
 */
const SERVICES: Service[] = [
  {
    no: "01",
    name: "Wedding",
    blurb:
      "Full-day candid coverage — pheras, vidaai, the speeches and the silences. Two photographers, six hundred edits, one heirloom album.",
    icon: Heart,
    timeIcon: Clock,
    time: "All Day · 12 hrs",
    img: u("photo-1654764746225-e63f5e90facd"),
    accent: "plum",
    span: "sm:col-span-2 lg:col-span-8 lg:row-span-2",
    shape: "rounded-tl-[5rem] rounded-br-[5rem] rounded-tr-2xl rounded-bl-2xl",
    featured: true,
  },
  {
    no: "02",
    name: "Baraat",
    blurb:
      "Dhol, horse, friends carrying you in — the arrival deserves its own film.",
    icon: Crown,
    timeIcon: Moon,
    time: "Evening",
    img: u("photo-1632340904083-7308c4ea7e2d"),
    accent: "terracotta",
    span: "sm:col-span-1 lg:col-span-4",
    shape: "rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-md rounded-br-md",
  },
  {
    no: "03",
    name: "Mehndi",
    blurb: "Hands curling with henna. Songs. Intimate, slow, hand-held.",
    icon: Flower2,
    timeIcon: Sun,
    time: "Day-Before",
    img: u("photo-1702378154233-9b870ff8f1b3"),
    accent: "ruby",
    span: "sm:col-span-1 lg:col-span-4",
    shape: "rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-md rounded-bl-md",
  },
  {
    no: "04",
    name: "Haldi",
    blurb: "Turmeric, laughter, sunlight on skin. The small warm ritual.",
    icon: Sparkles,
    timeIcon: Sun,
    time: "Morning",
    img: u("photo-1681717166573-f71589207785"),
    accent: "jade",
    span: "sm:col-span-1 lg:col-span-4",
    shape: "rounded-t-[3rem] rounded-b-xl",
  },
  {
    no: "05",
    name: "Sangeet",
    blurb: "Choreographed numbers, unchoreographed nani-dancing. Both kept.",
    icon: Music,
    timeIcon: Moon,
    time: "Night",
    img: u("photo-1764176269321-6d14f4af09c7"),
    accent: "plum",
    span: "sm:col-span-1 lg:col-span-4",
    shape: "rounded-b-[3rem] rounded-t-xl",
  },
  {
    no: "06",
    name: "Pre-Wedding",
    blurb: "A travelling portrait session — at home, on a hill, anywhere.",
    icon: Camera,
    timeIcon: Clock,
    time: "Anytime",
    img: u("photo-1606800052052-a08af7148866"),
    accent: "jade",
    span: "sm:col-span-2 lg:col-span-4",
    shape: "rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-md rounded-br-md",
  },
];

function ServiceTile({ s, i }: { s: Service; i: number }) {
  const Icon = s.icon;
  const TimeIcon = s.timeIcon;
  const a = ACCENT[s.accent];

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.9,
        delay: 0.05 + i * 0.08,
        ease: EASE,
      }}
      whileHover={{ y: -8 }}
      className={`group relative isolate flex h-full w-full flex-col justify-end overflow-hidden bg-ink shadow-[0_25px_60px_-25px_rgba(31,15,41,0.5)] transition-all duration-700 hover:shadow-[0_40px_80px_-25px_rgba(107,36,84,0.6)] ${s.shape}`}
    >
      {/* Image background */}
      <Image
        src={s.img}
        alt={s.name}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="-z-10 object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
      />

      {/* Color halo on hover */}
      <div
        className={`pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100 ${a.halo}`}
      />

      {/* Top→bottom gradient — text-zone darkens on hover */}
      <div className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-t from-ink/90 via-ink/45 to-ink/20 transition-all duration-700 group-hover:from-ink/95 group-hover:via-ink/65 group-hover:to-ink/40" />

      {/* Inner frame ring */}
      <span
        className={`pointer-events-none absolute inset-3 z-20 border border-bg/25 transition-all duration-700 group-hover:inset-4 group-hover:border-bg/50 ${s.shape}`}
      />

      {/* TOP-LEFT: huge editorial number */}
      <div className="absolute left-6 top-5 z-10 flex items-center gap-3 sm:left-8 sm:top-7">
        <span className="font-display text-[3rem] leading-none text-bg/95 sm:text-[4rem]">
          {s.no}
        </span>
        <span className="hidden h-10 w-px bg-bg/30 sm:block" />
        <span className="hidden font-display text-sm tracking-[0.32em] text-bg/70 sm:block">
          CHAPTER
        </span>
      </div>

      {/* TOP-RIGHT: time-of-day pill */}
      <div className="absolute right-5 top-5 z-10 flex items-center gap-1.5 rounded-full border border-bg/30 bg-bg/10 px-3 py-1.5 backdrop-blur-md">
        <TimeIcon className="h-3 w-3 text-bg" strokeWidth={1.6} />
        <span className="text-[0.55rem] uppercase tracking-[0.22em] text-bg">
          {s.time}
        </span>
      </div>

      {/* BOTTOM: name + blurb + cta */}
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-[clamp(1.8rem,3.4vw,3.5rem)] leading-[0.95] tracking-tight text-bg">
              {s.name}
            </h3>
            <p
              className={`mt-2 max-w-md text-sm leading-relaxed text-bg/85 transition-all duration-500 ${
                s.featured
                  ? "opacity-100"
                  : "max-h-0 overflow-hidden opacity-0 group-hover:max-h-32 group-hover:opacity-100"
              }`}
            >
              {s.blurb}
            </p>
          </div>

          {/* Floating icon + halo */}
          <div className="relative shrink-0">
            <span
              className={`absolute inset-0 rounded-full opacity-0 blur-xl transition-all duration-700 group-hover:scale-150 group-hover:opacity-90 ${a.halo}`}
            />
            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-full ring-1 transition-all duration-700 group-hover:rotate-[360deg] ${a.iconBg} ${a.ring} text-bg`}
            >
              <Icon className="h-5 w-5" strokeWidth={1.4} />
            </div>
          </div>
        </div>

        {/* CTA strip — slides in on hover */}
        <div className="mt-5 flex items-center gap-3 overflow-hidden">
          <motion.span
            className="h-px flex-1 bg-bg/40"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, delay: 0.6, ease: EASE }}
            style={{ originX: 0 }}
          />
          <a
            href="#contact"
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.28em] transition-all duration-500 ${a.chip} hover:opacity-90`}
          >
            Enquire
            <ArrowUpRight
              className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.8}
            />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

const INCLUSIONS = [
  {
    icon: Users,
    label: "Two Photographers",
    sub: "Lead + second shooter",
    accent: "plum" as const,
  },
  {
    icon: Plane,
    label: "Aerial Coverage",
    sub: "Drone where permitted",
    accent: "jade" as const,
  },
  {
    icon: Zap,
    label: "Sneak Peek",
    sub: "Within the same week",
    accent: "ruby" as const,
  },
  {
    icon: BookOpen,
    label: "Editorial Album",
    sub: "Hand-bound · archival",
    accent: "terracotta" as const,
  },
  {
    icon: MapPin,
    label: "Travel Included",
    sub: "Anywhere in India",
    accent: "plum" as const,
  },
];

const ACCENT_DOT = {
  plum: "bg-plum text-bg",
  jade: "bg-jade text-bg",
  ruby: "bg-ruby text-bg",
  terracotta: "bg-terracotta text-bg",
};

const ACCENT_RING = {
  plum: "group-hover:border-plum/60",
  jade: "group-hover:border-jade/60",
  ruby: "group-hover:border-ruby/60",
  terracotta: "group-hover:border-terracotta/60",
};

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-bg-soft py-28 sm:py-36">
      {/* Background flourish */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blush/15 blur-[140px]" />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10">
        <Ornament label="The Coverage" />

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mt-8 text-center font-display text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
        >
          From haldi to{" "}
          <span className="font-script text-5xl text-plum sm:text-6xl lg:text-7xl">
            vidaai.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base text-ink-soft sm:text-lg"
        >
          Every Indian wedding is a small civilisation of rituals. We come ready
          for all of them — six chapters, one devoted lens.
        </motion.p>

        {/* Bento mosaic — service photos as full backgrounds */}
        <div className="mt-16 grid auto-rows-[260px] grid-cols-1 gap-4 [perspective:1400px] sm:auto-rows-[280px] sm:grid-cols-2 sm:gap-5 lg:auto-rows-[280px] lg:grid-cols-12">
          {SERVICES.map((s, i) => (
            <Tilt3D
              key={s.name}
              intensity={7}
              hoverScale={1}
              className={s.span}
            >
              <ServiceTile s={s} i={i} />
            </Tilt3D>
          ))}
        </div>

        {/* Inclusion banner — premium icon tiles */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-8 flex items-center justify-center gap-4 text-[0.65rem] uppercase tracking-[0.32em]"
          >
            <span className="h-px w-12 bg-plum/30" />
            <Sparkles className="h-4 w-4 text-plum" strokeWidth={1.6} />
            <span className="text-plum">Every collection includes</span>
            <Sparkles className="h-4 w-4 text-plum" strokeWidth={1.6} />
            <span className="h-px w-12 bg-plum/30" />
          </motion.div>

          {/* Inline icon-label row — no cards, just a clean inventory */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-6 sm:gap-x-2">
            {INCLUSIONS.map((inc, i) => {
              const Icon = inc.icon;
              const iconColor = {
                plum: "text-plum",
                jade: "text-jade",
                ruby: "text-ruby",
                terracotta: "text-terracotta",
              }[inc.accent];
              return (
                <motion.div
                  key={inc.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.6,
                    ease: EASE,
                  }}
                  className="group flex items-center gap-3"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper transition-all duration-500 group-hover:scale-110 group-hover:border-current ${iconColor}`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div className="text-left">
                    <div className="font-display text-base leading-tight text-ink sm:text-[1.05rem]">
                      {inc.label}
                    </div>
                    <div className="text-[0.55rem] uppercase tracking-[0.24em] text-muted">
                      {inc.sub}
                    </div>
                  </div>
                  {i < INCLUSIONS.length - 1 && (
                    <span className="ml-4 hidden h-8 w-px bg-line sm:block" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-plum px-9 py-4 text-[0.7rem] uppercase tracking-[0.28em] text-bg shadow-[0_15px_40px_-15px_rgba(107,36,84,0.6)] transition-all duration-500 hover:bg-plum-deep hover:shadow-[0_25px_50px_-15px_rgba(107,36,84,0.8)]"
          >
            Build my package
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={1.8}
            />
          </a>
          <span className="text-[0.6rem] uppercase tracking-[0.32em] text-muted">
            Each wedding is priced custom · Quote in 24 hours
          </span>
        </motion.div>
      </div>
    </section>
  );
}
