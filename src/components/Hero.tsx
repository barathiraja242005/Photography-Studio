"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HERO_IMAGES } from "@/lib/images";
import { EASE } from "@/lib/motion";
import BgVideo from "@/components/BgVideo";
import { site } from "@/config/site";

const word: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.2, delay: 0.4 + i * 0.08, ease: EASE },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, -6]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate h-[100svh] w-full overflow-hidden bg-ink"
    >
      <motion.div
        style={{ y, rotateX, scale, transformPerspective: 1800 }}
        className="absolute inset-0 -z-10 will-change-transform [transform-style:preserve-3d]"
      >
        <BgVideo
          src="/videos/hero.mp4"
          poster={HERO_IMAGES[0]}
          className="absolute inset-0 h-full w-full scale-110 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/30 to-ink/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(212,54,94,0.15),transparent_55%)]" />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center sm:px-10"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="mb-5 inline-flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.42em] text-blush sm:text-xs"
        >
          <span className="h-px w-8 bg-blush" />
          {site.hero.eyebrow}
          <span className="h-px w-8 bg-blush" />
        </motion.span>

        <h1 className="font-display text-[clamp(2.5rem,8.4vw,7.5rem)] leading-[1] tracking-tight text-bg">
          {site.hero.headlineLines.map((w, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                custom={i}
                variants={word}
                initial="hidden"
                animate="show"
                className="block"
              >
                {w}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden">
            <motion.span
              custom={2}
              variants={word}
              initial="hidden"
              animate="show"
              className="block font-script text-[1.6em] leading-[0.8] text-blush"
            >
              {site.hero.headlineScript}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.9 }}
          className="mt-8 max-w-xl text-balance text-base text-bg/85 sm:text-lg"
        >
          {site.hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.9 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href={site.hero.primaryCTA.href}
            className="group inline-flex items-center gap-3 rounded-full bg-ruby px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-bg transition-all hover:bg-ruby-deep"
          >
            {site.hero.primaryCTA.label}
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href={site.hero.secondaryCTA.href}
            className="group inline-flex items-center gap-3 rounded-full border border-bg/40 bg-bg/5 px-8 py-3.5 text-xs uppercase tracking-[0.28em] text-bg backdrop-blur-md transition-all hover:border-blush hover:bg-bg/15 hover:text-blush"
          >
            {site.hero.secondaryCTA.label}
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.9 }}
          className="mt-12 inline-flex items-center gap-2 rounded-full border border-bg/20 bg-bg/5 px-4 py-1.5 text-[0.6rem] uppercase tracking-[0.32em] text-bg/80 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ruby opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ruby" />
          </span>
          {site.hero.bookingPill}
        </motion.div>
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto flex w-fit flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.4em] text-bg/70"
      >
        <span>Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" strokeWidth={1.2} />
        </motion.span>
      </motion.div>
    </section>
  );
}
