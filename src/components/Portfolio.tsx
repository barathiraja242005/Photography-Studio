"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowUpRight, Camera } from "lucide-react";
import { GALLERY, type GalleryTag } from "@/lib/images";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { SectionLabel } from "@/components/Ornament";

const TAGS: ("All" | GalleryTag)[] = [
  "All",
  "Wedding",
  "Baraat",
  "Pre-Wedding",
  "Haldi",
  "Mehndi",
  "Sangeet",
  "Maternity",
];

/**
 * Bento grid layout — varied spans create magazine rhythm.
 * On `grid-cols-12 auto-rows-[140px]` so heights are consistent.
 * Each entry is the Tailwind class for that tile slot;
 * cycles for filtered views with fewer items.
 */
const BENTO = [
  "lg:col-span-6 lg:row-span-3 sm:col-span-4 sm:row-span-2 col-span-2 row-span-2", // 0  HUGE feature
  "lg:col-span-3 lg:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2", // 1  tall portrait
  "lg:col-span-3 lg:row-span-1 sm:col-span-2 sm:row-span-1 col-span-1 row-span-1", // 2
  "lg:col-span-3 lg:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2", // 3  tall portrait
  "lg:col-span-3 lg:row-span-1 sm:col-span-2 sm:row-span-1 col-span-1 row-span-1", // 4
  "lg:col-span-4 lg:row-span-2 sm:col-span-3 sm:row-span-2 col-span-2 row-span-2", // 5  medium portrait
  "lg:col-span-4 lg:row-span-2 sm:col-span-3 sm:row-span-2 col-span-1 row-span-2", // 6
  "lg:col-span-4 lg:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2", // 7
  "lg:col-span-6 lg:row-span-2 sm:col-span-4 sm:row-span-2 col-span-2 row-span-2", // 8  wide landscape
  "lg:col-span-3 lg:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2", // 9
  "lg:col-span-3 lg:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2", // 10
  "lg:col-span-4 lg:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2", // 11
  "lg:col-span-4 lg:row-span-2 sm:col-span-2 sm:row-span-2 col-span-1 row-span-2", // 12
  "lg:col-span-4 lg:row-span-2 sm:col-span-4 sm:row-span-2 col-span-2 row-span-2", // 13
];

const SHAPES = [
  "rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-md rounded-bl-md",
  "rounded-3xl",
  "rounded-2xl",
  "rounded-t-[4rem] rounded-b-xl",
  "rounded-tr-[3rem] rounded-bl-[3rem] rounded-tl-md rounded-br-md",
  "rounded-3xl",
  "rounded-2xl",
  "rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-md rounded-bl-md",
  "rounded-3xl",
  "rounded-t-[4rem] rounded-b-xl",
];

export default function Portfolio() {
  const [tag, setTag] = useState<(typeof TAGS)[number]>("All");
  const [active, setActive] = useState<number | null>(null);

  const items = useMemo(
    () => (tag === "All" ? GALLERY : GALLERY.filter((g) => g.tag === tag)),
    [tag]
  );

  const next = () =>
    active !== null && setActive((active + 1) % GALLERY.length);
  const prev = () =>
    active !== null &&
    setActive((active - 1 + GALLERY.length) % GALLERY.length);

  return (
    <section id="portfolio" className="relative overflow-hidden bg-bg py-28 sm:py-36">
      {/* Background flourish */}
      <div className="pointer-events-none absolute -top-32 right-0 h-[400px] w-[400px] rounded-full bg-blush/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-jade/[0.08] blur-[140px]" />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-10">
        <SectionLabel
          eyebrow="Selected Work"
          title="Stories in"
          script="frames."
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base text-ink-soft sm:text-lg"
        >
          A field guide to the small, almost-missed moments — gathered from
          weddings across the country.
        </motion.p>

        {/* Filter pills */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={cn(
                "group relative overflow-hidden rounded-full border px-5 py-2 text-[0.65rem] uppercase tracking-[0.24em] transition-all duration-500",
                tag === t
                  ? "border-plum bg-plum text-bg shadow-[0_10px_25px_-12px_rgba(107,36,84,0.6)]"
                  : "border-line bg-paper text-ink-soft hover:border-plum hover:text-plum"
              )}
            >
              <span className="relative z-10">{t}</span>
            </button>
          ))}
          <span className="ml-2 inline-flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.28em] text-muted">
            <Camera className="h-3 w-3" strokeWidth={1.6} />
            {items.length} {items.length === 1 ? "frame" : "frames"}
          </span>
        </div>

        {/* Bento gallery grid */}
        <motion.div
          layout
          className="mt-14 grid auto-rows-[110px] grid-cols-2 gap-3 sm:auto-rows-[140px] sm:grid-cols-6 sm:gap-4 lg:auto-rows-[160px] lg:grid-cols-12"
        >
          <AnimatePresence mode="popLayout">
            {items.map((g, i) => {
              const absoluteIdx = GALLERY.indexOf(g);
              const span = BENTO[i % BENTO.length];
              const shape = SHAPES[i % SHAPES.length];
              return (
                <motion.button
                  key={g.src}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{
                    duration: 0.75,
                    delay: i * 0.03,
                    ease: EASE,
                  }}
                  onClick={() => setActive(absoluteIdx)}
                  className={cn(
                    "group relative block overflow-hidden bg-bg-soft shadow-[0_25px_60px_-30px_rgba(31,15,41,0.45)] transition-all duration-700 hover:shadow-[0_40px_80px_-30px_rgba(107,36,84,0.55)] hover:-translate-y-1",
                    span,
                    shape
                  )}
                >
                  {/* Inner terracotta frame ring — luxe gallery feel */}
                  <span className={cn(
                    "pointer-events-none absolute inset-2 z-20 border border-bg/30 transition-all duration-700 group-hover:inset-3 group-hover:border-bg/60",
                    shape
                  )} />

                  {/* Image */}
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, (min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.08]"
                  />

                  {/* Permanent number badge */}
                  <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                    <span className="rounded-full bg-bg/95 px-2.5 py-1 text-[0.55rem] font-medium uppercase tracking-[0.22em] text-plum backdrop-blur-md">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Bottom gradient — always slightly visible, intensifies on hover */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-95" />

                  {/* Permanent caption strip */}
                  <div className="absolute inset-x-4 bottom-3 z-10 flex items-end justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-base leading-tight text-bg sm:text-lg lg:text-xl">
                        {g.alt}
                      </p>
                      <p className="mt-0.5 text-[0.55rem] uppercase tracking-[0.28em] text-blush opacity-80">
                        {g.tag}
                      </p>
                    </div>
                    <span className="flex h-9 w-9 shrink-0 translate-y-1 items-center justify-center rounded-full bg-bg/95 text-plum opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-16 flex flex-col items-center gap-3"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full border border-plum/40 bg-paper px-9 py-4 text-[0.7rem] uppercase tracking-[0.28em] text-plum shadow-[0_15px_40px_-20px_rgba(107,36,84,0.4)] transition-all duration-500 hover:border-plum hover:bg-plum hover:text-bg"
          >
            View full portfolio
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          <span className="text-[0.6rem] uppercase tracking-[0.32em] text-muted">
            340+ weddings · 27 cities · 12 years
          </span>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 backdrop-blur-xl"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActive(null);
              }}
              aria-label="Close"
              className="absolute right-6 top-6 text-bg/80 hover:text-blush"
            >
              <X className="h-6 w-6" strokeWidth={1.4} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
              className="absolute left-6 text-bg/80 hover:text-blush"
            >
              <ChevronLeft className="h-8 w-8" strokeWidth={1.2} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
              className="absolute right-6 text-bg/80 hover:text-blush"
            >
              <ChevronRight className="h-8 w-8" strokeWidth={1.2} />
            </button>
            <motion.div
              key={active}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[80vh] w-[90vw] max-w-5xl"
            >
              <Image
                src={GALLERY[active].src}
                alt={GALLERY[active].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="font-display text-xl text-bg/90">
                {GALLERY[active].alt}
              </p>
              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.32em] text-blush">
                {GALLERY[active].tag}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
