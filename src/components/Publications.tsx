"use client";

import { motion } from "framer-motion";

const PUBS = [
  "WedMeGood",
  "Vogue India",
  "The Knot",
  "BetterHalf",
  "ShaadiSaga",
  "Brides Today",
  "Femina",
  "Wedding Sutra",
];

export default function Publications() {
  const doubled = [...PUBS, ...PUBS];
  return (
    <section className="relative overflow-hidden border-y border-line bg-paper py-14">
      <div className="mx-auto mb-6 w-full max-w-7xl px-6 text-center sm:px-10">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8 }}
          className="text-[0.65rem] uppercase tracking-[0.42em] text-muted"
        >
          As Featured In
        </motion.span>
      </div>

      <div className="marquee relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-paper to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-paper to-transparent" />
        <div className="marquee-track flex w-fit items-center gap-14 px-6">
          {doubled.map((p, i) => (
            <span
              key={`${p}-${i}`}
              className="whitespace-nowrap font-display text-2xl tracking-[0.18em] text-ink-soft/80 sm:text-3xl"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
