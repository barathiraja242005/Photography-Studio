"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Clock, MapPin } from "lucide-react";
import { SectionLabel } from "@/components/Ornament";
import { FILM_POSTER } from "@/lib/images";
import Tilt3D from "@/components/Tilt3D";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Film = {
  title: string;
  location: string;
  duration: string;
  poster: string;
  videoSrc: string;
  kind: "feature" | "reel";
};

const FILMS: Film[] = [
  {
    title: "Tara & Vihaan",
    location: "Udaipur · Mar 2024",
    duration: "3:42",
    poster: FILM_POSTER,
    videoSrc: "/videos/films.mp4",
    kind: "feature",
  },
  {
    title: "Anaya & Ishaan",
    location: "Jaipur · Dec 2023",
    duration: "4:18",
    poster: "/images/wedding/bridal-portrait.jpg",
    videoSrc: "/videos/films.mp4",
    kind: "feature",
  },
  {
    title: "Riya & Karthik",
    location: "Coorg · Feb 2024",
    duration: "3:01",
    poster: "/images/pre-wedding/window-light.jpg",
    videoSrc: "/videos/films.mp4",
    kind: "feature",
  },
  {
    title: "Meera & Aditya",
    location: "Udaipur · Nov 2023",
    duration: "4:45",
    poster: "/images/wedding/couple-at-mandap.jpg",
    videoSrc: "/videos/films.mp4",
    kind: "feature",
  },
  {
    title: "Sneha & Rohan",
    location: "Goa · Jan 2024",
    duration: "3:22",
    poster: "/images/pre-wedding/golden-hour.jpg",
    videoSrc: "/videos/films.mp4",
    kind: "feature",
  },
  {
    title: "Sofia & Henri",
    location: "Goa · Dec 2023",
    duration: "2:58",
    poster: "/images/wedding/bride-crimson-gold.jpg",
    videoSrc: "/videos/films.mp4",
    kind: "feature",
  },
];

const REELS: Film[] = [
  {
    title: "Baraat dance",
    location: "Sneha & Rohan",
    duration: "0:30",
    poster: "/images/baraat/horseback.jpg",
    videoSrc: "/videos/films.mp4",
    kind: "reel",
  },
  {
    title: "Haldi splash",
    location: "Riya · morning",
    duration: "0:38",
    poster: "/images/haldi/turmeric-splash.jpg",
    videoSrc: "/videos/films.mp4",
    kind: "reel",
  },
  {
    title: "Mehndi hands",
    location: "Anaya · night",
    duration: "0:45",
    poster: "/images/mehndi/bride-hands.jpg",
    videoSrc: "/videos/films.mp4",
    kind: "reel",
  },
  {
    title: "Sangeet sisters",
    location: "Tara · evening",
    duration: "0:52",
    poster: "/images/sangeet/sisters-singing.jpg",
    videoSrc: "/videos/films.mp4",
    kind: "reel",
  },
  {
    title: "First look",
    location: "Priya & Karthik",
    duration: "0:41",
    poster: "/images/pre-wedding/first-look.jpg",
    videoSrc: "/videos/films.mp4",
    kind: "reel",
  },
  {
    title: "Elephant baraat",
    location: "Rohan · sunset",
    duration: "0:36",
    poster: "/images/baraat/elephant.jpg",
    videoSrc: "/videos/films.mp4",
    kind: "reel",
  },
];

// ──────────────────────────────────────────────────────────
// SHARED — film modal player
// ──────────────────────────────────────────────────────────
function FilmModal({ film, onClose }: { film: Film; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-6 backdrop-blur-xl"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-6 top-6 z-10 text-bg/80 hover:text-blush"
      >
        <X className="h-6 w-6" strokeWidth={1.4} />
      </button>
      <motion.div
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative w-full overflow-hidden rounded-2xl bg-ink shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)]",
          film.kind === "reel"
            ? "aspect-[9/16] max-w-md"
            : "aspect-video max-w-5xl"
        )}
      >
        <video
          src={film.videoSrc}
          controls
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-bg">
        <p className="font-display text-xl">{film.title}</p>
        <p className="mt-1 text-[0.55rem] uppercase tracking-[0.32em] text-blush">
          {film.location} · {film.duration}
        </p>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────
// VARIANT A — Single featured film
// ──────────────────────────────────────────────────────────
function VariantSingle({ onOpen }: { onOpen: (f: Film) => void }) {
  const f = FILMS[0];
  return (
    <Tilt3D
      intensity={10}
      hoverScale={1}
      className="mx-auto mt-12 w-full max-w-5xl"
    >
      <motion.button
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1 }}
        onClick={() => onOpen(f)}
        className="group relative block w-full overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-2xl rounded-bl-2xl shadow-[0_40px_100px_-30px_rgba(31,15,41,0.5)]"
      >
        <div className="relative aspect-video">
          <Image src={f.poster} alt={f.title} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-ink/35" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="absolute h-28 w-28 rounded-full bg-ruby/40 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-ruby/60" />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-bg/60 bg-bg/10 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-ruby group-hover:bg-ruby">
              <Play className="ml-1 h-8 w-8 text-bg" fill="currentColor" strokeWidth={0} />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-8 sm:p-10">
            <h3 className="font-display text-2xl text-bg sm:text-3xl">{f.title}</h3>
            <p className="mt-1 text-[0.7rem] uppercase tracking-[0.28em] text-blush">
              {f.location} · {f.duration} — feature film
            </p>
          </div>
        </div>
      </motion.button>
    </Tilt3D>
  );
}

// ──────────────────────────────────────────────────────────
// VARIANT B — Hero + 3 smaller cards
// ──────────────────────────────────────────────────────────
function VariantHeroPlus3({ onOpen }: { onOpen: (f: Film) => void }) {
  const hero = FILMS[0];
  const rest = FILMS.slice(1, 4);
  return (
    <div className="mt-12 space-y-5 sm:space-y-6">
      <Tilt3D intensity={8} hoverScale={1}>
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1 }}
          onClick={() => onOpen(hero)}
          className="group relative block w-full overflow-hidden rounded-tl-[3.5rem] rounded-br-[3.5rem] rounded-tr-xl rounded-bl-xl shadow-[0_40px_100px_-30px_rgba(31,15,41,0.5)]"
        >
          <div className="relative aspect-video">
            <Image src={hero.poster} alt={hero.title} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-ink/35" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="absolute h-24 w-24 rounded-full bg-ruby/40 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-ruby/60" />
              <span className="relative flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-bg/60 bg-bg/10 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-ruby group-hover:bg-ruby">
                <Play className="ml-1 h-7 w-7 text-bg sm:h-8 sm:w-8" fill="currentColor" strokeWidth={0} />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-6 sm:p-8">
              <span className="rounded-full bg-ruby px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.22em] text-bg">
                Featured
              </span>
              <h3 className="mt-3 font-display text-2xl text-bg sm:text-3xl">
                {hero.title}
              </h3>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.28em] text-blush">
                {hero.location} · {hero.duration}
              </p>
            </div>
          </div>
        </motion.button>
      </Tilt3D>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-5">
        {rest.map((f, i) => (
          <FilmCard key={f.title} film={f} onOpen={onOpen} delay={0.1 + i * 0.08} />
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// VARIANT C — 6-film grid (3x2)
// ──────────────────────────────────────────────────────────
function VariantGrid6({ onOpen }: { onOpen: (f: Film) => void }) {
  return (
    <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {FILMS.map((f, i) => (
        <FilmCard key={f.title} film={f} onOpen={onOpen} delay={0.1 + i * 0.06} />
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// VARIANT D — Hero + Reels strip
// ──────────────────────────────────────────────────────────
function VariantHeroReels({ onOpen }: { onOpen: (f: Film) => void }) {
  const hero = FILMS[0];
  return (
    <div className="mt-12 space-y-12">
      <Tilt3D intensity={10} hoverScale={1}>
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1 }}
          onClick={() => onOpen(hero)}
          className="group relative block w-full overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-2xl rounded-bl-2xl shadow-[0_40px_100px_-30px_rgba(31,15,41,0.5)]"
        >
          <div className="relative aspect-video">
            <Image src={hero.poster} alt={hero.title} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-ink/35" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="absolute h-28 w-28 rounded-full bg-ruby/40 blur-2xl transition-all duration-700 group-hover:scale-150 group-hover:bg-ruby/60" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-bg/60 bg-bg/10 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-ruby group-hover:bg-ruby">
                <Play className="ml-1 h-8 w-8 text-bg" fill="currentColor" strokeWidth={0} />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-8 sm:p-10">
              <h3 className="font-display text-2xl text-bg sm:text-3xl">{hero.title}</h3>
              <p className="mt-1 text-[0.7rem] uppercase tracking-[0.28em] text-blush">
                {hero.location} · {hero.duration} — feature film
              </p>
            </div>
          </div>
        </motion.button>
      </Tilt3D>

      <div>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.32em] text-muted">
            <Play className="h-3 w-3 text-ruby" fill="currentColor" strokeWidth={0} />
            <span>Reels · swipe →</span>
          </div>
          <div className="hidden text-[0.55rem] uppercase tracking-[0.28em] text-muted sm:block">
            {REELS.length} short films
          </div>
        </div>

        <div className="no-scrollbar -mx-6 flex gap-4 overflow-x-auto px-6 pb-4 sm:-mx-10 sm:px-10">
          {REELS.map((r, i) => (
            <motion.button
              key={r.title}
              onClick={() => onOpen(r)}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.1 + i * 0.06, duration: 0.6 }}
              className="group relative aspect-[9/16] w-44 shrink-0 overflow-hidden rounded-2xl bg-ink shadow-[0_20px_50px_-25px_rgba(31,15,41,0.5)] sm:w-52"
            >
              <Image src={r.poster} alt={r.title} fill sizes="208px" className="object-cover transition-transform duration-[1.4s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-ink/30" />
              <div className="absolute right-3 top-3 flex h-6 items-center gap-1 rounded-full bg-ink/65 px-2 text-bg backdrop-blur-md">
                <Play className="h-2.5 w-2.5" fill="currentColor" strokeWidth={0} />
                <span className="text-[0.5rem] font-medium uppercase tracking-[0.18em]">
                  Reel
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ruby/95 text-bg shadow-xl">
                  <Play className="ml-0.5 h-6 w-6" fill="currentColor" strokeWidth={0} />
                </span>
              </div>
              <div className="absolute inset-x-3 bottom-3">
                <div className="font-display text-sm text-bg">{r.title}</div>
                <div className="mt-0.5 flex items-center justify-between text-[0.5rem] uppercase tracking-[0.22em] text-blush">
                  <span>{r.location}</span>
                  <span>{r.duration}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Small reusable film card (for Hero+3 and Grid6 variants)
// ──────────────────────────────────────────────────────────
function FilmCard({
  film,
  onOpen,
  delay,
}: {
  film: Film;
  onOpen: (f: Film) => void;
  delay: number;
}) {
  return (
    <motion.button
      onClick={() => onOpen(film)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover={{ y: -6 }}
      className="group relative block w-full overflow-hidden rounded-2xl bg-ink shadow-[0_20px_50px_-25px_rgba(31,15,41,0.4)]"
    >
      <div className="relative aspect-video">
        <Image
          src={film.poster}
          alt={film.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-ink/30 transition-opacity duration-500 group-hover:bg-ink/50" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="absolute h-16 w-16 rounded-full bg-ruby/40 blur-xl transition-all duration-700 group-hover:scale-150 group-hover:bg-ruby/60" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-bg/60 bg-bg/15 backdrop-blur-md transition-all duration-500 group-hover:scale-110 group-hover:border-ruby group-hover:bg-ruby">
            <Play className="ml-0.5 h-5 w-5 text-bg" fill="currentColor" strokeWidth={0} />
          </span>
        </div>

        {/* Duration badge */}
        <div className="absolute right-3 top-3 flex h-6 items-center gap-1 rounded-full bg-ink/65 px-2 text-bg backdrop-blur-md">
          <Clock className="h-2.5 w-2.5" strokeWidth={2} />
          <span className="text-[0.55rem] font-medium uppercase tracking-[0.18em]">
            {film.duration}
          </span>
        </div>

        {/* Bottom info */}
        <div className="absolute inset-x-4 bottom-3">
          <div className="font-display text-lg text-bg leading-tight">
            {film.title}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[0.55rem] uppercase tracking-[0.24em] text-blush">
            <MapPin className="h-2.5 w-2.5" strokeWidth={1.8} />
            {film.location}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ──────────────────────────────────────────────────────────
// Main Films section — Hero feature film + Reels strip
// ──────────────────────────────────────────────────────────
export default function Films() {
  const [activeFilm, setActiveFilm] = useState<Film | null>(null);

  return (
    <section id="films" className="relative overflow-hidden bg-bg py-28 sm:py-36">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <SectionLabel
          eyebrow="Wedding Films"
          title="Sound, slow motion,"
          script="& memory."
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base text-ink-soft sm:text-lg"
        >
          A short film of your wedding — three minutes of music, light, and the
          things you forgot you said.
        </motion.p>

        <VariantHeroReels onOpen={setActiveFilm} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-14 flex justify-center"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 text-[0.7rem] uppercase tracking-[0.32em] text-plum transition-colors hover:text-ruby"
          >
            <span className="h-px w-10 bg-plum transition-all group-hover:w-16 group-hover:bg-ruby" />
            Watch more films
          </a>
        </motion.div>
      </div>

      <AnimatePresence>
        {activeFilm && (
          <FilmModal film={activeFilm} onClose={() => setActiveFilm(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// Other variant designs kept below for future reference — not currently used
// (single, hero+3, grid6 functions still in this file but unreferenced)
