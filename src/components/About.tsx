"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { Award, Phone } from "lucide-react";
import { TESTIMONIAL_AVATARS } from "@/lib/images";
import { Mandala } from "@/components/Ornament";
import { EASE } from "@/lib/motion";
import Tilt3D from "@/components/Tilt3D";
import { useSite } from "@/components/SiteContext";

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
// SVG signature flourish
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
        Arjun &amp; Priya · Founders
      </motion.div>
    </div>
  );
}

// Curated three-frame editorial gallery. Kept static — these are visual
// design choices, not user-editable content.
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
  const site = useSite();
  // Visual portrait slots for founders — index-aligned to site.about.founders.
  const FOUNDER_SLOTS = [
    { img: TESTIMONIAL_AVATARS[2], accent: "plum" as const },
    { img: TESTIMONIAL_AVATARS[0], accent: "terracotta" as const },
  ];
  const STAT_COLORS = ["text-plum", "text-jade", "text-terracotta", "text-ruby"];
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["-6%", "6%"]);

  return (
    <div className="relative">
      <Mandala className="pointer-events-none absolute -left-32 top-24 z-0 h-[400px] w-[400px] text-plum/[0.05] spin-slow sm:-left-20" />
      <Mandala className="pointer-events-none absolute -right-40 top-[55%] z-0 h-[500px] w-[500px] text-terracotta/[0.05] spin-slow [animation-direction:reverse]" />
      <div className="pointer-events-none absolute inset-x-0 top-1/3 -z-0 h-[400px] bg-[radial-gradient(60%_50%_at_50%_50%,rgba(232,168,150,0.08),transparent_75%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        {/* 01 — HERO */}
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: EASE }}
            className="relative lg:col-span-7"
          >
            <div className="absolute -bottom-4 -right-4 hidden h-[80%] w-[85%] border border-plum/35 sm:block sm:-bottom-6 sm:-right-6" />

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

              <span className="pointer-events-none absolute inset-3 rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-sm rounded-bl-sm border border-bg/30" />

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

        {/* 02 — TWO PORTRAITS */}
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
            {site.about.founders.map((founder, i) => {
              const slot = FOUNDER_SLOTS[i % FOUNDER_SLOTS.length];
              const f = { ...founder, img: slot.img, accent: slot.accent };
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

        {/* 03 — SELECTED WORK */}
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
                className={`group relative ${i === 1 ? "sm:translate-y-8" : ""}`}
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

                  <span className="absolute left-4 top-4 z-10 rounded-full bg-bg/95 px-2.5 py-1 text-[0.55rem] font-medium uppercase tracking-[0.22em] text-plum backdrop-blur-md">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="absolute right-4 top-4 z-10 font-mono text-[0.5rem] uppercase tracking-[0.22em] text-bg/85">
                    {m.date}
                  </span>
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

        {/* 04 — BY THE NUMBERS */}
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
                ...site.about.stats.map((s, i) => ({
                  n: s.n,
                  suffix: s.suffix,
                  label: s.label,
                  color: STAT_COLORS[i % STAT_COLORS.length],
                })),
                {
                  n: parseFloat(site.voices.aggregate.rating) || 5,
                  suffix: ".0",
                  label: "★★★★★ Average",
                  color: "text-ruby",
                },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.1 }}
                  className={`relative text-center ${
                    i > 0
                      ? "sm:before:absolute sm:before:left-0 sm:before:top-1/2 sm:before:h-12 sm:before:w-px sm:before:-translate-y-1/2 sm:before:bg-line"
                      : ""
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

        {/* 05 — PRESS */}
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
            {site.publications.slice(0, 4).map((name, i) => (
              <span key={name + i} className="contents">
                <span className="font-display font-bold tracking-[0.28em] text-base text-ink sm:text-lg">
                  {name}
                </span>
                {i < Math.min(site.publications.length, 4) - 1 && (
                  <span className="text-line">·</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>

        {/* 06 — CLOSING CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1 }}
          className="relative isolate mt-28 overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-xl rounded-bl-xl bg-ink sm:mt-40"
        >
          <Image
            src="/images/wedding/couple-at-mandap.jpg"
            alt="Couple at the mandap"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/20 via-ink/40 to-ink/80" />
          <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(232,168,150,0.25),transparent_75%)] mix-blend-soft-light" />
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
                href={`tel:${site.contact.phoneTel}`}
                className="group inline-flex items-center gap-3 rounded-full border border-bg/40 bg-bg/10 px-7 py-4 text-xs uppercase tracking-[0.28em] text-bg backdrop-blur-md transition-all hover:border-blush hover:bg-bg/20"
              >
                <Phone className="h-3.5 w-3.5" strokeWidth={1.8} fill="currentColor" />
                {site.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="story" className="relative overflow-hidden bg-bg">
      <MeetTheStudio />
    </section>
  );
}
