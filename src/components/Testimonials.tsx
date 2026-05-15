"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pause,
  Play,
  Quote,
  Star,
} from "lucide-react";
import { SectionLabel } from "@/components/Ornament";
import { TESTIMONIAL_AVATARS } from "@/lib/images";
import { EASE } from "@/lib/motion";
import Tilt3D from "@/components/Tilt3D";

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const VOICES = [
  {
    quote:
      "We had three days of ceremonies in Jaipur and A S Photography was there for every haldi smear, every sangeet performance, every late-night chai. The album feels like the wedding actually felt.",
    name: "Anaya & Ishaan",
    place: "Jaipur, Rajasthan",
    date: "December 2023",
    avatar: TESTIMONIAL_AVATARS[0],
    photo: u("photo-1610173826014-d131b02d69ca"),
    accent: "plum" as const,
  },
  {
    quote:
      "They photographed our wedding the way good poetry sounds — quiet at first, then suddenly inevitable. Six months later our parents still call asking which page their photo is on.",
    name: "Riya & Karthik",
    place: "Coorg, Karnataka",
    date: "February 2024",
    avatar: TESTIMONIAL_AVATARS[1],
    photo: u("photo-1604017011826-d3b4c23f8914"),
    accent: "terracotta" as const,
  },
  {
    quote:
      "Indian weddings are loud. A S Photography is gentle. They moved through the chaos like they had a map only they could see. Every important moment is in our album, and every embarrassing one too.",
    name: "Meera & Aditya",
    place: "Udaipur, Rajasthan",
    date: "November 2023",
    avatar: TESTIMONIAL_AVATARS[2],
    photo: u("photo-1606800052052-a08af7148866"),
    accent: "jade" as const,
  },
  {
    quote:
      "Booked them for a sangeet only, ended up extending to all four days. Their candid eye is the real deal — no awkward poses, just real people on the best day of their lives.",
    name: "Sneha & Rohan",
    place: "Goa",
    date: "January 2024",
    avatar: TESTIMONIAL_AVATARS[3],
    photo: u("photo-1606216794074-735e91aa2c92"),
    accent: "ruby" as const,
  },
];

const ACCENT = {
  plum: "text-plum",
  terracotta: "text-terracotta",
  jade: "text-jade",
  ruby: "text-ruby",
};

type PressItem = {
  name: string;
  sub?: string;
  accolade: string;
  fontClass: string;
};

const PRESS: PressItem[] = [
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
];

const DURATION = 9000;

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(
      () => setI((v) => (v + 1) % VOICES.length),
      DURATION
    );
    return () => clearInterval(id);
  }, [paused]);

  const v = VOICES[i];
  const prevI = (i - 1 + VOICES.length) % VOICES.length;
  const nextI = (i + 1) % VOICES.length;

  return (
    <section
      id="voices"
      className="relative overflow-hidden bg-bg-soft py-28 sm:py-36"
    >
      {/* Background flourish */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-plum/[0.06] blur-[140px]" />
        <div className="absolute -bottom-20 right-1/4 h-[400px] w-[500px] rounded-full bg-terracotta/[0.07] blur-[120px]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10">
        <SectionLabel
          eyebrow="Voices"
          title="From the couples who"
          script="trusted us."
        />

        {/* Aggregate trust line */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[0.65rem] uppercase tracking-[0.28em] text-muted"
        >
          <span className="flex items-center gap-1.5 text-terracotta">
            {Array.from({ length: 5 }).map((_, k) => (
              <Star
                key={k}
                className="h-3 w-3"
                fill="currentColor"
                strokeWidth={0}
              />
            ))}
          </span>
          <span className="text-ink">5.0 average</span>
          <span className="h-3 w-px bg-line" />
          <span>340+ couples</span>
          <span className="h-3 w-px bg-line" />
          <span>12 years</span>
        </motion.div>

        {/* Carousel — peek + featured + peek */}
        <div className="relative mt-14 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* PREV peek */}
          <button
            onClick={() => setI(prevI)}
            aria-label="Previous review"
            className="group relative hidden overflow-hidden rounded-tl-[2rem] rounded-br-[2rem] rounded-tr-md rounded-bl-md lg:col-span-2 lg:block"
          >
            <Image
              src={VOICES[prevI].photo}
              alt={VOICES[prevI].name}
              fill
              sizes="20vw"
              className="object-cover opacity-50 grayscale-[40%] transition-all duration-700 group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg-soft/40 via-ink/30 to-ink/55 transition-all duration-500 group-hover:from-transparent group-hover:via-ink/15 group-hover:to-ink/30" />
            <div className="absolute inset-3 z-10 flex flex-col justify-between rounded-tl-[1.5rem] rounded-br-[1.5rem] border border-bg/30 p-4">
              <div className="flex items-center gap-1.5 self-start rounded-full bg-bg/90 px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.24em] text-plum">
                <ChevronLeft className="h-2.5 w-2.5" strokeWidth={2} />
                Prev
              </div>
              <div className="text-bg">
                <div className="font-display text-base leading-tight">
                  {VOICES[prevI].name}
                </div>
                <div className="mt-0.5 text-[0.55rem] uppercase tracking-[0.22em] text-blush">
                  {VOICES[prevI].place.split(",")[0]}
                </div>
              </div>
            </div>
          </button>

          {/* FEATURED CARD */}
          <Tilt3D
            intensity={4}
            hoverScale={1}
            className="lg:col-span-8"
          >
            <AnimatePresence mode="wait">
              <motion.article
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="grid grid-cols-1 overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-2xl rounded-bl-2xl border border-line bg-paper shadow-[0_40px_100px_-40px_rgba(31,15,41,0.4)] sm:grid-cols-5"
              >
                {/* IMAGE pane (2 cols) */}
                <div className="relative aspect-[4/5] sm:col-span-2 sm:aspect-auto sm:min-h-[540px]">
                  <Image
                    src={v.photo}
                    alt={v.name}
                    fill
                    sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-ink/30" />
                  {/* Verified pill */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-bg/95 px-3 py-1.5 text-[0.55rem] uppercase tracking-[0.24em] text-jade backdrop-blur-md"
                  >
                    <BadgeCheck
                      className="h-3 w-3"
                      strokeWidth={2.2}
                      fill="currentColor"
                      stroke="var(--bg)"
                    />
                    Verified Wedding
                  </motion.div>
                  {/* Date stamp */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, rotate: 8 }}
                    animate={{ opacity: 1, scale: 1, rotate: -6 }}
                    transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
                    className="absolute bottom-5 right-5 rounded-md border-2 border-dashed border-bg/70 bg-ink/35 px-3 py-1.5 text-bg backdrop-blur-md"
                  >
                    <div className="flex items-center gap-1.5 text-[0.55rem] uppercase tracking-[0.24em]">
                      <Calendar className="h-2.5 w-2.5" strokeWidth={2} />
                      {v.date}
                    </div>
                  </motion.div>
                  {/* Couple avatar inset */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-5 left-5 flex items-center gap-3"
                  >
                    <div className="relative h-14 w-12 overflow-hidden arch-top ring-2 ring-bg/80">
                      <Image
                        src={v.avatar}
                        alt={v.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="font-script text-3xl text-bg drop-shadow-md">
                      {v.name.split(" & ")[0]}.
                    </div>
                  </motion.div>
                </div>

                {/* TEXT pane (3 cols) */}
                <div className="relative flex flex-col justify-center gap-5 p-8 sm:col-span-3 sm:p-12 lg:p-14">
                  {/* Decorative giant quote glyph */}
                  <span
                    aria-hidden
                    className={`absolute -top-4 right-6 font-display text-[10rem] leading-none ${ACCENT[v.accent]} opacity-10`}
                  >
                    &ldquo;
                  </span>

                  {/* Stars */}
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <motion.span
                        key={k}
                        initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                          delay: 0.3 + k * 0.08,
                          type: "spring",
                          bounce: 0.5,
                        }}
                      >
                        <Star
                          className="h-4 w-4 text-terracotta"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      </motion.span>
                    ))}
                    <span className="ml-2 text-[0.6rem] uppercase tracking-[0.28em] text-muted">
                      Verified 5.0
                    </span>
                  </div>

                  {/* Quote */}
                  <Quote
                    className={`h-7 w-7 ${ACCENT[v.accent]} opacity-50`}
                    strokeWidth={1}
                  />

                  <blockquote className="font-display text-xl italic leading-[1.45] text-ink sm:text-2xl lg:text-[1.7rem]">
                    <span className="text-balance">{v.quote}</span>
                  </blockquote>

                  {/* Author + meta */}
                  <div className="mt-2 flex items-end justify-between gap-6 border-t border-line pt-5">
                    <div>
                      <div className="font-display text-2xl text-ink">
                        {v.name}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.28em] text-muted">
                        <MapPin className="h-3 w-3" strokeWidth={1.6} />
                        {v.place}
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="font-script text-3xl text-plum"
                    >
                      — with love
                    </motion.div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </Tilt3D>

          {/* NEXT peek */}
          <button
            onClick={() => setI(nextI)}
            aria-label="Next review"
            className="group relative hidden overflow-hidden rounded-tr-[2rem] rounded-bl-[2rem] rounded-tl-md rounded-br-md lg:col-span-2 lg:block"
          >
            <Image
              src={VOICES[nextI].photo}
              alt={VOICES[nextI].name}
              fill
              sizes="20vw"
              className="object-cover opacity-50 grayscale-[40%] transition-all duration-700 group-hover:scale-105 group-hover:opacity-90 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-bg-soft/40 via-ink/30 to-ink/55 transition-all duration-500 group-hover:from-transparent group-hover:via-ink/15 group-hover:to-ink/30" />
            <div className="absolute inset-3 z-10 flex flex-col justify-between rounded-tr-[1.5rem] rounded-bl-[1.5rem] border border-bg/30 p-4">
              <div className="flex items-center gap-1.5 self-end rounded-full bg-bg/90 px-2.5 py-1 text-[0.5rem] uppercase tracking-[0.24em] text-plum">
                Next
                <ChevronRight className="h-2.5 w-2.5" strokeWidth={2} />
              </div>
              <div className="text-right text-bg">
                <div className="font-display text-base leading-tight">
                  {VOICES[nextI].name}
                </div>
                <div className="mt-0.5 text-[0.55rem] uppercase tracking-[0.22em] text-blush">
                  {VOICES[nextI].place.split(",")[0]}
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Pagination + auto-play control */}
        <div className="mt-10 flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            {VOICES.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Voice ${k + 1}`}
                className="group relative h-1 overflow-hidden rounded-full bg-line transition-all"
                style={{ width: k === i ? 64 : 16 }}
              >
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-plum"
                  initial={false}
                  animate={{ width: k === i ? "100%" : "0%" }}
                  transition={{
                    duration: k === i && !paused ? DURATION / 1000 : 0.4,
                    ease: "linear",
                  }}
                />
              </button>
            ))}
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play" : "Pause"}
              className="ml-2 flex h-7 w-7 items-center justify-center rounded-full border border-line bg-paper text-plum transition-colors hover:border-plum hover:bg-plum hover:text-bg"
            >
              {paused ? (
                <Play className="h-3 w-3" fill="currentColor" strokeWidth={0} />
              ) : (
                <Pause
                  className="h-3 w-3"
                  fill="currentColor"
                  strokeWidth={0}
                />
              )}
            </button>
          </div>

          <span className="text-[0.6rem] uppercase tracking-[0.28em] text-muted">
            {String(i + 1).padStart(2, "0")} / {String(VOICES.length).padStart(2, "0")}
            <span className="mx-3 text-line">·</span>
            Tap arrows to navigate
          </span>
        </div>

        {/* Press section — featured pull-quote + minimal wordmark row */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="mb-10 flex items-center justify-center gap-4 text-[0.65rem] uppercase tracking-[0.32em]"
          >
            <span className="h-px w-12 bg-plum/30" />
            <Award className="h-4 w-4 text-plum" strokeWidth={1.6} />
            <span className="text-plum">In the press</span>
            <span className="h-px w-12 bg-plum/30" />
          </motion.div>

          {/* Featured editorial pull-quote */}
          <motion.figure
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9 }}
            className="relative mx-auto max-w-3xl text-center"
          >
            {/* Decorative giant quote glyphs */}
            <span
              aria-hidden
              className="pointer-events-none absolute -left-2 -top-6 font-display text-[8rem] leading-none text-plum/15 sm:-left-6 sm:text-[10rem]"
            >
              &ldquo;
            </span>
            <span
              aria-hidden
              className="pointer-events-none absolute -right-2 -bottom-12 font-display text-[8rem] leading-none text-plum/15 sm:-right-6 sm:text-[10rem]"
            >
              &rdquo;
            </span>

            <blockquote className="font-display text-2xl italic leading-[1.4] tracking-tight text-ink sm:text-3xl lg:text-[2.4rem] lg:leading-[1.35]">
              A S Photography is rewriting Indian wedding photography — patient,
              painterly, and{" "}
              <span className="text-plum">achingly honest</span>.
            </blockquote>

            <figcaption className="mt-10 flex flex-col items-center gap-3">
              <span className="h-px w-12 bg-plum/40" />
              <div className="flex items-baseline gap-3">
                <span className="font-display font-bold tracking-[0.32em] text-ink sm:text-lg">
                  VOGUE
                </span>
                <span className="font-display text-[0.65rem] tracking-[0.28em] text-muted">
                  INDIA
                </span>
                <span className="text-line">·</span>
                <span className="text-[0.6rem] uppercase tracking-[0.28em] text-muted">
                  January 2024
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1 text-terracotta">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star
                    key={k}
                    className="h-2.5 w-2.5"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                ))}
              </div>
            </figcaption>
          </motion.figure>

          {/* Wordmark row — no boxes, just editorial typography */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-16"
          >
            <div className="mb-6 flex items-center justify-center gap-3 text-[0.6rem] uppercase tracking-[0.32em] text-muted">
              <span className="h-px w-10 bg-line" />
              <span>And more — 2024–2023</span>
              <span className="h-px w-10 bg-line" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
              {PRESS.map((p, k) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: 0.2 + k * 0.07, duration: 0.6 }}
                  className="group flex flex-col items-center gap-1"
                >
                  <div
                    className={`text-xl text-ink-soft/85 transition-colors duration-500 group-hover:text-plum sm:text-2xl ${p.fontClass}`}
                  >
                    {p.name}
                    {p.sub && (
                      <span className="ml-1.5 text-[0.6rem] tracking-[0.32em] text-muted">
                        {p.sub}
                      </span>
                    )}
                  </div>
                  <span className="h-px w-0 bg-plum transition-all duration-500 group-hover:w-10" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
