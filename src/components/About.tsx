"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  Award,
  Camera,
  Film,
  Heart,
  MapPin,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import { ABOUT_IMAGE, GALLERY, TESTIMONIAL_AVATARS } from "@/lib/images";
import { Mandala, Ornament } from "@/components/Ornament";
import { EASE } from "@/lib/motion";
import Tilt3D from "@/components/Tilt3D";

// ──────────────────────────────────────────────────────────
// Animated count-up — long smooth ease-out, no spring snap
// ──────────────────────────────────────────────────────────
function Counter({
  to,
  suffix = "",
  duration = 2.6,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const value = useMotionValue(0);
  const display = useTransform(value, (v) => Math.round(v).toLocaleString());
  const [text, setText] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, to, value, duration]);

  useEffect(() => display.on("change", (v) => setText(v)), [display]);

  return (
    <span ref={ref}>
      {text}
      {suffix}
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// Polaroid stack — 3 tilted images with paper borders + tape
// ──────────────────────────────────────────────────────────
const POLAROIDS = [
  { src: GALLERY[1].src, tilt: -8, x: -36, y: 24, z: 1, label: "Udaipur · 2023" },
  { src: GALLERY[6].src, tilt: 5, x: 30, y: -20, z: 2, label: "Mumbai · 2024" },
  { src: ABOUT_IMAGE, tilt: -2, x: 0, y: 0, z: 3, label: "On set · This morning" },
];

function PolaroidStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yA = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const yB = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

  return (
    <div ref={ref} className="relative mx-auto h-[560px] w-full max-w-md sm:h-[620px]">
      {POLAROIDS.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 60, rotate: p.tilt - 12, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, rotate: p.tilt, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 1.1,
            delay: i * 0.18,
            ease: EASE,
          }}
          whileHover={{ rotate: p.tilt + (p.tilt > 0 ? -2 : 2), scale: 1.04, zIndex: 10 }}
          style={{
            x: p.x,
            y: i === 1 ? yA : i === 0 ? yB : 0,
            zIndex: p.z,
          }}
          className="group absolute left-1/2 top-1/2 w-[260px] -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-md bg-paper p-3 shadow-[0_30px_70px_-20px_rgba(31,15,41,0.4)] sm:w-[300px]"
        >
          {/* Washi tape */}
          <span className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-3 bg-terracotta/55 mix-blend-multiply" />
          <span className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-3 bg-[repeating-linear-gradient(135deg,transparent_0_4px,rgba(255,255,255,0.25)_4px_5px)]" />

          <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-bg-soft">
            <Image
              src={p.src}
              alt={p.label}
              fill
              sizes="(min-width: 640px) 300px, 260px"
              className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105"
            />
          </div>

          <div className="mt-3 flex items-center justify-between px-1 pb-1">
            <span className="font-script text-2xl text-plum">A S.</span>
            <span className="text-[0.55rem] uppercase tracking-[0.22em] text-muted">
              {p.label}
            </span>
          </div>
        </motion.div>
      ))}

      {/* Floating "5.0 review" badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.8, type: "spring", bounce: 0.4 }}
        className="absolute -bottom-2 left-2 z-20 w-44 rounded-2xl border border-line bg-paper p-4 shadow-2xl"
      >
        <div className="flex items-center gap-1 text-ruby">
          {Array.from({ length: 5 }).map((_, k) => (
            <Star key={k} className="h-3 w-3" fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        <div className="mt-1 font-display text-2xl text-plum">
          <Counter to={5} />
          <span className="text-base text-muted">.0</span>
        </div>
        <div className="text-[0.6rem] uppercase tracking-[0.22em] text-muted">
          Across <Counter to={340} suffix="+" /> reviews
        </div>
      </motion.div>

      {/* Floating "couple" mini-tag */}
      <motion.div
        initial={{ opacity: 0, x: 30, rotate: 10 }}
        whileInView={{ opacity: 1, x: 0, rotate: 6 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 1.1, duration: 1 }}
        className="absolute -right-4 top-12 z-20 rounded-full border border-jade/30 bg-paper px-4 py-2 shadow-xl"
      >
        <span className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.24em] text-jade">
          <Heart className="h-3 w-3" fill="currentColor" strokeWidth={0} />
          Founded with love
        </span>
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Kinetic split-character headline
// ──────────────────────────────────────────────────────────
const charV: Variants = {
  hidden: { y: "110%", opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, delay: 0.1 + i * 0.025, ease: EASE },
  }),
};

function KineticHeadline() {
  return (
    <h2 className="font-display text-[clamp(2.2rem,5.8vw,5rem)] leading-[1.02] tracking-tight text-ink">
      <SplitWord text="We don't pose moments." />
      <br />
      <span className="font-script text-[1.5em] leading-[0.8] text-plum">
        <SplitWord text="we honour them." delay={0.6} />
      </span>
    </h2>
  );
}

function SplitWord({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <span className="inline-block">
      {text.split("").map((ch, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            custom={i + delay * 40}
            variants={charV}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="inline-block"
          >
            {ch === " " ? " " : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// Marker-highlight phrase — yellow-marker swipe behind text
// ──────────────────────────────────────────────────────────
function Mark({
  children,
  color = "plum",
  delay = 0,
}: {
  children: React.ReactNode;
  color?: "plum" | "terracotta" | "jade" | "ruby";
  delay?: number;
}) {
  const colors = {
    plum: "rgba(107, 36, 84, 0.18)",
    terracotta: "rgba(182, 92, 69, 0.22)",
    jade: "rgba(13, 85, 71, 0.16)",
    ruby: "rgba(212, 54, 94, 0.18)",
  };
  return (
    <motion.span
      initial={{ backgroundSize: "0% 70%" }}
      whileInView={{ backgroundSize: "100% 70%" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.2, delay, ease: EASE }}
      style={{
        backgroundImage: `linear-gradient(180deg, transparent 0, transparent 38%, ${colors[color]} 38%, ${colors[color]} 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 0.85em",
        padding: "0.05em 0.15em",
      }}
      className="font-medium text-ink"
    >
      {children}
    </motion.span>
  );
}

// ──────────────────────────────────────────────────────────
// Pull-quote rule — fine line with diamond + thin script
// ──────────────────────────────────────────────────────────
function PullRule({ side = "both" }: { side?: "both" | "top" | "bottom" }) {
  return (
    <div className="flex items-center justify-center gap-3 text-plum/40">
      <span className="h-px w-full bg-line" />
      <svg viewBox="0 0 10 10" className="h-2 w-2 shrink-0" fill="currentColor">
        <path d="M5 0 L10 5 L5 10 L0 5 Z" />
      </svg>
      <span className="h-px w-full bg-line" />
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Editorial body — magazine-style typography
// ──────────────────────────────────────────────────────────
function ChapterMark({
  numeral,
  label,
}: {
  numeral: string;
  label: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-3 pt-2 sm:flex-col sm:items-end sm:gap-2 sm:pt-3 sm:w-20">
      <span className="font-display text-2xl italic leading-none text-plum sm:text-3xl">
        {numeral}.
      </span>
      <span className="hidden h-8 w-px bg-plum/30 sm:block" />
      <span className="text-[0.55rem] uppercase tracking-[0.32em] text-muted">
        {label}
      </span>
    </div>
  );
}

function EditorialBody() {
  return (
    <div className="relative mt-12">
      {/* LEDE — chapter-marker margin + drop-cap paragraph */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: 0.5 }}
        className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8"
      >
        <ChapterMark numeral="I" label="Origin" />

        <div className="flex flex-1 gap-4 sm:gap-5">
          <span
            aria-hidden
            className="shrink-0 font-display text-[5rem] leading-[0.78] sm:text-[6.5rem]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, var(--plum) 0%, var(--terracotta) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            S
          </span>
          <p className="font-display text-[1.3rem] leading-[1.5] tracking-tight text-ink-soft sm:text-[1.55rem] sm:leading-[1.5]">
            aaya Studio was born from a{" "}
            <Mark color="terracotta" delay={1.2}>
              simple obsession
            </Mark>{" "}
            — Indian weddings deserve a way of looking that matches their
            generosity. The colour, the noise, the{" "}
            <Mark color="plum" delay={1.5}>
              held breath before vidaai
            </Mark>
            .
          </p>
        </div>
      </motion.div>

      {/* PULL-QUOTE — floating, ornamental */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, delay: 0.6 }}
        className="relative my-12 mx-auto max-w-lg text-center"
      >
        <PullRule />
        <div className="relative px-8 py-6">
          <span
            aria-hidden
            className="absolute -left-2 top-2 font-display text-[5rem] leading-[0.6] text-terracotta/30"
          >
            &ldquo;
          </span>
          <p className="font-script text-[2.6rem] leading-[1.1] text-plum sm:text-[3.4rem]">
            We photograph like
            <br />
            we&apos;re listening.
          </p>
          <span
            aria-hidden
            className="absolute -right-2 bottom-0 font-display text-[5rem] leading-[0.3] text-terracotta/30"
          >
            &rdquo;
          </span>
        </div>
        <PullRule />
      </motion.div>

      {/* SECOND PARAGRAPH — chapter-marker margin + body */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: 0.7 }}
        className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8"
      >
        <ChapterMark numeral="II" label="Method" />

        <p className="flex-1 text-base leading-[1.85] text-ink-soft sm:text-lg sm:leading-[1.85]">
          Working in{" "}
          <Mark color="jade" delay={1.4}>
            pairs, light and unobtrusive
          </Mark>
          , we move through your day like a memory in real time.{" "}
          <span className="text-plum">No staged kisses.</span>{" "}
          <span className="text-plum">No lining-up of aunties.</span> Just the
          marriage as it actually happens.
        </p>
      </motion.div>

      {/* Footnote-style chapter marker */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="mt-10 flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.32em] text-muted"
      >
        <svg viewBox="0 0 12 12" className="h-2 w-2 text-terracotta" fill="currentColor">
          <path d="M6 0 L12 6 L6 12 L0 6 Z" />
        </svg>
        <span>End of chapter</span>
        <span className="h-px flex-1 bg-line" />
        <span className="font-display italic text-plum">A S Photography · 2012—</span>
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Animated signature — SVG path-drawing
// ──────────────────────────────────────────────────────────
function Signature() {
  return (
    <div className="relative inline-block">
      <motion.svg
        viewBox="0 0 360 80"
        className="h-16 w-72 text-plum sm:h-20 sm:w-96"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <motion.path
          d="M 12 60 Q 22 18 38 50 Q 50 70 56 35 Q 60 14 72 36 Q 80 56 90 30 Q 102 8 116 38 Q 124 62 138 36 L 150 50 Q 160 30 170 45 M 190 56 Q 196 30 206 50 Q 212 64 220 40 M 232 56 Q 240 30 250 50 Q 260 65 268 38 Q 275 18 286 40 Q 295 60 305 32"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 2.6, delay: 1.2, ease: "easeInOut" }}
        />
      </motion.svg>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 3, duration: 0.6 }}
        className="text-[0.65rem] uppercase tracking-[0.28em] text-muted"
      >
        Arjun & Priya · Founders
      </motion.div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Studio masthead — editorial banner with crested qualities
// ──────────────────────────────────────────────────────────
const QUALITIES = ["Film", "Editorial", "Candid", "Worldwide"];

function StudioMasthead() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mt-10 flex flex-col items-center gap-4"
    >
      {/* Top crested line — diamonds between qualities, gradient rules outside */}
      <div className="flex w-full items-center gap-3 sm:gap-4">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-line to-line/70" />
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-5">
          {QUALITIES.map((q, i) => (
            <span key={q} className="flex items-center gap-3 sm:gap-5">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.6 }}
                className="text-[0.62rem] font-medium uppercase tracking-[0.4em] text-ink"
              >
                {q}
              </motion.span>
              {i < QUALITIES.length - 1 && (
                <motion.svg
                  initial={{ opacity: 0, rotate: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, rotate: 45, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    delay: 0.55 + i * 0.08,
                    duration: 0.7,
                    type: "spring",
                    bounce: 0.4,
                  }}
                  viewBox="0 0 10 10"
                  className="h-2 w-2 text-terracotta"
                  fill="currentColor"
                  aria-hidden
                >
                  <rect x="1" y="1" width="8" height="8" />
                </motion.svg>
              )}
            </span>
          ))}
        </div>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-line to-line/70" />
      </div>

      {/* Bottom byline — italic studio crest with monogram */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ delay: 0.85, duration: 0.7 }}
        className="flex flex-wrap items-center justify-center gap-3 text-[0.58rem] uppercase tracking-[0.36em] text-muted"
      >
        <span className="font-display italic text-plum">A S Photography</span>
        <span className="h-1 w-1 rounded-full bg-terracotta" />
        <span>Wedding Photography</span>
        <span className="h-1 w-1 rounded-full bg-terracotta" />
        <span className="font-display italic">est. MMXII</span>
        <span className="hidden h-1 w-1 rounded-full bg-terracotta sm:inline-block" />
        <span className="hidden sm:inline">India · Worldwide</span>
      </motion.div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────
// By-the-numbers stats panel
// ──────────────────────────────────────────────────────────
const STATS = [
  {
    chapter: "i.",
    icon: Camera,
    n: 12,
    suffix: "+",
    word: "Twelve",
    label: "Years Working",
    sub: "Since the studio's first wedding · 2012",
    color: "plum",
    photo:
      "/images/pre-wedding/window-light.jpg",
  },
  {
    chapter: "ii.",
    icon: Heart,
    n: 340,
    suffix: "+",
    word: "Three forty",
    label: "Weddings Filmed",
    sub: "Across India and abroad · every season",
    color: "jade",
    photo:
      "/images/wedding/couple-at-mandap.jpg",
  },
  {
    chapter: "iii.",
    icon: MapPin,
    n: 27,
    suffix: "",
    word: "Twenty-seven",
    label: "Cities Visited",
    sub: "Jaipur · Udaipur · Coorg · Goa · and onward",
    color: "terracotta",
    photo:
      "/images/baraat/horseback.jpg",
  },
] as const;

const STAT_COLOR: Record<
  "plum" | "jade" | "terracotta",
  { text: string; ring: string; halo: string; rule: string; stroke: string; wash: string }
> = {
  plum: {
    text: "text-plum",
    ring: "border-plum/30 group-hover:border-plum/80",
    halo: "bg-plum/15",
    rule: "bg-plum/30 group-hover:bg-plum",
    stroke: "var(--plum)",
    wash:
      "[background:radial-gradient(60%_60%_at_50%_25%,rgba(107,36,84,0.06),transparent_70%)]",
  },
  jade: {
    text: "text-jade",
    ring: "border-jade/30 group-hover:border-jade/80",
    halo: "bg-jade/15",
    rule: "bg-jade/30 group-hover:bg-jade",
    stroke: "var(--jade)",
    wash:
      "[background:radial-gradient(60%_60%_at_50%_25%,rgba(13,85,71,0.06),transparent_70%)]",
  },
  terracotta: {
    text: "text-terracotta",
    ring: "border-terracotta/30 group-hover:border-terracotta/80",
    halo: "bg-terracotta/15",
    rule: "bg-terracotta/30 group-hover:bg-terracotta",
    stroke: "var(--terracotta)",
    wash:
      "[background:radial-gradient(60%_60%_at_50%_25%,rgba(182,92,69,0.07),transparent_70%)]",
  },
};

function StatsBlock() {
  return (
    <div className="mt-24">
      {/* Editorial header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mb-12 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <span className="text-[0.6rem] uppercase tracking-[0.42em] text-muted">
            A S Photography, by the numbers
          </span>
          <h3 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
            Three figures,{" "}
            <span className="font-script text-4xl text-plum sm:text-5xl">
              twelve years.
            </span>
          </h3>
        </div>
        <div className="hidden text-right sm:block">
          <span className="text-[0.55rem] uppercase tracking-[0.32em] text-muted">
            Verified · Updated 2025
          </span>
        </div>
      </motion.div>

      {/* 3 photo-pillars */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          const c = STAT_COLOR[s.color];
          return (
            <Tilt3D
              key={s.label}
              intensity={8}
              hoverScale={1}
              className={
                i === 0
                  ? "rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-md rounded-bl-md"
                  : i === 1
                    ? "rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-md rounded-br-md"
                    : "rounded-t-[3rem] rounded-b-md"
              }
            >
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 1,
                  delay: 0.15 + i * 0.18,
                  ease: EASE,
                }}
                className={`group relative isolate flex h-[520px] w-full flex-col justify-end overflow-hidden bg-ink ${
                  i === 0
                    ? "rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-md rounded-bl-md"
                    : i === 1
                      ? "rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-md rounded-br-md"
                      : "rounded-t-[3rem] rounded-b-md"
                }`}
              >
                {/* Photo background */}
                <Image
                  src={s.photo}
                  alt={s.label}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="-z-10 object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 -z-[5] bg-gradient-to-b from-ink/30 via-ink/55 to-ink/90 transition-opacity duration-700 group-hover:from-ink/40 group-hover:to-ink/95" />

                {/* Accent color wash on hover */}
                <div
                  className={`pointer-events-none absolute inset-0 -z-[6] opacity-0 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-60 ${c.halo}`}
                />

                {/* TOP: chapter mark + icon chip */}
                <div className="absolute inset-x-6 top-6 z-10 flex items-center justify-between">
                  <span className="font-display text-base italic text-bg/85">
                    {s.chapter}
                  </span>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-bg/30 bg-bg/10 text-bg backdrop-blur-md transition-all duration-700 group-hover:rotate-180 group-hover:border-bg`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </span>
                </div>

                {/* CENTER: HUGE editorial number */}
                <div className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-6 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      delay: 0.6 + i * 0.18,
                      duration: 1,
                      ease: EASE,
                    }}
                    className="font-display text-[7rem] leading-none tracking-tight text-bg sm:text-[8.5rem]"
                  >
                    <Counter to={s.n} suffix={s.suffix} duration={3} />
                  </motion.div>
                  {/* Word version below */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: 1.4 + i * 0.18, duration: 0.8 }}
                    className="mt-3 font-script text-2xl text-blush sm:text-3xl"
                  >
                    {s.word}
                  </motion.div>
                </div>

                {/* BOTTOM: inner frame ring + label + sub + rule */}
                <span
                  className={`pointer-events-none absolute inset-3 z-20 border border-bg/25 transition-all duration-700 group-hover:inset-4 group-hover:border-bg/50 ${
                    i === 0
                      ? "rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-md rounded-bl-md"
                      : i === 1
                        ? "rounded-tr-[2.5rem] rounded-bl-[2.5rem] rounded-tl-md rounded-br-md"
                        : "rounded-t-[2.5rem] rounded-b-md"
                  }`}
                />

                <div className="relative z-10 px-7 pb-8 pt-6 text-center">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: 48 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      delay: 1.5 + i * 0.18,
                      duration: 0.9,
                      ease: EASE,
                    }}
                    className="mx-auto mb-4 h-px bg-blush"
                  />
                  <div className="font-display text-xl uppercase tracking-[0.32em] text-bg sm:text-2xl sm:tracking-[0.28em]">
                    {s.label}
                  </div>
                  <div className="mt-3 text-[0.6rem] uppercase tracking-[0.24em] text-blush/80">
                    {s.sub}
                  </div>
                </div>
              </motion.article>
            </Tilt3D>
          );
        })}
      </div>

      {/* Tagline / coda below the row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, delay: 0.4 }}
        className="mt-10 flex flex-col items-center gap-2 text-center"
      >
        <div className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.32em] text-muted">
          <span className="h-px w-12 bg-line" />
          <span className="font-display italic text-plum">
            and counting · every weekend, every season
          </span>
          <span className="h-px w-12 bg-line" />
        </div>
      </motion.div>
    </div>
  );
}

// Founders row — twin arched portraits
// ──────────────────────────────────────────────────────────
const FOUNDERS = [
  {
    img: TESTIMONIAL_AVATARS[2],
    name: "Arjun Mehra",
    role: "Lead Photographer",
    line: "Trained at NID Ahmedabad · Brides Today contributor",
  },
  {
    img: TESTIMONIAL_AVATARS[0],
    name: "Priya Mehra",
    role: "Creative Director",
    line: "Ex–Vogue India · Curates every album by hand",
  },
];

function FoundersRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9 }}
      className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2"
    >
      {FOUNDERS.map((f, i) => (
        <motion.div
          key={f.name}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: i * 0.15 }}
          whileHover={{ y: -4 }}
          className="group flex items-center gap-5 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-xl rounded-bl-xl border border-line bg-paper p-5 shadow-[0_20px_50px_-25px_rgba(31,15,41,0.35)] transition-all duration-500 hover:border-plum/40"
        >
          <div className="relative h-24 w-20 shrink-0 overflow-hidden arch-top ring-1 ring-plum/30">
            <Image
              src={f.img}
              alt={f.name}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="min-w-0">
            <div className="font-display text-2xl text-ink">{f.name}</div>
            <div className="mt-0.5 text-[0.6rem] uppercase tracking-[0.28em] text-plum">
              {f.role}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {f.line}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────
// FILM NEGATIVE STRIP — 5 frames of the studio's history
// (replaces the conventional horizontal timeline)
// ──────────────────────────────────────────────────────────
const FRAMES = [
  {
    year: "2012",
    label: "Founded in Mumbai",
    photo:
      "/images/pre-wedding/window-light.jpg",
  },
  {
    year: "2016",
    label: "First destination wedding",
    photo:
      "/images/pre-wedding/golden-hour.jpg",
  },
  {
    year: "2019",
    label: "Featured — Vogue India",
    photo:
      "/images/wedding/bridal-portrait.jpg",
  },
  {
    year: "2022",
    label: "100th wedding",
    photo:
      "/images/wedding/couple-at-mandap.jpg",
  },
  {
    year: "2025",
    label: "340+ couples · 27 cities",
    photo:
      "/images/baraat/elephant.jpg",
  },
];

/** Renders a row of sprocket holes along the top or bottom edge of the negative */
function Sprockets({ count = 36 }: { count?: number }) {
  return (
    <div className="flex w-full items-center justify-between">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 w-2.5 shrink-0 rounded-[2px] bg-bg-soft/12"
        />
      ))}
    </div>
  );
}

function FilmStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay: 0.2 }}
      className="relative mt-20"
    >
      {/* Header */}
      <div className="mb-9 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <span className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.32em] text-muted">
            <svg
              viewBox="0 0 12 12"
              className="h-2 w-2 text-terracotta"
              fill="currentColor"
            >
              <path d="M6 0 L12 6 L6 12 L0 6 Z" />
            </svg>
            Roll No. 01 · 5 frames
          </span>
          <h3 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
            The negatives,{" "}
            <span className="font-script text-4xl text-plum sm:text-5xl">
              twelve years.
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full border border-terracotta/40 bg-terracotta/5 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.28em] text-terracotta sm:self-end">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-terracotta" />
          </span>
          Developed · 2012 — 2025
        </div>
      </div>

      {/* The negative strip — dark slate body with sprocket holes top + bottom */}
      <motion.div
        initial={{ rotate: -3, opacity: 0 }}
        whileInView={{ rotate: -1.2, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
        className="relative"
      >
        <div className="relative rounded-md bg-ink/[0.94] p-3 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.6)] sm:p-4">
          {/* Top edge — sprocket holes + roll info */}
          <div className="mb-2 flex items-center gap-3 px-1 sm:gap-4">
            <span className="shrink-0 font-mono text-[0.5rem] tracking-[0.18em] text-bg-soft/55">
              KODAK PORTRA 400
            </span>
            <div className="flex-1">
              <Sprockets count={28} />
            </div>
            <span className="shrink-0 font-mono text-[0.5rem] tracking-[0.18em] text-bg-soft/55">
              36 EXP · ASA 400
            </span>
          </div>

          {/* 5 frames */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-5">
            {FRAMES.map((f, i) => (
              <motion.div
                key={f.year}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 + i * 0.1,
                  ease: EASE,
                }}
                whileHover={{ scale: 1.04, zIndex: 10, rotate: 0 }}
                className={`group relative aspect-[3/4] overflow-hidden rounded-[2px] bg-ink shadow-[inset_0_0_0_1px_rgba(245,236,225,0.08)] ${
                  i === 4 ? "col-span-2 lg:col-span-1" : ""
                }`}
              >
                {/* The photo — grayscale at rest, colour on hover */}
                <Image
                  src={f.photo}
                  alt={`${f.year} · ${f.label}`}
                  fill
                  sizes="(min-width: 1024px) 18vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover transition-all duration-[1.4s] ease-out group-hover:scale-110 grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100"
                />
                {/* Slight sepia film tint */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_50%,transparent_40%,rgba(0,0,0,0.5)_100%)] transition-opacity duration-700 group-hover:opacity-50" />

                {/* Frame number — top-left, typewriter */}
                <div className="absolute left-2 top-2 z-10 font-mono text-[0.5rem] tracking-[0.16em] text-bg/85">
                  FR {String(i + 1).padStart(2, "0")}/05
                </div>

                {/* Center year — massive, faintly etched */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
                  <motion.div
                    className="font-display text-[3rem] leading-none tracking-tight text-bg sm:text-[3.6rem]"
                    style={{
                      textShadow: "0 4px 18px rgba(0,0,0,0.35)",
                    }}
                  >
                    {f.year}
                  </motion.div>
                </div>

                {/* Bottom — milestone label + tiny ornament */}
                <div className="absolute inset-x-2 bottom-2 z-10 text-center">
                  <span className="block font-display text-[0.7rem] leading-tight text-blush sm:text-xs">
                    {f.label}
                  </span>
                </div>

                {/* Tape-style corner — only on hover */}
                <span className="pointer-events-none absolute -top-1 left-1/2 h-2 w-8 -translate-x-1/2 -rotate-3 bg-terracotta/0 transition-all duration-700 group-hover:bg-terracotta/70" />
              </motion.div>
            ))}
          </div>

          {/* Bottom edge — sprocket holes + frame markers */}
          <div className="mt-2 flex items-center gap-3 px-1 sm:gap-4">
            <span className="shrink-0 font-mono text-[0.5rem] tracking-[0.18em] text-bg-soft/55">
              ◉ A S
            </span>
            <div className="flex-1">
              <Sprockets count={28} />
            </div>
            <span className="shrink-0 font-mono text-[0.5rem] tracking-[0.18em] text-bg-soft/55">
              MMXII—MMXXV
            </span>
          </div>
        </div>

        {/* Film canister sticker — vintage label */}
        <motion.div
          initial={{ rotate: 8, opacity: 0, y: 20 }}
          whileInView={{ rotate: 6, opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 1.2, type: "spring", bounce: 0.4 }}
          className="absolute -bottom-4 -right-2 z-20 rounded-sm bg-paper px-3 py-2 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.35)] sm:-right-4"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-plum text-bg">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="12" cy="12" r="3.5" />
                <path d="M3 12h6M15 12h6M12 3v6M12 15v6" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="font-display text-[0.55rem] tracking-[0.28em] text-plum">
                A·S STUDIO
              </div>
              <div className="font-mono text-[0.5rem] text-muted">
                ROLL 01 · DEV 2025
              </div>
            </div>
          </div>
        </motion.div>

        {/* Date stamp — bottom-left */}
        <motion.div
          initial={{ rotate: -6, opacity: 0 }}
          whileInView={{ rotate: -4, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 1.4, duration: 0.7 }}
          className="absolute -bottom-3 left-3 z-20 rounded-sm border border-ruby/60 bg-paper/95 px-2 py-1"
        >
          <span className="font-mono text-[0.5rem] uppercase tracking-[0.22em] text-ruby">
            ▸ PROCESSED — 14 / 05 / 25
          </span>
        </motion.div>
      </motion.div>

      {/* Tiny caption under the strip */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="mt-10 text-center text-[0.55rem] uppercase tracking-[0.32em] text-muted"
      >
        Hover any frame to develop · the colour returns
      </motion.p>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════
// SCRAPBOOK COMPONENTS — taped photos, sticky notes, stamps,
// pinned tickets, coffee rings, washi tape, handwritten margins,
// bookmark ribbon, hand-drawn doodles, wax seal, photo strip
// ══════════════════════════════════════════════════════════

// ────────── Hand-drawn doodle SVGs ──────────
function DoodleHeart(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M12 19c-2.9-2.7-7-5.8-7-10.2 0-1.8 1.3-3.3 3.2-3.3 1.4 0 2.5 0.9 3.8 2.4 1.3-1.6 2.4-2.4 3.8-2.4C17.7 5.5 19 7 19 8.8c0 4.4-4.2 7.6-7 10.2z" />
    </svg>
  );
}

function DoodleStar(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M12 3.5l2.4 5.9 6.4.5-4.9 4.1 1.5 6.2L12 16.7l-5.4 3.5 1.5-6.2-4.9-4.1 6.4-.5z" />
    </svg>
  );
}

function DoodleSun(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      {...p}
    >
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7" />
    </svg>
  );
}

function DoodleArrow(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...p}
    >
      <path d="M3 12c4-3 10-6 20-4 6 1.2 10 4 14 6" />
      <path d="M32 9l5 5-5 5" />
    </svg>
  );
}

function DoodleFlower(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      {...p}
    >
      <circle cx="12" cy="12" r="2" />
      <path d="M12 5c-1.5 0-2 2-2 3.5 0 1 0.6 1.5 2 1.5s2-0.5 2-1.5C14 7 13.5 5 12 5z" />
      <path d="M19 12c0-1.5-2-2-3.5-2-1 0-1.5 0.6-1.5 2s0.5 2 1.5 2c1.5 0 3.5-0.5 3.5-2z" />
      <path d="M12 19c1.5 0 2-2 2-3.5 0-1-0.6-1.5-2-1.5s-2 0.5-2 1.5C10 17 10.5 19 12 19z" />
      <path d="M5 12c0 1.5 2 2 3.5 2 1 0 1.5-0.6 1.5-2s-0.5-2-1.5-2C7 10 5 10.5 5 12z" />
    </svg>
  );
}

function DoodleLeaf(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      {...p}
    >
      <path d="M4 20c0-8 4-14 16-16-1 13-7 17-16 16z" />
      <path d="M4 20c4-5 8-8 14-12" />
    </svg>
  );
}

// Floats a doodle at an absolute position
function Doodle({
  Icon,
  className,
  rotate = 0,
  delay = 0,
}: {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className: string;
  rotate?: number;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0, rotate: rotate - 30 }}
      whileInView={{ opacity: 1, scale: 1, rotate }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0.5 }}
      className={`pointer-events-none absolute z-20 ${className}`}
      aria-hidden
    >
      <Icon className="h-full w-full" />
    </motion.span>
  );
}

// ────────── Bookmark ribbon — hangs from top of diary ──────────
function BookmarkRibbon() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay: 0.3 }}
      className="pointer-events-none absolute -top-2 right-12 z-30 h-[180px] w-9 sm:right-20 sm:h-[220px]"
      aria-hidden
    >
      {/* Main ribbon body */}
      <div
        className="absolute inset-x-0 top-0 h-full bg-gradient-to-r from-ruby-deep via-ruby to-ruby-deep shadow-[2px_0_8px_-2px_rgba(0,0,0,0.3)]"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 88%, 0 100%)",
        }}
      />
      {/* Stitching detail */}
      <div className="absolute inset-x-1.5 top-3 h-px bg-bg/30" />
      <div className="absolute inset-x-1.5 top-6 h-px bg-bg/15" />
    </motion.div>
  );
}

// ────────── Wax seal monogram ──────────
function WaxSeal() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.4, rotate: -25 }}
      whileInView={{ opacity: 1, scale: 1, rotate: -12 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.9,
        delay: 0.2,
        type: "spring",
        stiffness: 180,
        damping: 12,
      }}
      className="relative inline-flex shrink-0"
    >
      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-ruby-deep to-ruby text-bg shadow-[0_10px_25px_-6px_rgba(165,37,70,0.65)]">
        {/* Engraving rings */}
        <span className="absolute inset-1.5 rounded-full border border-bg/30" />
        <span className="absolute inset-3 rounded-full border border-bg/15" />
        {/* Drip drops at the bottom — wax dripping down */}
        <span
          className="absolute -bottom-2 left-4 h-3 w-2 rounded-b-full bg-ruby-deep"
          style={{ filter: "drop-shadow(0 2px 1px rgba(0,0,0,0.25))" }}
        />
        <span
          className="absolute -bottom-1 right-5 h-2 w-1.5 rounded-b-full bg-ruby"
          style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.2))" }}
        />
        <div className="relative text-center font-display leading-none">
          <div className="text-xl tracking-[0.16em]">A·S</div>
          <div className="mt-0.5 font-mono text-[0.4rem] uppercase tracking-[0.22em] text-bg/70">
            sealed
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ────────── Vertical photo contact strip ──────────
function PhotoStrip({ photos }: { photos: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -7 }}
      whileInView={{ opacity: 1, y: 0, rotate: -3 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, type: "spring", bounce: 0.3 }}
      whileHover={{ rotate: 0, scale: 1.04 }}
      className="relative inline-block bg-ink p-2 shadow-[0_18px_35px_-15px_rgba(0,0,0,0.5)]"
    >
      <WashiTape variant="jade" className="-top-2 left-1/2 w-12 -translate-x-1/2 -rotate-3" />
      <div className="flex flex-col gap-1.5">
        {photos.map((src, i) => (
          <div
            key={i}
            className="relative h-20 w-14 overflow-hidden bg-ink"
          >
            <Image
              src={src}
              alt={`Contact ${i + 1}`}
              fill
              sizes="56px"
              className="object-cover grayscale brightness-95"
            />
            <div className="absolute inset-1 ring-1 ring-bg/20" />
          </div>
        ))}
      </div>
      <div className="mt-2 text-center font-mono text-[0.45rem] uppercase tracking-[0.2em] text-bg/60">
        ROLL 04 — 3 FR
      </div>
    </motion.div>
  );
}

function SpiralBinding({ count = 16 }: { count?: number }) {
  return (
    <div className="flex w-full items-center justify-around gap-1 px-6 py-3 sm:gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="spiral-hole shrink-0" />
      ))}
    </div>
  );
}

function WashiTape({
  className = "",
  variant = "terracotta",
}: {
  className?: string;
  variant?: "terracotta" | "plum" | "jade";
}) {
  const cls = {
    terracotta: "washi-tape",
    plum: "washi-tape-plum",
    jade: "washi-tape-jade",
  }[variant];
  return <span className={`pointer-events-none absolute h-4 ${cls} ${className}`} />;
}

function PinnedPolaroid({
  src,
  caption,
  date,
  tilt = -3,
  className = "",
}: {
  src: string;
  caption: string;
  date: string;
  tilt?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: tilt - 8, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, type: "spring", bounce: 0.35 }}
      whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
      className={`relative w-[200px] bg-paper p-2.5 shadow-[0_18px_35px_-15px_rgba(31,15,41,0.4)] sm:w-[240px] sm:p-3 ${className}`}
    >
      <WashiTape className="-top-2 left-1/2 w-14 -translate-x-1/2 -rotate-2" />
      <div className="relative aspect-[3/4] overflow-hidden bg-bg-soft">
        <Image src={src} alt={caption} fill sizes="240px" className="object-cover" />
      </div>
      <div className="mt-2 flex items-baseline justify-between px-1 pb-1">
        <span className="font-script text-2xl text-plum leading-none">
          {caption}
        </span>
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-muted">
          {date}
        </span>
      </div>
    </motion.div>
  );
}

function StickyNote({
  children,
  className = "",
  tilt = -3,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: number;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: tilt - 5 }}
      whileInView={{ opacity: 1, scale: 1, rotate: tilt }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, type: "spring", bounce: 0.4 }}
      className={`relative inline-block bg-blush/55 p-4 shadow-[0_8px_18px_-8px_rgba(31,15,41,0.35)] ${className}`}
      style={{ minWidth: 160 }}
    >
      <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blush-soft" />
      {children}
    </motion.div>
  );
}

function TornPaperQuote({ quote }: { quote: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: -0.5 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1 }}
      className="relative mx-auto w-full max-w-md"
    >
      <WashiTape variant="plum" className="-top-2 left-12 w-20 -rotate-3" />
      <WashiTape variant="plum" className="-top-2 right-12 w-20 rotate-3" />
      <div className="torn-paper bg-paper px-8 py-9 text-center shadow-[0_15px_35px_-15px_rgba(31,15,41,0.3)]">
        <span className="font-mono text-[0.5rem] uppercase tracking-[0.28em] text-muted">
          ⊹ A pinned note ⊹
        </span>
        <p className="mt-3 font-script text-3xl leading-tight text-plum sm:text-4xl">
          &ldquo;{quote[0]}
          <br />
          {quote[1]}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}

function RubberStamp({
  big,
  small,
  bottom,
  variant,
  tilt = -4,
}: {
  big: string;
  small: string;
  bottom: string;
  variant: "plum" | "jade" | "terracotta" | "ruby";
  tilt?: number;
}) {
  const color = {
    plum: "text-plum border-plum/60",
    jade: "text-jade border-jade/60",
    terracotta: "text-terracotta border-terracotta/60",
    ruby: "text-ruby border-ruby/60",
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: tilt + 12 }}
      whileInView={{ opacity: 0.95, scale: 1, rotate: tilt }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.45 }}
      whileHover={{ rotate: 0, scale: 1.05 }}
      className={`stamp-ink relative inline-flex flex-col items-center rounded-full border-[2.5px] px-6 py-5 ${color}`}
    >
      <span className="absolute inset-2 rounded-full border border-current opacity-50" />
      <span className="font-mono text-[0.55rem] uppercase tracking-[0.32em]">
        {small}
      </span>
      <span className="font-display text-4xl leading-none sm:text-5xl">
        {big}
      </span>
      <span className="mt-1 font-mono text-[0.5rem] uppercase tracking-[0.2em] opacity-80">
        {bottom}
      </span>
    </motion.div>
  );
}

function PinnedTicket({ year, label }: { year: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, rotate: 6 }}
      whileInView={{ opacity: 1, y: 0, rotate: 3 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
      className="relative inline-flex flex-col items-start gap-1 bg-bg-soft px-4 py-3 shadow-[0_8px_18px_-8px_rgba(31,15,41,0.3)]"
    >
      <span className="push-pin absolute -top-2 left-1/2 -translate-x-1/2" />
      <span className="font-mono text-[0.5rem] uppercase tracking-[0.28em] text-ruby">
        Admit one
      </span>
      <div className="flex items-end gap-2">
        <span className="font-display text-2xl leading-none text-plum">
          {year}
        </span>
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-muted">
          {label}
        </span>
      </div>
      {/* Perforated edge dots */}
      <span className="absolute -right-1 top-0 bottom-0 flex flex-col justify-around">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-bg-soft ring-1 ring-line" />
        ))}
      </span>
    </motion.div>
  );
}

function CoffeeRing({ className = "" }: { className?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.2 }}
      className={`coffee-ring pointer-events-none absolute rounded-full ${className}`}
      aria-hidden
    />
  );
}

function MarginNote({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay: 0.4 }}
      className={`pointer-events-none ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════
// VARIANT 1 — EDITORIAL SPREAD (Vogue magazine style)
// Big imagery, generous whitespace, alternating chapter rows,
// dramatic full-bleed pull-quote, premium typography.
// ══════════════════════════════════════════════════════════
function EditorialVariant() {
  return (
    <>
      {/* Opener */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="mx-auto flex items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.42em] text-muted"
        >
          <span className="h-px w-12 bg-line" />
          <span>Entry No. 01 · The Studio</span>
          <span className="h-px w-12 bg-line" />
        </motion.div>

        <h2 className="mt-8 font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.98] tracking-tight text-ink">
          <SplitWord text="We don't pose moments." />
          <br />
          <span className="font-script text-[1.4em] leading-[0.9] text-plum">
            <SplitWord text="we honour them." delay={0.4} />
          </span>
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mx-auto mt-10 h-px w-24 origin-center bg-plum"
        />
      </div>

      {/* CHAPTER I — Photo left · Copy right */}
      <div className="mt-28 grid grid-cols-1 items-center gap-12 sm:gap-16 lg:grid-cols-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="relative lg:col-span-7"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-bg-soft shadow-[0_40px_90px_-40px_rgba(31,15,41,0.4)]">
            <Image
              src="/images/haldi/turmeric-splash.jpg"
              alt="Origin"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-[2s] hover:scale-[1.04]"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 hidden h-32 w-32 border border-plum/40 sm:block" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <div className="flex items-baseline gap-3">
            <span className="font-display text-5xl italic leading-none text-plum sm:text-6xl">
              I.
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.42em] text-muted">
              Origin
            </span>
          </div>

          <p className="mt-7 font-display text-[1.35rem] leading-[1.55] text-ink-soft sm:text-[1.55rem]">
            <span
              aria-hidden
              className="float-left mr-3 mt-3 font-display text-[5.5rem] leading-[0.78] text-plum sm:text-[7rem]"
            >
              A
            </span>{" "}
            S Photography was born from a{" "}
            <Mark color="terracotta" delay={1.2}>
              simple obsession
            </Mark>{" "}
            — Indian weddings deserve a way of looking that matches their
            generosity. The colour, the noise, the{" "}
            <Mark color="plum" delay={1.5}>
              held breath before vidaai
            </Mark>
            .
          </p>

          <div className="mt-10 flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.32em] text-muted">
            <span className="h-px w-8 bg-plum/40" />
            <span className="font-display italic text-plum">est. 2012</span>
            <span className="h-px w-8 bg-plum/40" />
          </div>
        </motion.div>
      </div>

      {/* CHAPTER II — Copy left · Photo right (mirrored) */}
      <div className="mt-32 grid grid-cols-1 items-center gap-12 sm:gap-16 lg:grid-cols-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="order-2 lg:order-1 lg:col-span-5"
        >
          <div className="flex items-baseline gap-3">
            <span className="font-display text-5xl italic leading-none text-plum sm:text-6xl">
              II.
            </span>
            <span className="text-[0.6rem] uppercase tracking-[0.42em] text-muted">
              Method
            </span>
          </div>

          <p className="mt-7 font-display text-[1.35rem] leading-[1.55] text-ink-soft sm:text-[1.55rem]">
            Working in{" "}
            <Mark color="jade" delay={1.2}>
              pairs, light and unobtrusive
            </Mark>
            , we move through your day like a memory in real time.{" "}
            <span className="text-plum">No staged kisses.</span>{" "}
            <span className="text-plum">No lining-up of aunties.</span> Just the
            marriage as it actually happens.
          </p>

          <div className="mt-10 flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.32em] text-muted">
            <span className="h-px w-8 bg-plum/40" />
            <span className="font-display italic text-plum">
              candid · editorial · film
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative order-1 lg:order-2 lg:col-span-7"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-bg-soft shadow-[0_40px_90px_-40px_rgba(31,15,41,0.4)]">
            <Image
              src="/images/wedding/couple-at-mandap.jpg"
              alt="Method"
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-[2s] hover:scale-[1.04]"
            />
          </div>
          <div className="absolute -bottom-3 -left-3 hidden h-32 w-32 border border-terracotta/40 sm:block" />
        </motion.div>
      </div>

      {/* FULL-BLEED CINEMATIC PULL-QUOTE */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2 }}
        className="relative my-28 -mx-4 sm:-mx-8 lg:-mx-16"
      >
        <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <Image
            src="/images/wedding/bridal-portrait.jpg"
            alt="Pull-quote"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-ink/40 to-ink/65" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,transparent_30%,rgba(31,15,41,0.4)_100%)]" />

          <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-bg">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[0.6rem] uppercase tracking-[0.42em] text-blush"
            >
              ⊹ A note on what we believe ⊹
            </motion.span>

            <motion.blockquote
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-8 font-display text-[clamp(2rem,5vw,4.2rem)] leading-[1.1] tracking-tight"
            >
              &ldquo;We photograph like
              <br />
              <span className="font-script text-[1.4em] text-blush">
                we&apos;re listening.&rdquo;
              </span>
            </motion.blockquote>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-10 h-px w-20 origin-center bg-blush"
            />
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="mt-5 font-mono text-[0.55rem] uppercase tracking-[0.32em] text-bg/70"
            >
              A · S Photography · est. 2012
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* FOUNDERS — premium portrait cards */}
      <div className="mt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.42em] text-muted"
        >
          <span className="h-px w-12 bg-line" />
          <span>The Founders</span>
          <span className="h-px w-12 bg-line" />
        </motion.div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12">
          {[
            {
              name: "Arjun Mehra",
              role: "Lead Photographer",
              bio: "Trained at NID Ahmedabad · Brides Today contributor",
              img: TESTIMONIAL_AVATARS[2],
            },
            {
              name: "Priya Mehra",
              role: "Creative Director",
              bio: "Ex–Vogue India · Curates every album by hand",
              img: TESTIMONIAL_AVATARS[0],
            },
          ].map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.15 }}
              className="group text-center"
            >
              <div className="relative mx-auto aspect-[3/4] max-w-[280px] overflow-hidden bg-bg-soft shadow-[0_30px_60px_-30px_rgba(31,15,41,0.4)]">
                <Image
                  src={f.img}
                  alt={f.name}
                  fill
                  sizes="280px"
                  className="object-cover transition-transform duration-[1.6s] group-hover:scale-105"
                />
              </div>
              <h4 className="mt-7 font-display text-2xl text-ink sm:text-3xl">
                {f.name}
              </h4>
              <div className="mt-2 text-[0.6rem] uppercase tracking-[0.32em] text-plum">
                {f.role}
              </div>
              <p className="mt-3 text-sm text-ink-soft">{f.bio}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 text-center font-script text-3xl text-plum"
        >
          — together since 2012 —
        </motion.p>
      </div>

      {/* BY THE NUMBERS — premium minimal */}
      <div className="mt-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="mb-14 flex items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.42em] text-muted"
        >
          <span className="h-px w-12 bg-line" />
          <span>By the Numbers</span>
          <span className="h-px w-12 bg-line" />
        </motion.div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          {[
            { n: 12, suffix: "+", label: "Years Working" },
            { n: 340, suffix: "+", label: "Weddings Filmed" },
            { n: 27, suffix: "", label: "Cities Visited" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.12 }}
              className="relative text-center"
            >
              {i > 0 && (
                <span className="pointer-events-none absolute -left-4 top-1/2 hidden h-12 w-px -translate-y-1/2 bg-line sm:block" />
              )}
              <div className="font-display text-[clamp(4rem,9vw,6.5rem)] leading-none tracking-tight text-plum">
                <Counter to={s.n} suffix={s.suffix} duration={2.6} />
              </div>
              <div className="mt-4 text-[0.6rem] uppercase tracking-[0.32em] text-muted">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Film strip kept */}
      <div className="mt-20">
        <FilmStrip />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════
// VARIANT 2 — CINEMATIC SCROLL
// Three full-screen scenes, each with a fixed background image
// that crossfades as you scroll past. Text drifts in over them.
// ══════════════════════════════════════════════════════════
function CinematicScene({
  src,
  eyebrow,
  title,
  body,
  isQuote,
}: {
  src: string;
  eyebrow: string;
  title: string;
  body?: string;
  isQuote?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1]);
  const textY = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[600px] w-full overflow-hidden"
    >
      <motion.div
        style={{ opacity, scale }}
        className="absolute inset-0 -z-10"
      >
        <Image src={src} alt={eyebrow} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/35 to-ink/75" />
      </motion.div>

      <motion.div
        style={{ y: textY }}
        className="relative flex h-full flex-col items-center justify-center px-6 text-center text-bg"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.42em] text-blush">
          {eyebrow}
        </span>
        <h3
          className={`mt-6 font-display leading-[1.05] tracking-tight ${
            isQuote ? "text-[clamp(2.6rem,7vw,5.8rem)]" : "text-[clamp(2.4rem,6vw,5rem)]"
          }`}
        >
          {isQuote ? (
            <>
              &ldquo;{title.split(" / ")[0]}
              <br />
              <span className="font-script text-[1.3em] text-blush">
                {title.split(" / ")[1]}&rdquo;
              </span>
            </>
          ) : (
            title
          )}
        </h3>
        {body && (
          <p className="mt-8 max-w-xl text-balance text-base leading-relaxed text-bg/85 sm:text-lg">
            {body}
          </p>
        )}
        <span className="mt-10 h-px w-16 bg-blush" />
      </motion.div>
    </section>
  );
}

function CinematicVariant() {
  return (
    <div className="relative">
      <CinematicScene
        src="/images/haldi/turmeric-splash.jpg"
        eyebrow="01 — Our Story"
        title="We don't pose moments. We honour them."
        body="A S Photography was born from a simple obsession — Indian weddings deserve a way of looking that matches their generosity."
      />
      <CinematicScene
        src="/images/wedding/couple-at-mandap.jpg"
        eyebrow="02 — Method"
        title="Pairs, light and unobtrusive."
        body="We move through your day like a memory in real time. No staged kisses. No lining-up of aunties. Just the marriage as it actually happens."
      />
      <CinematicScene
        src="/images/wedding/bridal-portrait.jpg"
        eyebrow="03 — A note"
        title="We photograph like / we're listening."
        isQuote
      />

      <div className="mx-auto w-full max-w-5xl px-6 py-24">
        <FoundersBlock />
        <StatsRow />
        <div className="mt-16">
          <FilmStrip />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// VARIANT 3 — GLASS CARDS ON HERO
// One huge atmospheric photo. Frosted glass cards float over it.
// ══════════════════════════════════════════════════════════
function GlassVariant() {
  return (
    <div className="relative">
      {/* Sticky hero photo */}
      <div className="sticky top-0 -z-10 h-screen w-full overflow-hidden">
        <Image
          src="/images/wedding/couple-at-mandap.jpg"
          alt="A wedding"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/40 to-ink/70" />
      </div>

      <div className="relative -mt-[100vh] px-4 py-32 sm:px-8 sm:py-40">
        <div className="mx-auto flex max-w-4xl flex-col gap-8">
          {/* Title card */}
          <GlassCard delay={0}>
            <div className="text-center">
              <span className="text-[0.6rem] uppercase tracking-[0.42em] text-blush">
                01 — Our Story
              </span>
              <h2 className="mt-5 font-display text-4xl leading-tight text-bg sm:text-5xl">
                We don&apos;t pose moments.{" "}
                <span className="font-script text-5xl text-blush sm:text-6xl">
                  we honour them.
                </span>
              </h2>
            </div>
          </GlassCard>

          {/* Chapter I */}
          <GlassCard delay={0.1}>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl italic text-blush">I.</span>
              <span className="text-[0.55rem] uppercase tracking-[0.32em] text-bg/70">
                Origin
              </span>
            </div>
            <p className="mt-4 text-balance text-base leading-relaxed text-bg/90 sm:text-lg">
              A S Photography was born from a simple obsession — Indian weddings
              deserve a way of looking that matches their generosity. The
              colour, the noise, the held breath before vidaai.
            </p>
          </GlassCard>

          {/* Chapter II */}
          <GlassCard delay={0.2}>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl italic text-blush">II.</span>
              <span className="text-[0.55rem] uppercase tracking-[0.32em] text-bg/70">
                Method
              </span>
            </div>
            <p className="mt-4 text-balance text-base leading-relaxed text-bg/90 sm:text-lg">
              Working in pairs, light and unobtrusive, we move through your day
              like a memory in real time. No staged kisses. No lining-up of
              aunties.
            </p>
          </GlassCard>

          {/* Quote */}
          <GlassCard delay={0.3} accent>
            <p className="text-center font-script text-3xl leading-tight text-bg sm:text-5xl">
              &ldquo;We photograph like
              <br />
              we&apos;re listening.&rdquo;
            </p>
            <p className="mt-5 text-center text-[0.55rem] uppercase tracking-[0.32em] text-blush">
              A · S Photography · est. 2012
            </p>
          </GlassCard>

          {/* Founders + stats glass-styled */}
          <GlassCard delay={0.4}>
            <div className="grid grid-cols-2 gap-6 sm:gap-10">
              {[
                { name: "Arjun Mehra", role: "Lead Photographer", img: TESTIMONIAL_AVATARS[2] },
                { name: "Priya Mehra", role: "Creative Director", img: TESTIMONIAL_AVATARS[0] },
              ].map((f) => (
                <div key={f.name} className="flex items-center gap-4">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden arch-top ring-1 ring-blush/50">
                    <Image src={f.img} alt={f.name} fill sizes="56px" className="object-cover" />
                  </div>
                  <div>
                    <div className="font-display text-lg text-bg">{f.name}</div>
                    <div className="text-[0.55rem] uppercase tracking-[0.28em] text-blush">
                      {f.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard delay={0.5}>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { n: 12, suffix: "+", label: "Years" },
                { n: 340, suffix: "+", label: "Weddings" },
                { n: 27, suffix: "", label: "Cities" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-4xl text-bg sm:text-5xl">
                    <Counter to={s.n} suffix={s.suffix} duration={2.4} />
                  </div>
                  <div className="mt-1 text-[0.55rem] uppercase tracking-[0.28em] text-blush">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="relative bg-bg-soft px-4 py-20 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <FilmStrip />
        </div>
      </div>
    </div>
  );
}

function GlassCard({
  children,
  delay,
  accent,
}: {
  children: React.ReactNode;
  delay: number;
  accent?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={`relative overflow-hidden rounded-2xl border ${
        accent ? "border-blush/40 bg-bg/10" : "border-bg/20 bg-bg/[0.08]"
      } p-8 backdrop-blur-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)] sm:p-10`}
    >
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-bg/10 via-transparent to-transparent opacity-70" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════
// VARIANT 4 — STICKY PHOTO STACK
// Sticky image column on one side, scrolling text on the other.
// Image changes as you cross each chapter boundary.
// ══════════════════════════════════════════════════════════
function StickyVariant() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const photos = [
    "/images/haldi/turmeric-splash.jpg",
    "/images/wedding/couple-at-mandap.jpg",
    "/images/wedding/bridal-portrait.jpg",
  ];

  const chapters = [
    {
      numeral: "I",
      label: "Origin",
      title: "A simple obsession.",
      body:
        "A S Photography was born from the belief that Indian weddings deserve a way of looking that matches their generosity. The colour, the noise, the held breath before vidaai — every grain of it.",
    },
    {
      numeral: "II",
      label: "Method",
      title: "Pairs, in real time.",
      body:
        "Working in pairs, light and unobtrusive, we move through your day like a memory in real time. No staged kisses. No lining-up of aunties. Just the marriage as it actually happens.",
    },
    {
      numeral: "III",
      label: "Today",
      title: "Twelve years on.",
      body:
        "340 weddings, 27 cities, and counting. We still keep the season small — 18 to 24 weddings — so the work stays personal, and the people stay close.",
    },
  ];

  return (
    <div ref={ref} className="relative">
      {/* Opener */}
      <div className="mb-16 text-center">
        <div className="flex items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.42em] text-muted">
          <span className="h-px w-12 bg-line" />
          <span>The Studio</span>
          <span className="h-px w-12 bg-line" />
        </div>
        <h2 className="mt-7 font-display text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl">
          We don&apos;t pose moments.{" "}
          <span className="font-script text-5xl text-plum sm:text-6xl lg:text-7xl">
            we honour them.
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Sticky image */}
        <div className="lg:col-span-6">
          <div className="sticky top-24 h-[70vh] min-h-[420px] overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-md rounded-bl-md shadow-[0_30px_80px_-30px_rgba(31,15,41,0.45)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.9, ease: EASE }}
                className="absolute inset-0"
              >
                <Image
                  src={photos[active]}
                  alt={chapters[active].label}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Chapter pagination dots */}
            <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
              {chapters.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full bg-bg transition-all duration-500 ${
                    i === active ? "w-10 opacity-100" : "w-2 opacity-50"
                  }`}
                />
              ))}
            </div>
            <div className="absolute left-6 top-6 text-bg">
              <div className="font-display text-5xl italic leading-none">
                {chapters[active].numeral}.
              </div>
              <div className="mt-2 text-[0.55rem] uppercase tracking-[0.32em] text-blush">
                {chapters[active].label}
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling chapters */}
        <div className="lg:col-span-6">
          {chapters.map((ch, i) => (
            <ChapterPanel
              key={ch.numeral}
              chapter={ch}
              onEnter={() => setActive(i)}
              isLast={i === chapters.length - 1}
            />
          ))}
        </div>
      </div>

      <div className="mt-20 space-y-20">
        <FoundersBlock />
        <StatsRow />
        <FilmStrip />
      </div>
    </div>
  );
}

function ChapterPanel({
  chapter,
  onEnter,
  isLast,
}: {
  chapter: { numeral: string; label: string; title: string; body: string };
  onEnter: () => void;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (inView) onEnter();
  }, [inView, onEnter]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9 }}
      className={`min-h-[60vh] flex flex-col justify-center ${!isLast ? "border-b border-line pb-20 mb-20" : ""}`}
    >
      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl italic text-plum sm:text-4xl">
          {chapter.numeral}.
        </span>
        <span className="text-[0.55rem] uppercase tracking-[0.32em] text-muted">
          {chapter.label}
        </span>
      </div>
      <h3 className="mt-5 font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
        {chapter.title}
      </h3>
      <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
        {chapter.body}
      </p>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════
// Shared blocks used by all variants
// ══════════════════════════════════════════════════════════
function FoundersBlock() {
  return (
    <div>
      <div className="mb-10 flex items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.42em] text-muted">
        <span className="h-px w-12 bg-line" />
        <span>The Founders</span>
        <span className="h-px w-12 bg-line" />
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10">
        {[
          {
            name: "Arjun Mehra",
            role: "Lead Photographer",
            bio: "Trained at NID Ahmedabad · Brides Today contributor",
            img: TESTIMONIAL_AVATARS[2],
          },
          {
            name: "Priya Mehra",
            role: "Creative Director",
            bio: "Ex–Vogue India · Curates every album by hand",
            img: TESTIMONIAL_AVATARS[0],
          },
        ].map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.12 }}
            className="group text-center"
          >
            <div className="relative mx-auto aspect-[3/4] max-w-[240px] overflow-hidden bg-bg-soft shadow-[0_25px_55px_-25px_rgba(31,15,41,0.4)]">
              <Image
                src={f.img}
                alt={f.name}
                fill
                sizes="240px"
                className="object-cover transition-transform duration-[1.6s] group-hover:scale-105"
              />
            </div>
            <h4 className="mt-6 font-display text-xl text-ink sm:text-2xl">
              {f.name}
            </h4>
            <div className="mt-1.5 text-[0.55rem] uppercase tracking-[0.32em] text-plum">
              {f.role}
            </div>
            <p className="mt-2 text-xs text-ink-soft">{f.bio}</p>
          </motion.div>
        ))}
      </div>
      <p className="mt-8 text-center font-script text-2xl text-plum sm:text-3xl">
        — together since 2012 —
      </p>
    </div>
  );
}

function StatsRow() {
  return (
    <div>
      <div className="mb-12 flex items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.42em] text-muted">
        <span className="h-px w-12 bg-line" />
        <span>By the Numbers</span>
        <span className="h-px w-12 bg-line" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        {[
          { n: 12, suffix: "+", label: "Years" },
          { n: 340, suffix: "+", label: "Weddings" },
          { n: 27, suffix: "", label: "Cities" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 + i * 0.1 }}
            className="text-center"
          >
            <div className="font-display text-[clamp(3rem,8vw,5.5rem)] leading-none text-plum">
              <Counter to={s.n} suffix={s.suffix} duration={2.6} />
            </div>
            <div className="mt-3 text-[0.55rem] uppercase tracking-[0.32em] text-muted">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SCROLL REEL — image moves DOWN with the scroll, new image takes over
// Each chapter is a tall section. Image translates Y based on scroll
// progress through the section. Text translates the OPPOSITE direction
// for depth. Sections crossfade at their edges.
// ══════════════════════════════════════════════════════════

function ReelSection({
  src,
  no,
  label,
  title,
  body,
  accent = "blush",
}: {
  src: string;
  no?: string;
  label?: string;
  title: string;
  body?: string;
  accent?: "blush" | "ink";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Image slowly travels DOWNWARDS as you scroll (translated from -12% to +12%
  // of its overflow-padded container), giving the feel that the image is
  // "coming along with the scroll, downwards".
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);
  // Text moves the OTHER way — upwards — so the image feels "behind"
  const textY = useTransform(scrollYProgress, [0, 1], ["80px", "-80px"]);
  // Mask in / out at the section edges
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [0, 1, 1, 0]
  );
  // Overlay darkens as the section nears its end (so the next image enters cleanly)
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.35, 0.4, 0.7]
  );

  return (
    <section
      ref={ref}
      className="relative h-[110vh] min-h-[660px] w-full overflow-hidden bg-ink"
    >
      {/* IMAGE — translates down with the scroll, slowly */}
      <motion.div
        style={{ y: imgY, scale: imgScale, opacity }}
        className="absolute inset-[-15%] -z-10 will-change-transform"
      >
        <Image src={src} alt={title} fill sizes="100vw" className="object-cover" priority={false} />
      </motion.div>

      {/* Gradient overlay — its opacity rises towards the section end */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 -z-[5] bg-gradient-to-b from-ink/30 via-ink/45 to-ink/85"
      />

      {/* Text content — anchored, but with counter-parallax */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative flex h-full flex-col items-center justify-center px-6 text-center text-bg sm:px-12"
      >
        {no && (
          <motion.span
            className={`font-display text-6xl leading-none italic sm:text-7xl ${
              accent === "blush" ? "text-blush" : "text-bg"
            }`}
          >
            {no}.
          </motion.span>
        )}
        {label && (
          <span
            className={`mt-3 text-[0.6rem] uppercase tracking-[0.42em] ${
              accent === "blush" ? "text-blush" : "text-bg/70"
            }`}
          >
            {label}
          </span>
        )}
        <h3 className="mt-8 max-w-4xl font-display text-[clamp(2.4rem,5.5vw,4.8rem)] leading-[1.05] tracking-tight">
          {title}
        </h3>
        {body && (
          <p className="mt-7 max-w-2xl text-balance text-base leading-[1.7] text-bg/85 sm:text-lg sm:leading-[1.7]">
            {body}
          </p>
        )}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className={`mt-12 h-px w-16 origin-center ${
            accent === "blush" ? "bg-blush" : "bg-bg/60"
          }`}
        />
      </motion.div>

      {/* Section progress label bottom-right (purely decorative) */}
      <div className="pointer-events-none absolute bottom-6 right-6 z-10 flex items-center gap-2 text-[0.5rem] uppercase tracking-[0.32em] text-bg/60 sm:bottom-8 sm:right-10">
        <span className="h-px w-8 bg-bg/30" />
        <span className="font-mono">↓ keep scrolling</span>
      </div>
    </section>
  );
}

function ReelOpener() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex h-[80vh] min-h-[540px] items-center justify-center bg-bg-soft px-6 text-center sm:px-12"
    >
      <motion.div style={{ y, opacity }} className="relative">
        <div className="flex items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.42em] text-muted">
          <span className="h-px w-12 bg-line" />
          <span>Entry No. 01 · Our Story</span>
          <span className="h-px w-12 bg-line" />
        </div>
        <h2 className="mt-8 font-display text-[clamp(2.8rem,6.5vw,6rem)] leading-[0.98] tracking-tight text-ink">
          <SplitWord text="We don't pose moments." />
          <br />
          <span className="font-script text-[1.4em] leading-[0.9] text-plum">
            <SplitWord text="we honour them." delay={0.4} />
          </span>
        </h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="mx-auto mt-10 h-px w-24 origin-center bg-plum"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.9 }}
          className="mx-auto mt-7 max-w-md text-[0.65rem] uppercase tracking-[0.32em] text-muted"
        >
          Scroll through three frames of a studio
        </motion.p>
      </motion.div>
    </section>
  );
}

function ScrollReelVariant() {
  return (
    <div className="relative">
      <ReelOpener />

      <ReelSection
        src="/images/haldi/turmeric-splash.jpg"
        no="I"
        label="Origin"
        title="A simple obsession."
        body="A S Photography was born from the belief that Indian weddings deserve a way of looking that matches their generosity. The colour, the noise, the held breath before vidaai — every grain of it."
      />

      <ReelSection
        src="/images/wedding/couple-at-mandap.jpg"
        no="II"
        label="Method"
        title="Pairs, light & unobtrusive."
        body="We move through your day like a memory in real time. No staged kisses. No lining-up of aunties. Just the marriage as it actually happens."
      />

      <ReelSection
        src="/images/wedding/bridal-portrait.jpg"
        no="III"
        label="A note"
        title='"We photograph like we are listening."'
        body="A · S Photography · est. 2012 · Mumbai → Worldwide"
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-28 sm:px-12 sm:py-36">
        <FoundersBlock />
        <div className="mt-24">
          <StatsRow />
        </div>
        <div className="mt-24">
          <FilmStrip />
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MEET THE STUDIO — editorial luxe edition
// Big imagery · premium typography · restrained decoration
// Founders portrait, story, moments, numbers, press, CTA.
// Fully responsive: 1-col mobile → asymmetric desktop.
// ══════════════════════════════════════════════════════════

const MOMENTS = [
  {
    src: "/images/haldi/turmeric-splash.jpg",
    label: "A morning of yellow",
    place: "Riya & Karthik · Coorg",
    date: "Feb 2024",
  },
  {
    src: "/images/mehndi/bride-hands.jpg",
    label: "Hands of the wedding",
    place: "Anaya & Ishaan · Jaipur",
    date: "Dec 2023",
  },
  {
    src: "/images/wedding/couple-at-mandap.jpg",
    label: "At the mandap",
    place: "Meera & Aditya · Udaipur",
    date: "Nov 2023",
  },
];

function MeetTheStudio() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["-6%", "6%"]);

  return (
    <div className="relative">
      {/* ╔════════════════════════════════════════════════════╗
          ║  Background flourishes — faint, premium           ║
          ╚════════════════════════════════════════════════════╝ */}
      <Mandala className="pointer-events-none absolute -left-32 top-24 z-0 h-[400px] w-[400px] text-plum/[0.05] spin-slow sm:-left-20" />
      <Mandala className="pointer-events-none absolute -right-40 top-[55%] z-0 h-[500px] w-[500px] text-terracotta/[0.05] spin-slow [animation-direction:reverse]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-0 h-[400px] bg-[radial-gradient(60%_50%_at_50%_50%,rgba(232,168,150,0.08),transparent_75%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        {/* ╔════════════════════════════════════════════════════╗
            ║  01 · HERO — portrait + intro + signature CTA     ║
            ╚════════════════════════════════════════════════════╝ */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="mb-10 flex items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.42em] text-muted sm:mb-14"
        >
          <span className="h-px w-12 bg-plum/40" />
          <span className="font-display italic text-plum">01</span>
          <span>The Studio</span>
          <span className="h-px w-12 bg-plum/40" />
        </motion.div>

        <div
          ref={heroRef}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16"
        >
          {/* LEFT — hero portrait with parallax + ornate frame */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: EASE }}
            className="relative lg:col-span-7"
          >
            {/* Offset frame — back layer */}
            <div className="absolute -bottom-4 -right-4 hidden h-[80%] w-[85%] border border-plum/35 sm:block sm:-bottom-6 sm:-right-6" />

            {/* Main photo with parallax */}
            <Tilt3D
              intensity={3}
              hoverScale={1}
              className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-sm rounded-bl-sm bg-bg-soft shadow-[0_50px_120px_-40px_rgba(31,15,41,0.5)]"
            >
              <motion.div style={{ y: heroY }} className="absolute inset-[-8%] will-change-transform">
                <Image
                  src="/images/pre-wedding/window-light.jpg"
                  alt="The studio at work"
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />

              {/* Inner cream border */}
              <span className="pointer-events-none absolute inset-3 rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-sm rounded-bl-sm border border-bg/30" />

              {/* Caption pinned to the photo */}
              <div className="absolute inset-x-6 bottom-6">
                <div className="flex items-center gap-3">
                  <div
                    className="rounded-full p-[2px]"
                    style={{
                      background:
                        "conic-gradient(from 0deg, var(--blush), var(--plum), var(--terracotta), var(--blush))",
                    }}
                  >
                    <div className="rounded-full bg-paper p-[1.5px]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-plum text-bg">
                        <svg viewBox="0 0 32 32" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
                          <circle cx="16" cy="16" r="13" />
                          <circle cx="16" cy="16" r="6" />
                          <circle cx="16" cy="16" r="2" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-script text-2xl text-bg leading-none drop-shadow-[0_3px_12px_rgba(0,0,0,0.5)]">
                      Arjun &amp; Priya,
                    </div>
                    <div className="mt-1 text-[0.55rem] uppercase tracking-[0.28em] text-blush">
                      A · S Photography · since MMXII
                    </div>
                  </div>
                </div>
              </div>
            </Tilt3D>

            {/* Award/trust chip — floats over bottom-left, safely above the offset frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: 8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 4 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.8, type: "spring", bounce: 0.4 }}
              className="absolute -bottom-5 -left-2 z-30 hidden items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-2 shadow-[0_15px_35px_-12px_rgba(31,15,41,0.35)] sm:flex sm:-left-4"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jade/10 text-jade">
                <Award className="h-3.5 w-3.5" strokeWidth={1.8} />
              </span>
              <div className="leading-tight">
                <div className="font-display text-xs italic text-plum">Vogue India</div>
                <div className="text-[0.5rem] uppercase tracking-[0.22em] text-muted">
                  Featured · 2024
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — welcome copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <span className="font-display text-base italic text-plum sm:text-lg">
              ⊹ A note from the studio
            </span>

            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,5.4rem)] leading-[0.95] tracking-tight text-ink">
              We&apos;re Arjun
              <br />
              &amp;{" "}
              <span className="font-script text-[1.18em] text-plum">
                Priya.
              </span>
            </h2>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-px w-10 bg-plum" />
              <span className="text-[0.55rem] uppercase tracking-[0.32em] text-plum">
                Husband · Wife · Photographers
              </span>
            </div>

            <p className="mt-7 text-balance text-base leading-[1.85] text-ink-soft sm:text-[1.05rem] sm:leading-[1.85]">
              We started{" "}
              <span className="font-display italic text-plum">
                A · S Photography
              </span>{" "}
              in 2012 — first as friends with a camera, then as photographers
              who couldn&apos;t stop showing up. We photograph Indian weddings
              because they&apos;re the most generous days a year holds.
            </p>

            <p className="mt-5 text-balance text-base leading-[1.85] text-ink-soft sm:text-[1.05rem] sm:leading-[1.85]">
              We shoot in pairs — light, unobtrusive, listening. No staged
              kisses, no lining-up of aunties. Just the marriage as it
              actually happens.
            </p>

            <div className="mt-10 flex max-w-full items-end gap-6 overflow-hidden">
              <Signature />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full bg-plum px-7 py-3.5 text-xs uppercase tracking-[0.28em] text-bg shadow-[0_15px_35px_-12px_rgba(107,36,84,0.5)] transition-all hover:bg-plum-deep hover:shadow-[0_22px_45px_-12px_rgba(107,36,84,0.7)]"
              >
                Let&apos;s meet
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#portfolio"
                className="group inline-flex items-center gap-2 rounded-full border border-line bg-paper px-6 py-3.5 text-[0.7rem] uppercase tracking-[0.28em] text-plum transition-all hover:border-plum hover:bg-bg-soft"
              >
                See our work
                <span className="text-plum transition-transform group-hover:translate-x-0.5">
                  ↗
                </span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* ╔════════════════════════════════════════════════════╗
            ║  02 · TWO PORTRAITS — Arjun + Priya, side by side ║
            ╚════════════════════════════════════════════════════╝ */}
        <div className="mt-32 sm:mt-40">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="mb-12 flex items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.42em] text-muted"
          >
            <span className="h-px w-12 bg-plum/40" />
            <span className="font-display italic text-plum">02</span>
            <span>The People</span>
            <span className="h-px w-12 bg-plum/40" />
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:gap-12">
            {[
              {
                name: "Arjun Mehra",
                role: "Lead Photographer",
                bio: "Trained at NID Ahmedabad · Brides Today contributor. Shoots primarily with film and a Leica.",
                img: TESTIMONIAL_AVATARS[2],
                accent: "plum" as const,
              },
              {
                name: "Priya Mehra",
                role: "Creative Director",
                bio: "Ex–Vogue India · Curates every album by hand. Speaks four languages on set.",
                img: TESTIMONIAL_AVATARS[0],
                accent: "terracotta" as const,
              },
            ].map((f, i) => {
              const isPlum = f.accent === "plum";
              const textCls = isPlum ? "text-plum" : "text-terracotta";
              const bgCls = isPlum ? "bg-plum" : "bg-terracotta";
              const innerShadow = isPlum
                ? "shadow-[inset_0_0_0_1.5px_rgba(107,36,84,0.45)]"
                : "shadow-[inset_0_0_0_1.5px_rgba(182,92,69,0.45)]";
              return (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.15 }}
                  className="group relative"
                >
                  <Tilt3D
                    intensity={4}
                    hoverScale={1}
                    className="relative h-full rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-md rounded-bl-md border border-line bg-paper p-6 shadow-[0_30px_70px_-30px_rgba(31,15,41,0.35)] sm:p-8"
                  >
                    <div className="flex gap-5 sm:gap-7">
                      <div
                        className={`relative h-32 w-24 shrink-0 overflow-hidden arch-top sm:h-40 sm:w-32 ${innerShadow}`}
                      >
                        <Image
                          src={f.img}
                          alt={f.name}
                          fill
                          sizes="128px"
                          className="object-cover transition-transform duration-[1.6s] group-hover:scale-105"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <span
                          className={`text-[0.55rem] uppercase tracking-[0.32em] ${textCls}`}
                        >
                          {f.role}
                        </span>
                        <h4 className="mt-1.5 font-display text-2xl leading-tight text-ink sm:text-3xl">
                          {f.name}
                        </h4>
                        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                          {f.bio}
                        </p>
                        <div className="mt-auto pt-4">
                          <span
                            className={`inline-flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.28em] ${textCls}`}
                          >
                            <span className={`h-px w-6 ${bgCls}`} />
                            since 2012
                          </span>
                        </div>
                      </div>
                    </div>
                  </Tilt3D>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-10 text-center font-script text-3xl text-plum sm:text-4xl"
          >
            together since &apos;12 ·{" "}
            <span className="text-terracotta">married &apos;14 ·</span>{" "}
            still in love
          </motion.p>
        </div>

        {/* ╔════════════════════════════════════════════════════╗
            ║  03 · SELECTED WORK — three frames with depth     ║
            ╚════════════════════════════════════════════════════╝ */}
        <div className="mt-32 sm:mt-40">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <div className="flex items-center gap-4 text-[0.6rem] uppercase tracking-[0.42em] text-muted">
                <span className="h-px w-12 bg-plum/40" />
                <span className="font-display italic text-plum">03</span>
                <span>Selected Work</span>
              </div>
              <h3 className="mt-5 font-display text-3xl leading-tight text-ink sm:text-4xl lg:text-5xl">
                Three frames{" "}
                <span className="font-script text-4xl text-plum sm:text-5xl lg:text-6xl">
                  we love.
                </span>
              </h3>
            </div>
            <a
              href="#portfolio"
              className="group flex items-center gap-3 rounded-full border border-line bg-paper px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.28em] text-plum transition-all hover:border-plum hover:bg-bg-soft"
            >
              <span className="h-px w-6 bg-plum transition-all group-hover:w-10" />
              All weddings ↗
            </a>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-5 lg:gap-7">
            {MOMENTS.map((m, i) => (
              <motion.figure
                key={m.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease: EASE }}
                whileHover={{ y: -6 }}
                className={`group relative ${
                  i === 1 ? "sm:translate-y-8" : ""
                }`}
              >
                <Tilt3D
                  intensity={5}
                  hoverScale={1}
                  className={`relative aspect-[4/5] w-full overflow-hidden bg-bg-soft shadow-[0_30px_70px_-30px_rgba(31,15,41,0.4)] ${
                    i === 0
                      ? "rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-sm rounded-bl-sm"
                      : i === 1
                        ? "rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-sm rounded-br-sm"
                        : "rounded-t-[3rem] rounded-b-sm"
                  }`}
                >
                  <Image
                    src={m.src}
                    alt={m.label}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

                  {/* Frame number, top-left */}
                  <span className="absolute left-4 top-4 z-10 rounded-full bg-bg/95 px-2.5 py-1 text-[0.55rem] font-medium uppercase tracking-[0.22em] text-plum backdrop-blur-md">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Date stamp top-right */}
                  <span className="absolute right-4 top-4 z-10 font-mono text-[0.5rem] uppercase tracking-[0.22em] text-bg/85">
                    {m.date}
                  </span>

                  {/* Caption bottom */}
                  <div className="absolute inset-x-4 bottom-4 z-10">
                    <div className="font-display text-lg text-bg sm:text-xl">
                      {m.label}
                    </div>
                    <div className="mt-0.5 text-[0.55rem] uppercase tracking-[0.28em] text-blush">
                      {m.place}
                    </div>
                  </div>
                </Tilt3D>
              </motion.figure>
            ))}
          </div>
        </div>

        {/* ╔════════════════════════════════════════════════════╗
            ║  04 · BY THE NUMBERS — premium trust panel        ║
            ╚════════════════════════════════════════════════════╝ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9 }}
          className="mt-32 sm:mt-40"
        >
          <div className="mb-12 flex items-center justify-center gap-4 text-[0.6rem] uppercase tracking-[0.42em] text-muted">
            <span className="h-px w-12 bg-plum/40" />
            <span className="font-display italic text-plum">04</span>
            <span>By the Numbers</span>
            <span className="h-px w-12 bg-plum/40" />
          </div>

          <div className="overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-xl rounded-bl-xl border border-line bg-paper p-6 shadow-[0_30px_70px_-30px_rgba(31,15,41,0.3)] sm:p-12">
            <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
              {[
                { n: 12, suffix: "+", label: "Years working", color: "text-plum" },
                { n: 340, suffix: "+", label: "Weddings filmed", color: "text-jade" },
                { n: 27, suffix: "", label: "Cities visited", color: "text-terracotta" },
                { n: 5, suffix: ".0", label: "★★★★★ Average", color: "text-ruby" },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.1 }}
                  className={`relative text-center ${
                    i > 0 ? "sm:before:absolute sm:before:left-0 sm:before:top-1/2 sm:before:h-12 sm:before:w-px sm:before:-translate-y-1/2 sm:before:bg-line" : ""
                  }`}
                >
                  <div
                    className={`font-display text-[clamp(2.8rem,6vw,4.5rem)] leading-none tracking-tight ${s.color}`}
                  >
                    <Counter to={s.n} suffix={s.suffix} duration={2.6} />
                  </div>
                  <div className="mt-3 text-[0.55rem] uppercase tracking-[0.32em] text-muted">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ╔════════════════════════════════════════════════════╗
            ║  05 · PRESS — as featured in                      ║
            ╚════════════════════════════════════════════════════╝ */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-20 text-center sm:mt-24"
        >
          <span className="flex items-center justify-center gap-3 text-[0.55rem] uppercase tracking-[0.42em] text-muted">
            <span className="h-px w-10 bg-line" />
            <Award className="h-3 w-3 text-plum" strokeWidth={1.8} />
            As featured in
            <span className="h-px w-10 bg-line" />
          </span>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-ink-soft sm:gap-x-12">
            <span className="font-display font-bold tracking-[0.32em] text-base text-ink sm:text-lg">
              VOGUE
              <span className="ml-1.5 text-[0.55rem] tracking-[0.28em] text-muted">
                INDIA
              </span>
            </span>
            <span className="text-line">·</span>
            <span className="font-sans font-extrabold tracking-tight text-base text-ink sm:text-lg">
              WedMeGood
            </span>
            <span className="text-line">·</span>
            <span className="font-script text-2xl text-ink sm:text-3xl">
              The Knot
            </span>
            <span className="text-line">·</span>
            <span className="font-display italic text-base text-ink sm:text-lg">
              Brides Today
            </span>
          </div>
        </motion.div>

        {/* ╔════════════════════════════════════════════════════╗
            ║  06 · CLOSING CTA — cinematic finale              ║
            ╚════════════════════════════════════════════════════╝ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1 }}
          className="relative isolate mt-28 overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-xl rounded-bl-xl bg-ink sm:mt-40"
        >
          {/* Background image — direct child, no negative z-index.
              The `isolate` on the parent creates a stacking context so
              the absolute layers stack predictably. */}
          <Image
            src="/images/wedding/couple-at-mandap.jpg"
            alt="Couple at the mandap"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          {/* Soft gradient — light at top so the photo shows, darker at bottom for text */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/40 to-ink/80" />
          {/* Warm blush bloom at the centre — adds atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(232,168,150,0.25),transparent_75%)] mix-blend-soft-light" />
          {/* Subtle vignette at the corners */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_50%,rgba(31,15,41,0.55)_100%)]" />

          <div className="relative z-10 px-6 py-20 text-center sm:px-12 sm:py-28">
            <span className="text-[0.55rem] uppercase tracking-[0.42em] text-blush">
              ⊹ Where we go from here ⊹
            </span>

            <h3 className="mt-7 font-display text-[clamp(2.4rem,5.5vw,4.8rem)] leading-[1.05] tracking-tight text-bg">
              We&apos;d love to{" "}
              <span className="font-script text-[1.25em] text-blush">
                meet you.
              </span>
            </h3>

            <p className="mx-auto mt-7 max-w-xl text-balance text-base leading-relaxed text-bg/85 sm:text-lg">
              No-pressure chat. Tell us your date, your venue, and the bit
              you&apos;re most nervous about — we&apos;ll write back within 48
              hours.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full bg-bg px-9 py-4 text-xs uppercase tracking-[0.28em] text-plum shadow-[0_25px_50px_-15px_rgba(0,0,0,0.4)] transition-all hover:bg-blush hover:text-ink"
              >
                Book a chat
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="tel:+919876543210"
                className="group inline-flex items-center gap-3 rounded-full border border-bg/40 bg-bg/10 px-7 py-4 text-xs uppercase tracking-[0.28em] text-bg backdrop-blur-md transition-all hover:border-blush hover:bg-bg/20"
              >
                <Phone className="h-3.5 w-3.5" strokeWidth={1.8} fill="currentColor" />
                +91 98765 43210
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// Main About
// ══════════════════════════════════════════════════════════

export default function About() {
  return (
    <section
      id="story"
      className="relative overflow-hidden bg-bg"
    >
      <MeetTheStudio />
    </section>
  );
}

// ══════════════════════════════════════════════════════════
// (kept below for safety — unused scrapbook layout, hidden)
// ══════════════════════════════════════════════════════════
function _LegacyScrapbook() {
  return (
    <div className="hidden">
      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-8">
        {/* ────── SCRAPBOOK PAGE ────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="relative"
        >
          {/* Leather cover band */}
          <div className="relative rounded-t-lg bg-gradient-to-b from-plum-deep to-plum px-6 py-4 shadow-[0_20px_50px_-15px_rgba(31,15,41,0.4)]">
            <div className="flex items-center justify-between text-bg/85">
              <span className="font-display italic text-sm sm:text-base">
                A · S Studio Diary
              </span>
              <span className="font-mono text-[0.55rem] tracking-[0.28em]">
                VOL. I — PAGE 12 / 312
              </span>
            </div>
          </div>

          {/* Spiral binding row */}
          <div className="bg-ink py-1">
            <SpiralBinding count={24} />
          </div>

          {/* Bookmark ribbon hanging from the top */}
          <BookmarkRibbon />

          {/* Page body — aged paper with rules and grain */}
          <div className="paper-aged paper-grain paper-lined relative px-6 pb-16 pt-12 shadow-[0_30px_80px_-20px_rgba(31,15,41,0.35)] sm:px-14 sm:pt-16">
            {/* Vertical margin rule (red ink) */}
            <div className="absolute bottom-8 left-8 top-8 w-px bg-ruby/30 sm:left-12" />
            {/* Page number bottom */}
            <div className="absolute bottom-4 right-6 font-mono text-[0.55rem] uppercase tracking-[0.24em] text-muted">
              · 12 ·
            </div>

            {/* Scattered hand-drawn doodles */}
            <Doodle Icon={DoodleStar} className="left-3 top-32 h-5 w-5 text-terracotta sm:left-6" rotate={-15} delay={0.5} />
            <Doodle Icon={DoodleHeart} className="right-12 top-44 h-5 w-5 text-ruby sm:right-20" rotate={12} delay={0.7} />
            <Doodle Icon={DoodleFlower} className="left-4 top-[40%] h-6 w-6 text-plum sm:left-7" rotate={-8} delay={0.9} />
            <Doodle Icon={DoodleArrow} className="right-6 top-[44%] h-4 w-8 text-jade sm:right-12" rotate={-15} delay={1.0} />
            <Doodle Icon={DoodleSun} className="left-2 top-[62%] h-5 w-5 text-terracotta sm:left-5" rotate={0} delay={1.1} />
            <Doodle Icon={DoodleLeaf} className="right-3 top-[68%] h-6 w-6 text-jade-soft sm:right-8" rotate={20} delay={1.2} />
            <Doodle Icon={DoodleStar} className="left-6 top-[82%] h-4 w-4 text-plum sm:left-12" rotate={25} delay={1.3} />
            <Doodle Icon={DoodleHeart} className="right-14 top-[88%] h-4 w-4 text-ruby sm:right-20" rotate={-10} delay={1.4} />
            {/* Date stamp top-right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: 12 }}
              whileInView={{ opacity: 0.85, scale: 1, rotate: 8 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute right-6 top-6 stamp-ink inline-flex flex-col items-center rounded border-2 border-ruby/60 px-3 py-1.5 text-ruby sm:right-10"
            >
              <span className="font-mono text-[0.5rem] uppercase tracking-[0.24em]">
                Entered
              </span>
              <span className="font-display text-lg leading-none">
                09 · V · 2025
              </span>
            </motion.div>

            {/* ═══════ CHAPTER OPENER ═══════ */}
            <div className="relative pl-6 sm:pl-12">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8 }}
                className="mb-3 flex items-center gap-3 text-[0.55rem] uppercase tracking-[0.32em] text-muted"
              >
                <span className="font-display text-base italic text-plum">
                  Entry №. 01
                </span>
                <span className="h-px w-12 bg-plum/30" />
                <span>Our Story, in our own hand</span>
              </motion.div>

              <h2 className="font-display text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
                <SplitWord text="We don't pose moments." />
                <br />
                <span className="font-script text-5xl text-plum sm:text-6xl lg:text-7xl">
                  <SplitWord text="we honour them." delay={0.4} />
                </span>
              </h2>
            </div>

            {/* ═══════ CHAPTER I — Polaroid + Body + Margin Notes ═══════ */}
            <div className="relative mt-16 grid grid-cols-1 gap-12 sm:grid-cols-12 sm:gap-8">
              <div className="relative flex justify-center sm:col-span-5 sm:justify-start sm:pl-12">
                <PinnedPolaroid
                  src="/images/haldi/turmeric-splash.jpg"
                  caption="Riya · Haldi"
                  date="03/2024"
                  tilt={-4}
                />
                <CoffeeRing className="-bottom-6 -right-2 h-20 w-20" />
              </div>

              <div className="relative sm:col-span-7">
                <div className="flex items-baseline gap-3 pl-6 sm:pl-0">
                  <span className="font-display text-3xl italic text-plum">
                    I.
                  </span>
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.32em] text-muted">
                    Origin
                  </span>
                </div>
                <p className="mt-4 pl-6 font-display text-[1.2rem] leading-[1.6] text-ink-soft sm:pl-0 sm:text-[1.35rem]">
                  <span
                    aria-hidden
                    className="float-left mr-3 mt-2 font-display text-7xl leading-[0.78] text-plum sm:text-[5.5rem]"
                  >
                    A
                  </span>{" "}
                  S Photography was born from a{" "}
                  <Mark color="terracotta" delay={1.2}>
                    simple obsession
                  </Mark>{" "}
                  — Indian weddings deserve a way of looking that matches their
                  generosity. The colour, the noise, the{" "}
                  <Mark color="plum" delay={1.5}>
                    held breath before vidaai
                  </Mark>
                  .
                </p>

                <MarginNote className="mt-6 pl-6 sm:pl-0">
                  <div className="flex items-center gap-2">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 -rotate-12 text-ruby/70"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <path d="M5 12 L19 12 M14 7 L19 12 L14 17" />
                    </svg>
                    <span className="font-script text-xl text-plum">
                      our north star, this line.
                    </span>
                  </div>
                </MarginNote>
              </div>
            </div>

            {/* ═══════ PULL-QUOTE on torn paper ═══════ */}
            <div className="relative mt-16 flex justify-center">
              <TornPaperQuote
                quote={["We photograph like", "we're listening."]}
              />
            </div>

            {/* ═══════ CHAPTER II — Body + Ticket ═══════ */}
            <div className="relative mt-20 grid grid-cols-1 gap-10 sm:grid-cols-12 sm:gap-8">
              <div className="relative sm:col-span-7 sm:pl-12">
                <div className="flex items-baseline gap-3 pl-6 sm:pl-0">
                  <span className="font-display text-3xl italic text-plum">
                    II.
                  </span>
                  <span className="font-mono text-[0.55rem] uppercase tracking-[0.32em] text-muted">
                    Method
                  </span>
                </div>
                <p className="mt-4 pl-6 font-display text-[1.2rem] leading-[1.6] text-ink-soft sm:pl-0 sm:text-[1.35rem]">
                  Working in{" "}
                  <Mark color="jade" delay={1.2}>
                    pairs, light and unobtrusive
                  </Mark>
                  , we move through your day like a memory in real time.{" "}
                  <span className="text-plum">No staged kisses.</span>{" "}
                  <span className="text-plum">No lining-up of aunties.</span>{" "}
                  Just the marriage as it actually happens.
                </p>
              </div>

              <div className="relative flex flex-col items-center gap-6 sm:col-span-5 sm:items-start sm:pl-6">
                <PinnedTicket year="2019" label="Vogue India Feature" />
                <div className="flex items-start gap-4">
                  <StickyNote tilt={2} delay={0.3}>
                    <p className="font-script text-lg leading-tight text-ink">
                      340 weddings &amp;<br />still counting!
                    </p>
                    <span className="mt-1 block font-mono text-[0.45rem] uppercase tracking-[0.22em] text-muted">
                      — Priya, 14/4/25
                    </span>
                  </StickyNote>
                  <PhotoStrip
                    photos={[
                      "/images/wedding/bridal-portrait.jpg",
                      "/images/mehndi/bride-hands.jpg",
                      "/images/wedding/couple-at-mandap.jpg",
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* ═══════ FOUNDERS — Polaroid pair ═══════ */}
            <div className="relative mt-20">
              <div className="mb-8 flex items-center gap-3 text-[0.55rem] uppercase tracking-[0.32em] text-muted">
                <span className="font-display text-base italic text-plum">
                  Entry №. 02
                </span>
                <span className="h-px flex-1 bg-line" />
                <span>The Studio</span>
              </div>
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-6">
                <div className="flex justify-center sm:justify-end">
                  <PinnedPolaroid
                    src={TESTIMONIAL_AVATARS[2]}
                    caption="Arjun M."
                    date="founder"
                    tilt={-5}
                  />
                </div>
                <div className="flex justify-center sm:justify-start">
                  <PinnedPolaroid
                    src={TESTIMONIAL_AVATARS[0]}
                    caption="Priya M."
                    date="founder"
                    tilt={4}
                  />
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="font-script text-2xl text-plum">
                  Arjun &amp; Priya · together since '12
                </p>
              </div>
            </div>

            {/* ═══════ RUBBER-STAMP STATS ═══════ */}
            <div className="relative mt-20">
              <div className="mb-8 flex items-center gap-3 text-[0.55rem] uppercase tracking-[0.32em] text-muted">
                <span className="font-display text-base italic text-plum">
                  Entry №. 03
                </span>
                <span className="h-px flex-1 bg-line" />
                <span>By the numbers</span>
              </div>
              <div className="flex flex-wrap items-center justify-around gap-y-6 sm:gap-x-4">
                <RubberStamp
                  small="Years"
                  big="12+"
                  bottom="est. 2012"
                  variant="plum"
                  tilt={-5}
                />
                <RubberStamp
                  small="Weddings"
                  big="340+"
                  bottom="& counting"
                  variant="jade"
                  tilt={3}
                />
                <RubberStamp
                  small="Cities"
                  big="27"
                  bottom="across india"
                  variant="terracotta"
                  tilt={-2}
                />
              </div>
            </div>

            {/* ═══════ FILM STRIP (kept) ═══════ */}
            <div className="relative mt-20">
              <FilmStrip />
            </div>

            {/* ═══════ SIGNATURE with WAX SEAL ═══════ */}
            <div className="relative mt-16 flex items-end justify-between gap-6 pl-6 pr-2 sm:pr-12">
              <WaxSeal />
              <div className="flex flex-col items-end gap-2">
                <p className="font-display text-sm italic text-ink-soft">
                  Yours, from the studio —
                </p>
                <Signature />
              </div>
            </div>
          </div>

          {/* Bottom leather band */}
          <div className="rounded-b-lg bg-gradient-to-t from-plum-deep to-plum px-6 py-3 shadow-[0_10px_30px_-10px_rgba(31,15,41,0.4)]">
            <div className="flex items-center justify-between text-bg/75">
              <span className="font-mono text-[0.5rem] tracking-[0.28em]">
                ⊹ A · S · STUDIO ⊹
              </span>
              <span className="font-mono text-[0.5rem] tracking-[0.28em]">
                EST. MMXII
              </span>
            </div>
          </div>
        </motion.div>

        {/* Caption under the diary */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 text-center text-[0.55rem] uppercase tracking-[0.32em] text-muted"
        >
          A page from the studio diary · hover the polaroids
        </motion.p>
      </div>
    </div>
  );
}
